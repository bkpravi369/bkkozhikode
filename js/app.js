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

    // Check hash URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      if (hash.startsWith('events-')) {
        const sub = hash.replace('events-', '');
        this.switchTab('events', sub);
      } else if (hash.startsWith('media-')) {
        const sub = hash.replace('media-', '');
        this.switchTab('media', sub);
      } else {
        this.switchTab(hash);
      }
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

    // Keyboard support for Lightbox
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
      }
    });
  }

  // --- Dynamic Navigation & Tabs ---
  renderNavigation() {
    const navContainer = document.getElementById('dynamicNavContainer');
    if (!navContainer) return;

    const tabs = window.bkStore.getEnabledTabs();
    const socialChannels = window.bkStore.getSocialChannels();
    navContainer.innerHTML = '';

    tabs.forEach(tab => {
      const li = document.createElement('li');
      const isCurrent = this.currentTab === tab.id;

      if (tab.id === 'media' || tab.type === 'media-dropdown') {
        // Multi-level Nested Dropdown for Media
        li.className = 'nav-item-dropdown';
        
        // Build Level 3 channel items HTML
        let socialChannelsHtml = '';
        socialChannels.forEach(ch => {
          if (!ch.active) return;
          const hasYt = Boolean(ch.youtubeUrl && ch.youtubeUrl.trim());
          const hasInsta = Boolean(ch.instagramUrl && ch.instagramUrl.trim());
          const hasFb = Boolean(ch.facebookUrl && ch.facebookUrl.trim());

          socialChannelsHtml += `
            <li class="dropdown-nested-parent-l3">
              <div class="dropdown-item dropdown-toggle-nested" onclick="bkApp.toggleNestedDropdown(event, 'chMenu_${ch.id}')">
                <span class="channel-name-txt">${ch.name}</span>
                <i data-lucide="chevron-right" class="nested-arrow-icon" style="width:14px;height:14px;"></i>
              </div>
              <ul class="nav-channel-submenu" id="chMenu_${ch.id}">
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
            <i data-lucide="film" style="width:16px;height:16px;"></i>
            <span>Media</span>
            <i data-lucide="chevron-down" class="dropdown-arrow-icon" style="width:13px;height:13px;margin-left:2px;"></i>
          </button>
          
          <!-- Level 1 Dropdown Menu -->
          <ul class="nav-dropdown-menu" id="navMediaDropdown">
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('media', 'songs')">
                <i data-lucide="music-2" style="width:15px;height:15px;"></i>
                <span>Songs</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('media', 'commentaries')">
                <i data-lucide="mic" style="width:15px;height:15px;"></i>
                <span>Commentaries</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('media', 'music')">
                <i data-lucide="headphones" style="width:15px;height:15px;"></i>
                <span>Music</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('media', 'videos')">
                <i data-lucide="video" style="width:15px;height:15px;"></i>
                <span>Videos</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('media', 'films')">
                <i data-lucide="film" style="width:15px;height:15px;"></i>
                <span>Films</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('media', 'others')">
                <i data-lucide="folder-heart" style="width:15px;height:15px;"></i>
                <span>Others</span>
              </button>
            </li>
            
            <li class="dropdown-divider"></li>
            
            <!-- Level 2: Social Media Nested Flyout -->
            <li class="dropdown-nested-parent">
              <div class="dropdown-item dropdown-toggle-nested" onclick="bkApp.toggleNestedDropdown(event, 'nestedSocialMenu')">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  <i data-lucide="share-2" style="width:15px;height:15px;color:var(--sunset-amber);"></i>
                  <span>Social Media</span>
                </div>
                <i data-lucide="chevron-right" class="nested-arrow-icon" style="width:14px;height:14px;"></i>
              </div>
              
              <!-- Channels Submenu -->
              <ul class="nav-nested-submenu" id="nestedSocialMenu">
                ${socialChannelsHtml}
              </ul>
            </li>
          </ul>
        `;
        navContainer.appendChild(li);
      } else if (tab.id === 'events' || tab.type === 'events-dropdown') {
        // Multi-level Nested Dropdown for Events
        li.className = 'nav-item-dropdown';
        li.innerHTML = `
          <button class="nav-link nav-dropdown-toggle ${isCurrent ? 'active' : ''}" data-tab-id="events" onclick="bkApp.handleEventsTabClick(event)">
            <i data-lucide="calendar" style="width:16px;height:16px;"></i>
            <span>Events</span>
            <i data-lucide="chevron-down" class="dropdown-arrow-icon" style="width:13px;height:13px;margin-left:2px;"></i>
          </button>
          
          <!-- Level 1 Dropdown Menu -->
          <ul class="nav-dropdown-menu" id="navEventsDropdown">
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('events', 'latest')">
                <i data-lucide="sparkles" style="width:15px;height:15px;"></i>
                <span>Latest Events</span>
              </button>
            </li>
            <li>
              <button class="dropdown-item" onclick="bkApp.switchTab('events', 'navathi')">
                <i data-lucide="award" style="width:15px;height:15px;"></i>
                <span>Navathi Celebrations</span>
              </button>
            </li>
            
            <li class="dropdown-divider"></li>
            
            <!-- Level 2: Festivals Nested Submenu -->
            <li class="dropdown-nested-parent">
              <div class="dropdown-item dropdown-toggle-nested" onclick="bkApp.toggleNestedDropdown(event, 'nestedFestivalsMenu')">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                  <i data-lucide="flame" style="width:15px;height:15px;color:var(--sunset-amber);"></i>
                  <span>Festivals</span>
                </div>
                <i data-lucide="chevron-right" class="nested-arrow-icon" style="width:14px;height:14px;"></i>
              </div>
              
              <!-- Festivals Submenu (Children: Shivarathri, Raksha Bandhan, Other Programs) -->
              <ul class="nav-nested-submenu" id="nestedFestivalsMenu">
                <li>
                  <button class="dropdown-item" onclick="bkApp.switchTab('events', 'shivarathri')">
                    <i data-lucide="sun" style="width:15px;height:15px;"></i>
                    <span>Shivarathri</span>
                  </button>
                </li>
                <li>
                  <button class="dropdown-item" onclick="bkApp.switchTab('events', 'rakshabandhan')">
                    <i data-lucide="heart-handshake" style="width:15px;height:15px;"></i>
                    <span>Raksha Bandhan</span>
                  </button>
                </li>
                <li>
                  <button class="dropdown-item" onclick="bkApp.switchTab('events', 'other')">
                    <i data-lucide="calendar" style="width:15px;height:15px;"></i>
                    <span>Other Programs</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        `;
        navContainer.appendChild(li);
      } else {
        // Standard Navigation Item
        const btn = document.createElement('button');
        btn.className = `nav-link ${isCurrent ? 'active' : ''}`;
        btn.setAttribute('data-tab-id', tab.id);
        btn.onclick = () => this.switchTab(tab.id);

        let iconHtml = '';
        if (tab.icon) {
          iconHtml = `<i data-lucide="${tab.icon}" style="width:16px;height:16px;"></i>`;
        }

        const customTag = tab.type === 'custom' ? `<span class="custom-indicator">New</span>` : '';

        btn.innerHTML = `${iconHtml}<span>${tab.label}</span>${customTag}`;
        li.appendChild(btn);
        navContainer.appendChild(li);
      }
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

  switchTab(tabId, subCategory = null) {
    this.currentTab = tabId;
    window.location.hash = subCategory ? `${tabId}-${subCategory}` : tabId;

    // Update active nav button
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-tab-id') === tabId);
    });

    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
      pane.style.display = 'none';
    });

    const isSystemTab = ['home', 'about', 'meditation', 'course', 'centers', 'gallery', 'media', 'events', 'murali', 'contact'].includes(tabId);

    if (isSystemTab) {
      const targetPane = document.getElementById(`tab-${tabId}`);
      if (targetPane) {
        targetPane.classList.add('active');
        targetPane.style.display = 'block';
      }
      if (tabId === 'about') {
        this.renderAboutPage();
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
      if (tabId === 'media') {
        this.filterMediaCategory(subCategory || 'all');
      }
      if (tabId === 'events') {
        this.renderEventsSection(subCategory || 'latest');
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

  // --- Render 7-Day Rajyoga Course with Embedded YouTube Videos ---
  renderCourseModules() {
    const container = document.getElementById('courseModulesContainer');
    if (!container) return;

    const modules = window.bkStore.getCourseModules();
    container.innerHTML = '';

    modules.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'course-card';

      // Extract YouTube Video ID
      const videoId = mod.youtubeVideoId || (window.bkUtils ? window.bkUtils.extractYouTubeVideoId(mod.youtubeUrl || '') : '');

      let videoHtml = '';
      if (videoId) {
        videoHtml = `
          <div class="course-video-wrapper">
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1" 
              title="Day ${mod.day}: ${mod.title}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen 
              loading="lazy">
            </iframe>
          </div>
        `;
      } else {
        videoHtml = `
          <div class="course-video-wrapper course-video-placeholder">
            <div class="video-placeholder-inner">
              <div class="video-placeholder-icon">
                <i data-lucide="play-circle"></i>
              </div>
              <h4>Day ${mod.day} Video Coming Soon</h4>
              <p>This lesson video is being prepared. Review the spiritual wisdom and core reflection below.</p>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="course-card-top-bar">
          <span class="course-day-badge">Day 0${mod.day}</span>
          <div class="course-top-badges">
            <span class="course-duration-badge"><i data-lucide="clock" style="width:13px;height:13px;"></i> ${mod.duration || '30 mins'}</span>
            <span class="course-status-badge available"><i data-lucide="sparkles" style="width:13px;height:13px;"></i> Available</span>
          </div>
        </div>

        <h3 class="course-card-title">${mod.title}</h3>
        ${mod.titleMl ? `<div class="card-ml-title">${mod.titleMl}</div>` : ''}

        ${videoHtml}

        <p class="course-lesson-desc">${mod.description || mod.summary || ''}</p>

        ${mod.keyInsight ? `
          <div class="course-insight">
            <strong>✨ Core Realization:</strong> "${mod.keyInsight}"
          </div>
        ` : ''}

        <div class="course-meta">
          <span class="course-journey-step">Day ${mod.day} of 7 • Free Spiritual Learning</span>
          <button class="btn-action-sm btn-action-edit" onclick="bkApp.openRegistrationModal('Day ${mod.day}: ${mod.title}')">
            <i data-lucide="calendar-check" style="width:14px;height:14px;"></i>
            <span>Join Kozhikode Center Batch</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Render About Us Editorial Page ---
  renderAboutPage() {
    const bkContainer = document.getElementById('aboutBkDisplayContainer');
    const kozhikodeContainer = document.getElementById('aboutKozhikodeDisplayContainer');
    const aboutData = window.bkStore.getAboutData();

    if (bkContainer && aboutData.aboutBk) {
      const bk = aboutData.aboutBk;
      if (bk.published !== false) {
        bkContainer.style.display = 'block';
        const paragraphs = (bk.text || '').split('\n').filter(p => p.trim().length > 0);
        const pTags = paragraphs.map(p => `<p>${p}</p>`).join('');

        bkContainer.innerHTML = `
          <div class="about-editorial-grid">
            <div class="about-editorial-media">
              <img src="${bk.image || 'assets/images/light_palace_center.jpg'}" alt="${bk.heading || 'About Brahma Kumaris'}">
            </div>
            <div class="about-editorial-text">
              <span class="editorial-badge">Global Spiritual Movement • Est. 1936</span>
              <h3>${bk.heading || 'About Brahma Kumaris'}</h3>
              ${bk.headingMl ? `<div class="about-ml-heading">${bk.headingMl}</div>` : ''}
              <div class="about-body-paragraphs">${pTags}</div>
            </div>
          </div>
        `;
      } else {
        bkContainer.style.display = 'none';
      }
    }

    if (kozhikodeContainer && aboutData.aboutKozhikode) {
      const kzk = aboutData.aboutKozhikode;
      if (kzk.published !== false) {
        kozhikodeContainer.style.display = 'block';
        const paragraphs = (kzk.text || '').split('\n').filter(p => p.trim().length > 0);
        const pTags = paragraphs.map(p => `<p>${p}</p>`).join('');

        kozhikodeContainer.innerHTML = `
          <div class="about-editorial-grid reverse">
            <div class="about-editorial-text">
              <span class="editorial-badge local">North Kerala Sub-Zone • Light Palace</span>
              <h3>${kzk.heading || 'About Brahma Kumaris Kozhikode'}</h3>
              ${kzk.headingMl ? `<div class="about-ml-heading">${kzk.headingMl}</div>` : ''}
              <div class="about-body-paragraphs">${pTags}</div>
            </div>
            <div class="about-editorial-media">
              <img src="${kzk.image || 'assets/images/meditation_hall.jpg'}" alt="${kzk.heading || 'About Brahma Kumaris Kozhikode'}">
            </div>
          </div>
        `;
      } else {
        kozhikodeContainer.style.display = 'none';
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Render Daily Murali Sacred Reading Page ---
  renderDailyMuraliPage() {
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
          ${c.isPrimary ? '<span class="main-badge">★ Kozhikode Main Sub-Zone Center</span>' : ''}
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

  // --- Render Media Hub (Songs, Commentaries, Music, Videos, Films, Others, Social Channels) ---
  renderMediaHub(selectedCategory = 'all') {
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
    document.querySelectorAll('.media-filter-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('onclick')?.includes(`'${category}'`));
    });
    if (btn) {
      document.querySelectorAll('.media-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    this.renderMediaHub(category);
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
  // RENDER EVENTS SECTION — PREMIUM EDITORIAL DESIGN
  // =========================================================================

  renderEvents() {
    this.renderEventsSection('latest');
  }

  renderEventsSection(viewType = 'latest') {
    const headerArea = document.getElementById('eventsHeaderArea');
    const viewContainer = document.getElementById('eventsViewContainer');
    if (!viewContainer) return;

    // Update Sub-Navigation Buttons
    document.querySelectorAll('.events-subnav-btn').forEach(btn => {
      const v = btn.getAttribute('data-view');
      btn.classList.toggle('active', v === viewType);
    });

    // Render Dynamic Header
    if (headerArea) {
      headerArea.innerHTML = this.getEventsHeaderHtml(viewType);
    }

    // Fetch Published Events for the Category
    let events = [];
    if (viewType === 'latest') {
      events = window.bkStore.getEvents('latest');
      this.renderLatestEventsView(events, viewContainer);
    } else if (viewType === 'navathi') {
      events = window.bkStore.getEvents('navathi');
      this.renderNavathiView(events, viewContainer);
    } else if (viewType === 'festivals') {
      this.renderFestivalsHubView(viewContainer);
    } else if (['shivarathri', 'rakshabandhan', 'other'].includes(viewType)) {
      events = window.bkStore.getEvents(viewType);
      this.renderFestivalCategoryView(viewType, events, viewContainer);
    } else {
      events = window.bkStore.getEvents('latest');
      this.renderLatestEventsView(events, viewContainer);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  filterEventsView(viewType, btn) {
    if (btn) {
      document.querySelectorAll('.events-subnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    window.location.hash = `events-${viewType}`;
    this.renderEventsSection(viewType);
  }

  getEventsHeaderHtml(viewType) {
    const meta = {
      latest: {
        kicker: 'Spiritual Gatherings & Programs',
        title: 'Latest Events & Retreats',
        titleMl: 'ഏറ്റവും പുതിയ ആത്മീയ പരിപാടികൾ',
        desc: 'Join our uplifting spiritual discourses, collective peace meditation sessions, and value education workshops in Kozhikode.'
      },
      navathi: {
        kicker: '90 Years of Spiritual Awakening (1936 – 2026)',
        title: 'Navathi Celebrations',
        titleMl: 'ബ്രഹ്മാകുമാരീസ് നവതി ആത്മീയ മഹോത്സവം',
        desc: 'Commemorating 90 glorious years of dedicated service to humanity, spiritual empowerment of women, and world renewal across 140+ countries.'
      },
      festivals: {
        kicker: 'Sacred Celebrations & Meaning',
        title: 'Spiritual Festivals of Light',
        titleMl: 'ആത്മീയ ആഘോഷങ്ങളും അന്തസ്സത്തയും',
        desc: 'Discover the profound spiritual symbolism behind sacred Indian festivals, awakening inner purity, love, and divine remembrance.'
      },
      shivarathri: {
        kicker: 'Divine Descent of Incorporeal Shiva',
        title: 'Maha Shivratri Celebrations',
        titleMl: 'മഹാശിവരാത്രി ആത്മീയോത്സവം',
        desc: 'Experience the secret of Shivratri, continuous peace meditation, 3D Paramdham darshan, and flag hoisting at our Kozhikode centers.'
      },
      rakshabandhan: {
        kicker: 'Bond of Supreme Purity & Love',
        title: 'Sacred Raksha Bandhan Gathering',
        titleMl: 'വിശുദ്ധി ദിവ്യസ്നേഹ രക്ഷാബന്ധൻ',
        desc: 'Tying the sacred thread of soul consciousness and taking a divine pledge of living with purity, peace, and universal brotherhood.'
      },
      other: {
        kicker: 'Retreats, Seminars & Workshops',
        title: 'Other Programs & Special Workshops',
        titleMl: 'മറ്റു വിശേഷ പരിപാടികളും ശിൽപശാലകളും',
        desc: 'Interactive stress-relief seminars, youth empowerment workshops, medical conferences, and community peace initiatives.'
      }
    };

    const cur = meta[viewType] || meta.latest;

    return `
      <div class="section-header" style="margin-bottom:2rem;">
        <span class="section-kicker">${cur.kicker}</span>
        <h2>${cur.title}</h2>
        <div class="section-title-ml">${cur.titleMl}</div>
        <div class="divider-sun"></div>
        <p class="section-subtitle">${cur.desc}</p>
      </div>
    `;
  }

  // --- 1. LATEST EVENTS VIEW ---
  renderLatestEventsView(events, container) {
    if (!events || events.length === 0) {
      container.innerHTML = `
        <div class="events-empty-state">
          <div class="empty-icon-wrap">
            <i data-lucide="calendar-off" style="width:36px;height:36px;color:var(--sunset-primary);"></i>
          </div>
          <h3>No Events Currently Available</h3>
          <p>Upcoming programs and retreat dates will be published here soon. You are warmly welcome to visit our Kozhikode centers daily for meditation.</p>
          <button class="btn-cta-course" onclick="bkApp.switchTab('contact')" style="margin-top:1rem;">
            <span>Contact Light Palace Center</span>
          </button>
        </div>
      `;
      return;
    }

    const featured = events.find(e => e.isFeatured) || events[0];
    const otherEvents = events.filter(e => e.id !== featured.id);

    let html = `
      <div class="latest-events-editorial-layout">
        <!-- Hero Featured Event Card -->
        <div class="featured-event-hero-card">
          <div class="featured-event-img-wrap">
            <img src="${featured.image || 'assets/images/light_palace_center.jpg'}" alt="${featured.title}">
            <div class="featured-event-badge">
              <i data-lucide="star" style="width:13px;height:13px;fill:currentColor;"></i>
              <span>Featured Program</span>
            </div>
            <div class="featured-cat-tag">${this.formatEventCategory(featured.category)}</div>
          </div>
          <div class="featured-event-info">
            <div class="event-meta-chips">
              <span class="meta-chip date"><i data-lucide="calendar" style="width:14px;height:14px;"></i> ${featured.date}</span>
              <span class="meta-chip time"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${featured.time}</span>
              <span class="meta-chip loc"><i data-lucide="map-pin" style="width:14px;height:14px;"></i> ${featured.location}</span>
            </div>
            <h3 class="featured-event-title">${featured.title}</h3>
            ${featured.titleMl ? `<div class="featured-event-title-ml">${featured.titleMl}</div>` : ''}
            <p class="featured-event-desc">${featured.shortDesc || featured.fullDesc || ''}</p>
            
            <div class="featured-event-actions">
              <button class="btn-cta-course" onclick="bkApp.openEventDetail('${featured.id}')">
                <i data-lucide="eye" style="width:15px;height:15px;"></i>
                <span>View Details & Schedule</span>
              </button>
              ${featured.registrationUrl ? `
                <a href="${featured.registrationUrl}" target="_blank" class="btn-event-outline">
                  <i data-lucide="user-plus" style="width:15px;height:15px;"></i>
                  <span>Register Free</span>
                </a>
              ` : `
                <button class="btn-event-outline" onclick="bkApp.openRegistrationModal('${featured.title}')">
                  <i data-lucide="user-plus" style="width:15px;height:15px;"></i>
                  <span>Register Free</span>
                </button>
              `}
            </div>
          </div>
        </div>
    `;

    if (otherEvents.length > 0) {
      html += `
        <div class="other-events-section-header">
          <h4>Upcoming Gatherings & Workshops</h4>
          <div class="divider-subtle"></div>
        </div>
        <div class="events-editorial-grid">
      `;

      otherEvents.forEach(ev => {
        html += `
          <div class="event-editorial-card">
            <div class="event-card-media-wrap">
              <img src="${ev.image || 'assets/images/meditation_hall.jpg'}" alt="${ev.title}">
              <span class="event-cat-pill">${this.formatEventCategory(ev.category)}</span>
            </div>
            <div class="event-card-body">
              <div class="event-card-meta">
                <span><i data-lucide="calendar" style="width:13px;height:13px;"></i> ${ev.date}</span>
                <span><i data-lucide="clock" style="width:13px;height:13px;"></i> ${ev.time}</span>
              </div>
              <h4 class="event-card-heading">${ev.title}</h4>
              ${ev.titleMl ? `<div class="event-card-heading-ml">${ev.titleMl}</div>` : ''}
              <div class="event-card-location">
                <i data-lucide="map-pin" style="width:13px;height:13px;color:var(--sunset-primary);"></i>
                <span>${ev.location}</span>
              </div>
              <p class="event-card-summary">${ev.shortDesc || ''}</p>
              <div class="event-card-bottom">
                <button class="btn-view-event-detail" onclick="bkApp.openEventDetail('${ev.id}')">
                  <span>View Details</span>
                  <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  // --- 2. NAVATHI CELEBRATIONS VIEW ---
  renderNavathiView(events, container) {
    const navathiEvents = events.filter(e => e.category === 'navathi');
    const mainNavathi = navathiEvents[0] || (events.length > 0 ? events[0] : null);

    let html = `
      <div class="navathi-ceremonial-view">
        <!-- Ceremonial Grand Hero Banner -->
        <div class="navathi-grand-banner">
          <div class="navathi-badge-gold">
            <i data-lucide="sparkles" style="width:16px;height:16px;"></i>
            <span>1936 – 2026 • 90 Glorious Years</span>
          </div>
          <h2>Navathi Celebrations of Brahma Kumaris</h2>
          <div class="navathi-ml-banner-title">ബ്രഹ്മാകുമാരീസ് നവതി ആത്മീയ മഹോത്സവം</div>
          <p class="navathi-banner-lead">
            Commemorating 90 years of dedicated service to humanity, spiritual awakening, and world transformation founded by Incorporeal God Father Shiva through Prajapita Brahma.
          </p>
          
          <div class="navathi-milestones-row">
            <div class="navathi-milestone-box">
              <div class="milestone-num">90+</div>
              <div class="milestone-label">Years of Service</div>
            </div>
            <div class="navathi-milestone-box">
              <div class="milestone-num">140+</div>
              <div class="milestone-label">Countries Globally</div>
            </div>
            <div class="navathi-milestone-box">
              <div class="milestone-num">8,500+</div>
              <div class="milestone-label">Meditation Centers</div>
            </div>
            <div class="navathi-milestone-box">
              <div class="milestone-num">Millions</div>
              <div class="milestone-label">Lives Transformed</div>
            </div>
          </div>
        </div>
    `;

    if (mainNavathi) {
      html += `
        <div class="navathi-event-feature-box">
          <div class="navathi-feature-grid">
            <div class="navathi-feature-img">
              <img src="${mainNavathi.image || 'assets/images/light_palace_center.jpg'}" alt="${mainNavathi.title}">
            </div>
            <div class="navathi-feature-content">
              <div class="event-meta-chips">
                <span class="meta-chip date"><i data-lucide="calendar" style="width:14px;height:14px;"></i> ${mainNavathi.date}</span>
                <span class="meta-chip time"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${mainNavathi.time}</span>
                <span class="meta-chip loc"><i data-lucide="map-pin" style="width:14px;height:14px;"></i> ${mainNavathi.location}</span>
              </div>
              <h3>${mainNavathi.title}</h3>
              ${mainNavathi.titleMl ? `<div class="featured-event-title-ml">${mainNavathi.titleMl}</div>` : ''}
              <p>${mainNavathi.fullDesc || mainNavathi.shortDesc}</p>
              
              ${Array.isArray(mainNavathi.schedule) && mainNavathi.schedule.length > 0 ? `
                <div class="navathi-schedule-preview">
                  <h4 style="font-size:0.95rem;color:var(--sunset-dark-base);margin-bottom:0.65rem;display:flex;align-items:center;gap:0.4rem;">
                    <i data-lucide="list-checks" style="width:16px;height:16px;color:var(--sunset-primary);"></i>
                    <span>Ceremonial Schedule Highlights</span>
                  </h4>
                  <ul class="navathi-schedule-list">
                    ${mainNavathi.schedule.map(s => `
                      <li>
                        <span class="sched-time">${s.time}</span>
                        <span class="sched-session">${s.session}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}

              <div style="display:flex;gap:0.75rem;margin-top:1.5rem;flex-wrap:wrap;">
                <button class="btn-cta-course" onclick="bkApp.openEventDetail('${mainNavathi.id}')">
                  <i data-lucide="eye" style="width:15px;height:15px;"></i>
                  <span>Full Program Details</span>
                </button>
                <button class="btn-event-outline" onclick="bkApp.openRegistrationModal('${mainNavathi.title}')">
                  <i data-lucide="user-check" style="width:15px;height:15px;"></i>
                  <span>Attend Navathi Gathering</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  // --- 3. FESTIVALS HUB VIEW ---
  renderFestivalsHubView(container) {
    const festivalCards = [
      {
        id: 'shivarathri',
        title: 'Maha Shivratri',
        titleMl: 'മഹാശിവരാത്രി',
        lead: 'The sacred festival of the divine incorporeal descent of God Shiva, Dispeller of Darkness and Ocean of Peace.',
        image: 'assets/images/paramdham_sunset.jpg',
        badge: 'Annual Sacred Festival',
        icon: 'sun'
      },
      {
        id: 'rakshabandhan',
        title: 'Raksha Bandhan',
        titleMl: 'രക്ഷാബന്ധൻ',
        lead: 'The spiritual festival of pure divine love, soul-conscious protection, and taking the pledge of universal brotherhood.',
        image: 'assets/images/rajyoga_peace.jpg',
        badge: 'Sacred Purity Festival',
        icon: 'heart-handshake'
      },
      {
        id: 'other',
        title: 'Other Programs',
        titleMl: 'മറ്റു വിശേഷ പരിപാടികൾ',
        lead: 'Spiritual retreats, stress-free living workshops, youth initiatives, medical symposiums, and collective peace hours.',
        image: 'assets/images/meditation_hall.jpg',
        badge: 'Retreats & Workshops',
        icon: 'calendar'
      }
    ];

    let html = `
      <div class="festivals-hub-container">
        <div class="festivals-intro-box">
          <p>
            Brahma Kumaris celebrates Indian festivals by revealing their deep, transformative spiritual significance. Select a festival below to explore our special spiritual celebrations, exhibitions, and schedules in Kozhikode:
          </p>
        </div>
        <div class="festivals-hub-grid">
    `;

    festivalCards.forEach(f => {
      html += `
        <div class="festival-hub-card" onclick="bkApp.filterEventsView('${f.id}')">
          <div class="fest-card-img-wrap">
            <img src="${f.image}" alt="${f.title}">
            <span class="fest-badge-tag">${f.badge}</span>
          </div>
          <div class="fest-card-content">
            <div class="fest-icon-box">
              <i data-lucide="${f.icon}" style="width:20px;height:20px;color:var(--sunset-primary);"></i>
            </div>
            <h3>${f.title}</h3>
            <div class="fest-ml-title">${f.titleMl}</div>
            <p>${f.lead}</p>
            <div class="fest-card-footer">
              <span class="fest-link-txt">Explore ${f.title} Events</span>
              <i data-lucide="arrow-right" style="width:15px;height:15px;color:var(--sunset-primary);"></i>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
    container.innerHTML = html;
  }

  // --- 4. DEDICATED FESTIVAL CATEGORY VIEW (Shivarathri / Raksha Bandhan / Other) ---
  renderFestivalCategoryView(category, events, container) {
    if (!events || events.length === 0) {
      container.innerHTML = `
        <div class="events-empty-state">
          <div class="empty-icon-wrap">
            <i data-lucide="calendar-off" style="width:36px;height:36px;color:var(--sunset-primary);"></i>
          </div>
          <h3>No Events Currently Scheduled</h3>
          <p>There are no events currently scheduled under this category. Please check back soon or contact our Kozhikode center for upcoming program dates.</p>
          <div style="display:flex;gap:0.75rem;margin-top:1rem;justify-content:center;">
            <button class="btn-event-outline" onclick="bkApp.filterEventsView('festivals')">
              <span>Back to Festivals Hub</span>
            </button>
            <button class="btn-cta-course" onclick="bkApp.switchTab('contact')">
              <span>Contact Center</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="events-editorial-grid">
    `;

    events.forEach(ev => {
      html += `
        <div class="event-editorial-card">
          <div class="event-card-media-wrap">
            <img src="${ev.image || 'assets/images/light_palace_center.jpg'}" alt="${ev.title}">
            <span class="event-cat-pill">${this.formatEventCategory(ev.category)}</span>
          </div>
          <div class="event-card-body">
            <div class="event-card-meta">
              <span><i data-lucide="calendar" style="width:13px;height:13px;"></i> ${ev.date}</span>
              <span><i data-lucide="clock" style="width:13px;height:13px;"></i> ${ev.time}</span>
            </div>
            <h4 class="event-card-heading">${ev.title}</h4>
            ${ev.titleMl ? `<div class="event-card-heading-ml">${ev.titleMl}</div>` : ''}
            <div class="event-card-location">
              <i data-lucide="map-pin" style="width:13px;height:13px;color:var(--sunset-primary);"></i>
              <span>${ev.location}</span>
            </div>
            <p class="event-card-summary">${ev.shortDesc || ''}</p>
            <div class="event-card-bottom">
              <button class="btn-view-event-detail" onclick="bkApp.openEventDetail('${ev.id}')">
                <span>View Details</span>
                <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  // --- 5. PREMIUM EVENT DETAIL MODAL ---
  openEventDetail(eventId) {
    const ev = window.bkStore.getEvent(eventId);
    if (!ev) return;

    const modal = document.getElementById('eventDetailModal');
    const content = document.getElementById('eventDetailContent');
    if (!modal || !content) return;

    // YouTube embed check
    const ytEmbedUrl = ev.videoUrl ? window.bkUtils.getYouTubeEmbedUrl(ev.videoUrl) : '';

    let scheduleHtml = '';
    if (Array.isArray(ev.schedule) && ev.schedule.length > 0) {
      scheduleHtml = `
        <div class="modal-schedule-section">
          <h4>
            <i data-lucide="clock-4" style="width:16px;height:16px;color:var(--sunset-primary);"></i>
            <span>Program Schedule</span>
          </h4>
          <div class="modal-schedule-table-wrap">
            <table class="modal-schedule-table">
              <thead>
                <tr>
                  <th style="width:130px;">Time</th>
                  <th>Session & Spiritual Discourse</th>
                </tr>
              </thead>
              <tbody>
                ${ev.schedule.map(s => `
                  <tr>
                    <td class="sched-col-time"><strong>${s.time}</strong></td>
                    <td class="sched-col-session">${s.session}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    let galleryHtml = '';
    if (Array.isArray(ev.additionalImages) && ev.additionalImages.length > 0) {
      galleryHtml = `
        <div class="modal-gallery-section">
          <h4>
            <i data-lucide="image" style="width:16px;height:16px;color:var(--sunset-primary);"></i>
            <span>Event Photo Gallery</span>
          </h4>
          <div class="modal-gallery-strip">
            ${ev.additionalImages.map(img => `
              <div class="modal-gallery-thumb">
                <img src="${img}" alt="Gallery photo">
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    let videoHtml = '';
    if (ytEmbedUrl) {
      videoHtml = `
        <div class="modal-video-section">
          <h4>
            <i data-lucide="video" style="width:16px;height:16px;color:#ef4444;"></i>
            <span>Event Video Broadcast / Highlights</span>
          </h4>
          <div class="modal-video-player-wrap">
            <iframe src="${ytEmbedUrl}" title="${ev.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="event-detail-hero-media">
        <img src="${ev.image || 'assets/images/light_palace_center.jpg'}" alt="${ev.title}">
        <div class="detail-hero-overlay">
          <span class="detail-cat-badge">${this.formatEventCategory(ev.category)}</span>
          <span class="detail-date-badge">${ev.date}</span>
        </div>
      </div>

      <div class="event-detail-body">
        <div class="event-detail-header-block">
          <h2>${ev.title}</h2>
          ${ev.titleMl ? `<div class="event-detail-title-ml">${ev.titleMl}</div>` : ''}
          
          <div class="event-detail-meta-bar">
            <div class="detail-meta-item">
              <i data-lucide="calendar" style="width:16px;height:16px;"></i>
              <div>
                <strong>Date / Period</strong>
                <span>${ev.date}</span>
              </div>
            </div>
            <div class="detail-meta-item">
              <i data-lucide="clock" style="width:16px;height:16px;"></i>
              <div>
                <strong>Time</strong>
                <span>${ev.time}</span>
              </div>
            </div>
            <div class="detail-meta-item">
              <i data-lucide="map-pin" style="width:16px;height:16px;"></i>
              <div>
                <strong>Venue / Location</strong>
                <span>${ev.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="event-detail-text-content">
          ${ev.shortDesc ? `<p class="detail-lead-intro">${ev.shortDesc}</p>` : ''}
          <div class="detail-full-text">
            <p>${(ev.fullDesc || ev.shortDesc || '').replace(/\n/g, '<br>')}</p>
          </div>
        </div>

        ${scheduleHtml}
        ${galleryHtml}
        ${videoHtml}

        <div class="event-detail-footer-actions">
          <div class="footer-note">
            <i data-lucide="info" style="width:15px;height:15px;"></i>
            <span>All Brahma Kumaris programs are conducted as complimentary public spiritual service.</span>
          </div>
          <div class="footer-btn-group">
            ${ev.registrationUrl ? `
              <a href="${ev.registrationUrl}" target="_blank" class="btn-cta-course" style="padding:0.75rem 1.75rem;">
                <i data-lucide="user-plus" style="width:16px;height:16px;"></i>
                <span>Register for Event</span>
              </a>
            ` : `
              <button class="btn-cta-course" onclick="bkApp.closeEventDetail(); bkApp.openRegistrationModal('${ev.title}');" style="padding:0.75rem 1.75rem;">
                <i data-lucide="user-plus" style="width:16px;height:16px;"></i>
                <span>Register Free for Event</span>
              </button>
            `}
            <button class="btn-event-outline" onclick="bkApp.closeEventDetail()">Close</button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeEventDetail() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) modal.classList.remove('active');
  }

  formatEventCategory(cat) {
    const map = {
      latest: 'Latest Event',
      navathi: 'Navathi Celebrations',
      shivarathri: 'Maha Shivratri',
      rakshabandhan: 'Raksha Bandhan',
      other: 'Special Program'
    };
    return map[cat] || 'Spiritual Gathering';
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
      dpr = Math.min(window.devicePixelRatio || 1, 2.5); // High-DPI Retina scaling for extreme sharpness

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Scale context to match physical pixels

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Adaptive coordinates for Desktop vs Tablet vs Mobile
      if (W < 600) {
        p0 = { x: W * 0.5, y: H * 0.125 };
        cy_forehead = H * 0.485;
      } else if (W < 992) {
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
