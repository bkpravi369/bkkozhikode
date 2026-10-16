/**
 * Brahma Kumaris Kozhikode — Official Daily Murli Platform
 * Exact recreation of connect-god-app MurliScreen.tsx architecture
 * 
 * Features:
 * - Clean standard red-and-white Brahma Kumaris official theme
 * - Automatic live daily fetching from Doctor Luhar / Babamurli sync system
 * - Multi-language audio player supporting Malayalam, Hindi, and English
 * - Direct action buttons for Full PDF and HTML Web Reader
 * - Core in-app readable Murli text view with A- / 100% / A+ font resize controls
 * - No dark theme, no extra summary/blessing boxes, no banner clutter
 */

(function () {
  'use strict';

  const CACHE_KEY_PREFIX = 'bk_daily_murli_sync_';
  const FONT_SIZE_KEY = '@connectgod_murli_font_size';
  const DEFAULT_FONT_SIZE = 17;
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 28;

  function getTodayIST() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 5.5 * 3600000);
    const day = ist.getDate();
    const month = ist.getMonth() + 1;
    const year = ist.getFullYear();
    const shortYear = String(year).slice(-2);

    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    const ddmmyy = `${dd}.${mm}.${shortYear}`;
    const isoDate = `${year}-${mm}-${dd}`;

    const daysMl = ['ഞായർ', 'തിങ്കൾ', 'ചൊവ്വ', 'ബുധൻ', 'വ്യാഴം', 'വെള്ളി', 'ശനി'];
    const monthsMl = ['ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മേയ്', 'ജൂൺ', 'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const monthsHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

    const malayalamDate = `${daysMl[ist.getDay()]}, ${day} ${monthsMl[ist.getMonth()]} ${year}`;
    const englishDate = `${daysEn[ist.getDay()]}, ${day} ${monthsEn[ist.getMonth()]} ${year}`;
    const hindiDate = `${daysHi[ist.getDay()]}, ${day} ${monthsHi[ist.getMonth()]} ${year}`;

    return {
      ddmmyy,
      isoDate,
      day,
      month,
      year,
      malayalamDate,
      englishDate,
      hindiDate
    };
  }

  class OfficialMurliManager {
    constructor() {
      this.dateInfo = getTodayIST();
      this.selectedLang = 'ml'; // 'ml' | 'hi' | 'en'
      this.syncedData = null;
      this.isRefreshing = false;
      this.fontSize = DEFAULT_FONT_SIZE;

      // Audio state
      this.audio = null;
      this.isPlaying = false;
      this.isBuffering = false;
      this.currentTime = 0;
      this.duration = 0;
      this.candidateIndex = 0;
      this.candidates = [];

      this.initFontSize();
      this.initAudioElement();
      this.loadCachedData();
    }

    initFontSize() {
      try {
        const saved = localStorage.getItem(FONT_SIZE_KEY);
        if (saved) {
          const val = parseFloat(saved);
          if (val >= MIN_FONT_SIZE && val <= MAX_FONT_SIZE) {
            this.fontSize = val;
          }
        }
      } catch (_) {}
    }

    initAudioElement() {
      if (typeof window === 'undefined') return;
      this.audio = new Audio();
      this.audio.preload = 'metadata';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isBuffering = false;
        this.updateAudioUI();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updateAudioUI();
      });

      this.audio.addEventListener('waiting', () => {
        this.isBuffering = true;
        this.updateAudioUI();
      });

      this.audio.addEventListener('playing', () => {
        this.isPlaying = true;
        this.isBuffering = false;
        this.updateAudioUI();
      });

      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime || 0;
        this.updateAudioProgressUI();
      });

      this.audio.addEventListener('durationchange', () => {
        this.duration = this.audio.duration || 0;
        this.updateAudioProgressUI();
      });

      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration || 0;
        this.isBuffering = false;
        this.updateAudioProgressUI();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.isBuffering = false;
        this.currentTime = 0;
        this.updateAudioUI();
      });

      this.audio.addEventListener('error', () => {
        this.handleAudioCandidateError();
      });
    }

    getAudioCandidates(lang = this.selectedLang) {
      const ddmmyy = this.dateInfo.ddmmyy;
      if (lang === 'hi') {
        return [
          `https://www.babamurli.com/01.%20Daily%20Murli/01.%20Hindi/03.%20Hindi%20Murli%20-%20Mp3/${ddmmyy}-Hin.mp3`,
          `https://www.babamurli.com/01.%20Daily%20Murli/01.%20Hindi/03.%20Hindi%20Murli%20-%20MP3/${ddmmyy}-H.mp3`,
          `https://bkdrluhar.com/00.%20Mp3/01.%20Hindi/${ddmmyy}.mp3`
        ];
      }
      if (lang === 'en') {
        return [
          `https://www.babamurli.com/01.%20Daily%20Murli/02.%20English/03.%20English%20Murli%20-%20Mp3/${ddmmyy}-Eng.mp3`,
          `https://www.babamurli.com/01.%20Daily%20Murli/02.%20English/04.%20Eng%20Murli%20-%20MP3%20-%20UK/${ddmmyy}-E.mp3`,
          `https://bkdrluhar.com/00.%20Mp3/02.%20English/${ddmmyy}.mp3`
        ];
      }
      return [
        `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/03.%20Malayalam%20Murli%20-%20Mp3/${ddmmyy}-Mal.mp3`,
        `https://bkdrluhar.com/00.%20Mp3/06.%20Malayalam/${ddmmyy}.mp3`
      ];
    }

    loadCachedData() {
      try {
        const key = CACHE_KEY_PREFIX + this.dateInfo.isoDate;
        const stored = localStorage.getItem(key);
        if (stored) {
          this.syncedData = JSON.parse(stored);
        }
      } catch (_) {}
    }

    saveCachedData(data) {
      try {
        const key = CACHE_KEY_PREFIX + this.dateInfo.isoDate;
        localStorage.setItem(key, JSON.stringify(data));
      } catch (_) {}
    }

    async syncData(forceRefresh = false) {
      this.isRefreshing = true;
      this.updateRefreshButtonUI(true);

      const ddmmyy = this.dateInfo.ddmmyy;
      const endpoints = [
        `/api/daily-murli-sync?date=${encodeURIComponent(ddmmyy)}`,
        `https://connect-god-app.vercel.app/api/daily-murli-sync?date=${encodeURIComponent(ddmmyy)}`
      ];

      let result = null;
      for (const endpoint of endpoints) {
        try {
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timer = controller ? setTimeout(() => controller.abort(), 6000) : null;
          const resp = await fetch(endpoint, {
            cache: forceRefresh ? 'no-store' : 'default',
            signal: controller ? controller.signal : undefined
          });
          if (timer) clearTimeout(timer);
          if (resp.ok) {
            const json = await resp.json();
            if (json && json.success) {
              result = json;
              break;
            }
          }
        } catch (e) {
          // try next endpoint
        }
      }

      if (result) {
        this.syncedData = result;
        this.saveCachedData(result);
        if (window.bkApp && window.bkApp.toast) {
          window.bkApp.toast(`മുരളി (${ddmmyy}) പുതുക്കി ✨`, 'info');
        }
      } else if (!this.syncedData) {
        this.syncedData = this.buildInitialFallback();
      }

      this.isRefreshing = false;
      this.updateRefreshButtonUI(false);
      this.render();
    }

    buildInitialFallback() {
      const ddmmyy = this.dateInfo.ddmmyy;
      return {
        success: true,
        date: this.dateInfo.isoDate,
        formattedDate: ddmmyy,
        languages: {
          ml: {
            label: 'മലയാളം',
            code: 'ml',
            html: '',
            pdfUrl: `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/02.%20Malayalam%20Murli%20-%20Pdf/${ddmmyy}-Mal.pdf`,
            audioUrl: `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/03.%20Malayalam%20Murli%20-%20Mp3/${ddmmyy}-Mal.mp3`,
            htmlUrl: `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/01.%20Malayalam%20Murli%20-%20Htm/${ddmmyy}-Mal.htm`
          },
          hi: {
            label: 'हिन्दी',
            code: 'hi',
            html: '',
            pdfUrl: `https://www.babamurli.com/01.%20Daily%20Murli/01.%20Hindi/02.%20Hindi%20Murli%20-%20Pdf/${ddmmyy}-h.pdf`,
            audioUrl: `https://www.babamurli.com/01.%20Daily%20Murli/01.%20Hindi/03.%20Hindi%20Murli%20-%20Mp3/${ddmmyy}-Hin.mp3`,
            htmlUrl: `https://www.babamurli.com/01.%20Daily%20Murli/01.%20Hindi/01.%20Hindi%20Murli%20-%20Htm/${ddmmyy}-H.htm`
          },
          en: {
            label: 'English',
            code: 'en',
            html: '',
            pdfUrl: `https://www.babamurli.com/01.%20Daily%20Murli/02.%20English/02.%20Eng%20Murli%20-%20Pdf/${ddmmyy}-E.pdf`,
            audioUrl: `https://www.babamurli.com/01.%20Daily%20Murli/02.%20English/03.%20English%20Murli%20-%20Mp3/${ddmmyy}-Eng.mp3`,
            htmlUrl: `https://www.babamurli.com/01.%20Daily%20Murli/02.%20English/01.%20Eng%20Murli%20-%20Htm/${ddmmyy}-E.htm`
          }
        }
      };
    }

    setLanguage(lang) {
      if (this.selectedLang === lang) return;
      this.selectedLang = lang;
      this.candidateIndex = 0;
      this.candidates = this.getAudioCandidates(lang);

      if (this.audio) {
        const wasPlaying = this.isPlaying;
        this.audio.pause();
        this.audio.src = this.candidates[0] || '';
        this.currentTime = 0;
        if (wasPlaying) {
          this.audio.play().catch(() => {});
        }
      }

      this.render();
    }

    handleAudioCandidateError() {
      if (!this.candidates || this.candidates.length === 0) {
        this.candidates = this.getAudioCandidates(this.selectedLang);
      }
      this.candidateIndex++;
      if (this.candidateIndex < this.candidates.length) {
        const nextUrl = this.candidates[this.candidateIndex];
        if (this.audio) {
          this.audio.src = nextUrl;
          if (this.isPlaying) {
            this.audio.play().catch(() => {});
          }
        }
      } else {
        this.isBuffering = false;
        this.isPlaying = false;
        this.updateAudioUI();
      }
    }

    togglePlay() {
      if (!this.audio) return;
      if (!this.audio.src || this.audio.src === window.location.href) {
        this.candidates = this.getAudioCandidates(this.selectedLang);
        this.candidateIndex = 0;
        this.audio.src = this.candidates[0];
      }

      if (this.audio.paused) {
        this.isBuffering = true;
        this.updateAudioUI();
        this.audio.play().catch(() => {
          this.handleAudioCandidateError();
        });
      } else {
        this.audio.pause();
      }
    }

    seekBy(seconds) {
      if (!this.audio) return;
      const target = Math.max(0, Math.min(this.audio.duration || 1800, (this.audio.currentTime || 0) + seconds));
      this.audio.currentTime = target;
    }

    seekToPercent(percent) {
      if (!this.audio || !this.audio.duration) return;
      const target = (percent / 100) * this.audio.duration;
      this.audio.currentTime = target;
    }

    increaseFont() {
      this.fontSize = Math.min(MAX_FONT_SIZE, Math.round((this.fontSize + 1.5) * 10) / 10);
      try { localStorage.setItem(FONT_SIZE_KEY, this.fontSize); } catch (_) {}
      this.updateFontSizeUI();
    }

    decreaseFont() {
      this.fontSize = Math.max(MIN_FONT_SIZE, Math.round((this.fontSize - 1.5) * 10) / 10);
      try { localStorage.setItem(FONT_SIZE_KEY, this.fontSize); } catch (_) {}
      this.updateFontSizeUI();
    }

    resetFont() {
      this.fontSize = DEFAULT_FONT_SIZE;
      try { localStorage.setItem(FONT_SIZE_KEY, this.fontSize); } catch (_) {}
      this.updateFontSizeUI();
    }

    formatTime(sec) {
      if (!sec || isNaN(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateAudioUI() {
      const playIcon = document.getElementById('murliPlayIcon');
      const soundwave = document.getElementById('murliSoundwave');
      const stateBadge = document.getElementById('murliAudioStateBadge');

      if (playIcon) {
        if (this.isBuffering) {
          playIcon.innerHTML = `<span class="app-spinner-mini"></span>`;
        } else if (this.isPlaying) {
          playIcon.innerHTML = `<i data-lucide="pause" style="width:18px;height:18px;color:#fff;"></i>`;
        } else {
          playIcon.innerHTML = `<i data-lucide="play" style="width:18px;height:18px;color:#fff;margin-left:2px;"></i>`;
        }
        if (window.lucide) window.lucide.createIcons();
      }

      if (soundwave) {
        if (this.isPlaying && !this.isBuffering) {
          soundwave.classList.add('playing');
        } else {
          soundwave.classList.remove('playing');
        }
      }

      if (stateBadge) {
        stateBadge.textContent = this.isBuffering ? 'STREAMING...' : `MURLI AUDIO (${this.dateInfo.ddmmyy})`;
      }
    }

    updateAudioProgressUI() {
      const curTimeEl = document.getElementById('murliCurTime');
      const durTimeEl = document.getElementById('murliDurTime');
      const fillBar = document.getElementById('murliProgressFill');
      const thumb = document.getElementById('murliProgressThumb');

      if (curTimeEl) curTimeEl.textContent = this.formatTime(this.currentTime);
      if (durTimeEl && this.duration > 0) durTimeEl.textContent = this.formatTime(this.duration);

      const percent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
      if (fillBar) fillBar.style.width = `${percent}%`;
      if (thumb) thumb.style.left = `${Math.min(98, Math.max(0, percent))}%`;
    }

    updateFontSizeUI() {
      const container = document.getElementById('murliHtmlReadingBody');
      const percentEl = document.getElementById('murliFontPercentText');
      if (container) {
        container.style.fontSize = `${this.fontSize}px`;
      }
      if (percentEl) {
        const pct = Math.round((this.fontSize / DEFAULT_FONT_SIZE) * 100);
        percentEl.textContent = `${pct}%`;
      }
    }

    updateRefreshButtonUI(isRefreshing) {
      const btn = document.getElementById('murliRefreshBtn');
      if (btn) {
        if (isRefreshing) {
          btn.classList.add('spinning');
        } else {
          btn.classList.remove('spinning');
        }
      }
    }

    openPdf() {
      const langData = this.syncedData?.languages?.[this.selectedLang];
      const url = langData?.pdfUrl || `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/02.%20Malayalam%20Murli%20-%20Pdf/${this.dateInfo.ddmmyy}-Mal.pdf`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    openHtml() {
      const langData = this.syncedData?.languages?.[this.selectedLang];
      const url = langData?.htmlUrl || `https://www.babamurli.com/01.%20Daily%20Murli/06.%20Malayalam/01.%20Malayalam%20Murli%20-%20Htm/${this.dateInfo.ddmmyy}-Mal.htm`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    render() {
      // 1. Remove any Live Zoom Banner completely
      const zoomContainer = document.getElementById('muraliZoomBannerContainer');
      if (zoomContainer) {
        zoomContainer.innerHTML = '';
        zoomContainer.style.display = 'none';
      }

      const container = document.getElementById('dailyMuraliDisplayContainer');
      if (!container) return;

      if (!this.syncedData) {
        this.syncedData = this.buildInitialFallback();
        this.syncData(false);
      }

      const ddmmyy = this.dateInfo.ddmmyy;
      const langData = this.syncedData?.languages?.[this.selectedLang] || {};
      const rawHtml = langData?.html || '';

      const dateHeading =
        this.selectedLang === 'hi'
          ? `${ddmmyy} बापदादा मधुबन`
          : this.selectedLang === 'en'
          ? `${this.dateInfo.englishDate} (${ddmmyy})`
          : `${this.dateInfo.malayalamDate} (${ddmmyy})`;

      const portalCardHeading =
        this.selectedLang === 'hi'
          ? 'आज की सम्पूर्ण साकार मुरली पढ़ें'
          : this.selectedLang === 'en'
          ? "Read Today's Complete Murli"
          : 'ഇന്നത്തെ സമ്പൂർണ്ണ മുരളി വായിക്കുക';

      const audioTitle =
        this.selectedLang === 'ml'
          ? 'മലയാളം മുരളി ഓഡിയോ'
          : this.selectedLang === 'hi'
          ? 'हिन्दी मुरली ऑडियो'
          : 'English Murli Audio';

      const fontPercent = Math.round((this.fontSize / DEFAULT_FONT_SIZE) * 100);

      container.innerHTML = `
        <div class="app-murli-container">

          <!-- 1. Top Date Bar: 'ദൈനംദിന മുരളി' with active date -->
          <div class="app-murli-header-card">
            <div class="app-murli-icon-wrap">
              <i data-lucide="book-open" style="width:20px;height:20px;color:#ffffff;"></i>
            </div>
            <div style="flex:1;">
              <div class="app-murli-header-row-top">
                <span class="app-murli-header-title">ദൈനംദിന മുരളി</span>
                <span class="app-murli-live-badge">${ddmmyy}</span>
              </div>
              <div class="app-murli-header-sub">${dateHeading}</div>
            </div>
            <button class="app-murli-refresh-btn" id="murliRefreshBtn" onclick="window.bkMurli.syncData(true)" title="Refresh live daily Murli" aria-label="Refresh daily Murli">
              <i data-lucide="refresh-cw" style="width:16px;height:16px;"></i>
            </button>
          </div>

          <!-- 2. 3-Language Selector Tabs: [ മലയാളം | हिन्दी | English ] -->
          <div class="app-murli-lang-tabs" role="tablist" aria-label="Language Selector">
            <button type="button" class="app-murli-lang-btn ${this.selectedLang === 'ml' ? 'active' : ''}" onclick="window.bkMurli.setLanguage('ml')">
              <span>മലയാളം</span>
            </button>
            <button type="button" class="app-murli-lang-btn ${this.selectedLang === 'hi' ? 'active' : ''}" onclick="window.bkMurli.setLanguage('hi')">
              <span>हिन्दी</span>
            </button>
            <button type="button" class="app-murli-lang-btn ${this.selectedLang === 'en' ? 'active' : ''}" onclick="window.bkMurli.setLanguage('en')">
              <span>English</span>
            </button>
          </div>

          <!-- 3. Official Daily Murli Audio Player -->
          <div class="app-murli-player-card">
            <div class="app-player-top-row">
              <div class="app-player-info">
                <div class="app-now-playing-badge">
                  <div class="app-soundwave ${this.isPlaying ? 'playing' : ''}" id="murliSoundwave">
                    <span></span><span></span><span></span><span></span>
                  </div>
                  <span id="murliAudioStateBadge" style="font-weight:800;letter-spacing:0.5px;">MURLI AUDIO (${ddmmyy})</span>
                </div>
                <div class="app-player-title">${audioTitle}</div>
                <div class="app-player-sub">${ddmmyy} • Official Babamurli.com Audio</div>
              </div>

              <!-- Controls -->
              <div class="app-player-controls">
                <button type="button" class="app-seek-btn" onclick="window.bkMurli.seekBy(-10)" title="Rewind 10 seconds" aria-label="Rewind 10 seconds">
                  <i data-lucide="rotate-ccw" style="width:14px;height:14px;"></i>
                  <span>-10s</span>
                </button>

                <button type="button" class="app-play-btn" onclick="window.bkMurli.togglePlay()" title="Play / Pause Murli" aria-label="Play / Pause">
                  <span id="murliPlayIcon">
                    ${this.isPlaying 
                      ? `<i data-lucide="pause" style="width:18px;height:18px;color:#fff;"></i>` 
                      : `<i data-lucide="play" style="width:18px;height:18px;color:#fff;margin-left:2px;"></i>`}
                  </span>
                </button>

                <button type="button" class="app-seek-btn" onclick="window.bkMurli.seekBy(10)" title="Forward 10 seconds" aria-label="Forward 10 seconds">
                  <i data-lucide="rotate-cw" style="width:14px;height:14px;"></i>
                  <span>+10s</span>
                </button>
              </div>
            </div>

            <!-- Scrubber Track -->
            <div class="app-progress-wrap">
              <div class="app-progress-track" onclick="window.bkMurli.onTrackClick(event)">
                <div class="app-progress-fill" id="murliProgressFill" style="width:0%;"></div>
                <div class="app-progress-thumb" id="murliProgressThumb" style="left:0%;"></div>
              </div>
              <div class="app-time-row">
                <span id="murliCurTime">0:00</span>
                <span id="murliDurTime">0:00</span>
              </div>
            </div>
          </div>

          <!-- 4. 'ഇന്നത്തെ സമ്പൂർണ്ണ മുരളി വായിക്കുക' Card with 2 Action Buttons -->
          <div class="app-reading-portal-card">
            <div class="app-portal-header-row">
              <div class="app-portal-icon-box">
                <i data-lucide="sparkles" style="width:18px;height:18px;color:#D4AF37;"></i>
              </div>
              <div>
                <div class="app-portal-heading">${portalCardHeading}</div>
                <div class="app-portal-sub">${this.selectedLang.toUpperCase()} • Official Daily Sakara Murli • ${ddmmyy}</div>
              </div>
            </div>

            <div class="app-portal-action-row">
              <button type="button" class="app-action-btn primary" onclick="window.bkMurli.openPdf()">
                <i data-lucide="file-text" style="width:16px;height:16px;"></i>
                <span>സമ്പൂർണ്ണ PDF തുറക്കുക</span>
                <i data-lucide="external-link" style="width:13px;height:13px;opacity:0.85;"></i>
              </button>

              <button type="button" class="app-action-btn secondary" onclick="window.bkMurli.openHtml()">
                <i data-lucide="globe" style="width:16px;height:16px;"></i>
                <span>വെബ് റീഡർ തുറക്കുക (HTML)</span>
                <i data-lucide="external-link" style="width:13px;height:13px;opacity:0.85;"></i>
              </button>
            </div>
          </div>

          <!-- 5. Full Clean In-App Murli Text Reader (Rendered Seamlessly) -->
          <div class="app-text-reader-card">
            <div class="app-text-reader-header">
              <div class="app-text-reader-badge">
                <i data-lucide="book-open" style="width:14px;height:14px;color:#8B0000;"></i>
                <span>${this.selectedLang.toUpperCase()} • ${ddmmyy}</span>
              </div>

              <div class="app-header-controls-right">
                <!-- Font Resize Controls -->
                <div class="app-font-resize-controls">
                  <button type="button" class="app-font-btn" onclick="window.bkMurli.decreaseFont()" title="Decrease font size" aria-label="Decrease font size">
                    A-
                  </button>
                  <button type="button" class="app-font-reset-btn" onclick="window.bkMurli.resetFont()" title="Reset font size to 100%" aria-label="Reset font size">
                    <span id="murliFontPercentText">${fontPercent}%</span>
                  </button>
                  <button type="button" class="app-font-btn" onclick="window.bkMurli.increaseFont()" title="Increase font size" aria-label="Increase font size">
                    A+
                  </button>
                </div>

                <button type="button" class="app-open-external-btn" onclick="window.bkMurli.openHtml()" title="Open in new window" aria-label="Open in new window">
                  <i data-lucide="external-link" style="width:14px;height:14px;color:#8B0000;"></i>
                </button>
              </div>
            </div>

            <div class="app-murli-html-container" id="murliHtmlReadingBody" style="font-size:${this.fontSize}px;">
              ${rawHtml ? `
                <div class="app-murli-clean-text">
                  ${rawHtml}
                </div>
              ` : `
                <div class="app-murli-loading-state">
                  <p>ഈ ദിവസത്തെ സമ്പൂർണ്ണ മുരളി ലോഡ് ചെയ്യുന്നു... (Loading today's Murli...)</p>
                  <div style="display:flex;gap:10px;margin-top:14px;justify-content:center;">
                    <button class="app-action-btn secondary sm" onclick="window.bkMurli.openPdf()">
                      <i data-lucide="file-text" style="width:14px;height:14px;"></i> Open Official PDF
                    </button>
                    <button class="app-action-btn secondary sm" onclick="window.bkMurli.openHtml()">
                      <i data-lucide="globe" style="width:14px;height:14px;"></i> Open HTML Web Reader
                    </button>
                  </div>
                </div>
              `}
            </div>
          </div>

        </div>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }

      this.updateAudioUI();
      this.updateAudioProgressUI();
    }

    onTrackClick(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (width > 0) {
        const percent = Math.max(0, Math.min(100, (clickX / width) * 100));
        this.seekToPercent(percent);
      }
    }
  }

  // Export globally
  window.bkMurli = new OfficialMurliManager();

  // Initial tab detection
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#tab-murali' || window.location.hash === '#murali' || window.location.hash === '#murli') {
      window.bkMurli.render();
    }
  });

})();
