# Brahma Kumaris Kozhikode (Calicut) — Official Spiritual Web Platform 🕊️

A high-performance, serene, and modern spiritual web platform for Brahma Kumaris Kozhikode (Light Palace, Ashokapuram).

## ✨ Features
- **Animated Rajyoga Hero**: All 300 supplied Full HD frames play in order as a 10-second, 30 fps H.264 loop, with subtle pointer-driven perspective. The complete seven-ray and lotus composition remains visible on mobile.
- **Accessible Playback**: Pause/play control, static poster when reduced motion is preferred, and automatic pause when the hero is offscreen or the browser tab is hidden. Existing course and meditation buttons remain connected.
- **7-Day Rajyoga Meditation Foundation Course**: Modular daily lessons with video streaming.
- **Events & Celebrations Hub**: Categorized latest events, Navathi celebrations, and festivals (Shivarathri, Raksha Bandhan).
- **Spiritual Media Hub**: Songs (Malayalam & Hindi), Commentaries, and Meditation Music.
- **Interactive Meditation Room**: Youthful Rajyoga visual showcase, breathing visualizer, and ambient soundscapes.
- **Daily Madhuban Murali Reader**: Dynamically computed in IST with Malayalam translations.
- **Center Locator**: Complete Kozhikode branches directory with click-to-call (`tel:`) & WhatsApp links.
- **Automated YouTube Feed**: 4-channel live video integrations for Supreme Light Creations, BKs Calicut, BK Sheeba, and BK Sheeja.
- **Admin CMS Portal**: PIN-protected management for content, events, and announcements.

## 🚀 Getting Started
Run the local python server:
```bash
python3 server.py 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

## Hero animation assets

Source: `ezgif-5a40703959d1c170-png-split.zip`, frames 001–300, each 1920 × 1080. The ZIP contains no playback timing; 30 fps is the chosen presentation rate. All 300 frames were encoded without dropping frames. There is no audio track.

`assets/video/rajyoga-hero.mp4` is a web-optimized H.264 video (approximately 7.4 MB), and `assets/video/rajyoga-poster.jpg` is the first frame. `css/hero.css` and `js/hero.js` control layout, playback and perspective. The depth effect transforms the supplied flat animation; it is not a reconstructed 3D scene. Serve the project using its existing Python server to preserve its YouTube endpoints.

### Device and performance optimization

The hero selects one video at first playback: 640×360 (0.87 MB) for small screens or constrained hardware, 960×540 (1.94 MB) for tablets, or the 1920×1080 desktop version (7.39 MB). Every version retains all 300 frames at 30 fps. Resizing does not trigger a second download. Data Saver, 2G connections, reduced-motion preferences and very limited hardware default to the poster with explicit play. Playback pauses when less than 10% of the stage is visible or the page is hidden. Pointer perspective runs only on eligible desktop pointers and schedules work only during pointer movement. Container-responsive layout also supports the existing device preview modes.

Validation: JavaScript syntax, existing store checks, mocked device selection/playback lifecycle checks and complete decoding of both optimized videos passed. Physical-device frame-rate and thermal measurements have not been performed.
