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

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
CACHE_TTL = 1800  # 30 minutes in seconds

# In-memory cache for YouTube responses
youtube_cache = {
    "timestamp": 0,
    "data": None
}

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

        # Fallback to standard static file serving
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/youtube/clear-cache'):
            global youtube_cache
            youtube_cache = {"timestamp": 0, "data": None}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "YouTube cache cleared."}).encode('utf-8'))
            return
        
        self.send_error(404, "Not found")

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), BKRequestHandler) as httpd:
        print(f"🕊️ Brahma Kumaris Web Server running on port {PORT}...")
        httpd.serve_forever()
