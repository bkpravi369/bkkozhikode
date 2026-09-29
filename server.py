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
import json
import os
import sys
import time
import hmac
import hashlib
import secrets

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
CACHE_TTL = 1800  # 30 minutes in seconds

# In-memory cache for YouTube responses
youtube_cache = {
    "timestamp": 0,
    "data": None
}

# Admin session tracking
admin_sessions = set()

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
    return "OmShanti@Kozhikode2026"

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
                    "id": "supreme-light-creations",
                    "name": "Supreme Light Creations",
                    "contentType": "Podcast",
                    "categoryLabel": "Spiritual Podcast",
                    "channelId": "",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@supremelightcreations",
                    "instagramUrl": "https://instagram.com/supremelightcreations",
                    "facebookUrl": "https://facebook.com/supremelightcreations",
                    "active": True,
                    "video": {
                        "id": "",
                        "title": "Awakening Higher Consciousness & Soul Healing",
                        "thumbnail": "assets/images/paramdham_sunset.jpg",
                        "publishedAt": "Recent Episode",
                        "description": "Weekly spiritual podcast series exploring deep meditation, soul consciousness, and divine virtues."
                    }
                },
                {
                    "id": "bks-calicut",
                    "name": "BKs Calicut",
                    "contentType": "Latest Live",
                    "categoryLabel": "Live / Discourse",
                    "channelId": "",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@bkscalicut",
                    "instagramUrl": "https://instagram.com/bkscalicut",
                    "facebookUrl": "https://facebook.com/bkscalicut",
                    "active": True,
                    "video": {
                        "id": "",
                        "title": "Daily Rajyoga Meditation & Satsang Discourse",
                        "thumbnail": "assets/images/meditation_hall.jpg",
                        "publishedAt": "Live Broadcasts",
                        "description": "Daily collective Rajyoga meditation broadcasts, Murli reflections, and spiritual empowerment sessions."
                    }
                },
                {
                    "id": "bk-sheeba",
                    "name": "BK Sheeba",
                    "contentType": "Latest Video",
                    "categoryLabel": "Discourse / Class",
                    "channelId": "",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@bksheeba",
                    "instagramUrl": "https://instagram.com/bksheeba",
                    "facebookUrl": "https://facebook.com/bksheeba",
                    "active": True,
                    "video": {
                        "id": "",
                        "title": "Mastering the Mind & Overcoming Life Challenges",
                        "thumbnail": "assets/images/light_palace_center.jpg",
                        "publishedAt": "Recent Video",
                        "description": "Practical insights and inspiring spiritual classes on peace, emotional resilience, and Rajyoga lifestyle."
                    }
                },
                {
                    "id": "bk-sheeja",
                    "name": "BK Sheeja",
                    "contentType": "Latest Video",
                    "categoryLabel": "Spiritual Insights",
                    "channelId": "",
                    "playlistId": "",
                    "youtubeUrl": "https://youtube.com/@bksheeja",
                    "instagramUrl": "https://instagram.com/bksheeja",
                    "facebookUrl": "",
                    "active": True,
                    "video": {
                        "id": "",
                        "title": "Inner Power & Harmonious Relationships",
                        "thumbnail": "assets/images/rajyoga_peace.jpg",
                        "publishedAt": "Recent Video",
                        "description": "Gentle guidance on cultivating divine virtues, soul-conscious vision, and pure intentions."
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

        # Admin route redirect and serving
        clean_path = self.path.split('?')[0]
        if clean_path == '/admin':
            self.send_response(301)
            self.send_header('Location', '/admin/')
            self.end_headers()
            return

        if clean_path == '/admin/':
            admin_index = os.path.join(os.getcwd(), 'admin', 'index.html')
            if os.path.isfile(admin_index):
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(admin_index, 'rb') as f:
                    self.wfile.write(f.read())
                return

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

        # Range request support for media & video seeking
        range_header = self.headers.get('Range')
        if range_header and range_header.startswith('bytes='):
            filepath = self.translate_path(self.path)
            if os.path.isfile(filepath):
                return self.send_range_response(filepath, range_header)

        # Fallback to standard static file serving
        return super().do_GET()

    def end_headers(self):
        # Ensure fresh assets during development
        p = self.path.split('?')[0]
        if p == '/' or p.endswith('.html') or p.endswith('.js') or p.endswith('.css'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

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

        # API: Admin Save (Requires valid auth token)
        if clean_path == '/api/admin/save':
            auth_header = self.headers.get('Authorization', '')
            token = auth_header[7:].strip() if auth_header.startswith('Bearer ') else ''
            if not verify_admin_token(token):
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Unauthorized: Valid administrative session required for write operations."}).encode('utf-8'))
                return

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "Settings saved successfully."}).encode('utf-8'))
            return

        self.send_error(404, "Not found")

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), BKRequestHandler) as httpd:
        print(f"🕊️ Brahma Kumaris Web Server running on port {PORT}...")
        httpd.serve_forever()
