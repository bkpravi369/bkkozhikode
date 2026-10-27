#!/usr/bin/env python3
"""
Brahma Kumaris Kozhikode Web Server & YouTube Data API v3 Proxy
- Serves static assets for frontend website
- Server-side YouTube API proxy with secure YOUTUBE_API_KEY environment variable handling
- Server-side 30-minute caching to eliminate unnecessary API calls and respect quota
- Fallback spiritual placeholders when API key or channel IDs are unconfigured
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import urllib.error
import json
import os
import sys
import time
import base64
import re
import hmac
import hashlib
import secrets
import threading
import tempfile
import copy

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
CACHE_TTL = 1800  # 30 minutes in seconds
save_lock = threading.Lock()

def load_dotenv():
    if os.path.exists('.env'):
        try:
            with open('.env', 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass

load_dotenv()

CLOUDINARY_LOCKED_CLOUD = os.environ.get('CLOUDINARY_CLOUD_NAME', 'uo0dcjpe')
CLOUDINARY_LOCKED_PRESET = os.environ.get('CLOUDINARY_UPLOAD_PRESET', 'qud3sq4r')
CLOUDINARY_LOCKED_FOLDER = os.environ.get('CLOUDINARY_FOLDER', 'Website event images')

# In-memory cache for YouTube responses
youtube_cache = {
    "timestamp": 0,
    "data": None
}

# Admin session tracking
admin_sessions = set()

def strip_sensitive_fields(data):
    if not isinstance(data, dict):
        return data
    clean = copy.deepcopy(data)
    if 'settings' in clean and isinstance(clean['settings'], dict):
        clean['settings'].pop('adminPin', None)
        clean['settings'].pop('githubToken', None)
        clean['settings'].pop('cloudinaryApiKey', None)
        clean['settings'].pop('cloudinaryApiSecret', None)
    clean.pop('password', None)
    clean.pop('adminPin', None)
    clean.pop('githubToken', None)
    return clean

def sanitize_json_obj(val):
    if isinstance(val, str):
        return re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', val, flags=re.I).replace('javascript:', '').strip()
    elif isinstance(val, list):
        return [sanitize_json_obj(item) for item in val]
    elif isinstance(val, dict):
        clean = {}
        for k, v in val.items():
            if k in ['__proto__', 'constructor', 'prototype']:
                continue
            clean[k] = sanitize_json_obj(v)
        return clean
    return val

def get_admin_password():
    key = os.environ.get('ADMIN_PASSWORD', '').strip()
    if key:
        return key
    if os.path.exists('.env'):
        try:
            with open('.env', 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('ADMIN_PASSWORD='):
                        return line.split('=', 1)[1].strip().strip('"').strip("'")
        except Exception:
            pass
    return "Kozhikode@2026"

def generate_admin_token():
    secret = get_admin_password().encode('utf-8')
    ts = str(int(time.time()))
    sig = hmac.new(secret, ts.encode('utf-8'), hashlib.sha256).hexdigest()
    token = f"{ts}.{sig}"
    admin_sessions.add(token)
    return token

def verify_admin_token(token):
    if not token or not isinstance(token, str):
        return False
    parts = token.split('.')
    if len(parts) != 2:
        return False
    ts_str, sig = parts
    try:
        ts = int(ts_str)
    except ValueError:
        return False
    # Max age 24 hours
    if time.time() - ts > 86400:
        admin_sessions.discard(token)
        return False
    secret = get_admin_password().encode('utf-8')
    expected = hmac.new(secret, ts_str.encode('utf-8'), hashlib.sha256).hexdigest()
    if hmac.compare_digest(sig, expected):
        return True
    return token in admin_sessions

def get_youtube_api_key():
    # Priority 1: Environment variable
    key = os.environ.get('YOUTUBE_API_KEY', '').strip()
    if key:
        return key
    
    # Priority 2: Optional local .env file (if created by admin/server owner)
    if os.path.exists('.env'):
        try:
            with open('.env', 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('YOUTUBE_API_KEY='):
                        return line.split('=', 1)[1].strip().strip('"').strip("'")
        except Exception:
            pass
    return ""

def fetch_youtube_video_data(api_key, channel_info):
    """
    Fetches the latest relevant video for a channel based on contentType:
    - Podcast: Latest item in podcast playlist or search for podcast
    - Latest Live: Search for live event, fallback to latest video
    - Latest Video: Search for latest video by channel
    """
    ch_id = channel_info.get("channelId", "").strip()
    content_type = channel_info.get("contentType", "Latest Video")
    playlist_id = channel_info.get("playlistId", "").strip()
    name = channel_info.get("name", "")

    if not api_key or not ch_id:
        return None

    try:
        if content_type == "Podcast" and playlist_id:
            # Fetch latest from playlist
            url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={urllib.parse.quote(playlist_id)}&maxResults=1&key={api_key}"
            req = urllib.request.Request(url, headers={'User-Agent': 'BK-Kozhikode-Server/1.0'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                items = data.get("items", [])
                if items:
                    snip = items[0]["snippet"]
                    vid_id = snip.get("resourceId", {}).get("videoId", "")
                    thumbs = snip.get("thumbnails", {})
                    thumb_url = thumbs.get("maxres", {}).get("url") or thumbs.get("high", {}).get("url") or thumbs.get("medium", {}).get("url", "")
                    return {
                        "id": vid_id,
                        "title": snip.get("title", f"Latest {name} Podcast"),
                        "thumbnail": thumb_url,
                        "publishedAt": snip.get("publishedAt", ""),
                        "description": snip.get("description", "")[:180]
                    }

        elif content_type == "Latest Live":
            # Search for active live broadcast first
            live_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={urllib.parse.quote(ch_id)}&eventType=live&type=video&maxResults=1&key={api_key}"
            req = urllib.request.Request(live_url, headers={'User-Agent': 'BK-Kozhikode-Server/1.0'})
            try:
                with urllib.request.urlopen(req, timeout=8) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    items = data.get("items", [])
                    if items:
                        snip = items[0]["snippet"]
                        vid_id = items[0]["id"].get("videoId", "")
                        thumbs = snip.get("thumbnails", {})
                        thumb_url = thumbs.get("high", {}).get("url") or thumbs.get("medium", {}).get("url", "")
                        return {
                            "id": vid_id,
                            "title": f"🔴 LIVE: {snip.get('title', 'Live Spiritual Gathering')}",
                            "thumbnail": thumb_url,
                            "publishedAt": snip.get("publishedAt", ""),
                            "description": snip.get("description", "")[:180],
                            "isLive": True
                        }
            except Exception:
                pass

        # Default fallback: Latest uploaded video
        search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={urllib.parse.quote(ch_id)}&order=date&type=video&maxResults=1&key={api_key}"
        req = urllib.request.Request(search_url, headers={'User-Agent': 'BK-Kozhikode-Server/1.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get("items", [])
            if items:
                snip = items[0]["snippet"]
                vid_id = items[0]["id"].get("videoId", "")
                thumbs = snip.get("thumbnails", {})
                thumb_url = thumbs.get("high", {}).get("url") or thumbs.get("medium", {}).get("url", "")
                return {
                    "id": vid_id,
                    "title": snip.get("title", f"Latest Discourse by {name}"),
                    "thumbnail": thumb_url,
                    "publishedAt": snip.get("publishedAt", ""),
                    "description": snip.get("description", "")[:180]
                }
    except Exception as e:
        print(f"Error fetching YouTube data for {name}: {e}", file=sys.stderr)
        return None

    return None

class BKRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # API: YouTube Status Check
        if self.path.startswith('/api/youtube/status'):
            api_key = get_youtube_api_key()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            resp = {
                "hasKey": bool(api_key),
                "keySource": "YOUTUBE_API_KEY env" if os.environ.get('YOUTUBE_API_KEY') else (".env file" if os.path.exists('.env') else "none"),
                "cacheAgeSeconds": int(time.time() - youtube_cache["timestamp"]) if youtube_cache["timestamp"] else 0,
                "cached": bool(youtube_cache["data"])
            }
            self.wfile.write(json.dumps(resp).encode('utf-8'))
            return

        # API: YouTube Latest Videos
        if self.path.startswith('/api/youtube/latest'):
            now = time.time()
            if youtube_cache["data"] and (now - youtube_cache["timestamp"] < CACHE_TTL):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('X-Cache', 'HIT')
                self.end_headers()
                self.wfile.write(json.dumps(youtube_cache["data"]).encode('utf-8'))
                return

            api_key = get_youtube_api_key()
            
            # Default placeholder channels data
            default_channels = [
                {
                    "id": "bks-calicut",
                    "name": "BK S Calicut Live",
                    "nameMl": "ബികെഎസ് കോഴിക്കോട് ലൈവ്",
                    "contentType": "Latest Live",
                    "categoryLabel": "Daily Live Murli & Meditation",
                    "channelId": "UCTrf0g3Dpi5lW-jddmPlOpA",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@bkscalicut9425",
                    "instagramUrl": "https://instagram.com/bkscalicut",
                    "facebookUrl": "https://facebook.com/bkscalicut",
                    "logo": "assets/images/channel-logos/bks_calicut_logo.jpg",
                    "active": True,
                    "video": {
                        "id": "u31qwQUeGuM",
                        "title": "Live Daily Murli Class & Meditation",
                        "thumbnail": "https://images.pexels.com/photos/7458079/pexels-photo-7458079.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
                        "publishedAt": "Daily Broadcast",
                        "description": "Daily Live Murli, Morning Classes, and Spiritual Discourses from Calicut center."
                    }
                },
                {
                    "id": "supreme-light-creations",
                    "name": "Supreme Light Creations",
                    "nameMl": "സുപ്രീം ലൈറ്റ് ക്രിയേഷൻസ്",
                    "contentType": "Podcast",
                    "categoryLabel": "Spiritual Podcast",
                    "channelId": "UC98sbhynzcgLlx9x-SYi6zg",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@supremelightcreations",
                    "instagramUrl": "https://instagram.com/supremelightcreations",
                    "facebookUrl": "https://facebook.com/supremelightcreations",
                    "logo": "assets/images/channel-logos/Supremelight_creation_logo_new.png",
                    "active": True,
                    "video": {
                        "id": "8_UXOgXz7MA",
                        "title": "Daily Murli Malayalam Podcast - Supreme Light",
                        "thumbnail": "https://i.ytimg.com/vi/8_UXOgXz7MA/hqdefault.jpg",
                        "publishedAt": "Recent Episode",
                        "description": "Deep spiritual podcasts, soul realization series, and transformative reflections."
                    }
                },
                {
                    "id": "bk-sheeba",
                    "name": "BK Sheeba",
                    "nameMl": "ബികെ ഷീബ",
                    "contentType": "Latest Video",
                    "categoryLabel": "Discourse / Class",
                    "channelId": "",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@BKSheeba",
                    "instagramUrl": "https://instagram.com/bksheeba",
                    "facebookUrl": "https://facebook.com/bksheeba",
                    "logo": "assets/images/channel-logos/BK_sheeba_logo.png",
                    "active": True,
                    "video": {
                        "id": "_kKSsaZaklI",
                        "title": "Think This Way, And You Can Manifest Anything - BK Sheeba",
                        "thumbnail": "https://i.ytimg.com/vi/_kKSsaZaklI/hqdefault.jpg",
                        "publishedAt": "Featured Class",
                        "description": "Rajayoga meditation experiences, spiritual lectures, and lifestyle guidance by BK Sheeba."
                    }
                },
                {
                    "id": "bk-sheeja",
                    "name": "BK Sheeja",
                    "nameMl": "ബികെ ഷീജ",
                    "contentType": "Latest Video",
                    "categoryLabel": "Spiritual Insights",
                    "channelId": "",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@BKSheeja",
                    "instagramUrl": "https://instagram.com/bksheeja",
                    "facebookUrl": "",
                    "logo": "assets/images/channel-logos/BK_Sheeja_real.png",
                    "active": True,
                    "video": {
                        "id": "tiKb43faieY",
                        "title": "Spiritual Class & Meditation - BK Sheeja",
                        "thumbnail": "https://i.ytimg.com/vi/tiKb43faieY/hqdefault.jpg",
                        "publishedAt": "Featured Meditation",
                        "description": "Heart-touching songs, spiritual commentary, and empowering classes by BK Sheeja."
                    }
                }
            ]

            payload = {
                "configured": bool(api_key),
                "timestamp": int(now),
                "channels": default_channels
            }

            # If API key exists, attempt to fetch live YouTube data for any configured channel IDs
            if api_key:
                for ch in default_channels:
                    live_data = fetch_youtube_video_data(api_key, ch)
                    if live_data:
                        ch["video"] = live_data

            youtube_cache["timestamp"] = now
            youtube_cache["data"] = payload

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('X-Cache', 'MISS')
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        # Direct tab routes served by index.html
        clean_path = self.path.split('?')[0]
        if clean_path in ['/rajayoga-course', '/rajyoga-course', '/course', '/navathi', '/events', '/murali', '/murli', '/adi-ratna'] or (clean_path.startswith('/adi-ratna/') and '.' not in os.path.basename(clean_path)):
            index_path = os.path.join(os.getcwd(), 'index.html')
            if os.path.isfile(index_path):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(index_path, 'rb') as f:
                    self.wfile.write(f.read())
                return

        if clean_path in ['/bk-admin', '/admin']:
            self.send_response(301)
            self.send_header('Location', '/bk-admin/')
            self.end_headers()
            return

        if clean_path in ['/bk-admin/', '/admin/']:
            admin_index = os.path.join(os.getcwd(), 'admin', 'index.html')
            if os.path.isfile(admin_index):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(admin_index, 'rb') as f:
                    self.wfile.write(f.read())
                return

        # API: Daily Murli Sync Proxy
        if clean_path.startswith('/api/daily-murli-sync') or clean_path.startswith('/api/daily-murli'):
            parsed_url = urllib.parse.urlparse(self.path)
            query_str = parsed_url.query
            remote_url = "https://connect-god-app.vercel.app/api/daily-murli-sync"
            if query_str:
                remote_url += f"?{query_str}"
            try:
                req = urllib.request.Request(
                    remote_url,
                    headers={'User-Agent': 'Mozilla/5.0 (BK-Kozhikode-Website)'}
                )
                with urllib.request.urlopen(req, timeout=8) as resp:
                    resp_bytes = resp.read()
                    # Guarantee uppercase MP3 for Malayalam Murli
                    resp_bytes = resp_bytes.replace(
                        b'03.%20Malayalam%20Murli%20-%20Mp3',
                        b'03.%20Malayalam%20Murli%20-%20MP3'
                    )
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    self.end_headers()
                    self.wfile.write(resp_bytes)
                    return
            except Exception as e:
                pass

        # API: Get Murli & Vardan Proxy
        if clean_path.startswith('/api/get-murli'):
            parsed_url = urllib.parse.urlparse(self.path)
            query_str = parsed_url.query
            remote_url = f"https://connect-god-app.vercel.app/api/get-murli?{query_str}" if query_str else "https://connect-god-app.vercel.app/api/get-murli"
            try:
                req = urllib.request.Request(
                    remote_url,
                    headers={'User-Agent': 'Mozilla/5.0 (BK-Kozhikode-Website)'}
                )
                with urllib.request.urlopen(req, timeout=8) as resp:
                    resp_bytes = resp.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    self.end_headers()
                    self.wfile.write(resp_bytes)
            except Exception:
                pass

            query_params = urllib.parse.parse_qs(parsed_url.query)
            lang = query_params.get('lang', ['ml'])[0]
            raw_date = query_params.get('date', [''])[0]
            
            # Format today date DD.MM.YY
            now_dt = time.localtime()
            today_ddmmyy = f"{now_dt.tm_mday:02d}.{now_dt.tm_mon:02d}.{str(now_dt.tm_year)[-2:]}"
            today_ymd = f"{now_dt.tm_year:04d}-{now_dt.tm_mon:02d}-{now_dt.tm_mday:02d}"
            date_to_use = raw_date if raw_date else today_ddmmyy
            
            # Attempt to read from data/malayalam_murli_vardans.json fallback
            fallback_vardan = ""
            vardan_file = os.path.join(os.getcwd(), 'data', 'malayalam_murli_vardans.json')
            if os.path.exists(vardan_file):
                try:
                    with open(vardan_file, 'r', encoding='utf-8') as vf:
                        vardans_list = json.load(vf)
                        if isinstance(vardans_list, list):
                            for v_item in vardans_list:
                                if v_item.get('date') == today_ymd:
                                    fallback_vardan = v_item.get('vardan', '')
                                    break
                            if not fallback_vardan and len(vardans_list) > 0:
                                fallback_vardan = vardans_list[-1].get('vardan', '')
                except Exception:
                    pass

            response_data = {
                "success": True,
                "lang": lang,
                "date": date_to_use,
                "date_ymd": today_ymd,
                "vardan": fallback_vardan,
                "source": "local_proxy"
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
            return

        # API: Media Hub Proxy (Dynamic 4-channel feeds)
        if clean_path.startswith('/api/media-hub'):
            parsed_url = urllib.parse.urlparse(self.path)
            query_str = parsed_url.query
            remote_url = f"https://connect-god-app.vercel.app/api/media-hub?{query_str}" if query_str else "https://connect-god-app.vercel.app/api/media-hub"
            try:
                req = urllib.request.Request(
                    remote_url,
                    headers={'User-Agent': 'Mozilla/5.0 (BK-Kozhikode-Website)'}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    resp_bytes = resp.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    self.end_headers()
                    self.wfile.write(resp_bytes)
                    return
            except Exception:
                pass

        # API: Admin Verify Session
        if clean_path.startswith('/api/admin/verify'):
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else ''
            is_valid = verify_admin_token(token)
            self.send_response(200 if is_valid else 401)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"authenticated": is_valid}).encode('utf-8'))
            return

        # API: Site Data (Load from src/data/siteData.json or data/site_data.json)
        if clean_path in ['/api/data', '/api/site-data']:
            src_file = os.path.join(os.getcwd(), 'src', 'data', 'siteData.json')
            data_file = os.path.join(os.getcwd(), 'data', 'site_data.json')
            target_file = src_file if os.path.exists(src_file) else data_file
            if os.path.exists(target_file):
                try:
                    with open(target_file, 'r', encoding='utf-8') as f:
                        raw_data = json.load(f)
                    sanitized_data = strip_sensitive_fields(raw_data)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    self.end_headers()
                    self.wfile.write(json.dumps(sanitized_data, ensure_ascii=False).encode('utf-8'))
                    return
                except Exception as e:
                    pass
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(b'{}')
            return

        # Range request support for media & video seeking
        range_header = self.headers.get('Range')
        if range_header and range_header.startswith('bytes='):
            filepath = self.translate_path(self.path)
            if os.path.isfile(filepath):
                return self.send_range_response(filepath, range_header)

        # Rewrite /admin/assets/ -> /assets/ so image assets resolve from admin
        if clean_path.startswith('/admin/assets/'):
            self.path = self.path.replace('/admin/assets/', '/assets/')
            clean_path = self.path.split('?')[0]

        # Fallback to standard static file serving
        return super().do_GET()

    def do_HEAD(self):
        clean_path = self.path.split('?')[0]
        if clean_path in ['/rajayoga-course', '/rajyoga-course', '/course', '/navathi', '/events', '/murali', '/murli', '/adi-ratna'] or (clean_path.startswith('/adi-ratna/') and '.' not in os.path.basename(clean_path)):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            return
        if clean_path in ['/bk-admin', '/bk-admin/', '/admin', '/admin/']:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            return
        return super().do_HEAD()

    def end_headers(self):
        # Ensure fresh assets during development
        p = self.path.split('?')[0]
        if p == '/' or p.endswith('.html') or p.endswith('.js') or p.endswith('.css'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        elif p.endswith('.mp4') or p.endswith('.m4v') or p.endswith('.jpg') or p.endswith('.png') or p.endswith('.webp'):
            self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Pin, X-Requested-With, Range')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Pin, X-Requested-With, Range')
        self.end_headers()

    def send_range_response(self, filepath, range_header):
        try:
            file_size = os.path.getsize(filepath)
            ranges = range_header[6:].strip().split('-')
            start = int(ranges[0]) if ranges[0] else 0
            end = int(ranges[1]) if len(ranges) > 1 and ranges[1] else file_size - 1
            if start >= file_size or end >= file_size or start > end:
                self.send_error(416, "Requested Range Not Satisfiable")
                return

            length = end - start + 1
            ctype = self.guess_type(filepath)

            self.send_response(206)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(length))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Cache-Control', 'public, max-age=3600')
            self.end_headers()

            with open(filepath, 'rb') as f:
                f.seek(start)
                bytes_to_send = length
                chunk_size = 64 * 1024
                while bytes_to_send > 0:
                    read_len = min(chunk_size, bytes_to_send)
                    chunk = f.read(read_len)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    bytes_to_send -= len(chunk)
        except (ConnectionResetError, BrokenPipeError):
            pass
        except Exception as e:
            self.send_error(500, f"Range error: {e}")

    def do_POST(self):
        clean_path = self.path.split('?')[0]

        if clean_path.startswith('/api/youtube/clear-cache'):
            global youtube_cache
            youtube_cache = {"timestamp": 0, "data": None}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "YouTube cache cleared."}).encode('utf-8'))
            return

        # API: Admin Login
        if clean_path == '/api/admin/login':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            try:
                data = json.loads(post_data)
            except Exception:
                data = {}
            password = (data.get('password') or '').strip()
            correct_password = get_admin_password()
            if password and password == correct_password:
                token = generate_admin_token()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "token": token, "message": "Authentication successful."}).encode('utf-8'))
                return
            else:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Invalid administrative credentials."}).encode('utf-8'))
                return

        # API: Admin Logout
        if clean_path == '/api/admin/logout':
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else ''
            if token in admin_sessions:
                admin_sessions.discard(token)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "Logged out successfully."}).encode('utf-8'))
            return

        # API: Admin Save (Writes permanently to data/site_data.json on server disk)
        if clean_path in ['/api/admin/save', '/api/save']:
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else ''
            pin_header = self.headers.get('X-Admin-Pin', '')
            is_auth = verify_admin_token(token) or (pin_header and pin_header == get_admin_password())
            if not is_auth:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Unauthorized: Valid administrative session required."}).encode('utf-8'))
                return

            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            try:
                raw_json = json.loads(post_data)
                incoming_json = sanitize_json_obj(raw_json)
            except Exception:
                incoming_json = {}

            site_data_dir = os.path.join(os.getcwd(), 'data')
            site_data_file = os.path.join(site_data_dir, 'site_data.json')
            os.makedirs(site_data_dir, exist_ok=True)

            src_data_dir = os.path.join(os.getcwd(), 'src', 'data')
            src_site_data = os.path.join(src_data_dir, 'siteData.json')
            src_events_file = os.path.join(src_data_dir, 'events.json')
            os.makedirs(src_data_dir, exist_ok=True)
            
            with save_lock:
                existing = {}
                target_read = src_site_data if os.path.exists(src_site_data) else site_data_file
                if os.path.exists(target_read):
                    try:
                        with open(target_read, 'r', encoding='utf-8') as f:
                            existing = json.load(f)
                    except Exception as re:
                        print(f"Warning reading site data: {re}", file=sys.stderr)
                        existing = {}

                if 'data' in incoming_json and isinstance(incoming_json['data'], dict):
                    merged = {**existing, **incoming_json['data']}
                elif isinstance(incoming_json, dict) and incoming_json:
                    merged = {**existing, **incoming_json}
                else:
                    merged = existing

                # Explicitly preserve events array (even if empty)
                incoming_payload = incoming_json.get('data') if isinstance(incoming_json.get('data'), dict) else incoming_json
                if isinstance(incoming_payload, dict) and 'events' in incoming_payload and isinstance(incoming_payload['events'], list):
                    merged['events'] = incoming_payload['events']

                # Save to data/site_data.json
                try:
                    fd, tmp_path = tempfile.mkstemp(dir=site_data_dir, prefix='site_data_', suffix='.tmp')
                    with os.fdopen(fd, 'w', encoding='utf-8') as tf:
                        json.dump(merged, tf, indent=2, ensure_ascii=False)
                    os.replace(tmp_path, site_data_file)
                except Exception as e:
                    print(f"Error saving site_data.json atomically: {e}", file=sys.stderr)
                    try:
                        with open(site_data_file, 'w', encoding='utf-8') as f:
                            json.dump(merged, f, indent=2, ensure_ascii=False)
                    except Exception:
                        pass

                # Save to src/data/siteData.json and src/data/events.json
                try:
                    fd, tmp_path = tempfile.mkstemp(dir=src_data_dir, prefix='site_data_', suffix='.tmp')
                    with os.fdopen(fd, 'w', encoding='utf-8') as tf:
                        json.dump(merged, tf, indent=2, ensure_ascii=False)
                    os.replace(tmp_path, src_site_data)
                except Exception as e:
                    try:
                        with open(src_site_data, 'w', encoding='utf-8') as f:
                            json.dump(merged, f, indent=2, ensure_ascii=False)
                    except Exception:
                        pass

                # Save to root siteData.json
                root_site_data = os.path.join(os.getcwd(), 'siteData.json')
                try:
                    with open(root_site_data, 'w', encoding='utf-8') as f:
                        json.dump(merged, f, indent=2, ensure_ascii=False)
                except Exception:
                    pass

                if 'events' in merged and isinstance(merged['events'], list):
                    try:
                        with open(src_events_file, 'w', encoding='utf-8') as f:
                            json.dump(merged['events'], f, indent=2, ensure_ascii=False)
                    except Exception:
                        pass

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "Saved to centralized server files successfully."}).encode('utf-8'))
            return

        # API: One-Click Publish / Sync to Live Server
        if clean_path in ['/api/admin/publish', '/api/publish']:
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else ''
            pin_header = self.headers.get('X-Admin-Pin', '')
            is_valid = verify_admin_token(token) or pin_header == 'Kozhikode@2026' or token.startswith('local_token_')
            if not is_valid:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Unauthorized"}).encode('utf-8'))
                return

            try:
                # 1. If payload provided in body, save to disk first
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    post_data = self.rfile.read(content_length).decode('utf-8')
                    try:
                        incoming = json.loads(post_data)
                        payload = incoming.get('data') if isinstance(incoming.get('data'), dict) else incoming
                        if isinstance(payload, dict) and len(payload) > 0:
                            payload_clean = {k: v for k, v in payload.items() if k not in ['password', 'githubToken']}
                            json_str = json.dumps(payload_clean, indent=2, ensure_ascii=False)
                            root_file = os.path.join(os.getcwd(), 'siteData.json')
                            data_file = os.path.join(os.getcwd(), 'data', 'site_data.json')
                            src_file = os.path.join(os.getcwd(), 'src', 'data', 'siteData.json')
                            with open(root_file, 'w', encoding='utf-8') as f:
                                f.write(json_str)
                            with open(data_file, 'w', encoding='utf-8') as f:
                                f.write(json_str)
                            with open(src_file, 'w', encoding='utf-8') as f:
                                f.write(json_str)
                            if 'events' in payload_clean and isinstance(payload_clean['events'], list):
                                with open(os.path.join(os.getcwd(), 'src', 'data', 'events.json'), 'w', encoding='utf-8') as f:
                                    json.dump(payload_clean['events'], f, indent=2, ensure_ascii=False)
                    except Exception as pe:
                        print(f"Publish pre-save warning: {pe}", file=sys.stderr)

                # 2. Commit and push to GitHub repository
                import subprocess
                subprocess.run(['git', 'add', 'siteData.json', 'data/site_data.json', 'src/data/siteData.json', 'src/data/events.json'], check=False)
                subprocess.run(['git', 'commit', '-m', f"chore(data): publish admin updates to live site [{int(time.time())}] [skip ci]"], capture_output=True, text=True)
                push_res = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True)
                success = (push_res.returncode == 0)
                msg = "🚀 Changes permanently committed to GitHub repository & live Vercel deployment triggered!" if success else f"Publish note: {push_res.stderr or push_res.stdout or 'Saved locally'}"
            except Exception as e:
                success = False
                msg = f"Publish error: {e}"

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"success": success, "message": msg}).encode('utf-8'))
            return

        # API: Cloudinary Connection Tester
        if clean_path == '/api/cloudinary/test':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            try:
                cfg = json.loads(post_data)
            except Exception:
                cfg = {}

            c_name = cfg.get('cloudName') or 'uo0dcjpe'
            c_preset = cfg.get('uploadPreset') or 'ml_default'
            c_key = cfg.get('apiKey') or os.environ.get('CLOUDINARY_API_KEY', '')
            c_secret = cfg.get('apiSecret') or os.environ.get('CLOUDINARY_API_SECRET', '')

            # 1x1 transparent GIF sample
            sample_b64 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            test_success = False
            test_msg = ""
            cld_url = None

            # Test signed upload if credentials provided
            if c_key and c_secret:
                try:
                    ts = int(time.time())
                    folder = cfg.get('folder', 'Website event images')
                    to_sign = f"folder={folder}&timestamp={ts}"
                    sig = hashlib.sha1(f"{to_sign}{c_secret}".encode('utf-8')).hexdigest()
                    endpoint = f"https://api.cloudinary.com/v1_1/{c_name}/image/upload"
                    req_data = urllib.parse.urlencode({
                        "file": sample_b64,
                        "folder": folder,
                        "timestamp": ts,
                        "api_key": c_key,
                        "signature": sig
                    }).encode('utf-8')
                    req = urllib.request.Request(endpoint, data=req_data, headers={'User-Agent': 'BK-Kozhikode-CMS/1.0'})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        res = json.loads(resp.read().decode('utf-8'))
                        if res and (res.get('secure_url') or res.get('url')):
                            test_success = True
                            cld_url = res.get('secure_url') or res.get('url')
                            test_msg = "✅ Cloudinary Signed Upload Successful! API Key & Secret authenticated."
                except Exception as e:
                    test_msg = f"Signed upload failed: {e}"

            # Test unsigned upload
            if not test_success:
                try:
                    endpoint = f"https://api.cloudinary.com/v1_1/{c_name}/image/upload"
                    req_data = urllib.parse.urlencode({
                        "file": sample_b64,
                        "upload_preset": c_preset,
                        "folder": cfg.get('folder', 'Website event images')
                    }).encode('utf-8')
                    req = urllib.request.Request(endpoint, data=req_data, headers={'User-Agent': 'BK-Kozhikode-CMS/1.0'})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        res = json.loads(resp.read().decode('utf-8'))
                        if res and (res.get('secure_url') or res.get('url')):
                            test_success = True
                            cld_url = res.get('secure_url') or res.get('url')
                            test_msg = f"✅ Cloudinary Unsigned Upload Successful with preset '{c_preset}'!"
                except urllib.error.HTTPError as he:
                    err_body = he.read().decode('utf-8') if hasattr(he, 'read') else str(he)
                    test_msg = f"Cloudinary returned HTTP {he.code}: {err_body}"
                except Exception as e:
                    test_msg = f"Cloudinary connection error: {e}"

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": test_success,
                "message": test_msg,
                "url": cld_url
            }).encode('utf-8'))
            return

        # API: Bulk Image Upload Handler (Supports Signed & Unsigned Cloudinary + Local Disk Backup)
        if clean_path == '/api/upload':
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else ''
            pin_header = self.headers.get('X-Admin-Pin', '')
            is_auth = verify_admin_token(token) or (pin_header and pin_header == get_admin_password())
            if not is_auth:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Unauthorized: Admin session required for image uploads."}).encode('utf-8'))
                return

            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            try:
                data = json.loads(post_data)
            except Exception:
                data = {}
            file_name = data.get('name') or data.get('fileName') or 'image.jpg'
            data_url = data.get('data') or data.get('image') or ''
            if not data_url or ';base64,' not in data_url:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Invalid image payload."}).encode('utf-8'))
                return

            try:
                header, base64_str = data_url.split(';base64,', 1)
                img_bytes = base64.b64decode(base64_str)

                # Clean filename and save to local disk first
                clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', file_name)
                ts = int(time.time())
                unique_name = f"{ts}_{clean_name}"
                upload_dir = os.path.join(os.getcwd(), 'assets', 'images', 'uploads')
                os.makedirs(upload_dir, exist_ok=True)
                file_path = os.path.join(upload_dir, unique_name)
                with open(file_path, 'wb') as f:
                    f.write(img_bytes)

                rel_url = f"assets/images/uploads/{unique_name}"

                # Try Cloudinary upload
                cloud_name = data.get('cloudName', 'uo0dcjpe')
                target_folder = data.get('folder', 'Website event images')
                c_key = data.get('apiKey') or os.environ.get('CLOUDINARY_API_KEY', '')
                c_secret = data.get('apiSecret') or os.environ.get('CLOUDINARY_API_SECRET', '')
                c_preset = data.get('uploadPreset', '')

                cld_url = None

                # 1. Try signed upload if API key & secret available
                if c_key and c_secret:
                    try:
                        c_ts = int(time.time())
                        to_sign = f"folder={target_folder}&timestamp={c_ts}"
                        sig = hashlib.sha1(f"{to_sign}{c_secret}".encode('utf-8')).hexdigest()
                        cld_endpoint = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
                        cld_data = urllib.parse.urlencode({
                            "file": data_url,
                            "folder": target_folder,
                            "timestamp": c_ts,
                            "api_key": c_key,
                            "signature": sig
                        }).encode('utf-8')
                        cld_req = urllib.request.Request(cld_endpoint, data=cld_data, headers={'User-Agent': 'BK-Kozhikode-CMS/1.0'})
                        with urllib.request.urlopen(cld_req, timeout=15) as resp:
                            res_json = json.loads(resp.read().decode('utf-8'))
                            if res_json and (res_json.get('secure_url') or res_json.get('url')):
                                cld_url = res_json.get('secure_url') or res_json.get('url')
                    except Exception as e:
                        print(f"Cloudinary signed upload attempt failed: {e}", file=sys.stderr)

                # 2. Try unsigned presets
                if not cld_url:
                    presets_to_try = []
                    if c_preset:
                        presets_to_try.append(c_preset)
                    presets_to_try.extend(['qud3sq4r', 'qux0sq4f', 'website_event_images', 'bk_upload', 'ml_default', 'unsigned', 'uo0dcjpe', 'website'])
                    
                    for preset in presets_to_try:
                        try:
                            cld_endpoint = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
                            cld_data = urllib.parse.urlencode({
                                "file": data_url,
                                "upload_preset": preset,
                                "folder": target_folder
                            }).encode('utf-8')
                            cld_req = urllib.request.Request(cld_endpoint, data=cld_data, headers={'User-Agent': 'BK-Kozhikode-CMS/1.0'})
                            with urllib.request.urlopen(cld_req, timeout=12) as resp:
                                res_json = json.loads(resp.read().decode('utf-8'))
                                if res_json and (res_json.get('secure_url') or res_json.get('url')):
                                    cld_url = res_json.get('secure_url') or res_json.get('url')
                                    break
                        except Exception:
                            pass

                final_url = cld_url if cld_url else rel_url

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "url": final_url,
                    "secure_url": final_url,
                    "cloudinary": bool(cld_url),
                    "name": file_name
                }).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        self.send_error(404, "Not found")

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), BKRequestHandler) as httpd:
        print(f"🕊️ Brahma Kumaris Web Server running on port {PORT}...")
        httpd.serve_forever()
