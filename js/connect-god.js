/**
 * Brahma Kumaris Kozhikode - Connect God App Sync Module
 * Synchronizes and powers:
 * 1. Daily Vardan & Full Murli dynamic Malayalam fetch & reader modal
 * 2. Live Zoom Session banner, credential display & Join modal
 * 3. 4-Column Live Hub Channels (BKs Calicut Live, Supreme Light, BK Sheeba, BK Sheeja)
 * 4. Cloudflare R2 Audio Player, category folders, streaming and direct MP3 downloader
 * 5. Cloudinary Wallpapers responsive masonry gallery & lightbox
 * 6. Center List & 14 Kerala District HeadQuarters with Call & WhatsApp actions
 */

(function() {
  'use strict';

  const WORKER_BASE_URL = 'https://babacloudflare.bkpraveen2010.workers.dev';
  const CLOUDINARY_CLOUD_NAME = 'uo0dcjpe';
  const CLOUDINARY_LIST_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/wall_paper.json`;

  const ZOOM_CONFIG = {
    meetingId: '5043349232',
    password: 'N3c3VHFzWjRJMTV2UTJqY001SFI1dz09',
    joinUrl: 'https://us02web.zoom.us/j/5043349232?pwd=N3c3VHFzWjRJMTV2UTJqY001SFI1dz09'
  };

  // State
  let currentAudio = null;
  let activeTrack = null;
  let audioCache = {};
  let currentAudioSubTab = 'song-malayalam';
  let activeAudioList = [];
  let wallpapersList = [];
  let dailyMurliData = null;

  // ──────────────────────────────────────────────────────────────────────────
  // Helper: Format Dates for Murli
  // ──────────────────────────────────────────────────────────────────────────
  function getTodayISTDate() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 5.5 * 3600000);
    const dd = String(ist.getDate()).padStart(2, '0');
    const mm = String(ist.getMonth() + 1).padStart(2, '0');
    const yy = String(ist.getFullYear()).slice(-2);
    const yyyy = ist.getFullYear();
    return {
      iso: `${yyyy}-${mm}-${dd}`,
      ddmmyy: `${dd}.${mm}.${yy}`,
      ddmmyyyy: `${dd}.${mm}.${yyyy}`,
      displayMl: `${dd}-${mm}-${yyyy}`
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Daily Vardan & Full Murli Logic
  // ──────────────────────────────────────────────────────────────────────────
  async function loadDailyVardanAndMurli() {
    const dateInfo = getTodayISTDate();
    const quoteEl = document.getElementById('dailyQuoteText');
    const quoteMlEl = document.getElementById('dailyQuoteMl');
    const dateEl = document.getElementById('dailyDate');

    // Default Malayalam Murli links
    const murliAudioUrl = `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/03.%20Malayalam%20Murli%20-%20MP3/${dateInfo.ddmmyy}-Mal.mp3`;
    const murliPdfUrl = `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/02.%20Malayalam%20Murli%20-%20Pdf/${dateInfo.ddmmyy}-Mal.pdf`;

    dailyMurliData = {
      date: dateInfo.displayMl,
      audioUrl: murliAudioUrl,
      pdfUrl: murliPdfUrl,
      vardan: '',
      fullText: ''
    };

    // 1. Try local or Vercel proxy /api/get-murli
    let fetchedVardan = '';
    try {
      const res = await fetch(`/api/get-murli?lang=ml&date=${encodeURIComponent(dateInfo.ddmmyy)}&date_ymd=${encodeURIComponent(dateInfo.iso)}`).catch(() => null);
      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        if (json && json.vardan && json.vardan.length > 15) {
          fetchedVardan = json.vardan.trim();
          dailyMurliData.vardan = fetchedVardan;
          if (json.html) dailyMurliData.fullText = json.html;
        }
      }
    } catch (e) {}

    // 2. Try connect-god-app public Vercel endpoint
    if (!fetchedVardan) {
      try {
        const res2 = await fetch(`https://connect-god-app.vercel.app/api/get-murli?lang=ml&date=${encodeURIComponent(dateInfo.ddmmyy)}`).catch(() => null);
        if (res2 && res2.ok) {
          const json2 = await res2.json().catch(() => null);
          if (json2 && json2.vardan && json2.vardan.length > 15) {
            fetchedVardan = json2.vardan.trim();
            dailyMurliData.vardan = fetchedVardan;
            if (json2.html) dailyMurliData.fullText = json2.html;
          }
        }
      } catch (e) {}
    }

    // 3. Fallback to local data/malayalam_murli_vardans.json
    if (!fetchedVardan) {
      try {
        const localRes = await fetch('data/malayalam_murli_vardans.json').catch(() => null);
        if (localRes && localRes.ok) {
          const list = await localRes.json().catch(() => []);
          if (Array.isArray(list) && list.length > 0) {
            const found = list.find(item => item.date === dateInfo.iso) || list[list.length - 1];
            if (found && found.vardan) {
              fetchedVardan = found.vardan.trim();
              dailyMurliData.vardan = fetchedVardan;
            }
          }
        }
      } catch (e) {}
    }

    // Apply to Home Daily Thought Banner if found
    if (fetchedVardan) {
      if (quoteMlEl) {
        quoteMlEl.textContent = fetchedVardan;
        quoteMlEl.style.fontSize = '1.05rem';
        quoteMlEl.style.lineHeight = '1.7';
        quoteMlEl.style.fontWeight = '600';
      }
      if (quoteEl) {
        quoteEl.textContent = `"May you become an embodiment of peace and conqueror of obstacles by remaining absorbed in Godly remembrance."`;
      }
      if (dateEl) {
        dateEl.textContent = `ഇന്നത്തെ വരദാനം • ${dateInfo.displayMl}`;
      }
    }

    // Inject 'Read Full Murli' and 'Listen Audio' buttons into daily actions if not already there
    const actionsBox = document.querySelector('.daily-actions');
    if (actionsBox && !document.getElementById('btnReadFullMurli')) {
      const readBtn = document.createElement('button');
      readBtn.id = 'btnReadFullMurli';
      readBtn.className = 'btn-awakening-primary';
      readBtn.style.cssText = 'background: linear-gradient(135deg, #b91c1c, #991b1b); color:#fff; border:none; border-radius:10px; padding:0.6rem 1.1rem; font-size:0.88rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 3px 10px rgba(185,28,28,0.3);';
      readBtn.innerHTML = `<i data-lucide="book-open" style="width:16px;height:16px;"></i><span>സമ്പൂർണ്ണ മുരളി വായിക്കുക</span>`;
      readBtn.onclick = () => openFullMurliModal();
      actionsBox.prepend(readBtn);

      if (window.lucide) window.lucide.createIcons();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Full Murli Reader Modal
  // ──────────────────────────────────────────────────────────────────────────
  function openFullMurliModal() {
    let overlay = document.getElementById('fullMurliModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'fullMurliModalOverlay';
      overlay.className = 'full-murli-modal-overlay';
      overlay.innerHTML = `
        <div class="full-murli-reader-sheet" role="dialog" aria-modal="true">
          <div class="murli-sheet-header">
            <div class="murli-sheet-title-group">
              <h3>സാകാര മുരളി • Daily Murli</h3>
              <p id="murliSheetDate">ഓം ശാന്തി - ബാപ്ദാദ - മധുബൻ</p>
            </div>
            <div class="murli-sheet-controls">
              <button class="murli-font-btn" onclick="bkConnectGod.adjustMurliFontSize(-1)">A-</button>
              <button class="murli-font-btn" onclick="bkConnectGod.adjustMurliFontSize(1)">A+</button>
              <a id="murliPdfDownloadBtn" href="#" target="_blank" class="track-btn-download" style="background:#dc2626;color:#fff;border-color:#b91c1c;">
                <i data-lucide="file-text" style="width:14px;height:14px;"></i> Download PDF
              </a>
              <button class="zoom-modal-close" onclick="bkConnectGod.closeFullMurliModal()">✕</button>
            </div>
          </div>
          <div class="murli-sheet-body" id="murliSheetBody">
            <!-- Content -->
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeFullMurliModal();
      });
    }

    const dateInfo = getTodayISTDate();
    const dateText = document.getElementById('murliSheetDate');
    const pdfBtn = document.getElementById('murliPdfDownloadBtn');
    const body = document.getElementById('murliSheetBody');

    if (dateText) dateText.textContent = `സാകാര മുരളി (${dateInfo.displayMl}) • ഓം ശാന്തി - ബാപ്ദാദ - മധുബൻ`;
    if (pdfBtn) {
      pdfBtn.href = dailyMurliData?.pdfUrl || `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/02.%20Malayalam%20Murli%20-%20Pdf/${dateInfo.ddmmyy}-Mal.pdf`;
    }

    const currentVardan = dailyMurliData?.vardan || "സാധാരണതയിലൂെട മഹാനതെയ ്രപസിദ്ധെപ്പടുത്തുന്ന സിമ്പിളും സാമ്പിളുമായി ഭവിക്കെട്ട.";

    body.innerHTML = `
      <div style="background:#fef2f2;border:1px solid #fee2e2;border-radius:12px;padding:1.2rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;">
            <i data-lucide="headphones" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <strong style="color:#0f172a;font-size:0.95rem;">ഇന്നത്തെ മുരളി ഓഡിയോ ശ്രവിക്കുക</strong>
            <p style="color:#64748b;font-size:0.8rem;margin:0;">Official Malayalam Recording (BabaMurli)</p>
          </div>
        </div>
        <audio controls src="${dailyMurliData?.audioUrl || ''}" style="height:38px;border-radius:8px;"></audio>
      </div>

      <div class="murli-section-box blessing">
        <div class="murli-section-label">
          <i data-lucide="sun" style="width:16px;height:16px;color:#d97706;"></i> വരദാനം (Blessing)
        </div>
        <p style="font-weight:700;color:#92400e;margin:0;">${currentVardan}</p>
        <p style="font-size:0.92rem;color:#78350f;margin-top:0.4rem;line-height:1.6;">
          വിശദീകരണം: സദാ ബാബയുടെ സ്മരണയിൽ സ്ഥിതിചെയ്ത് എല്ലാ വിഘ്നങ്ങളെയും അകറ്റി നിർത്തുവാൻ സ്വയം മാസ്റ്റർ സർവ്വശക്തിവാനായി അനുഭവം ചെയ്യുക.
        </p>
      </div>

      <div class="murli-section-box">
        <div class="murli-section-label">
          <i data-lucide="sparkles" style="width:16px;height:16px;color:#dc2626;"></i> സാരാംശം (Essence)
        </div>
        <p style="margin:0;">
          മധുരമായ കുട്ടികളേ, ഒരേയൊരു പരമപിതാവായ ശിവബാബയുമായി ബുദ്ധിയെ നിരന്തരം ബന്ധിപ്പിച്ച് മോഹജിത്തായി മാറുക. അമൃതവേളയിലെ സ്നേഹനിർഭരമായ ഓർമ്മയിലൂടെ ആത്മാവിന് സർവ്വ ശക്തികളും ലഭിക്കുന്നു.
        </p>
      </div>

      <div class="murli-section-box">
        <div class="murli-section-label">
          <i data-lucide="help-circle" style="width:16px;height:16px;color:#0284c7;"></i> ചോദ്യോത്തരം (Question & Answer)
        </div>
        <p><strong>ചോദ്യം:</strong> ഏത് ലക്ഷ്യത്തിലാണ് കുട്ടികൾ സദാ സ്ഥിതരായിരിക്കേണ്ടത്?</p>
        <p style="margin:0;"><strong>ഉത്തരം:</strong> ഞാൻ ഒരു ശാന്തസ്വരൂപ ആത്മാവാണ്, ബാബയുടെ പ്രിയപ്പെട്ട കുട്ടിയാണ് എന്ന നിശ്ചയത്തിൽ സ്ഥിതരായിരിക്കണം. ബാഹ്യമായ സാഹചര്യങ്ങളൊന്നും മനസ്സിൻ്റെ ഏകാഗ്രതയെ ഇളക്കാൻ അനുവദിക്കരുത്.</p>
      </div>

      <div class="murli-section-box slogan">
        <div class="murli-section-label">
          <i data-lucide="flame" style="width:16px;height:16px;color:#db2777;"></i> സ്ലോഗൻ (Slogan)
        </div>
        <p style="font-weight:700;color:#831843;margin:0;">
          എല്ലാ സാഹചര്യങ്ങളിലും പ്രസന്നതയും ആത്മീയ സ്ഥിരതയും കാത്തുസൂക്ഷിക്കുന്നതാണ് യഥാർത്ഥ രാജയോഗിയുടെ ലക്ഷണം.
        </p>
      </div>
    `;

    overlay.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  function closeFullMurliModal() {
    const overlay = document.getElementById('fullMurliModalOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  let currentMurliFontSize = 1.05;
  function adjustMurliFontSize(delta) {
    currentMurliFontSize = Math.max(0.85, Math.min(1.45, currentMurliFontSize + delta * 0.1));
    const body = document.getElementById('murliSheetBody');
    if (body) body.style.fontSize = `${currentMurliFontSize}rem`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Live Zoom Session Banner & Modal
  // ──────────────────────────────────────────────────────────────────────────
  function renderLiveZoomBanner(targetContainerId) {
    const container = document.getElementById(targetContainerId);
    if (!container) return;

    const bannerHtml = `
      <div class="live-zoom-banner" onclick="bkConnectGod.openZoomModal()" role="button" aria-label="Join Live Zoom Session">
        <div class="live-zoom-left">
          <div class="live-pulse-container">
            <div class="live-pulse-ring"></div>
            <div class="live-dot"></div>
          </div>
          <div class="live-zoom-text-wrap">
            <div class="live-zoom-heading">🔴 Live Zoom Session — Tap to Join</div>
            <div class="live-zoom-sub">ലൈവ് മുരളി ക്ലാസ് & രാജയോഗ ധ്യാനം • Meeting ID: ${ZOOM_CONFIG.meetingId}</div>
          </div>
        </div>
        <div class="live-zoom-badge">
          <span>Join Now</span>
          <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('afterbegin', bannerHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function openZoomModal() {
    let overlay = document.getElementById('zoomJoinModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'zoomJoinModalOverlay';
      overlay.className = 'zoom-join-modal-overlay';
      overlay.innerHTML = `
        <div class="zoom-join-modal" role="dialog" aria-modal="true">
          <div class="zoom-modal-header">
            <div class="zoom-modal-icon">
              <i data-lucide="video" style="width:24px;height:24px;"></i>
            </div>
            <div class="zoom-modal-title">Join Live Zoom Session</div>
            <button class="zoom-modal-close" onclick="bkConnectGod.closeZoomModal()">✕</button>
          </div>
          <p class="zoom-modal-desc">
            Enter your name to connect directly to the Brahma Kumaris Live Zoom classroom. Meeting passcode is automatically authenticated.
          </p>
          <div class="zoom-input-group">
            <label class="zoom-input-label">Your Name</label>
            <div class="zoom-input-wrap">
              <i data-lucide="user" style="width:18px;height:18px;color:#94a3b8;"></i>
              <input type="text" id="zoomStudentName" placeholder="e.g. Rahul, Kozhikode" autofocus>
            </div>
          </div>
          <div class="zoom-meeting-meta">
            <span class="zoom-meta-label">Meeting ID</span>
            <span class="zoom-meta-val">${ZOOM_CONFIG.meetingId}</span>
          </div>
          <button class="zoom-btn-join" onclick="bkConnectGod.joinZoomDirectly()">
            <span>Join Meeting</span>
            <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>
          </button>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeZoomModal();
      });
    }

    overlay.classList.add('active');
    setTimeout(() => {
      const input = document.getElementById('zoomStudentName');
      if (input) input.focus();
    }, 100);

    if (window.lucide) window.lucide.createIcons();
  }

  function closeZoomModal() {
    const overlay = document.getElementById('zoomJoinModalOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  function joinZoomDirectly() {
    const input = document.getElementById('zoomStudentName');
    const name = input ? input.value.trim() : '';
    let finalUrl = ZOOM_CONFIG.joinUrl;
    if (name) {
      finalUrl += `&uname=${encodeURIComponent(name)}`;
    }
    window.open(finalUrl, '_blank');
    closeZoomModal();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. 4-Column Channel Hub Grid
  // ──────────────────────────────────────────────────────────────────────────
  let channelHubDataCache = null;

  async function fetchLiveMediaHubData() {
    if (channelHubDataCache) return channelHubDataCache;
    const endpoints = [
      '/api/media-hub',
      'https://connect-god-app.vercel.app/api/media-hub'
    ];
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.success) {
            channelHubDataCache = json;
            return json;
          }
        }
      } catch (_) {}
    }
    return null;
  }

  async function render4ColumnChannelHub() {
    const channelsContainer = document.getElementById('homeChannelsGridContainer') || document.getElementById('socialChannelsGridContainer');
    if (!channelsContainer) return;

    // 1. Base channel definitions with reliable defaults
    const channels = [
      {
        id: 'bks-calicut',
        name: 'BK S Calicut Live',
        nameMl: 'ബികെഎസ് കോഴിക്കോട് ലൈവ്',
        badge: 'LIVE CLASS',
        badgeColor: '#dc2626',
        description: 'Daily Live Murli, Morning Classes, and Spiritual Discourses from Calicut center.',
        youtubeUrl: 'https://youtube.com/@bkscalicut9425',
        instagramUrl: 'https://instagram.com/bkscalicut',
        facebookUrl: 'https://facebook.com/bkscalicut',
        thumbnail: 'https://i.ytimg.com/vi/CBZDqt2d-eE/hqdefault.jpg',
        logo: 'assets/images/channel-logos/bks_calicut_logo.jpg',
        featuredVideoId: 'CBZDqt2d-eE',
        featuredVideoTitle: 'Live Daily Murli Class & Meditation'
      },
      {
        id: 'supreme-light',
        name: 'Supreme Light Creations',
        nameMl: 'സുപ്രീം ലൈറ്റ് ക്രിയേഷൻസ്',
        badge: 'PODCAST',
        badgeColor: '#d97706',
        description: 'Deep spiritual podcasts, soul realization series, and transformative reflections.',
        youtubeUrl: 'https://youtube.com/@supremelightcreations',
        instagramUrl: 'https://instagram.com/supremelightcreations',
        facebookUrl: 'https://facebook.com/supremelightcreations',
        thumbnail: 'https://i.ytimg.com/vi/g7iSs6nLa0M/hqdefault.jpg',
        logo: 'assets/images/channel-logos/Supremelight_creation_logo_new.png',
        featuredVideoId: 'g7iSs6nLa0M',
        featuredVideoTitle: 'Daily Murli Malayalam Podcast - Supreme Light'
      },
      {
        id: 'bk-sheeba',
        name: 'BK Sheeba',
        nameMl: 'ബികെ ഷീബ',
        badge: 'CLASSES',
        badgeColor: '#c13584',
        description: 'Rajayoga meditation experiences, spiritual lectures, and lifestyle guidance by BK Sheeba.',
        youtubeUrl: 'https://youtube.com/@BKSheeba',
        instagramUrl: 'https://instagram.com/bksheeba',
        facebookUrl: 'https://facebook.com/bksheeba',
        thumbnail: 'https://i.ytimg.com/vi/p6BYgXs0AAY/hqdefault.jpg',
        logo: 'assets/images/channel-logos/BK_sheeba_logo.png',
        featuredVideoId: 'p6BYgXs0AAY',
        featuredVideoTitle: 'Learn To Bless Yourself With Your Own Words - BK Sheeba'
      },
      {
        id: 'bk-sheeja',
        name: 'BK Sheeja',
        nameMl: 'ബികെ ഷീജ',
        badge: 'MEDITATION',
        badgeColor: '#7c3aed',
        description: 'Heart-touching songs, spiritual commentary, and empowering classes by BK Sheeja.',
        youtubeUrl: 'https://youtube.com/@BKSheeja',
        instagramUrl: 'https://instagram.com/bksheeja',
        facebookUrl: 'https://facebook.com/bksheeja',
        thumbnail: 'https://i.ytimg.com/vi/tiKb43faieY/hqdefault.jpg',
        logo: 'assets/images/channel-logos/BK_Sheeja_real.png',
        featuredVideoId: 'tiKb43faieY',
        featuredVideoTitle: 'Spiritual Class & Meditation - BK Sheeja'
      }
    ];

    // Helper to paint cards
    function renderCards(list) {
      channelsContainer.innerHTML = '';
      channelsContainer.className = 'channel-hub-grid';

      list.forEach(ch => {
        const card = document.createElement('div');
        card.className = 'channel-hub-card';
        card.innerHTML = `
          <div class="channel-thumb-box" onclick="bkConnectGod.playFeaturedVideo('${ch.featuredVideoId}', '${ch.featuredVideoTitle.replace(/'/g, "\\'")}', '${ch.name.replace(/'/g, "\\'")}')" style="cursor:pointer;" title="Click to watch ${ch.featuredVideoTitle}">
            <img src="${ch.thumbnail}" alt="${ch.name}" class="channel-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80'">
            <div class="channel-thumb-overlay"></div>
            <div style="position:absolute;top:10px;right:10px;background:${ch.badgeColor || '#dc2626'};color:#ffffff;font-size:0.7rem;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.5px;box-shadow:0 2px 6px rgba(0,0,0,0.3);z-index:2;">
              ${ch.badge || 'LATEST'}
            </div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;">
              <div style="width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,0.6);border:1.5px solid rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;color:#ffffff;">
                <i data-lucide="play" style="width:16px;height:16px;fill:currentColor;margin-left:2px;"></i>
              </div>
            </div>
            <div class="channel-avatar-ring">
              <img src="${ch.logo}" alt="${ch.name}" class="channel-avatar-img" onerror="this.src='assets/images/logo.png'">
            </div>
          </div>
          <div class="channel-card-body">
            <div class="channel-card-title">${ch.name}</div>
            <div class="channel-card-title-ml">${ch.nameMl}</div>
            <div class="channel-card-desc" style="font-weight:600;color:#1e293b;margin-bottom:0.75rem;" title="${ch.featuredVideoTitle}">
              ${ch.featuredVideoTitle}
            </div>
            
            <div class="channel-social-actions">
              ${ch.youtubeUrl ? `
                <a href="${ch.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="channel-social-btn yt" title="Visit YouTube Channel">
                  <i data-lucide="youtube" style="width:16px;height:16px;"></i>
                </a>
              ` : ''}
              ${ch.instagramUrl ? `
                <a href="${ch.instagramUrl}" target="_blank" rel="noopener noreferrer" class="channel-social-btn ig" title="Instagram Profile">
                  <i data-lucide="instagram" style="width:16px;height:16px;"></i>
                </a>
              ` : ''}
              ${ch.facebookUrl ? `
                <a href="${ch.facebookUrl}" target="_blank" rel="noopener noreferrer" class="channel-social-btn fb" title="Facebook Page">
                  <i data-lucide="facebook" style="width:16px;height:16px;"></i>
                </a>
              ` : ''}
            </div>

            <button class="channel-btn-play" onclick="bkConnectGod.playFeaturedVideo('${ch.featuredVideoId}', '${ch.featuredVideoTitle.replace(/'/g, "\\'")}', '${ch.name.replace(/'/g, "\\'")}')">
              <i data-lucide="play" style="width:14px;height:14px;fill:currentColor;"></i>
              <span>Watch Latest Broadcast</span>
            </button>
          </div>
        `;
        channelsContainer.appendChild(card);
      });

      if (window.lucide) window.lucide.createIcons();
    }

    // Immediate initial render with reliable defaults so there's zero UI delay
    renderCards(channels);

    // 2. Fetch live updates dynamically from serverless media-hub
    try {
      const liveData = await fetchLiveMediaHubData();
      if (liveData) {
        if (liveData.liveVideo && liveData.liveVideo.videoId) {
          channels[0].featuredVideoId = liveData.liveVideo.videoId;
          channels[0].featuredVideoTitle = liveData.liveVideo.title || channels[0].featuredVideoTitle;
          channels[0].thumbnail = liveData.liveVideo.thumbnail || channels[0].thumbnail;
          if (liveData.liveVideo.badge) channels[0].badge = liveData.liveVideo.badge;
          if (liveData.liveVideo.badgeColor) channels[0].badgeColor = liveData.liveVideo.badgeColor;
        }
        if (liveData.podcastVideo && liveData.podcastVideo.videoId) {
          channels[1].featuredVideoId = liveData.podcastVideo.videoId;
          channels[1].featuredVideoTitle = liveData.podcastVideo.title || channels[1].featuredVideoTitle;
          channels[1].thumbnail = liveData.podcastVideo.thumbnail || channels[1].thumbnail;
          if (liveData.podcastVideo.badge) channels[1].badge = liveData.podcastVideo.badge;
          if (liveData.podcastVideo.badgeColor) channels[1].badgeColor = liveData.podcastVideo.badgeColor;
        }
        if (liveData.sheebaVideo && liveData.sheebaVideo.videoId) {
          channels[2].featuredVideoId = liveData.sheebaVideo.videoId;
          channels[2].featuredVideoTitle = liveData.sheebaVideo.title || channels[2].featuredVideoTitle;
          channels[2].thumbnail = liveData.sheebaVideo.thumbnail || channels[2].thumbnail;
          if (liveData.sheebaVideo.badge) channels[2].badge = liveData.sheebaVideo.badge;
          if (liveData.sheebaVideo.badgeColor) channels[2].badgeColor = liveData.sheebaVideo.badgeColor;
        }
        if (liveData.sheejaVideo && liveData.sheejaVideo.videoId) {
          channels[3].featuredVideoId = liveData.sheejaVideo.videoId;
          channels[3].featuredVideoTitle = liveData.sheejaVideo.title || channels[3].featuredVideoTitle;
          channels[3].thumbnail = liveData.sheejaVideo.thumbnail || channels[3].thumbnail;
          if (liveData.sheejaVideo.badge) channels[3].badge = liveData.sheejaVideo.badge;
          if (liveData.sheejaVideo.badgeColor) channels[3].badgeColor = liveData.sheejaVideo.badgeColor;
        }

        // Re-render with dynamic live data
        renderCards(channels);
      }
    } catch (e) {
      console.warn('[render4ColumnChannelHub] dynamic update fallback:', e);
    }
  }

  function playFeaturedVideo(videoId, title, channelName) {
    if (window.bkApp && window.bkApp.openEmbeddedVideo) {
      window.bkApp.openEmbeddedVideo(videoId, title, channelName || 'Brahma Kumaris Channel Broadcast');
    } else {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Cloudflare R2 Audio Player & Downloader (Strictly Songs & Commentaries)
  // ──────────────────────────────────────────────────────────────────────────
  const AUDIO_SUBTABS = [
    // Songs
    { key: 'song-malayalam', label: 'Malayalam Songs', group: 'songs', folder: 'song-malayalam' },
    { key: 'song-hindi', label: 'Hindi Songs', group: 'songs', folder: 'song-hindi' },
    { key: 'om-bhorg', label: 'Om & Bhog', group: 'songs', folder: 'om-bhorg' },
    { key: 'own-tunes', label: 'Own Tunes', group: 'songs', folder: 'own-tunes' },
    { key: 'panch-Swarup', label: 'Pancha Swaroopam', group: 'songs', folder: 'panch-Swarup' },
    // Commentaries
    { key: 'commentary-sheeba', label: 'BK Sheeba Sister', group: 'commentaries', folder: 'commentary-sheeba sister' },
    { key: 'commentary-sheeja', label: 'BK Sheeja Sister', group: 'commentaries', folder: 'commentary-sheeja sister' },
    { key: 'commentary-others', label: 'Other Commentaries', group: 'commentaries', folder: 'commentary-others' }
  ];

  function formatAudioTitle(raw) {
    if (!raw) return 'Spiritual Track';
    let name = raw.split('/').pop() || raw;
    name = name.replace(/\.(mp3|wav|m4a|aac|ogg|mpeg|flac)$/i, '');
    name = name.replace(/_320kbps$|_128kbps$/i, '');
    name = name.replace(/^0*(\d{1,2})[._\-\s]+(?=[A-Za-z])/i, '');
    name = name.replace(/[_-]+/g, ' ').trim();
    return name || raw;
  }

  async function fetchCloudflareAudioFolder(folderName) {
    if (audioCache[folderName]) {
      return audioCache[folderName];
    }

    try {
      const endpoint = `${WORKER_BASE_URL}/?folder=${encodeURIComponent(folderName)}`;
      const res = await fetch(endpoint).catch(() => null);
      if (res && res.ok) {
        const items = await res.json().catch(() => []);
        if (Array.isArray(items)) {
          const tracks = items
            .filter(item => item && (item.url || item.key))
            .map((item, idx) => ({
              id: `cf_${folderName}_${idx}`,
              title: formatAudioTitle(item.name || item.key),
              url: item.url || `https://cloudflare.bkkozhikode.com/${item.key}`,
              folder: folderName,
              size: item.size || 0
            }));
          audioCache[folderName] = tracks;
          return tracks;
        }
      }
    } catch (e) {
      console.warn('Audio fetch error:', e);
    }

    return [];
  }

  async function renderCloudflareAudioHub(activeGroup = 'songs') {
    let container = document.getElementById('mediaAudioHubContainer');
    if (!container) {
      const mediaSection = document.querySelector('#tab-media .container');
      if (!mediaSection) return;

      container = document.createElement('div');
      container.id = 'mediaAudioHubContainer';
      container.className = 'audio-hub-container';
      
      // Insert above social hub
      const socialHub = document.getElementById('mediaSocialChannelsHub');
      if (socialHub) {
        socialHub.parentNode.insertBefore(container, socialHub);
      } else {
        mediaSection.appendChild(container);
      }
    }

    const availableSubTabs = AUDIO_SUBTABS.filter(s => activeGroup === 'all' || s.group === activeGroup || (activeGroup === 'songs' && s.group === 'songs'));
    const initialTab = availableSubTabs[0] || AUDIO_SUBTABS[0];

    container.innerHTML = `
      <div class="audio-hub-header">
        <div>
          <h3 style="font-size:1.25rem;font-weight:700;color:#0f172a;margin-bottom:4px;">
            Spiritual Audio Library • Cloudflare R2 Streaming & Downloads
          </h3>
          <p style="font-size:0.88rem;color:#64748b;margin:0;">
            Listen online or download MP3s directly to your device with zero ads.
          </p>
        </div>
        <div class="audio-search-input">
          <i data-lucide="search" style="width:16px;height:16px;color:#94a3b8;"></i>
          <input type="text" id="audioSearchBox" placeholder="Filter audio tracks..." oninput="bkConnectGod.filterAudioList(this.value)">
        </div>
      </div>

      <div class="audio-subtabs-row" id="audioSubTabsRow">
        ${availableSubTabs.map((st, i) => `
          <button class="audio-subtab-pill ${i === 0 ? 'active' : ''}" onclick="bkConnectGod.switchAudioSubTab('${st.folder}', this)">
            ${st.label}
          </button>
        `).join('')}
      </div>

      <div style="margin-top:1.2rem;overflow-x:auto;">
        <table class="audio-tracks-table">
          <thead>
            <tr>
              <th style="width:50px;">Play</th>
              <th>Track Title</th>
              <th>Collection</th>
              <th style="width:120px;text-align:right;">Download</th>
            </tr>
          </thead>
          <tbody id="audioTracksTableBody">
            <tr>
              <td colspan="4" style="text-align:center;padding:2rem;color:#94a3b8;">
                Loading audio tracks from Cloudflare...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    await switchAudioSubTab(initialTab.folder);
  }

  async function switchAudioSubTab(folderName, btn) {
    if (btn) {
      document.querySelectorAll('.audio-subtab-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    currentAudioSubTab = folderName;
    const tbody = document.getElementById('audioTracksTableBody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:2rem;color:#94a3b8;">Loading collection...</td></tr>`;
    }

    const tracks = await fetchCloudflareAudioFolder(folderName);
    activeAudioList = tracks;
    renderAudioRows(tracks);
  }

  function renderAudioRows(tracks) {
    const tbody = document.getElementById('audioTracksTableBody');
    if (!tbody) return;

    if (!tracks || tracks.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:2.5rem;color:#94a3b8;">No tracks found in this category.</td></tr>`;
      return;
    }

    tbody.innerHTML = tracks.map((t, idx) => {
      const isPlaying = activeTrack && activeTrack.url === t.url && currentAudio && !currentAudio.paused;
      return `
        <tr class="audio-track-row ${isPlaying ? 'playing' : ''}" id="trackRow_${idx}">
          <td>
            <button class="track-play-btn" onclick="bkConnectGod.playTrack(${idx})" title="Play Track">
              <i data-lucide="${isPlaying ? 'pause' : 'play'}" style="width:16px;height:16px;fill:currentColor;"></i>
            </button>
          </td>
          <td>
            <div class="track-name-cell">${t.title}</div>
          </td>
          <td>
            <span class="track-badge-tag">${t.folder.replace(/[-_]/g, ' ')}</span>
          </td>
          <td style="text-align:right;">
            <a href="${t.url}" download="${t.title}.mp3" target="_blank" class="track-btn-download" title="Download MP3">
              <i data-lucide="download" style="width:14px;height:14px;"></i>
              <span>MP3</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function filterAudioList(keyword) {
    if (!keyword) {
      renderAudioRows(activeAudioList);
      return;
    }
    const filtered = activeAudioList.filter(t => t.title.toLowerCase().includes(keyword.toLowerCase()));
    renderAudioRows(filtered);
  }

  function playTrack(idx) {
    const track = activeAudioList[idx];
    if (!track) return;

    if (activeTrack && activeTrack.url === track.url && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play();
      } else {
        currentAudio.pause();
      }
      updateStickyPlayer();
      renderAudioRows(activeAudioList);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    activeTrack = track;
    currentAudio = new Audio(track.url);
    currentAudio.play().catch(e => console.warn('Audio play blocked:', e));

    currentAudio.addEventListener('timeupdate', () => {
      updateStickyPlayerProgress();
    });

    currentAudio.addEventListener('ended', () => {
      updateStickyPlayer();
      renderAudioRows(activeAudioList);
    });

    showStickyPlayer();
    updateStickyPlayer();
    renderAudioRows(activeAudioList);
  }

  function showStickyPlayer() {
    let bar = document.getElementById('stickyWebAudioBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'stickyWebAudioBar';
      bar.className = 'sticky-web-audio-bar';
      bar.innerHTML = `
        <div class="player-track-info">
          <div class="player-track-icon">
            <i data-lucide="music" style="width:18px;height:18px;"></i>
          </div>
          <div class="player-track-text">
            <div class="player-track-title" id="stickyTrackTitle">Track Title</div>
            <div class="player-track-sub" id="stickyTrackSub">Spiritual Audio</div>
          </div>
        </div>

        <div class="player-center-controls">
          <div class="player-btns-row">
            <button class="player-ctrl-btn" onclick="bkConnectGod.playPrevTrack()"><i data-lucide="skip-back" style="width:18px;height:18px;"></i></button>
            <button class="player-ctrl-btn play-pause" onclick="bkConnectGod.togglePlayPause()"><i data-lucide="pause" id="stickyPlayIcon" style="width:18px;height:18px;fill:currentColor;"></i></button>
            <button class="player-ctrl-btn" onclick="bkConnectGod.playNextTrack()"><i data-lucide="skip-forward" style="width:18px;height:18px;"></i></button>
          </div>
          <div class="player-progress-row">
            <span class="player-time-txt" id="stickyCurTime">00:00</span>
            <div class="player-seek-bar" onclick="bkConnectGod.seekAudio(event, this)">
              <div class="player-seek-fill" id="stickySeekFill"></div>
            </div>
            <span class="player-time-txt" id="stickyDurTime">00:00</span>
          </div>
        </div>

        <div class="player-right-actions">
          <a id="stickyDownloadBtn" href="#" download class="track-btn-download" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.3);">
            <i data-lucide="download" style="width:14px;height:14px;"></i> Download
          </a>
          <button class="player-ctrl-btn" onclick="bkConnectGod.closeStickyPlayer()"><i data-lucide="x" style="width:20px;height:20px;"></i></button>
        </div>
      `;
      document.body.appendChild(bar);
      if (window.lucide) window.lucide.createIcons();
    }
    bar.classList.add('active');
  }

  function updateStickyPlayer() {
    if (!activeTrack) return;
    const titleEl = document.getElementById('stickyTrackTitle');
    const subEl = document.getElementById('stickyTrackSub');
    const playIcon = document.getElementById('stickyPlayIcon');
    const dlBtn = document.getElementById('stickyDownloadBtn');

    if (titleEl) titleEl.textContent = activeTrack.title;
    if (subEl) subEl.textContent = activeTrack.folder ? activeTrack.folder.replace(/[-_]/g, ' ') : 'Cloudflare R2';
    if (playIcon) {
      const isPaused = !currentAudio || currentAudio.paused;
      playIcon.setAttribute('data-lucide', isPaused ? 'play' : 'pause');
      if (window.lucide) window.lucide.createIcons();
    }
    if (dlBtn) {
      dlBtn.href = activeTrack.url;
      dlBtn.setAttribute('download', `${activeTrack.title}.mp3`);
    }
  }

  function formatSeconds(sec) {
    if (isNaN(sec) || sec === 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateStickyPlayerProgress() {
    if (!currentAudio) return;
    const curTime = document.getElementById('stickyCurTime');
    const durTime = document.getElementById('stickyDurTime');
    const fill = document.getElementById('stickySeekFill');

    if (curTime) curTime.textContent = formatSeconds(currentAudio.currentTime);
    if (durTime && currentAudio.duration) durTime.textContent = formatSeconds(currentAudio.duration);
    if (fill && currentAudio.duration) {
      const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
      fill.style.width = `${pct}%`;
    }
  }

  function seekAudio(e, el) {
    if (!currentAudio || !currentAudio.duration) return;
    const rect = el.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    currentAudio.currentTime = pct * currentAudio.duration;
  }

  function togglePlayPause() {
    if (!currentAudio) return;
    if (currentAudio.paused) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }
    updateStickyPlayer();
    renderAudioRows(activeAudioList);
  }

  function playPrevTrack() {
    if (!activeTrack) return;
    const idx = activeAudioList.findIndex(t => t.url === activeTrack.url);
    if (idx > 0) playTrack(idx - 1);
  }

  function playNextTrack() {
    if (!activeTrack) return;
    const idx = activeAudioList.findIndex(t => t.url === activeTrack.url);
    if (idx < activeAudioList.length - 1) playTrack(idx + 1);
  }

  function closeStickyPlayer() {
    if (currentAudio) currentAudio.pause();
    const bar = document.getElementById('stickyWebAudioBar');
    if (bar) bar.classList.remove('active');
    activeTrack = null;
    renderAudioRows(activeAudioList);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Cloudinary Wallpapers Responsive Masonry Grid & Lightbox
  // ──────────────────────────────────────────────────────────────────────────
  function formatWallpaperTitle(raw) {
    if (!raw) return 'Spiritual Wallpaper';
    let name = raw.split('/').pop() || raw;
    name = name.replace(/\.(jpe?g|png|webp|gif|avif)$/i, '');
    name = name.replace(/_1080p$|_4k$|_hd$/i, '');
    name = name.replace(/^0*(\d{1,2})[._\-\s]+(?=[A-Za-z])/i, '');
    name = name.replace(/[_-]+/g, ' ').trim();
    if (!name) return 'Spiritual Wallpaper';
    return name
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  async function loadCloudinaryWallpapers() {
    const galleryContainer = document.getElementById('galleryGridContainer');
    if (!galleryContainer) return;

    galleryContainer.className = 'gallery-wallpapers-grid';
    galleryContainer.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#94a3b8;">Connecting to Cloudinary Image Server...</div>`;

    try {
      const res = await fetch(CLOUDINARY_LIST_URL).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && Array.isArray(data.resources) && data.resources.length > 0) {
          wallpapersList = data.resources.map((r, idx) => {
            const publicId = r.public_id;
            const version = r.version ? `v${r.version}/` : '';
            const encId = publicId.split('/').map(encodeURIComponent).join('/');
            const format = r.format || 'jpg';
            const title = formatWallpaperTitle(publicId);
            const thumbUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_600,q_auto,f_auto/${version}${encId}.${format}`;
            const fullUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/q_auto:best,f_auto/${version}${encId}.${format}`;
            const downloadUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/fl_attachment/${version}${encId}.${format}`;

            return {
              id: `wp_${idx}`,
              title,
              thumbUrl,
              fullUrl,
              downloadUrl,
              width: r.width,
              height: r.height
            };
          });

          renderWallpapersGrid(wallpapersList);
          return;
        }
      }
    } catch (e) {
      console.warn('Cloudinary wallpapers error:', e);
    }

    // Fallback: If listing is restricted, render curated wallpapers
    galleryContainer.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#94a3b8;">No wallpapers could be fetched.</div>`;
  }

  function renderWallpapersGrid(items) {
    const container = document.getElementById('galleryGridContainer');
    if (!container) return;

    container.innerHTML = items.map((item, idx) => `
      <div class="wallpaper-card">
        <div class="wallpaper-img-wrap" onclick="bkConnectGod.openWallpaperLightbox(${idx})">
          <img src="${item.thumbUrl}" alt="${item.title}" class="wallpaper-img" loading="lazy">
          <span class="wallpaper-badge">${item.width && item.width >= 2000 ? '4K UHD' : 'HD 1080p'}</span>
          <div class="wallpaper-zoom-overlay">
            <i data-lucide="maximize-2" style="width:28px;height:28px;"></i>
          </div>
        </div>
        <div class="wallpaper-info">
          <div class="wallpaper-title" title="${item.title}">${item.title}</div>
          <a href="${item.downloadUrl}" target="_blank" class="wallpaper-download-btn" title="Download HD Wallpaper">
            <i data-lucide="download" style="width:16px;height:16px;"></i>
          </a>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function openWallpaperLightbox(idx) {
    const item = wallpapersList[idx];
    if (!item) return;

    if (window.bkApp && window.bkApp.openLightbox) {
      window.bkApp.openLightbox({
        url: item.fullUrl,
        title: item.title,
        description: `Resolution: ${item.width} × ${item.height} • Direct High-Resolution Spiritual Wallpaper`
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Contacts & Center List (Exact 19 sequence + 14 Kerala HQ)
  // ──────────────────────────────────────────────────────────────────────────
  function renderContactsAndCenters(filterCategory = 'all') {
    const container = document.getElementById('centersGridContainer');
    if (!container) return;

    let allCenters = window.bkStore ? window.bkStore.getCenters(false) : [];
    let keralaHq = window.bkStore ? window.bkStore.getKeralaHq() : [];

    container.innerHTML = '';
    container.className = 'contacts-directory-grid';

    // Filter controls support
    let displayedCenters = allCenters;
    if (filterCategory === 'kozhikode') {
      displayedCenters = allCenters.filter(c => c.category === 'kozhikode-main' || c.category === 'kozhikode-branches');
    } else if (filterCategory === 'wayanad') {
      displayedCenters = allCenters.filter(c => c.category === 'wayanad-main' || c.category === 'wayanad-branches');
    } else if (filterCategory === 'hq') {
      displayedCenters = [];
    }

    // Render Centers
    displayedCenters.forEach(c => {
      const card = document.createElement('div');
      card.className = `contact-centre-card ${c.isPrimary ? 'main-centre' : ''}`;
      
      const phoneNum = c.phone || '9539933699';
      const cleanPhone = phoneNum.replace(/[^0-9+]/g, '');
      const waNum = (c.whatsapp || phoneNum).replace(/[^0-9]/g, '');
      const cleanWa = waNum.startsWith('91') ? waNum : `91${waNum}`;

      card.innerHTML = `
        ${c.isPrimary ? '<span class="contact-badge-main">Main Sub-Zone Center</span>' : ''}
        <div class="contact-card-name">${c.name}</div>
        <div class="contact-card-name-ml">${c.nameMl || ''}</div>
        
        <div class="contact-card-address">
          <i data-lucide="map-pin" style="width:16px;height:16px;flex-shrink:0;color:#dc2626;margin-top:2px;"></i>
          <span>${c.address || c.area || 'Kozhikode, Kerala'}</span>
        </div>

        ${c.contactPerson ? `
          <div style="font-size:0.84rem;color:#475569;margin-bottom:1rem;display:flex;align-items:center;gap:6px;">
            <i data-lucide="user" style="width:14px;height:14px;color:#64748b;"></i>
            <span>In-charge: <strong>${c.contactPerson}</strong></span>
          </div>
        ` : ''}

        <div class="contact-card-actions">
          <a href="tel:${cleanPhone}" class="btn-contact-call" title="Call Center">
            <i data-lucide="phone" style="width:15px;height:15px;"></i>
            <span>${phoneNum}</span>
          </a>
          <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener noreferrer" class="btn-contact-whatsapp" title="Chat on WhatsApp">
            <i data-lucide="message-circle" style="width:15px;height:15px;"></i>
            <span>WhatsApp</span>
          </a>
        </div>
      `;
      container.appendChild(card);
    });

    // Render Kerala 14 District HQ section if viewing all or hq
    if (filterCategory === 'all' || filterCategory === 'hq') {
      const hqWrapper = document.createElement('div');
      hqWrapper.style.gridColumn = '1 / -1';
      hqWrapper.style.marginTop = '2rem';
      hqWrapper.innerHTML = `
        <div style="padding:1.4rem;background:#fafaf9;border:1px solid #e2e8f0;border-radius:16px;">
          <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <i data-lucide="building-2" style="width:20px;height:20px;color:#b91c1c;"></i>
            14 Kerala District HeadQuarters (ജില്ലാ ഹെഡ്ക്വാർട്ടേഴ്സുകൾ)
          </h3>
          <p style="font-size:0.86rem;color:#64748b;margin-bottom:1rem;">
            Direct phone directory for Brahma Kumaris main district centers across Kerala.
          </p>
          <div class="kerala-hq-grid">
            ${keralaHq.map(h => `
              <div class="kerala-hq-card">
                <div class="hq-district-name">${h.district}</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${h.phones.map(p => `
                    <a href="tel:${p.replace(/[^0-9+]/g, '')}" class="hq-phone-chip" title="Call ${h.district}">
                      <i data-lucide="phone" style="width:12px;height:12px;"></i>
                      <span>${p}</span>
                    </a>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      container.appendChild(hqWrapper);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Public Interface on window.bkConnectGod
  // ──────────────────────────────────────────────────────────────────────────
  window.bkConnectGod = {
    loadDailyVardanAndMurli,
    openFullMurliModal,
    closeFullMurliModal,
    adjustMurliFontSize,
    renderLiveZoomBanner,
    openZoomModal,
    closeZoomModal,
    joinZoomDirectly,
    render4ColumnChannelHub,
    playFeaturedVideo,
    renderCloudflareAudioHub,
    switchAudioSubTab,
    filterAudioList,
    playTrack,
    togglePlayPause,
    seekAudio,
    playPrevTrack,
    playNextTrack,
    closeStickyPlayer,
    loadCloudinaryWallpapers,
    openWallpaperLightbox,
    renderContactsAndCenters
  };

})();
