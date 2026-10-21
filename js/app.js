/**
 * Brahma Kumaris Kozhikode - Public Application Controller
 * Handles dynamic navigation, meditation soundscapes, breath pacer,
 * gallery lightbox, center locator, and course enrollment flows.
 */

class AppController {
  constructor() {
    this.currentTab = 'home';
    this.meditationActive = false;
    this.meditationDurationSec = 300; // 5 mins default
    this.remainingSec = 300;
    this.meditationInterval = null;
    this.breathInterval = null;
    this.audioCtx = null;
    this.soundscapeType = 'tanpura';
    this.activeAudioNodes = [];
    
    // Dynamic Events and Navathi state filters
    this.eventsFilter = {
      year: 'all',
      centre: 'all',
      category: 'all',
      search: ''
    };

    this.navathiFilter = {
      centre: 'all',
      year: 'all'
    };
    
    // Bind methods
    this.init = this.init.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }

  init() {
    this.renderNavigation();
    this.renderDailyThought();
    this.renderAboutPage();
    this.renderDailyMuraliPage();
    this.renderCourseModules();
    this.renderCenters('all');
    this.renderGallery('all');
    this.renderMediaHub('all');
    this.renderEvents();
    this.renderContactPage();
    this.initHeroCanvas();
    this.setupEventListeners();

    if (window.bkConnectGod) {
      window.bkConnectGod.loadDailyVardanAndMurli();
      window.bkConnectGod.render4ColumnChannelHub();
    }

    // Listen for store updates
    window.addEventListener('bk_store_updated', () => {
      this.renderNavigation();
      this.renderDailyThought();
      this.renderAboutPage();
      this.renderDailyMuraliPage();
      this.renderCourseModules();
      this.renderCenters('all');
      this.renderGallery('all');
      this.renderMediaHub('all');
      this.renderEvents();
      this.renderContactPage();
    });

    // Check clean pathname or hash URL for direct routing
    const cleanPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const hash = window.location.hash.replace('#', '');
    
    if (cleanPath === 'rajayoga-course' || cleanPath === 'rajyoga-course' || cleanPath === 'course') {
      this.switchTab('course');
    } else if (cleanPath === 'murali' || cleanPath === 'murli') {
      this.switchTab('murali');
    } else if (cleanPath === 'navathi') {
      this.switchTab('navathi');
    } else if (cleanPath === 'events') {
      this.switchTab('events');
    } else if (hash) {
      if (hash === 'murali' || hash === 'murli' || hash === 'tab-murali') {
        this.switchTab('murali');
      } else if (hash === 'navathi' || hash.startsWith('navathi-')) {
        const sub = hash.replace('navathi-', '');
        this.switchTab('navathi', sub !== 'navathi' ? sub : null);
      } else if (hash.startsWith('events-')) {
        const sub = hash.replace('events-', '');
        this.switchTab('events', sub);
      } else if (hash.startsWith('media-')) {
        const sub = hash.replace('media-', '');
        this.switchTab('media', sub);
      } else if (hash === 'rajayoga-course' || hash === 'rajyoga-course' || hash.startsWith('course') || hash.startsWith('rajayoga-course')) {
        const dayMatch = hash.match(/day-?(\d+)/i);
        const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : null;
        this.switchTab('course', dayNum);
      } else {
        this.switchTab(hash.replace(/^tab-/, ''));
      }
    } else {
      this.updateHeaderTheme('home');
    }
  }

  setPublicViewport(mode, btnEl) {
    document.body.classList.remove('view-mode-tablet', 'view-mode-mobile');
    
    const allBtns = document.querySelectorAll('.viewport-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    if (mode === 'tablet') {
      document.body.classList.add('view-mode-tablet');
    } else if (mode === 'mobile') {
      document.body.classList.add('view-mode-mobile');
    }

    // Trigger canvas and layout resize
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }

  setupEventListeners() {
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Delegated click handler for Event Cards across Events & Navathi tabs
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.event-dynamic-card');
      if (card && card.dataset.eventId) {
        const isInteractive = e.target.closest('a:not(.btn-card-explore)');
        if (!isInteractive) {
          this.openEventMediaModal(card.dataset.eventId);
        }
      }
    });

    // Keyboard support for Lightbox
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
        this.closeImageLightbox();
      }
    });
  }

  // --- Dynamic Navigation & Tabs ---
  renderNavigation() {
    const mobileContainer = document.getElementById('dynamicNavContainer');
    const desktopContainer = document.getElementById('desktopNavContainer');
    if (!mobileContainer && !desktopContainer) return;

    const tabs = window.bkStore.getEnabledTabs();
    const socialChannels = window.bkStore.getSocialChannels();

    const targets = [
      { el: mobileContainer, isDesktop: false },
      { el: desktopContainer, isDesktop: true }
    ].filter(t => t.el);

    targets.forEach(({ el, isDesktop }) => {
      el.innerHTML = '';
      const suffix = isDesktop ? '_d' : '';

      tabs.forEach(tab => {
        const li = document.createElement('li');
        const isCurrent = this.currentTab === tab.id;
        const displayLabel = isDesktop
          ? (tab.id === 'about' ? 'About' : tab.id === 'meditation' ? 'Meditation' : tab.id === 'course' ? 'Rajyoga Course' : tab.id === 'centers' ? 'Centers' : tab.id === 'murali' ? 'Murali' : tab.id === 'contact' ? 'Contact' : tab.label)
          : tab.label;

        if (tab.id === 'media' || tab.type === 'media-dropdown') {
          li.className = 'nav-item-dropdown';

          let socialChannelsHtml = '';
          socialChannels.forEach(ch => {
            if (!ch.active) return;
            const hasYt = Boolean(ch.youtubeUrl && ch.youtubeUrl.trim());
            const hasInsta = Boolean(ch.instagramUrl && ch.instagramUrl.trim());
            const hasFb = Boolean(ch.facebookUrl && ch.facebookUrl.trim());

            socialChannelsHtml += `
              <li class="dropdown-nested-parent-l3">
                <div class="dropdown-item dropdown-toggle-nested" onclick="bkApp.toggleNestedDropdown(event, 'chMenu_${ch.id}${suffix}')">
                  <span class="channel-name-txt">${ch.name}</span>
                  <i data-lucide="chevron-right" class="nested-arrow-icon" style="width:14px;height:14px;"></i>
                </div>
                <ul class="nav-channel-submenu" id="chMenu_${ch.id}${suffix}">
                  <li>
                    <a href="${hasYt ? ch.youtubeUrl : 'javascript:void(0)'}" ${hasYt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="dropdown-item ${!hasYt ? 'empty-link' : ''}" onclick="bkApp.handleSocialLinkClick(event, '${ch.name}', 'YouTube', '${ch.youtubeUrl || ''}')">
                      <i data-lucide="youtube" class="social-ico yt" style="width:15px;height:15px;"></i>
                      <span>YouTube</span>
                      ${!hasYt ? '<span class="empty-badge">Coming Soon</span>' : ''}
                    </a>
                  </li>
                  <li>
                    <a href="${hasInsta ? ch.instagramUrl : 'javascript:void(0)'}" ${hasInsta ? 'target="_blank" rel="noopener noreferrer"' : ''} class="dropdown-item ${!hasInsta ? 'empty-link' : ''}" onclick="bkApp.handleSocialLinkClick(event, '${ch.name}', 'Instagram', '${ch.instagramUrl || ''}')">
                      <i data-lucide="instagram" class="social-ico insta" style="width:15px;height:15px;"></i>
                      <span>Instagram</span>
                      ${!hasInsta ? '<span class="empty-badge">Coming Soon</span>' : ''}
                    </a>
                  </li>
                  <li>
                    <a href="${hasFb ? ch.facebookUrl : 'javascript:void(0)'}" ${hasFb ? 'target="_blank" rel="noopener noreferrer"' : ''} class="dropdown-item ${!hasFb ? 'empty-link' : ''}" onclick="bkApp.handleSocialLinkClick(event, '${ch.name}', 'Facebook', '${ch.facebookUrl || ''}')">
                      <i data-lucide="facebook" class="social-ico fb" style="width:15px;height:15px;"></i>
                      <span>Facebook</span>
                      ${!hasFb ? '<span class="empty-badge">Coming Soon</span>' : ''}
                    </a>
                  </li>
                </ul>
              </li>
            `;
          });

          li.innerHTML = `
            <button class="nav-link nav-dropdown-toggle ${isCurrent ? 'active' : ''}" data-tab-id="media" onclick="bkApp.handleMediaTabClick(event)">
              ${!isDesktop && tab.icon ? `<i data-lucide="${tab.icon}" style="width:16px;height:16px;"></i>` : ''}
              <span>${displayLabel}</span>
              <i data-lucide="chevron-down" class="dropdown-arrow-icon" style="width:13px;height:13px;margin-left:2px;"></i>
            </button>
            
            <ul class="nav-dropdown-menu" id="navMediaDropdown${suffix}">
              <li>
                <button class="dropdown-item" onclick="bkApp.switchTab('media', 'songs'); ${!isDesktop ? 'bkApp.toggleMobileMenu(true);' : ''}">
                  <i data-lucide="music-2" style="width:15px;height:15px;"></i>
                  <span>Songs (ഗാനങ്ങൾ)</span>
                </button>
              </li>
              <li>
                <button class="dropdown-item" onclick="bkApp.switchTab('media', 'commentaries'); ${!isDesktop ? 'bkApp.toggleMobileMenu(true);' : ''}">
                  <i data-lucide="mic" style="width:15px;height:15px;"></i>
                  <span>Commentaries (കമന്ററികൾ)</span>
                </button>
              </li>
              
              <li class="dropdown-divider"></li>
              
              <li class="dropdown-nested-parent">
                <div class="dropdown-item dropdown-toggle-nested" onclick="bkApp.toggleNestedDropdown(event, 'nestedSocialMenu${suffix}')">
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <i data-lucide="share-2" style="width:15px;height:15px;color:var(--sunset-amber);"></i>
                    <span>Social Media</span>
                  </div>
                  <i data-lucide="chevron-right" class="nested-arrow-icon" style="width:14px;height:14px;"></i>
                </div>
                
                <ul class="nav-nested-submenu" id="nestedSocialMenu${suffix}">
                  ${socialChannelsHtml}
                </ul>
              </li>
            </ul>
          `;
          el.appendChild(li);
        } else {
          const btn = document.createElement('button');
          const isNavathi = tab.id === 'navathi';
          btn.className = `nav-link ${isCurrent ? 'active' : ''} ${isNavathi ? 'nav-link-navathi' : ''}`;
          btn.setAttribute('data-tab-id', tab.id);
          btn.onclick = () => {
            this.switchTab(tab.id);
            if (!isDesktop) {
              this.toggleMobileMenu(true);
            }
          };

          let iconHtml = '';
          if (!isDesktop && tab.icon) {
            iconHtml = `<i data-lucide="${tab.icon}" style="width:16px;height:16px;"></i>`;
          }

          const customTag = tab.type === 'custom' 
            ? `<span class="custom-indicator">New</span>` 
            : (isNavathi ? `<span class="navathi-nav-badge">90</span>` : '');

          btn.innerHTML = `${iconHtml}<span>${displayLabel}</span>${customTag}`;
          li.appendChild(btn);
          el.appendChild(li);
        }
      });
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  handleEventsTabClick(e) {
    if (window.innerWidth <= 992) {
      // On mobile, toggle accordion
      const dropdownLi = e.target.closest('.nav-item-dropdown');
      if (dropdownLi) {
        dropdownLi.classList.toggle('expanded');
      }
    } else {
      // On desktop, switch to Events (Latest Events view)
      this.switchTab('events', 'latest');
    }
  }

  handleMediaTabClick(e) {
    if (window.innerWidth <= 992) {
      // On mobile, toggle accordion
      const dropdownLi = e.target.closest('.nav-item-dropdown');
      if (dropdownLi) {
        dropdownLi.classList.toggle('expanded');
      }
    } else {
      // On desktop, switch to Media tab
      this.switchTab('media', 'all');
    }
  }

  toggleNestedDropdown(e, menuId) {
    e.stopPropagation();
    if (window.innerWidth <= 992) {
      const menu = document.getElementById(menuId);
      if (menu) {
        menu.classList.toggle('mobile-open');
      }
    }
  }

  handleSocialLinkClick(e, channelName, platform, url) {
    if (!url || url.trim() === '' || url === 'javascript:void(0)') {
      e.preventDefault();
      this.toast(`🕊️ ${platform} link for "${channelName}" will be added soon.`);
      return;
    }

    // Valid URL: close mobile menu
    const mobileMenu = document.getElementById('dynamicNavContainer');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
    }
  }

  updateHeaderTheme(tabId) {
    const isInterior = Boolean(tabId && tabId !== 'home');
    const header = document.getElementById('siteHeader');
    if (header) {
      header.classList.toggle('header-interior', isInterior);
    }
    if (document.body) {
      document.body.classList.toggle('is-interior-page', isInterior);
    }
    if (document.documentElement) {
      document.documentElement.classList.toggle('is-interior-page', isInterior);
    }
  }

  switchTab(tabId, subCategory = null) {
    if (tabId === 'rajayoga-course' || tabId === 'rajyoga-course') {
      tabId = 'course';
    }
    this.currentTab = tabId;
    window.location.hash = (tabId === 'course' && subCategory) ? `course-day-${subCategory}` : (subCategory ? `${tabId}-${subCategory}` : tabId);

    // Update Header and Body theme immediately for interior vs home
    this.updateHeaderTheme(tabId);

    // Update active nav button
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab-id') === tabId || (tabId === 'course' && link.getAttribute('data-tab-id') === 'course'));
    });

    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
      pane.style.display = 'none';
    });

    const isSystemTab = ['home', 'about', 'meditation', 'course', 'centers', 'gallery', 'media', 'events', 'navathi', 'murali', 'contact'].includes(tabId);

    if (isSystemTab) {
      const targetPane = document.getElementById(`tab-${tabId}`);
      if (targetPane) {
        targetPane.classList.add('active');
        targetPane.style.display = 'block';
      }
      if (tabId === 'about') {
        this.renderAboutPage();
      }
      if (tabId === 'course') {
        this.renderCourseModules(subCategory);
      }
      if (tabId === 'murali') {
        this.renderDailyMuraliPage();
      }
      if (tabId === 'centers') {
        this.renderCenters('all');
      }
      if (tabId === 'gallery') {
        this.renderGallery('all');
      }
      if (tabId === 'home') {
        if (window.bkConnectGod && window.bkConnectGod.render4ColumnChannelHub) {
          window.bkConnectGod.render4ColumnChannelHub();
        }
      }
      if (tabId === 'media') {
        this.filterMediaCategory(subCategory || 'songs');
      }
      if (tabId === 'events') {
        this.renderEventsPage(subCategory);
      }
      if (tabId === 'navathi') {
        this.renderNavathiPage(subCategory);
      }
      if (tabId === 'contact') {
        this.renderContactPage();
      }
    } else {
      // Dynamic Custom Page created by Admin
      const customContainer = document.getElementById('customTabContainer');
      const customPageContent = document.getElementById('customPageContent');
      const page = window.bkStore.getCustomPage(tabId);

      if (customContainer && customPageContent && page) {
        customPageContent.innerHTML = `
          <div class="custom-hero-banner">
            <img src="${page.bannerImage || 'assets/images/paramdham_sunset.jpg'}" alt="${page.title}">
            <div class="overlay"></div>
            <div class="custom-hero-content">
              <span class="section-kicker" style="background:rgba(255,255,255,0.2);color:#ffd064;">Brahma Kumaris Kozhikode</span>
              <h1>${page.title}</h1>
              <p>${page.subtitle || ''}</p>
            </div>
          </div>
          <div class="custom-article-body">
            ${page.contentHtml || '<p>Content for this section will be updated soon.</p>'}
            <div style="margin-top:2.5rem;text-align:center;">
              <button class="btn-hero-primary" onclick="bkApp.openRegistrationModal('${page.title}')">
                <i data-lucide="sparkles"></i>
                <span>${page.ctaText || 'Connect with Kozhikode Center'}</span>
              </button>
            </div>
          </div>
        `;
        customContainer.classList.add('active');
        customContainer.style.display = 'block';
        if (window.lucide) window.lucide.createIcons();
      }
    }

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close navigation drawer if open
    this.toggleMobileMenu(true);
  }

  toggleMobileMenu(forceClose = false) {
    const drawer = document.getElementById('navDrawerPanel');
    const backdrop = document.getElementById('navDrawerBackdrop');
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('dynamicNavContainer');

    const isOpen = drawer ? drawer.classList.contains('open') : (nav ? nav.classList.contains('open') : false);
    const shouldOpen = forceClose ? false : !isOpen;

    if (drawer) drawer.classList.toggle('open', shouldOpen);
    if (backdrop) backdrop.classList.toggle('open', shouldOpen);
    if (btn) btn.classList.toggle('active', shouldOpen);
    if (nav) nav.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('drawer-open', shouldOpen);
  }

  // --- Render Daily Murli & Thought ---
  renderDailyThought() {
    const thought = window.bkStore.getDailyThought();
    if (!thought) return;

    const quoteEl = document.getElementById('dailyQuoteText');
    const quoteMlEl = document.getElementById('dailyQuoteMl');
    const dateEl = document.getElementById('dailyDate');
    const authorEl = document.getElementById('dailyAuthor');

    if (quoteEl) quoteEl.textContent = `"${thought.quote}"`;
    if (quoteMlEl) quoteMlEl.textContent = thought.quoteMl || '';
    if (dateEl) dateEl.textContent = `Daily Murli Essence • ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (authorEl) authorEl.textContent = thought.author || 'Brahma Kumaris Godly Wisdom';
  }

  shareDailyThought() {
    const thought = window.bkStore.getDailyThought();
    const shareText = `🕊️ *Brahma Kumaris Kozhikode — Thought for Today*\n\n"${thought.quote}"\n\n_${thought.quoteMl || ''}_\n\n✨ *Blessing:* ${thought.blessing || ''}\n\n📍 Ashokapuram Light Palace, Calicut\nVisit: https://brahmakumaris.com`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  }

  playDailyAudio() {
    this.toast("Playing Daily Reflection Commentary (Om Shanti)...");
    this.setSoundscape('tanpura');
    this.switchTab('meditation');
    this.toggleMeditation(true);
  }

  // --- Render 7-Day Rajyoga Course Interactive Learning Platform ---
  renderCourseModules(dayNumber = null) {
    if (window.bkCourse) {
      if (!window.bkCourse.hasLoaded) {
        window.bkCourse.init();
      } else {
        window.bkCourse.render();
      }
      if (dayNumber && typeof dayNumber === 'number') {
        window.bkCourse.selectDay(dayNumber);
      }
    }
  }

  // --- Render About Us Editorial Page ---
  renderAboutPage() {
    if (window.lucide) window.lucide.createIcons();
  }

  // --- Render Daily Murali Sacred Reading Page ---
  renderDailyMuraliPage() {
    if (window.bkMurli && typeof window.bkMurli.render === 'function') {
      window.bkMurli.render();
      return;
    }

    const container = document.getElementById('dailyMuraliDisplayContainer');
    if (!container) return;

    const murali = window.bkStore.getDailyMurali();
    if (!murali) return;

    let mediaActionsHtml = '';
    if (murali.audioUrl) {
      mediaActionsHtml += `
        <a href="${murali.audioUrl}" target="_blank" rel="noopener noreferrer" class="btn-event-outline">
          <i data-lucide="headphones" style="width:15px;height:15px;"></i> Listen Audio
        </a>
      `;
    }
    if (murali.videoUrl) {
      const vidId = window.bkUtils.extractYouTubeVideoId(murali.videoUrl);
      mediaActionsHtml += `
        <button class="btn-event-outline" onclick="bkApp.openEmbeddedVideo('${vidId}', '${murali.title}', 'Daily Murli Discourse')">
          <i data-lucide="video" style="width:15px;height:15px;"></i> Watch Video
        </button>
      `;
    }

    container.innerHTML = `
      <div class="daily-murali-reader-card">
        <div class="murali-reader-header">
          <div class="murali-date-badge">
            <i data-lucide="calendar" style="width:14px;height:14px;"></i>
            <span>${murali.date || 'Today'}</span>
          </div>
          <span class="murali-sacred-pill">🕊️ Madhuban Mahavakyas • ഈശ്വരീയ മഹാവാക്യങ്ങൾ</span>
        </div>

        <h3 class="murali-reader-title">${murali.title || 'Daily Spiritual Wisdom'}</h3>
        ${murali.titleMl ? `<div class="murali-reader-title-ml">${murali.titleMl}</div>` : ''}

        <!-- Essence Section -->
        <div class="murali-essence-box">
          <div class="murali-essence-item">
            <strong class="essence-tag"><i data-lucide="sparkles" style="width:14px;height:14px;"></i> Essence (സാരാംശം):</strong>
            <p>${murali.essence || ''}</p>
          </div>
          ${murali.essenceMl ? `
            <div class="murali-essence-item ml">
              <strong class="essence-tag"><i data-lucide="sparkles" style="width:14px;height:14px;"></i> മലയാള സാരാംശം:</strong>
              <p style="font-family:var(--font-malayalam);">${murali.essenceMl}</p>
            </div>
          ` : ''}
        </div>

        <!-- Blessing & Slogan Row -->
        <div class="murali-blessing-slogan-row">
          ${murali.blessing ? `
            <div class="murali-pill-card blessing">
              <span class="card-icon-tag"><i data-lucide="sun" style="width:16px;height:16px;"></i> Blessing (വരദാനം)</span>
              <p>${murali.blessing}</p>
              ${murali.blessingMl ? `<p style="font-family:var(--font-malayalam);margin-top:0.4rem;color:var(--sunset-crimson);">${murali.blessingMl}</p>` : ''}
            </div>
          ` : ''}

          ${murali.slogan ? `
            <div class="murali-pill-card slogan">
              <span class="card-icon-tag"><i data-lucide="flame" style="width:16px;height:16px;"></i> Slogan (സ്ലോഗൻ)</span>
              <p>${murali.slogan}</p>
              ${murali.sloganMl ? `<p style="font-family:var(--font-malayalam);margin-top:0.4rem;color:var(--sunset-crimson);">${murali.sloganMl}</p>` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Full Murli Reading (if available) -->
        ${murali.fullMuraliText ? `
          <div class="murali-full-reading-box">
            <h4><i data-lucide="book-open" style="width:16px;height:16px;"></i> Sacred Murli Version:</h4>
            <p style="white-space:pre-line;line-height:1.8;color:var(--text-dark);font-size:0.95rem;">${murali.fullMuraliText}</p>
          </div>
        ` : ''}

        <!-- Audio, Video & Center Join Actions -->
        <div class="murali-reader-footer-actions">
          ${mediaActionsHtml}
          <button class="btn-hero-primary" style="background:linear-gradient(135deg, #b91c1c, #991b1b);" onclick="window.bkConnectGod ? window.bkConnectGod.openFullMurliModal() : bkApp.toast('Loading Murli...')">
            <i data-lucide="book-open" style="width:15px;height:15px;"></i> സമ്പൂർണ്ണ മുരളി വായിക്കുക
          </button>
          <button class="btn-hero-primary" onclick="bkApp.openRegistrationModal('Daily Murli Class at Center')">
            <i data-lucide="check-circle" style="width:15px;height:15px;"></i> Join Daily Class at Center
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Render Kozhikode Center List Directory (with Click-to-Call) ---
  renderCenters(filterType = 'all') {
    if (window.bkConnectGod && window.bkConnectGod.renderContactsAndCenters) {
      window.bkConnectGod.renderContactsAndCenters(filterType);
      return;
    }
    const container = document.getElementById('centersGridContainer');
    if (!container) return;

    let centers = window.bkStore.getCenters(false);
    if (filterType === 'main') {
      centers = centers.filter(c => c.isPrimary);
    } else if (filterType === 'city') {
      centers = centers.filter(c => c.id === 'ashokapuram' || c.id === 'westhill' || c.id === 'chevayoor');
    } else if (filterType === 'rural') {
      centers = centers.filter(c => c.id === 'balussery' || c.id === 'vadakara' || c.id === 'koyilandy');
    }

    container.innerHTML = '';

    centers.forEach(c => {
      const card = document.createElement('div');
      card.className = `center-card ${c.isPrimary ? 'main-center' : ''}`;

      const primaryPhone = c.phone || (c.phones && c.phones[0]) || '+91 9746334202';
      const cleanPhone = primaryPhone.replace(/[^0-9+]/g, '');
      const cleanWa = (c.whatsapp || primaryPhone).replace(/[^0-9]/g, '');

      card.innerHTML = `
        <div class="center-card-header">
          <img src="${c.image || 'assets/images/light_palace_center.jpg'}" alt="${c.name}">
          ${c.isPrimary ? '<span class="main-badge">★ Kozhikode Main Center</span>' : ''}
          <span class="center-area-tag">${c.area || 'Kozhikode'}</span>
        </div>
        <div class="center-card-body">
          <h3>${c.name}</h3>
          ${c.nameMl ? `<div class="center-ml">${c.nameMl}</div>` : ''}
          
          <ul class="center-details-list">
            ${c.address ? `
              <li>
                <i data-lucide="map-pin" class="icon" style="width:16px;height:16px;"></i>
                <span>${c.address}</span>
              </li>
            ` : ''}
            ${c.contactPerson ? `
              <li>
                <i data-lucide="user" class="icon" style="width:16px;height:16px;"></i>
                <span>In-charge: <strong>${c.contactPerson}</strong></span>
              </li>
            ` : ''}
            ${c.timings ? `
              <li>
                <i data-lucide="clock" class="icon" style="width:16px;height:16px;"></i>
                <span>${c.timings}</span>
              </li>
            ` : ''}
          </ul>

          ${c.description ? `<p class="center-desc-txt">${c.description}</p>` : ''}

          <div class="center-card-actions">
            <!-- Click-to-Call Phone Button (opens device dialer on mobile) -->
            <a href="tel:${cleanPhone}" class="btn-center-call" title="Tap to call ${c.name}">
              <i data-lucide="phone-call" style="width:15px;height:15px;"></i>
              <span>${c.phone || primaryPhone}</span>
            </a>
            
            ${c.whatsapp ? `
              <a href="https://wa.me/${cleanWa}" target="_blank" rel="noopener noreferrer" class="btn-center-wa" title="Message on WhatsApp">
                <i data-lucide="message-circle" style="width:15px;height:15px;"></i>
                <span>WhatsApp</span>
              </a>
            ` : ''}

            ${c.mapsUrl ? `
              <a href="${c.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-center-directions" title="Open Google Maps Navigation">
                <i data-lucide="navigation" style="width:14px;height:14px;"></i>
                <span>Map</span>
              </a>
            ` : ''}

            <button class="btn-action-sm" onclick="bkApp.openRegistrationModal('Visit ${c.name}')" style="background:var(--sunset-primary);color:#fff;border:none;border-radius:4px;padding:0.5rem 0.8rem;cursor:pointer;font-weight:700;">
              Visit
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  filterCenters(type, btn) {
    document.querySelectorAll('.center-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderCenters(type);
  }

  // --- Render Contact Page & Latest YouTube / Social Media Section ---
  renderContactPage() {
    this.renderLatestVideosSection();
  }

  async renderLatestVideosSection() {
    const grid = document.getElementById('contactLatestVideosGrid');
    const strip = document.getElementById('contactSocialLinksStrip');
    if (!grid) return;

    let channelsData = window.bkStore.getYouTubeChannels();

    // Try fetching from server-side proxy
    try {
      const res = await fetch('/api/youtube/latest');
      if (res.ok) {
        const payload = await res.json();
        if (payload && Array.isArray(payload.channels)) {
          channelsData = payload.channels;
        }
      }
    } catch (e) {
      console.log('Using local channel data for videos section:', e);
    }

    grid.innerHTML = '';

    channelsData.forEach(ch => {
      if (ch.active === false) return;
      const vid = ch.video || {
        id: '',
        title: `${ch.name} Latest Updates`,
        thumbnail: 'assets/images/paramdham_sunset.jpg',
        publishedAt: 'Recent',
        description: 'Spiritual discourse and meditation commentary.'
      };

      const card = document.createElement('div');
      card.className = 'yt-channel-video-card';
      card.onclick = () => {
        this.openEmbeddedVideo(vid.id, vid.title, ch.name);
      };

      const typeBadgeClass = (ch.contentType || '').toLowerCase().replace(/\s+/g, '-');

      card.innerHTML = `
        <div class="yt-thumb-container">
          <img src="${vid.thumbnail || 'assets/images/paramdham_sunset.jpg'}" alt="${vid.title}" loading="lazy">
          <div class="yt-play-overlay">
            <div class="yt-play-icon-circle"><i data-lucide="play" style="fill:#fff;width:20px;height:20px;"></i></div>
          </div>
          <span class="yt-content-type-badge ${typeBadgeClass}">
            ${ch.contentType === 'Podcast' ? '🎙️ Podcast' : (ch.contentType === 'Latest Live' ? '🔴 Live Stream' : '▶ Video')}
          </span>
        </div>
        <div class="yt-card-content">
          <div class="yt-channel-author-row">
            <span class="yt-author-name">${ch.name}</span>
            <span class="yt-date-txt">${vid.publishedAt || 'Latest'}</span>
          </div>
          <h4 class="yt-video-title">${vid.title}</h4>
          <p class="yt-video-desc">${vid.description || ''}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    // Render social media strip below videos
    if (strip) {
      const channels = window.bkStore.getYouTubeChannels();
      let socialPillsHtml = '';

      channels.forEach(ch => {
        const hasYt = Boolean(ch.youtubeUrl && ch.youtubeUrl.trim());
        const hasInsta = Boolean(ch.instagramUrl && ch.instagramUrl.trim());
        const hasFb = Boolean(ch.facebookUrl && ch.facebookUrl.trim());

        if (hasYt || hasInsta || hasFb) {
          socialPillsHtml += `
            <div class="social-channel-pill-group">
              <span class="ch-group-label">${ch.name}:</span>
              ${hasYt ? `<a href="${ch.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="social-sub-pill yt"><i data-lucide="youtube"></i> YouTube</a>` : ''}
              ${hasInsta ? `<a href="${ch.instagramUrl}" target="_blank" rel="noopener noreferrer" class="social-sub-pill insta"><i data-lucide="instagram"></i> Instagram</a>` : ''}
              ${hasFb ? `<a href="${ch.facebookUrl}" target="_blank" rel="noopener noreferrer" class="social-sub-pill fb"><i data-lucide="facebook"></i> Facebook</a>` : ''}
            </div>
          `;
        }
      });

      strip.innerHTML = socialPillsHtml ? `
        <div class="social-channels-bar">
          <div style="font-size:0.88rem;font-weight:700;color:var(--sunset-dark-base);margin-bottom:0.75rem;">
            <i data-lucide="share-2" style="width:15px;height:15px;display:inline-block;vertical-align:middle;margin-right:0.25rem;"></i> Official Social Media Channels:
          </div>
          <div class="social-pills-wrap">${socialPillsHtml}</div>
        </div>
      ` : '';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  openEmbeddedVideo(videoId, title, channelName) {
    const modal = document.getElementById('embeddedVideoModal');
    const iframe = document.getElementById('embedModalIframe');
    const titleEl = document.getElementById('embedModalTitle');
    const badgeEl = document.getElementById('embedModalBadge');
    if (!modal) return;

    if (titleEl) titleEl.textContent = title || 'Spiritual Video';
    if (badgeEl) badgeEl.textContent = channelName || 'YouTube';

    if (iframe) {
      if (videoId && videoId.trim()) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId.trim()}?autoplay=1&rel=0`;
      } else {
        iframe.src = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0';
      }
    }

    modal.style.display = 'flex';
  }

  closeEmbeddedVideo() {
    const modal = document.getElementById('embeddedVideoModal');
    const iframe = document.getElementById('embedModalIframe');
    if (iframe) iframe.src = '';
    if (modal) modal.style.display = 'none';
  }

  // --- Render Filterable Gallery & Media ---
  renderGallery(category = 'all') {
    if (window.bkConnectGod && window.bkConnectGod.loadCloudinaryWallpapers) {
      window.bkConnectGod.loadCloudinaryWallpapers();
      return;
    }
    const container = document.getElementById('galleryGridContainer');
    if (!container) return;

    let items = window.bkStore.getGallery();
    if (category !== 'all') {
      items = items.filter(i => i.category === category);
    }

    container.innerHTML = '';

    if (items.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">No media items found in this category.</div>`;
      return;
    }

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.onclick = () => this.openLightbox(item);

      el.innerHTML = `
        <div class="gallery-thumb-wrap">
          <img src="${item.thumbnail || item.url}" alt="${item.title}">
          <span class="gallery-overlay-badge">${item.category}</span>
          <div class="gallery-zoom-icon"><i data-lucide="maximize-2"></i></div>
        </div>
        <div class="gallery-caption">
          <h4>${item.title}</h4>
          <p>${item.description || ''}</p>
        </div>
      `;
      container.appendChild(el);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  filterGallery(category, btn) {
    document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderGallery(category);
  }

  // --- Render Media Hub (Strictly Audios: Songs & Commentaries) ---
  renderMediaHub(selectedCategory = 'songs') {
    if (window.bkConnectGod) {
      window.bkConnectGod.renderCloudflareAudioHub(selectedCategory);
      return;
    }
    const gridContainer = document.getElementById('mediaGridContainer');
    const socialGrid = document.getElementById('socialChannelsGridContainer');
    if (!gridContainer) return;

    const mediaCategories = [
      {
        id: 'songs',
        name: 'Songs',
        nameMl: 'ആത്മീയ ഗാനങ്ങൾ',
        icon: 'music-2',
        badge: 'Spiritual Geeths',
        description: 'Soulful devotional songs, Paramdham melodies, and elevated remembrance geeths in Malayalam and Hindi to awaken pure love for the Supreme.',
        itemsCount: 'Archive Ready • Content Ready',
        ctaText: 'Explore Songs'
      },
      {
        id: 'commentaries',
        name: 'Commentaries',
        nameMl: 'ധ്യാന കമന്ററികൾ',
        icon: 'mic',
        badge: 'Guided Rajyoga',
        description: 'Step-by-step guided meditation commentaries by senior Rajyogis to guide the soul into deep stillness, light, and soul consciousness.',
        itemsCount: 'Archive Ready • Audio Ready',
        ctaText: 'Listen to Commentaries'
      },
      {
        id: 'music',
        name: 'Music',
        nameMl: 'ശാന്തമായ സംഗീതം',
        icon: 'headphones',
        badge: 'Meditation Scores',
        description: 'Peaceful ambient meditation music, soothing sitar/flute ragas, and tranquil instrumental scores designed for silence and Amritvela reflection.',
        itemsCount: 'Archive Ready • Tracks Ready',
        ctaText: 'Experience Silence Music'
      },
      {
        id: 'videos',
        name: 'Videos',
        nameMl: 'ആത്മീയ പ്രഭാഷണങ്ങൾ',
        icon: 'video',
        badge: 'Discourses & Classes',
        description: 'Video discourses on practical spiritual wisdom, stress management, relationships, and Raja Yoga philosophy conducted in Kozhikode and Mount Abu.',
        itemsCount: 'Archive Ready • Videos Ready',
        ctaText: 'Watch Video Discourses'
      },
      {
        id: 'films',
        name: 'Films',
        nameMl: 'ആത്മീയ ചലച്ചിത്രങ്ങൾ',
        icon: 'film',
        badge: 'Awakening Cinema',
        description: 'Inspiring short films, spiritual docu-dramas, and values-based cinematic narratives illustrating inner peace, karma philosophy, and divinity.',
        itemsCount: 'Archive Ready • Films Ready',
        ctaText: 'View Spiritual Films'
      },
      {
        id: 'others',
        name: 'Others',
        nameMl: 'മറ്റു മാധ്യമങ്ങൾ',
        icon: 'folder-heart',
        badge: 'Special Resources',
        description: 'Special audio podcasts, e-books, spiritual magazines, printable meditation posters, and digital resources for daily spiritual study.',
        itemsCount: 'Archive Ready • Media Ready',
        ctaText: 'Browse Additional Media'
      }
    ];

    const filtered = selectedCategory === 'all' 
      ? mediaCategories 
      : mediaCategories.filter(c => c.id === selectedCategory);

    gridContainer.innerHTML = '';
    filtered.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'media-category-card';
      card.innerHTML = `
        <div class="media-card-top">
          <div class="media-card-icon-wrap">
            <i data-lucide="${cat.icon}"></i>
          </div>
          <span class="media-badge-tag">${cat.badge}</span>
        </div>
        <h3>${cat.name}</h3>
        <div class="media-ml-subtitle">${cat.nameMl}</div>
        <p>${cat.description}</p>
        
        <div class="media-card-placeholder-box">
          <div class="placeholder-status-pill">
            <i data-lucide="sparkles" style="width:13px;height:13px;"></i>
            <span>${cat.itemsCount}</span>
          </div>
          <p class="placeholder-note">Spiritual media releases will be uploaded in this section.</p>
        </div>

        <div class="media-card-footer">
          <button class="btn-action-sm btn-action-edit" onclick="bkApp.openRegistrationModal('Media Inquiry: ${cat.name}')">
            <i data-lucide="bell-ring" style="width:14px;height:14px;"></i>
            <span>Request Media & Content</span>
          </button>
        </div>
      `;
      gridContainer.appendChild(card);
    });

    // Render Social Media Channels Grid Hub
    if (socialGrid) {
      const channels = window.bkStore.getSocialChannels();
      socialGrid.innerHTML = '';
      channels.forEach(ch => {
        if (!ch.active) return;
        const hasYt = Boolean(ch.youtubeUrl && ch.youtubeUrl.trim());
        const hasInsta = Boolean(ch.instagramUrl && ch.instagramUrl.trim());
        const hasFb = Boolean(ch.facebookUrl && ch.facebookUrl.trim());

        const chCard = document.createElement('div');
        chCard.className = 'social-channel-card';
        chCard.innerHTML = `
          <div class="social-channel-header">
            <div class="channel-avatar">
              <i data-lucide="radio" style="width:20px;height:20px;color:var(--sunset-amber);"></i>
            </div>
            <div>
              <h4>${ch.name}</h4>
              <span class="channel-tag">Official Channel</span>
            </div>
          </div>
          <p class="channel-desc">Connect with ${ch.name} across social networks for regular divine content and live sessions.</p>
          <div class="social-links-row">
            <a href="${hasYt ? ch.youtubeUrl : 'javascript:void(0)'}" ${hasYt ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-social-platform yt ${!hasYt ? 'disabled' : ''}" onclick="bkApp.handleSocialLinkClick(event, '${ch.name}', 'YouTube', '${ch.youtubeUrl || ''}')">
              <i data-lucide="youtube"></i>
              <span>YouTube</span>
            </a>
            <a href="${hasInsta ? ch.instagramUrl : 'javascript:void(0)'}" ${hasInsta ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-social-platform insta ${!hasInsta ? 'disabled' : ''}" onclick="bkApp.handleSocialLinkClick(event, '${ch.name}', 'Instagram', '${ch.instagramUrl || ''}')">
              <i data-lucide="instagram"></i>
              <span>Instagram</span>
            </a>
            <a href="${hasFb ? ch.facebookUrl : 'javascript:void(0)'}" ${hasFb ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-social-platform fb ${!hasFb ? 'disabled' : ''}" onclick="bkApp.handleSocialLinkClick(event, '${ch.name}', 'Facebook', '${ch.facebookUrl || ''}')">
              <i data-lucide="facebook"></i>
              <span>Facebook</span>
            </a>
          </div>
        `;
        socialGrid.appendChild(chCard);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  filterMediaCategory(category, btn) {
    const activeCat = (category === 'commentaries') ? 'commentaries' : 'songs';
    document.querySelectorAll('.media-filter-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('onclick')?.includes(`'${activeCat}'`));
    });
    if (btn) {
      document.querySelectorAll('.media-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.renderMediaHub(activeCat);
  }

  // --- Lightbox Modal ---
  openLightbox(item) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');

    if (modal && img && title) {
      img.src = item.url;
      title.textContent = item.title;
      if (desc) desc.textContent = item.description || '';
      modal.classList.add('active');
    }
  }

  closeLightbox(e) {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // =========================================================================
  // DYNAMIC EVENTS SYSTEM (MULTI-LEVEL FILTERING & LIGHTBOX)
  // =========================================================================

  renderEvents(subCategory = null) {
    this.renderEventsPage(subCategory);
  }

  renderEventsSection(viewType = 'latest') {
    if (viewType === 'navathi') {
      this.switchTab('navathi');
    } else {
      this.renderEventsPage(viewType !== 'latest' ? viewType : null);
    }
  }

  filterEventsView(viewType) {
    if (viewType === 'navathi') {
      this.switchTab('navathi');
    } else {
      this.setEventsCategory(viewType === 'latest' ? 'all' : viewType);
    }
  }

  renderEventsPage(initialCategory = null) {
    if (initialCategory && initialCategory !== 'latest') {
      this.eventsFilter.category = initialCategory;
    }

    const allEvents = window.bkStore.getEvents('all'); // published
    const centers = window.bkStore.getCenters();

    // 1. Populate Year Filter Dropdown
    const yearSelect = document.getElementById('eventsFilterYear');
    if (yearSelect) {
      const years = Array.from(new Set(allEvents.map(e => e.year || (e.date ? e.date.substring(0, 4) : '2026')).filter(Boolean))).sort().reverse();
      const currentYearVal = this.eventsFilter.year;
      yearSelect.innerHTML = `<option value="all">All Years</option>` + years.map(y => `<option value="${y}" ${y === currentYearVal ? 'selected' : ''}>${y}</option>`).join('');
    }

    // 2. Populate Dynamic Centre Filter Dropdown from Centres List
    const centreSelect = document.getElementById('eventsFilterCentre');
    if (centreSelect) {
      const currentCentreVal = this.eventsFilter.centre;
      const centreNames = Array.from(new Set([
        ...centers.map(c => c.name),
        ...allEvents.map(e => e.centre).filter(Boolean)
      ])).sort();

      centreSelect.innerHTML = `<option value="all">All Centres</option>` + centreNames.map(c => `<option value="${c}" ${c === currentCentreVal ? 'selected' : ''}>${c}</option>`).join('');
    }

    // 3. Populate Category Filter Pills (Synced dynamically with admin categories)
    const pillsWrap = document.getElementById('eventsCategoryPills');
    if (pillsWrap) {
      const storeCats = window.bkStore.getCategories ? window.bkStore.getCategories() : ['Festivals', 'Rajayoga Shivir', 'Youth Program', 'Social Service', 'Celebrations'];
      const combinedCats = ['all', 'Navathi', ...storeCats.filter(c => c.toLowerCase() !== 'navathi')];

      pillsWrap.innerHTML = combinedCats.map(cat => {
        const isAct = (this.eventsFilter.category || 'all').toLowerCase() === cat.toLowerCase();
        const label = cat === 'all' ? 'All Programs' : (cat === 'Navathi' ? '✨ Navathi' : cat);
        return `
          <button type="button" class="category-pill-btn ${isAct ? 'active' : ''}" onclick="bkApp.setEventsCategory('${cat}')">
            ${label}
          </button>
        `;
      }).join('');
    }

    // 4. Render Grid
    this.applyEventsFilterAndRender();
  }

  setEventsCategory(category) {
    this.eventsFilter.category = category;
    document.querySelectorAll('#eventsCategoryPills .category-pill-btn').forEach(btn => {
      const txt = btn.textContent.trim().replace(/^✨\s*/, '');
      const isAct = (category === 'all' && (txt === 'All Programs' || txt === 'All Categories')) || txt.toLowerCase() === category.toLowerCase();
      btn.classList.toggle('active', isAct);
    });
    this.applyEventsFilterAndRender();
  }

  onEventsFilterChange() {
    const yearSelect = document.getElementById('eventsFilterYear');
    const centreSelect = document.getElementById('eventsFilterCentre');
    const searchInput = document.getElementById('eventsSearchInput');
    const clearBtn = document.getElementById('btnClearEventsSearch');

    if (yearSelect) this.eventsFilter.year = yearSelect.value;
    if (centreSelect) this.eventsFilter.centre = centreSelect.value;
    if (searchInput) {
      this.eventsFilter.search = searchInput.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = this.eventsFilter.search ? 'inline-block' : 'none';
    }

    this.applyEventsFilterAndRender();
  }

  clearEventsSearch() {
    const searchInput = document.getElementById('eventsSearchInput');
    const clearBtn = document.getElementById('btnClearEventsSearch');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.eventsFilter.search = '';
    this.applyEventsFilterAndRender();
  }

  resetEventsFilters() {
    this.eventsFilter = { year: 'all', centre: 'all', category: 'all', search: '' };
    const yearSelect = document.getElementById('eventsFilterYear');
    const centreSelect = document.getElementById('eventsFilterCentre');
    const searchInput = document.getElementById('eventsSearchInput');
    const clearBtn = document.getElementById('btnClearEventsSearch');

    if (yearSelect) yearSelect.value = 'all';
    if (centreSelect) centreSelect.value = 'all';
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    document.querySelectorAll('#eventsCategoryPills .category-pill-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === 0);
    });

    this.applyEventsFilterAndRender();
  }

  applyEventsFilterAndRender() {
    const grid = document.getElementById('eventsGridContainer');
    const countEl = document.getElementById('eventsResultsCount');
    const resetBtn = document.getElementById('btnResetEventsFilter');
    if (!grid) return;

    let events = window.bkStore.getEvents('all'); // published

    // Year Filter
    if (this.eventsFilter.year && this.eventsFilter.year !== 'all') {
      events = events.filter(e => (e.year || (e.date ? e.date.substring(0, 4) : '2026')) === this.eventsFilter.year);
    }

    // Centre Filter
    if (this.eventsFilter.centre && this.eventsFilter.centre !== 'all') {
      const targetC = this.eventsFilter.centre.toLowerCase();
      events = events.filter(e => {
        const c = (e.centre || e.location || '').toLowerCase();
        return c.includes(targetC) || targetC.includes(c);
      });
    }

    // Category Filter (supporting Navathi and dynamic categories)
    if (this.eventsFilter.category && this.eventsFilter.category !== 'all') {
      const targetCat = this.eventsFilter.category.toLowerCase();
      if (targetCat === 'navathi') {
        events = events.filter(e => Boolean(e.isNavathi || (e.category || '').toLowerCase() === 'navathi'));
      } else {
        events = events.filter(e => (e.category || '').toLowerCase() === targetCat);
      }
    }

    // Search Keyword Filter
    if (this.eventsFilter.search) {
      const q = this.eventsFilter.search;
      events = events.filter(e => {
        const title = (e.title || '').toLowerCase();
        const titleMl = (e.titleMl || '').toLowerCase();
        const desc = (e.description || e.fullDesc || e.shortDesc || '').toLowerCase();
        const centre = (e.centre || '').toLowerCase();
        return title.includes(q) || titleMl.includes(q) || desc.includes(q) || centre.includes(q);
      });
    }

    // Sort: featured first, then date
    events.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.date || '').localeCompare(a.date || '');
    });

    // Update Meta Count
    const isFiltered = this.eventsFilter.year !== 'all' || this.eventsFilter.centre !== 'all' || this.eventsFilter.category !== 'all' || Boolean(this.eventsFilter.search);
    if (countEl) {
      countEl.textContent = `Showing ${events.length} ${events.length === 1 ? 'program' : 'programs'}${isFiltered ? ' (filtered)' : ''}`;
    }
    if (resetBtn) {
      resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    }

    // Render Cards
    if (events.length === 0) {
      grid.innerHTML = `
        <div class="events-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap">
            <i data-lucide="calendar-x" style="width:36px;height:36px;color:var(--sunset-primary);"></i>
          </div>
          <h3>No Programs Match Your Filter</h3>
          <p>Try resetting your year, centre, or category filters to view other upcoming spiritual gatherings in Kozhikode.</p>
          <button class="btn-cta-course" onclick="bkApp.resetEventsFilters()" style="margin-top:1rem;">
            <i data-lucide="rotate-ccw"></i>
            <span>Reset All Filters</span>
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = events.map(ev => this.renderEventCardHtml(ev)).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  renderEventCardHtml(ev) {
    const isNavathi = Boolean(ev.isNavathi || ev.category === 'navathi');
    const videos = Array.isArray(ev.videos) && ev.videos.length > 0 
      ? ev.videos 
      : ((ev.youtubeUrl || ev.videoUrl) ? [{ url: ev.youtubeUrl || ev.videoUrl }] : []);
    const hasVideo = videos.length > 0;
    const photosCount = Array.isArray(ev.photos) ? ev.photos.length : (Array.isArray(ev.additionalImages) ? ev.additionalImages.length : 0);
    const cover = ev.coverImage || ev.image || 'assets/images/light_palace_center.jpg';
    const centreName = ev.centre || ev.location || 'Kozhikode Main';
    const dateFormatted = ev.date || 'Upcoming';

    return `
      <article class="event-dynamic-card ${isNavathi ? 'is-navathi-special' : ''}" 
               data-event-id="${ev.id}" 
               onclick="window.bkApp ? window.bkApp.openEventMediaModal('${ev.id}') : null">
        <!-- Strictly Uniform Media Container -->
        <div class="event-card-media">
          <img src="${cover}" alt="${ev.title}" loading="lazy">
          <div class="media-top-badges">
            <span class="badge-date">
              <i data-lucide="calendar" style="width:12px;height:12px;"></i>
              <span>${dateFormatted}</span>
            </span>
            ${isNavathi ? `
              <span class="badge-navathi-special">
                <i data-lucide="sparkles" style="width:12px;height:12px;"></i>
                <span>Navathi Special</span>
              </span>
            ` : ''}
            <span class="badge-event-cat">${ev.category || 'Gathering'}</span>
          </div>

          <div class="media-indicators-bar">
            ${hasVideo ? `
              <span class="media-chip video-chip" title="${videos.length} YouTube Video${videos.length > 1 ? 's' : ''}">
                <i data-lucide="play" style="width:11px;height:11px;fill:currentColor;"></i>
                <span>${videos.length > 1 ? `${videos.length} Videos` : 'Video'}</span>
              </span>
            ` : ''}
            ${photosCount > 1 ? `
              <span class="media-chip photos-chip" title="${photosCount} photos in gallery">
                <i data-lucide="camera" style="width:11px;height:11px;"></i>
                <span>${photosCount} Photos</span>
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Clean, Minimal Card Body -->
        <div class="event-card-content">
          <div class="event-tags-row">
            <span class="event-centre-tag">
              <i data-lucide="map-pin" style="width:12px;height:12px;"></i>
              <span>${centreName}</span>
            </span>
          </div>

          <h3 class="event-card-title">${ev.title}</h3>
          ${ev.titleMl ? `<div class="event-card-title-ml">${ev.titleMl}</div>` : ''}

          <div class="event-card-footer">
            <button type="button" class="btn-card-explore" 
                    onclick="event.stopPropagation(); window.bkApp ? window.bkApp.openEventMediaModal('${ev.id}') : null">
              <span>View Gallery / Details</span>
              <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // =========================================================================
  // DEDICATED NAVATHI TAB (1936-2026 90TH YEAR CELEBRATIONS)
  // =========================================================================

  renderNavathiPage(initialCentre = null) {
    if (initialCentre) {
      this.navathiFilter.centre = initialCentre;
    }

    const allEvents = window.bkStore.getEvents('all'); // published
    const navathiEvents = allEvents.filter(e => Boolean(e.isNavathi || e.category === 'navathi'));
    const centers = window.bkStore.getCenters();

    // 1. Populate Centre Filter Dropdown for Navathi
    const centreSelect = document.getElementById('navathiFilterCentre');
    if (centreSelect) {
      const currentVal = this.navathiFilter.centre;
      const centreNames = Array.from(new Set([
        ...centers.map(c => c.name),
        ...navathiEvents.map(e => e.centre).filter(Boolean)
      ])).sort();

      centreSelect.innerHTML = `<option value="all">All Centres (${navathiEvents.length} Programs)</option>` + centreNames.map(c => {
        const count = navathiEvents.filter(e => (e.centre || '').toLowerCase() === c.toLowerCase()).length;
        const countBadge = count > 0 ? ` (${count})` : '';
        return `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}${countBadge}</option>`;
      }).join('');
    }

    // 2. Populate Year Filter Dropdown for Navathi
    const yearSelect = document.getElementById('navathiFilterYear');
    if (yearSelect) {
      const currentYear = this.navathiFilter.year;
      const years = Array.from(new Set(navathiEvents.map(e => e.year || (e.date ? e.date.substring(0, 4) : '2026')).filter(Boolean))).sort().reverse();
      yearSelect.innerHTML = `<option value="all">All Years (Navathi)</option>` + years.map(y => `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`).join('');
    }

    this.applyNavathiFilterAndRender();
  }

  onNavathiFilterChange() {
    const centreSelect = document.getElementById('navathiFilterCentre');
    const yearSelect = document.getElementById('navathiFilterYear');
    if (centreSelect) this.navathiFilter.centre = centreSelect.value;
    if (yearSelect) this.navathiFilter.year = yearSelect.value;
    this.applyNavathiFilterAndRender();
  }

  resetNavathiFilters() {
    this.navathiFilter = { centre: 'all', year: 'all' };
    const centreSelect = document.getElementById('navathiFilterCentre');
    const yearSelect = document.getElementById('navathiFilterYear');
    if (centreSelect) centreSelect.value = 'all';
    if (yearSelect) yearSelect.value = 'all';
    this.applyNavathiFilterAndRender();
  }

  applyNavathiFilterAndRender() {
    const grid = document.getElementById('navathiGridContainer');
    const countEl = document.getElementById('navathiResultsCount');
    const resetBtn = document.getElementById('btnResetNavathiFilter');
    if (!grid) return;

    let events = window.bkStore.getEvents('all').filter(e => Boolean(e.isNavathi || e.category === 'navathi'));

    // Centre Filter
    if (this.navathiFilter.centre && this.navathiFilter.centre !== 'all') {
      const targetC = this.navathiFilter.centre.toLowerCase();
      events = events.filter(e => {
        const c = (e.centre || e.location || '').toLowerCase();
        return c.includes(targetC) || targetC.includes(c);
      });
    }

    // Year Filter
    if (this.navathiFilter.year && this.navathiFilter.year !== 'all') {
      events = events.filter(e => (e.year || (e.date ? e.date.substring(0, 4) : '2026')) === this.navathiFilter.year);
    }

    // Sort by date / order
    events.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.date || '').localeCompare(a.date || '');
    });

    // Update Meta
    const isFiltered = this.navathiFilter.centre !== 'all' || this.navathiFilter.year !== 'all';
    if (countEl) {
      countEl.textContent = `Showing ${events.length} Navathi celebration ${events.length === 1 ? 'program' : 'programs'}${isFiltered ? ' (filtered)' : ''}`;
    }
    if (resetBtn) {
      resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    }

    if (events.length === 0) {
      grid.innerHTML = `
        <div class="events-empty-state navathi-empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap gold-icon-wrap">
            <i data-lucide="award" style="width:36px;height:36px;color:var(--sunset-amber);"></i>
          </div>
          <h3>No Navathi Programs Found for Selected Filter</h3>
          <p>Please clear your centre or year selection to view all 90th Navathi celebration events across Kozhikode.</p>
          <button class="btn-cta-course" onclick="bkApp.resetNavathiFilters()" style="margin-top:1rem;">
            <i data-lucide="rotate-ccw"></i>
            <span>View All Navathi Celebrations</span>
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = events.map(ev => this.renderEventCardHtml(ev)).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // EVENT MEDIA MODAL & PHOTO LIGHTBOX
  // =========================================================================

  openEventMediaModal(eventId) {
    const ev = window.bkStore ? window.bkStore.getEvent(eventId) : null;
    if (!ev) return;

    const modal = document.getElementById('eventDetailModal');
    const content = document.getElementById('eventDetailContent');
    if (!modal || !content) return;

    const isNavathi = Boolean(ev.isNavathi || ev.category === 'navathi');
    const centreName = ev.centre || ev.location || 'Kozhikode Main';
    const dateFormatted = ev.date || 'Upcoming';
    const desc = ev.description || ev.fullDesc || ev.shortDesc || '';

    // Collect all videos
    const videosList = [];
    if (Array.isArray(ev.videos) && ev.videos.length > 0) {
      ev.videos.forEach((v, idx) => {
        if (v && (v.url || v.title)) {
          videosList.push({
            title: v.title || `Session Video #${idx + 1}`,
            url: v.url || ''
          });
        }
      });
    }
    // Backward compatibility with single youtubeUrl / videoUrl
    const legacyYt = ev.youtubeUrl || ev.videoUrl || '';
    if (legacyYt && !videosList.some(v => v.url === legacyYt)) {
      videosList.unshift({
        title: ev.videoTitle || (videosList.length === 0 ? 'Official Video Broadcast / Highlights' : 'Introductory Session'),
        url: legacyYt
      });
    }

    // Collect all unique photos
    const allPhotos = [];
    const cover = ev.coverImage || ev.image;
    if (cover) allPhotos.push(cover);
    const additional = Array.isArray(ev.photos) ? ev.photos : (Array.isArray(ev.additionalImages) ? ev.additionalImages : []);
    additional.forEach(p => {
      if (p && !allPhotos.includes(p)) allPhotos.push(p);
    });

    // Store for Lightbox Gallery navigation
    this.currentModalEventPhotos = allPhotos;
    this.currentModalEventTitle = ev.title || 'Event Gallery';

    // 1. YouTube Videos Section
    let videosSectionHtml = '';
    const validVideos = videosList.filter(v => v.url && v.url.trim());
    if (validVideos.length > 0) {
      videosSectionHtml = `
        <div class="modal-media-videos-section">
          <h4 class="modal-section-title">
            <i data-lucide="video" style="width:18px;height:18px;color:#ef4444;"></i>
            <span>Video Broadcasts &amp; Discourses (${validVideos.length} Video${validVideos.length > 1 ? 's' : ''})</span>
          </h4>
          <div class="modal-videos-grid">
            ${validVideos.map(v => {
              const embedUrl = window.bkUtils ? window.bkUtils.getYouTubeEmbedUrl(v.url.trim()) : '';
              if (!embedUrl) return '';
              return `
                <div class="modal-video-card">
                  <div class="video-responsive-player">
                    <iframe 
                      src="${embedUrl}" 
                      title="${v.title}" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
                    </iframe>
                  </div>
                  <div class="video-card-meta">
                    <i data-lucide="youtube" style="width:16px;height:16px;color:#ef4444;flex-shrink:0;"></i>
                    <span class="video-card-title">${v.title}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 2. Interactive Photo Gallery Section
    let gallerySectionHtml = '';
    if (allPhotos.length > 0) {
      gallerySectionHtml = `
        <div class="modal-media-gallery-section">
          <div class="gallery-section-header">
            <h4>
              <i data-lucide="camera" style="width:18px;height:18px;color:var(--sunset-primary);"></i>
              <span>Event Photo Gallery (${allPhotos.length} Photo${allPhotos.length > 1 ? 's' : ''})</span>
            </h4>
            <span class="gallery-hint">Click any photo for fullscreen view with next/prev controls</span>
          </div>
          <div class="modal-photos-grid">
            ${allPhotos.map((photoUrl, idx) => `
              <div class="modal-photo-thumb-wrap" onclick="bkApp.openImageLightbox(${idx})">
                <img src="${photoUrl}" alt="${ev.title} photo ${idx + 1}" loading="lazy">
                <div class="thumb-hover-overlay">
                  <i data-lucide="zoom-in" style="width:20px;height:20px;"></i>
                  <span>View #${idx + 1}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="event-modal-body-container">
        <!-- Header details -->
        <div class="modal-event-header-block">
          <div class="modal-badges-row">
            ${isNavathi ? `
              <span class="modal-badge-navathi">
                <i data-lucide="sparkles" style="width:13px;height:13px;"></i>
                <span>90th Navathi Celebrations Special</span>
              </span>
            ` : ''}
            <span class="modal-badge-cat">${ev.category || 'Gathering'}</span>
            <span class="modal-badge-centre">
              <i data-lucide="map-pin" style="width:13px;height:13px;"></i>
              <span>${centreName}</span>
            </span>
          </div>

          <h2 class="modal-event-title">${ev.title}</h2>
          ${ev.titleMl ? `<div class="modal-event-title-ml">${ev.titleMl}</div>` : ''}

          <div class="modal-meta-grid">
            <div class="modal-meta-item">
              <i data-lucide="calendar"></i>
              <div>
                <span class="meta-label">Date / Period</span>
                <span class="meta-val">${dateFormatted} (${ev.year || '2026'})</span>
              </div>
            </div>
            <div class="modal-meta-item">
              <i data-lucide="clock"></i>
              <div>
                <span class="meta-label">Timings</span>
                <span class="meta-val">${ev.time || '10:00 AM - 1:00 PM'}</span>
              </div>
            </div>
            <div class="modal-meta-item">
              <i data-lucide="map-pin"></i>
              <div>
                <span class="meta-label">Centre / Location</span>
                <span class="meta-val">${centreName}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description Content -->
        <div class="modal-event-desc-block">
          <h4 class="modal-section-title">
            <i data-lucide="file-text" style="width:17px;height:17px;color:var(--sunset-primary);"></i>
            <span>Program Overview &amp; Significance</span>
          </h4>
          <div class="modal-desc-text">
            ${desc ? desc.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') : '<p>Join us for this auspicious Brahma Kumaris spiritual initiative.</p>'}
          </div>
        </div>

        <!-- Multiple YouTube Videos if present -->
        ${videosSectionHtml}

        <!-- Interactive Photo Gallery Grid -->
        ${gallerySectionHtml}

        <!-- Footer CTA actions -->
        <div class="modal-footer-actions">
          <div class="modal-notice">
            <i data-lucide="info" style="width:15px;height:15px;"></i>
            <span>All Brahma Kumaris spiritual events and meditation sessions are free public service.</span>
          </div>
          <div class="modal-buttons">
            <button type="button" class="btn-event-outline" onclick="bkApp.closeEventDetail()">
              <span>Close</span>
            </button>
            <a href="https://wa.me/919539933699?text=Om%20Shanti,%20I%20would%20like%20information%20about%20${encodeURIComponent(ev.title)}" target="_blank" rel="noopener noreferrer" class="btn-cta-course" style="display:inline-flex;align-items:center;gap:0.4rem;">
              <i data-lucide="message-circle" style="width:16px;height:16px;"></i>
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  openEventDetail(eventId) {
    this.openEventMediaModal(eventId);
  }

  closeEventDetail() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) {
      const iframes = modal.querySelectorAll('iframe');
      iframes.forEach(f => f.src = '');
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  closeEventMediaModal() {
    this.closeEventDetail();
  }

  handleEventModalBackdrop(event) {
    if (event.target && event.target.id === 'eventDetailModal') {
      this.closeEventDetail();
    }
  }

  openImageLightbox(photoIndexOrUrl, caption = '') {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxLargeImg');
    if (!modal || !img) return;

    if (typeof photoIndexOrUrl === 'number') {
      this.lightboxIndex = photoIndexOrUrl;
      this.lightboxPhotos = Array.isArray(this.currentModalEventPhotos) && this.currentModalEventPhotos.length > 0
        ? this.currentModalEventPhotos
        : [];
      this.lightboxCaption = this.currentModalEventTitle || '';
    } else {
      const src = photoIndexOrUrl;
      this.lightboxPhotos = [src];
      this.lightboxIndex = 0;
      this.lightboxCaption = caption || '';
    }

    this.renderLightboxPhoto();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Keyboard navigation
    if (this._boundLightboxKeyHandler) {
      window.removeEventListener('keydown', this._boundLightboxKeyHandler);
    }
    this._boundLightboxKeyHandler = (e) => {
      if (e.key === 'ArrowRight') this.nextLightboxPhoto(e);
      else if (e.key === 'ArrowLeft') this.prevLightboxPhoto(e);
      else if (e.key === 'Escape') this.closeImageLightbox();
    };
    window.addEventListener('keydown', this._boundLightboxKeyHandler);
  }

  renderLightboxPhoto() {
    const img = document.getElementById('lightboxLargeImg');
    const cap = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    if (!img) return;

    const total = this.lightboxPhotos ? this.lightboxPhotos.length : 1;
    const current = (this.lightboxIndex !== undefined && this.lightboxIndex >= 0 && this.lightboxIndex < total) ? this.lightboxIndex : 0;
    const src = this.lightboxPhotos && this.lightboxPhotos[current] ? this.lightboxPhotos[current] : '';

    img.src = src;
    if (counter) {
      counter.textContent = `Photo ${current + 1} of ${total}`;
      counter.style.display = total > 1 ? 'inline-block' : 'none';
    }
    if (cap) {
      cap.textContent = this.lightboxCaption ? `${this.lightboxCaption} • Photo ${current + 1}` : '';
    }
    if (prevBtn) prevBtn.style.display = total > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = total > 1 ? 'flex' : 'none';
  }

  nextLightboxPhoto(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (!this.lightboxPhotos || this.lightboxPhotos.length <= 1) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % this.lightboxPhotos.length;
    this.renderLightboxPhoto();
  }

  prevLightboxPhoto(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (!this.lightboxPhotos || this.lightboxPhotos.length <= 1) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + this.lightboxPhotos.length) % this.lightboxPhotos.length;
    this.renderLightboxPhoto();
  }

  closeImageLightbox() {
    const modal = document.getElementById('imageLightboxModal');
    if (modal) modal.style.display = 'none';
    const eventModal = document.getElementById('eventDetailModal');
    if (!eventModal || eventModal.style.display === 'none') {
      document.body.style.overflow = '';
    }
    if (this._boundLightboxKeyHandler) {
      window.removeEventListener('keydown', this._boundLightboxKeyHandler);
      this._boundLightboxKeyHandler = null;
    }
  }

  handleLightboxBackdrop(event) {
    if (event && event.target && (event.target.id === 'imageLightboxModal' || event.target.classList.contains('lightbox-backdrop'))) {
      this.closeImageLightbox();
    }
  }

  formatEventCategory(cat) {
    const map = {
      latest: 'Latest Event',
      navathi: 'Navathi Celebrations',
      shivarathri: 'Maha Shivratri',
      rakshabandhan: 'Raksha Bandhan',
      other: 'Special Program'
    };
    return map[cat] || cat || 'Spiritual Gathering';
  }

  // --- Interactive Meditation Suite & Web Audio Synth ---
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setSoundscape(type) {
    this.soundscapeType = type;
    document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`snd-${type}`);
    if (targetBtn) targetBtn.classList.add('active');

    if (this.meditationActive) {
      this.stopSoundscapeAudio();
      this.startSoundscapeAudio();
    }
  }

  setDuration(minutes, el) {
    document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
    this.meditationDurationSec = minutes * 60;
    this.remainingSec = this.meditationDurationSec;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const display = document.getElementById('meditationTimerDisplay');
    if (!display) return;
    const mins = Math.floor(this.remainingSec / 60);
    const secs = this.remainingSec % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  toggleMeditation(forceStart = false) {
    if (this.meditationActive && !forceStart) {
      this.stopMeditation();
    } else {
      this.startMeditation();
    }
  }

  startMeditation() {
    this.meditationActive = true;
    const btn = document.getElementById('btnMeditationToggle');
    if (btn) {
      btn.innerHTML = `<i data-lucide="pause"></i><span>Pause Meditation</span>`;
      btn.style.background = 'var(--sunset-deep-red)';
    }

    this.startSoundscapeAudio();
    this.startBreathCycle();

    // Timer Interval
    clearInterval(this.meditationInterval);
    this.meditationInterval = setInterval(() => {
      this.remainingSec--;
      this.updateTimerDisplay();

      if (this.remainingSec <= 0) {
        this.completeMeditation();
      }
    }, 1000);

    if (window.lucide) window.lucide.createIcons();
    this.toast("Meditation started. Breathe peacefully and focus on the Supreme Light...");
  }

  stopMeditation() {
    this.meditationActive = false;
    clearInterval(this.meditationInterval);
    clearInterval(this.breathInterval);
    this.stopSoundscapeAudio();

    const btn = document.getElementById('btnMeditationToggle');
    if (btn) {
      btn.innerHTML = `<i data-lucide="play"></i><span>Resume Meditation</span>`;
      btn.style.background = 'var(--grad-gold-flame)';
    }

    const orb = document.getElementById('breathOrb');
    const stateText = document.getElementById('breathStateText');
    const subText = document.getElementById('breathSubText');
    if (orb) orb.className = 'breath-circle-inner';
    if (stateText) stateText.textContent = 'PAUSED';
    if (subText) subText.textContent = 'Click Resume when ready';

    if (window.lucide) window.lucide.createIcons();
  }

  resetMeditation() {
    this.stopMeditation();
    this.remainingSec = this.meditationDurationSec;
    this.updateTimerDisplay();

    const btn = document.getElementById('btnMeditationToggle');
    if (btn) {
      btn.innerHTML = `<i data-lucide="play"></i><span>Start Meditation</span>`;
      btn.style.background = 'var(--grad-gold-flame)';
    }

    const stateText = document.getElementById('breathStateText');
    const subText = document.getElementById('breathSubText');
    if (stateText) stateText.textContent = 'READY';
    if (subText) subText.textContent = 'Click Start to Begin';
    if (window.lucide) window.lucide.createIcons();
  }

  completeMeditation() {
    this.resetMeditation();
    this.playTibetanChime();
    this.toast("🕊️ Om Shanti! You have completed your meditation. May divine peace accompany your day.");
  }

  startBreathCycle() {
    const orb = document.getElementById('breathOrb');
    const stateText = document.getElementById('breathStateText');
    const subText = document.getElementById('breathSubText');

    let phase = 0; // 0: inhale (4s), 1: hold (4s), 2: exhale (4s)

    const runPhase = () => {
      if (!this.meditationActive) return;
      if (phase === 0) {
        if (orb) { orb.className = 'breath-circle-inner inhale'; }
        if (stateText) stateText.textContent = 'INHALE PEACE';
        if (subText) subText.textContent = 'ശാന്തി ഉൾക്കൊള്ളുക';
        phase = 1;
      } else if (phase === 1) {
        if (orb) { orb.className = 'breath-circle-inner hold'; }
        if (stateText) stateText.textContent = 'HOLD PURITY';
        if (subText) subText.textContent = 'വിശുദ്ധിയിൽ ലയിക്കുക';
        phase = 2;
      } else {
        if (orb) { orb.className = 'breath-circle-inner exhale'; }
        if (stateText) stateText.textContent = 'EXHALE LOVE';
        if (subText) subText.textContent = 'സ്നേഹം പ്രസരിപ്പിക്കുക';
        phase = 0;
      }
    };

    runPhase();
    clearInterval(this.breathInterval);
    this.breathInterval = setInterval(runPhase, 4000);
  }

  startSoundscapeAudio() {
    try {
      const ctx = this.getAudioContext();
      this.stopSoundscapeAudio();

      if (this.soundscapeType === 'tanpura') {
        // Paramdham 432Hz warmth drone synthesizer
        const baseFreq = 216; // A3
        const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 2.5]; // Sa, Pa, Sa', Ga'
        
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle LFO for breathing drone effect
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.2 + (i * 0.1);
          lfoGain.gain.value = 0.04;
          lfo.connect(gain.gain);
          lfo.start();

          gain.gain.setValueAtTime(0.08 / (i + 1), ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();

          this.activeAudioNodes.push(osc, lfo, gain, lfoGain);
        });
      } else if (this.soundscapeType === 'flute') {
        // Serene flute acoustic harmonic synthesis
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);

        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.value = 4.5;
        vibratoGain.gain.value = 6;
        vibrato.connect(osc.frequency);
        vibrato.start();

        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        this.activeAudioNodes.push(osc, vibrato, gain, vibratoGain);
      } else if (this.soundscapeType === 'waves') {
        // Pink noise filter sweep generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.12; // 8s wave cycle
        lfoGain.gain.value = 350;
        lfo.connect(filter.frequency);
        lfo.start();

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();

        this.activeAudioNodes.push(whiteNoise, filter, lfo, gain);
      }
    } catch (e) {
      console.warn("Web Audio initialization error", e);
    }
  }

  stopSoundscapeAudio() {
    this.activeAudioNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.activeAudioNodes = [];
  }

  playTibetanChime() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 peace frequency
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 5);
    } catch (e) {}
  }

  // --- Full-Width Spiritual Hero Experience (All 7 Simultaneous Rays Converging at Forehead Center + User Touch) ---
  initHeroCanvas() {
    const canvas = document.getElementById('divineRaysCanvas');
    const heroUniverse = document.getElementById('heroCinematicUniverse');
    const masterBg = document.getElementById('cinematicSceneImg');
    const jyotiBeacon = document.getElementById('supremeJyotiBeacon');
    const brikutiPoint = document.getElementById('yogiBrikutiPoint');
    const captionDock = document.querySelector('.hero-cinematic-caption-dock');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let isVisible = true;
    let animFrameId = null;

    // The Seven Divine Qualities (Exact 7 Rays Converging onto Forehead Center / Brikuti)
    const RAYS = [
      { id: 'peace', en: 'Peace', ml: 'ശാന്തി', color: '#00e5ff', glow: '#67e8f9', spread: -0.28, cpSpread: -0.18, endOffset: -6 },
      { id: 'love', en: 'Love', ml: 'സ്നേഹം', color: '#f43f5e', glow: '#fda4af', spread: -0.19, cpSpread: -0.12, endOffset: -4 },
      { id: 'purity', en: 'Purity', ml: 'വിശുദ്ധി', color: '#ffffff', glow: '#f8fafc', spread: -0.09, cpSpread: -0.06, endOffset: -2 },
      { id: 'wisdom', en: 'Wisdom', ml: 'ജ്ഞാനം', color: '#fbbf24', glow: '#fef08a', spread: 0.0, cpSpread: 0.0, endOffset: 0 },
      { id: 'power', en: 'Power', ml: 'ശക്തി', color: '#ef4444', glow: '#fca5a5', spread: 0.09, cpSpread: 0.06, endOffset: 2 },
      { id: 'bliss', en: 'Bliss', ml: 'ആനന്ദം', color: '#facc15', glow: '#fef9c3', spread: 0.19, cpSpread: 0.12, endOffset: 4 },
      { id: 'truth', en: 'Truth', ml: 'സത്യം', color: '#a855f7', glow: '#d8b4fe', spread: 0.28, cpSpread: 0.18, endOffset: 6 }
    ];

    // Cubic Bézier calculation
    const getBezier = (t, p0, p1, p2, p3) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;
      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
      };
    };

    // Resize and sync canvas with High-DPI (Retina) support, forehead brikuti point & typography
    let W = 0, H = 0;
    let p0 = { x: 0, y: 0 };
    let cy_forehead = 0;
    let dpr = 1;

    const resize = () => {
      W = heroUniverse ? heroUniverse.offsetWidth : window.innerWidth;
      H = heroUniverse ? heroUniverse.offsetHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2); // High-DPI Retina scaling up to 2x for maximum sharpness

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Scale context to match physical pixels

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Adaptive coordinates for Desktop vs Tablet vs Mobile Portrait (< 768px)
      if (W < 768) {
        // Specifically tuned for mobile portrait screens (9:16) so elements are not overly zoomed or cropped
        p0 = { x: W * 0.5, y: H * 0.16 };
        cy_forehead = H * 0.45;
      } else if (W < 1024) {
        p0 = { x: W * 0.5, y: H * 0.135 };
        cy_forehead = H * 0.495;
      } else {
        p0 = { x: W * 0.5, y: H * 0.14 };
        cy_forehead = H * 0.505;
      }

      // Sync Forehead Brikuti Soul Point directly to forehead center
      if (brikutiPoint) {
        brikutiPoint.style.top = `${cy_forehead}px`;
        brikutiPoint.style.left = `${p0.x}px`;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize Travelling Energy Particles for ALL 7 Continuous Rays
    const rayParticles = [];
    const particlesPerRay = window.innerWidth < 768 ? 12 : 18;
    RAYS.forEach((ray, rayIndex) => {
      for (let j = 0; j < particlesPerRay; j++) {
        rayParticles.push({
          rayIndex: rayIndex,
          t: j / particlesPerRay + Math.random() * 0.03, // Evenly spaced along the continuous stream
          speed: 0.0036 + Math.random() * 0.0016, // Peaceful, divine flowing pace
          size: Math.random() * 2.2 + 1.4,
          sparkleSpeed: Math.random() * 0.08 + 0.04,
          sparklePhase: Math.random() * Math.PI * 2
        });
      }
    });

    // Sparse Ambient Cosmic Stardust (High Clarity)
    const ambientStars = [];
    const starCount = window.innerWidth < 768 ? 24 : 48;
    for (let s = 0; s < starCount; s++) {
      ambientStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        color: Math.random() > 0.4 ? '#ffd064' : '#ffffff'
      });
    }

    // User Touch / Click State on Supreme Jyoti
    let touchQualityIndex = -1;
    let touchBurstActive = false;
    let touchBurstStartTime = 0;
    const TOUCH_BURST_DURATION = 3600; // 3.6 seconds emphasized stream

    // Expose triggerJyotiTouch to global app
    this.triggerJyotiTouch = () => {
      touchQualityIndex = (touchQualityIndex + 1) % 7; // Deterministic cycle: Peace -> Love -> Purity -> Wisdom -> Power -> Bliss -> Truth
      touchBurstActive = true;
      touchBurstStartTime = performance.now();
    };

    // Pause canvas rendering when scrolled offscreen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animFrameId) {
            animate();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    // Main 60fps Animation Loop (All 7 Rays Flow Simultaneously with Ultra-High Clarity)
    const animate = () => {
      if (!isVisible) {
        animFrameId = null;
        return;
      }

      const now = performance.now();
      ctx.clearRect(0, 0, W, H);

      // Check if touch burst is active
      let touchT = 0;
      let isBursting = false;
      let activeBurstIndex = -1;

      if (touchBurstActive) {
        const burstElapsed = now - touchBurstStartTime;
        if (burstElapsed < TOUCH_BURST_DURATION) {
          isBursting = true;
          activeBurstIndex = touchQualityIndex;
          touchT = burstElapsed / TOUCH_BURST_DURATION; // 0.0 to 1.0
        } else {
          touchBurstActive = false;
        }
      }

      // Forehead Center (Brikuti) Glow Synchronization During Touch Burst
      if (brikutiPoint) {
        if (isBursting && touchT >= 0.35 && touchT <= 0.85) {
          brikutiPoint.classList.add('brikuti-receive-glow');
          brikutiPoint.style.boxShadow = `0 0 30px #ffffff, 0 0 65px ${RAYS[activeBurstIndex].glow}, 0 0 120px ${RAYS[activeBurstIndex].color}`;
        } else {
          brikutiPoint.classList.remove('brikuti-receive-glow');
          brikutiPoint.style.boxShadow = '';
        }
      }

      // --- 1. Ambient Cosmic Stardust Rendering (Crisp Circular Points) ---
      ambientStars.forEach(star => {
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < 0) star.x = W;
        if (star.x > W) star.x = 0;
        if (star.y < 0) star.y = H;
        if (star.y > H) star.y = 0;

        const currentAlpha = star.alpha + Math.sin(now * star.twinkleSpeed + star.twinklePhase) * 0.25;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(0.95, currentAlpha));
        ctx.fill();
      });

      // Mobile spread factor constraint
      const spreadFactor = W < 600 ? 0.78 : (W < 992 ? 0.9 : 1.0);

      // --- 2. Draw ALL 7 Continuous Luminous Energy Streams + In-Stream Values (Ultra Clarity) ---
      RAYS.forEach((ray, i) => {
        const cp1 = { x: p0.x + W * ray.spread * 0.95 * spreadFactor, y: p0.y + (cy_forehead - p0.y) * 0.38 };
        const cp2 = { x: p0.x + W * ray.cpSpread * 0.45 * spreadFactor, y: p0.y + (cy_forehead - p0.y) * 0.78 };
        const p3 = { x: p0.x + ray.endOffset * (W < 600 ? 0.6 : 1.0), y: cy_forehead };

        const isEmphasized = (isBursting && i === activeBurstIndex);

        // Volumetric Outer Glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p3.x, p3.y);
        ctx.strokeStyle = ray.color;
        ctx.globalAlpha = isEmphasized ? 0.55 : (0.28 + Math.sin(now * 0.0018 + i) * 0.06);
        ctx.lineWidth = isEmphasized ? (W < 600 ? 6.5 : 9.5) : (W < 600 ? 3.5 : 5.0);
        ctx.shadowColor = ray.glow;
        ctx.shadowBlur = isEmphasized ? 32 : 18;
        ctx.stroke();
        ctx.restore();

        // Luminous Core Stream with Flowing Light Dashes (Continuous Direction: Top -> Forehead)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p3.x, p3.y);
        ctx.strokeStyle = isEmphasized ? '#ffffff' : ray.glow;
        ctx.globalAlpha = isEmphasized ? 0.98 : 0.75;
        ctx.lineWidth = isEmphasized ? (W < 600 ? 2.2 : 3.0) : (W < 600 ? 1.4 : 1.8);
        ctx.shadowColor = ray.color;
        ctx.shadowBlur = isEmphasized ? 10 : 5;
        ctx.setLineDash(isEmphasized ? [16, 10] : [12, 16]);
        ctx.lineDashOffset = -(now * (isEmphasized ? 0.06 : 0.032) + i * 4);
        ctx.stroke();
        ctx.restore();

        // High-Clarity In-Stream Value Typography (Flowing Elegantly With the Ray)
        const tVal = W < 600 ? 0.32 : 0.35;
        const valPos = getBezier(tVal, p0, cp1, cp2, p3);
        ctx.save();
        ctx.font = `700 ${W < 600 ? '9.5px' : '11.5px'} 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtle dark outline behind text for 100% crisp readability
        ctx.strokeStyle = 'rgba(20, 4, 3, 0.75)';
        ctx.lineWidth = 3;
        ctx.strokeText(`${ray.en} • ${ray.ml}`, valPos.x, valPos.y - 8);

        ctx.fillStyle = isEmphasized ? '#ffffff' : '#ffffff';
        ctx.globalAlpha = isEmphasized ? 1.0 : (0.85 + Math.sin(now * 0.002 + i) * 0.12);
        ctx.shadowColor = ray.glow;
        ctx.shadowBlur = isEmphasized ? 12 : 6;
        ctx.fillText(`${ray.en} • ${ray.ml}`, valPos.x, valPos.y - 8);
        ctx.restore();
      });

      // --- 3. Draw Travelling Particles (JYOTI → RAY → FOREHEAD CENTER) ---
      rayParticles.forEach(p => {
        const isEmphasized = (isBursting && p.rayIndex === activeBurstIndex);
        p.t += p.speed * (isEmphasized ? 1.5 : 1.0);
        if (p.t >= 1.0) {
          p.t = 0.0; // Loop seamlessly back to Supreme Jyoti
        }

        const ray = RAYS[p.rayIndex];
        const cp1 = { x: p0.x + W * ray.spread * 0.95 * spreadFactor, y: p0.y + (cy_forehead - p0.y) * 0.38 };
        const cp2 = { x: p0.x + W * ray.cpSpread * 0.45 * spreadFactor, y: p0.y + (cy_forehead - p0.y) * 0.78 };
        const p3 = { x: p0.x + ray.endOffset * (W < 600 ? 0.6 : 1.0), y: cy_forehead };

        const pos = getBezier(p.t, p0, cp1, cp2, p3);

        // Soft fade-in near Jyoti (t < 0.1) and graceful absorption at Forehead Center (t > 0.88)
        let alpha = 1.0;
        if (p.t < 0.1) alpha = p.t / 0.1;
        if (p.t > 0.88) alpha = (1.0 - p.t) / 0.12;

        const sparkle = Math.sin(now * p.sparkleSpeed + p.sparklePhase) * 0.3 + 0.7;
        const finalAlpha = Math.max(0.2, alpha * sparkle * (isEmphasized ? 1.0 : 0.85));
        const pSize = p.size * (isEmphasized ? 1.4 : 1.0) * (W < 600 ? 0.85 : 1.0);

        // Draw particle halo (soft volumetric glow)
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pSize * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = ray.glow;
        ctx.globalAlpha = finalAlpha * (isEmphasized ? 0.7 : 0.45);
        ctx.shadowColor = ray.glow;
        ctx.shadowBlur = isEmphasized ? 16 : 10;
        ctx.fill();

        // Draw ultra-bright particle core
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pSize * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = finalAlpha * 0.98;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Subtle 3D Desktop Parallax Tracking
    if (heroUniverse && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
      let isHovering = false;

      const onMouseMove = (e) => {
        const rect = heroUniverse.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetX = ((mouseX - centerX) / centerX) * 10;
        targetY = ((mouseY - centerY) / centerY) * 6;
        isHovering = true;
      };

      const onMouseLeave = () => {
        targetX = 0;
        targetY = 0;
        isHovering = false;
      };

      heroUniverse.addEventListener('mousemove', onMouseMove);
      heroUniverse.addEventListener('mouseleave', onMouseLeave);

      const renderParallax = () => {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01 || isHovering) {
          if (masterBg) {
            masterBg.style.transform = `scale(1.02) translate3d(${-currentX * 0.3}px, ${-currentY * 0.3}px, 0)`;
          }
          if (jyotiBeacon) {
            jyotiBeacon.style.transform = `translate(calc(-50% + ${currentX * 0.2}px), calc(-50% + ${currentY * 0.2}px))`;
          }
          if (captionDock) {
            captionDock.style.transform = `translate3d(${currentX * 0.15}px, ${currentY * 0.15}px, 0)`;
          }
        }

        requestAnimationFrame(renderParallax);
      };
      renderParallax();
    }
  }

  // --- Registration / Contact Submission ---
  handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const preferredCenter = document.getElementById('regCenter').value;
    const courseType = document.getElementById('regCourseType').value;
    const timePreference = document.getElementById('regTime').value;
    const notes = document.getElementById('regNotes').value.trim();

    if (!name || !phone) {
      this.toast("Please provide your name and contact phone number.");
      return;
    }

    window.bkStore.addRegistration({
      name,
      phone,
      email,
      preferredCenter,
      courseType,
      timePreference,
      notes
    });

    document.getElementById('contactForm').reset();
    this.toast(`🕊️ Om Shanti, ${name}! Your registration for Brahma Kumaris Kozhikode has been received. Our team will contact you shortly.`);
  }

  openRegistrationModal(courseName) {
    this.switchTab('contact');
    const select = document.getElementById('regCourseType');
    if (select) {
      select.value = '7-Day Rajyoga Foundation Course';
    }
    const notes = document.getElementById('regNotes');
    if (notes && courseName) {
      notes.value = `Enrolling for: ${courseName}`;
    }
    const form = document.getElementById('contactForm');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openVisitModal(centerName) {
    this.switchTab('contact');
    const centerSelect = document.getElementById('regCenter');
    if (centerSelect) {
      for (let i = 0; i < centerSelect.options.length; i++) {
        if (centerSelect.options[i].text.includes(centerName) || centerName.includes(centerSelect.options[i].value)) {
          centerSelect.selectedIndex = i;
          break;
        }
      }
    }
    const courseSelect = document.getElementById('regCourseType');
    if (courseSelect) {
      courseSelect.value = 'Meditation Sanctuary Visit';
    }
    const form = document.getElementById('contactForm');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // --- Toast Notification ---
  toast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="bell" style="width:16px;height:16px;color:var(--sunset-amber);"></i><span>${message}</span>`;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

// Global public app instance
window.bkApp = new AppController();
document.addEventListener('DOMContentLoaded', () => {
  window.bkApp.init();
});
