/**
 * ============================================================================
 * ADI RATNA & FOUNDERS CONTROLLER & DYNAMIC ROUTER
 * Dedicated Dynamic Routes: /adi-ratna/[slug] & Main Responsive Grid
 * Premium Spiritual UI/UX with 3D Float, Golden Aura & Malayalam Typography
 * ============================================================================
 */

(function() {
  'use strict';

  let currentSlug = null;
  let observer = null;

  // Initialize IntersectionObserver for staggered scroll reveals
  function initScrollObserver() {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
    }
  }

  /**
   * Render the Main Grid Page (Founders + 21 Adi Ratnas)
   */
  function renderAdiRatnaGrid() {
    const container = document.getElementById('adiRatnaDynamicGridContainer');
    if (!container || !window.BK_JEWELS_DATA) return;

    const founders = window.BK_JEWELS_DATA.filter(j => j.category === 'founder');
    const adiRatnas = window.BK_JEWELS_DATA.filter(j => j.category === 'adi-ratna');

    let html = '';

    // SECTION 1: SUPREME INSTRUMENTS (FOUNDERS)
    html += `
      <div class="bk-founders-category-header">
        <span class="bk-category-kicker">👑 ദിവ്യ സ്ഥാപകർ · Supreme Instruments</span>
        <h3 class="bk-category-title">പിതാശ്രീ ബ്രഹ്മാ ബാബ & മാതേശ്വരി സരസ്വതി മമ്മ</h3>
        <p class="bk-category-desc">
          പരമാത്മാവായ ശിവന്റെ ദിവ്യ സന്ദേശം ഈ ഭൂമിയിൽ ആദ്യമായി പകർന്നുനൽകിയ പരമ പവിത്ര ആത്മാക്കൾ.
        </p>
      </div>

      <div class="bk-founders-luxury-grid">
        ${founders.map((soul, idx) => `
          <article class="bk-founder-luxury-card bk-ratan-card-modern" 
                   data-slug="${soul.slug}" 
                   style="--card-index: ${idx};"
                   onclick="window.navigateToAdiRatna('${soul.slug}')" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${soul.name}">
            <div class="bk-card-ambient-aura"></div>
            <div class="bk-founder-media-wrap">
              <div class="bk-portrait-halo-frame">
                <img src="${soul.photo}" 
                     alt="${soul.name}" 
                     class="bk-portrait-img" 
                     loading="lazy" 
                     onerror="this.onerror=null; this.src='${soul.photoFallback || soul.photo}';">
                <div class="bk-portrait-warm-tint"></div>
              </div>
              <span class="bk-lifespan-pill">${soul.years}</span>
            </div>

            <div class="bk-founder-details-wrap">
              <div class="bk-role-badge">${soul.role}</div>
              <h4 class="bk-soul-name">${soul.name}</h4>
              <div class="bk-loukik-name">ലൗകിക നാമം: <strong>${soul.loukikName}</strong></div>
              <p class="bk-soul-summary">${soul.summary}</p>

              <div class="bk-virtues-chips-preview">
                ${(soul.virtues || []).slice(0, 3).map(v => `<span class="bk-chip-virtue">✨ ${v}</span>`).join('')}
              </div>

              <div class="bk-card-action-bar">
                <button type="button" class="bk-ratan-cta-btn" onclick="event.stopPropagation(); window.navigateToAdiRatna('${soul.slug}')">
                  <span>കൂടുതൽ അറിയാൻ / ജീവിതരേഖ വായിക്കുക</span>
                  <span class="bk-cta-arrow">→</span>
                </button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    // SECTION 2: ADI RATNAS (21 FOUNDING JEWELS)
    html += `
      <div class="bk-adi-ratnas-category-header">
        <span class="bk-category-kicker">💎 ആദി രത്നങ്ങൾ · 21 Founding Jewels</span>
        <h3 class="bk-category-title">തപസ്യയുടെയും ത്യാഗത്തിന്റെയും അനശ്വര സ്തംഭങ്ങൾ</h3>
        <p class="bk-category-desc">
          "വൃക്ഷത്തിന്റെ വേരുകൾ എത്ര ആഴത്തിൽ പോകുന്നുവോ, അത്രയും ശക്തമായിരിക്കും ആ വൃക്ഷം. അതുപോലെ ഈ ദിവ്യ ആത്മാക്കളുടെ തപസ്യയും ത്യാഗവുമാണ് ഈ പ്രസ്ഥാനത്തിന്റെ കരുത്ത്."
        </p>
      </div>

      <div class="bk-adi-ratnas-cards-grid">
        ${adiRatnas.map((soul, idx) => `
          <article class="bk-ratan-card-modern" 
                   data-slug="${soul.slug}" 
                   style="--card-index: ${idx + 2};"
                   onclick="window.navigateToAdiRatna('${soul.slug}')" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${soul.name}">
            <div class="bk-card-ambient-aura"></div>
            
            <div class="bk-ratan-top-meta">
              <span class="bk-soul-role-pill">${soul.role}</span>
              <span class="bk-years-badge">${soul.years}</span>
            </div>

            <div class="bk-ratan-avatar-center">
              <div class="bk-avatar-glowing-ring">
                <img src="${soul.photo}" 
                     alt="${soul.name}" 
                     class="bk-avatar-portrait" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${soul.photoFallback || soul.photo}';">
                <div class="bk-portrait-warm-tint"></div>
              </div>
            </div>

            <div class="bk-ratan-card-body">
              <h4 class="bk-ratan-title">${soul.name}</h4>
              <div class="bk-ratan-loukik">ലൗകിക നാമം: <strong>${soul.loukikName}</strong></div>
              <p class="bk-ratan-snippet">${soul.summary}</p>
            </div>

            <div class="bk-ratan-card-footer">
              <button type="button" class="bk-ratan-cta-btn" onclick="event.stopPropagation(); window.navigateToAdiRatna('${soul.slug}')">
                <span>കൂടുതൽ അറിയാൻ / ജീവിതരേഖ വായിക്കുക</span>
                <span class="bk-cta-arrow">→</span>
              </button>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;

    // Observe newly rendered cards for staggered scroll animation
    if (observer) {
      container.querySelectorAll('.bk-ratan-card-modern').forEach((card) => {
        observer.observe(card);
      });
    } else {
      container.querySelectorAll('.bk-ratan-card-modern').forEach((card) => {
        card.classList.add('is-visible');
      });
    }
  }

  /**
   * Navigate to a Dedicated Individual Profile Route: /adi-ratna/[slug]
   */
  function navigateToAdiRatna(slug, updateHistory = true) {
    if (!window.BK_JEWELS_DATA || !window.BK_JEWELS_DATA.length) return;

    const soul = window.BK_JEWELS_DATA.find(j => j.slug === slug || j.id === slug);
    if (!soul) {
      console.warn('Adi Ratna not found for slug:', slug);
      navigateBackToGrid(false);
      return;
    }

    currentSlug = soul.slug;

    // If we're on another tab, switch to 'about' first
    if (window.bkApp && window.bkApp.currentTab !== 'about') {
      window.bkApp.switchTab('about', 'founder');
    }

    // Update browser URL to /adi-ratna/[slug]
    if (updateHistory) {
      const newPath = `/adi-ratna/${soul.slug}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ slug: soul.slug, type: 'adi-ratna-detail' }, soul.name, newPath);
      }
    }

    // Update document title for SEO & bookmarking
    document.title = `${soul.name} (${soul.role}) | ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്`;

    // Render the detail view
    renderAdiRatnaDetailView(soul);

    // Toggle view containers
    const gridView = document.getElementById('adiRatnaGridSection');
    const detailView = document.getElementById('adiRatnaDetailSection');

    if (gridView) gridView.style.display = 'none';
    if (detailView) {
      detailView.style.display = 'block';
      const headerOffset = 90;
      const elementPosition = detailView.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition > 0 ? offsetPosition : 0,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Render the Dedicated Individual Detail View
   */
  function renderAdiRatnaDetailView(soul) {
    const detailView = document.getElementById('adiRatnaDetailSection');
    if (!detailView) return;

    const currentIndex = window.BK_JEWELS_DATA.findIndex(j => j.slug === soul.slug);
    const totalCount = window.BK_JEWELS_DATA.length;
    const prevSoul = window.BK_JEWELS_DATA[(currentIndex - 1 + totalCount) % totalCount];
    const nextSoul = window.BK_JEWELS_DATA[(currentIndex + 1) % totalCount];

    // Split bio into Malayalam paragraphs
    const bioParagraphs = (soul.bio || '')
      .split('\n\n')
      .filter(p => p.trim().length > 0)
      .map(p => `<p class="bk-detail-paragraph">${p.trim()}</p>`)
      .join('');

    detailView.innerHTML = `
      <div class="bk-detail-view-container">
        
        <!-- Breadcrumbs & Back Navigation Header -->
        <nav class="bk-detail-top-nav" aria-label="Breadcrumb">
          <button type="button" class="bk-back-to-grid-btn" onclick="window.navigateBackToGrid()">
            <span class="bk-back-arrow">←</span>
            <span>തിരികെ പേജിലേക്ക് (ആദിരത്നങ്ങൾ)</span>
          </button>
          
          <div class="bk-detail-breadcrumbs">
            <a href="/#about" onclick="event.preventDefault(); window.navigateBackToGrid();">ആദിരത്നങ്ങൾ</a>
            <span class="bk-bc-sep">/</span>
            <span class="bk-bc-current">${soul.name}</span>
          </div>
        </nav>

        <!-- HERO SECTION -->
        <header class="bk-detail-hero-section">
          <div class="bk-hero-ambient-glow"></div>

          <div class="bk-hero-grid">
            <!-- Left: Enhanced Portrait in Glowing Frame -->
            <div class="bk-hero-visual-col">
              <div class="bk-hero-portrait-frame">
                <div class="bk-hero-spiritual-aura"></div>
                <img src="${soul.photo}" 
                     alt="${soul.name}" 
                     class="bk-hero-portrait-img"
                     onerror="this.onerror=null; this.src='${soul.photoFallback || soul.photo}';">
                <div class="bk-portrait-warm-tint"></div>
              </div>

              <div class="bk-hero-badges-row">
                <span class="bk-hero-badge-years">📅 ${soul.years}</span>
                <span class="bk-hero-badge-status">${soul.category === 'founder' ? '👑 ദിവ്യ സ്ഥാപകർ' : '💎 ആദി രത്നം'}</span>
              </div>
            </div>

            <!-- Right: Identity, Loukik Name, Role, Quote -->
            <div class="bk-hero-content-col">
              <span class="bk-hero-kicker">ആത്മീയ ജീവചരിത്രം · Authentic Spiritual Profile</span>
              <h1 class="bk-hero-soul-name">${soul.name}</h1>
              
              <div class="bk-hero-role-badge">${soul.role}</div>

              <div class="bk-hero-loukik-box">
                <span class="bk-loukik-label">ലൗകിക നാമം:</span>
                <span class="bk-loukik-val">${soul.loukikName}</span>
              </div>

              ${soul.quote ? `
                <div class="bk-hero-quote-card">
                  <div class="bk-quote-icon">“</div>
                  <blockquote class="bk-hero-quote-text">${soul.quote}</blockquote>
                </div>
              ` : ''}

              <!-- Key Virtues Chips -->
              <div class="bk-hero-virtues-section">
                <h4 class="bk-virtues-heading">ആത്മീയ ഗുണങ്ങൾ (Key Virtues)</h4>
                <div class="bk-virtues-chips-list">
                  ${(soul.virtues || []).map(v => `
                    <span class="bk-virtue-chip">
                      <span class="bk-virtue-sparkle">✨</span>
                      <span>${v}</span>
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- COMPREHENSIVE BIOGRAPHY SECTION -->
        <section class="bk-detail-bio-section">
          <div class="bk-section-header-modern">
            <span class="bk-sec-kicker">ചരിത്രരേഖ · Detailed Biography</span>
            <h2 class="bk-sec-title">തപസ്യയും ജീവിതരേഖയും</h2>
            <div class="bk-sec-divider"></div>
          </div>

          <div class="bk-bio-content-body">
            ${bioParagraphs}
          </div>
        </section>

        <!-- VERIFIED VIDEO SECTION: STRICTLY RENDERED ONLY IF VIDEO_URL IS NOT NULL -->
        ${(soul.videoUrl || soul.videoEmbedUrl) ? `
        <section class="bk-detail-video-section">
          <div class="bk-section-header-modern">
            <span class="bk-sec-kicker">ദൃശ്യാവിഷ്കാരം · Official Documentary</span>
            <h2 class="bk-sec-title">ഔദ്യോഗിക ഡോക്യുമെന്ററി & ആത്മീയ സന്ദേശം</h2>
            <div class="bk-sec-divider"></div>
          </div>

          <div class="bk-video-player-card">
            <div class="bk-video-header-info">
              <div class="bk-video-title-wrap">
                <span class="bk-yt-badge">▶ YouTube</span>
                <h3 class="bk-video-main-title">${soul.videoTitle || 'ഔദ്യോഗിക ഡോക്യുമെന്ററി'}</h3>
              </div>
              <span class="bk-video-source-pill">ബ്രഹ്മാകുമാരീസ് ഔദ്യോഗിക ചാനൽ</span>
            </div>

            <div class="bk-video-responsive-wrap">
              <iframe src="${(soul.videoUrl || soul.videoEmbedUrl)}?rel=0&modestbranding=1" 
                      title="${soul.videoTitle || soul.name}"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowfullscreen 
                      loading="lazy" 
                      class="bk-video-iframe">
              </iframe>
            </div>
          </div>
        </section>
        ` : ''}

        <!-- PREV / NEXT SOUL SWITCHER BAR -->
        <footer class="bk-detail-footer-bar">
          <button type="button" class="bk-nav-sibling-btn prev" onclick="window.navigateToAdiRatna('${prevSoul.slug}')">
            <span class="bk-sibling-direction">← മുൻപത്തെ ആദിരത്നം</span>
            <span class="bk-sibling-name">${prevSoul.name}</span>
          </button>

          <button type="button" class="bk-back-to-grid-btn center" onclick="window.navigateBackToGrid()">
            <span>തിരികെ ആദിരത്നങ്ങളിലേക്ക് (Back to Grid)</span>
          </button>

          <button type="button" class="bk-nav-sibling-btn next" onclick="window.navigateToAdiRatna('${nextSoul.slug}')">
            <span class="bk-sibling-direction">അടുത്ത ആദിരത്നം →</span>
            <span class="bk-sibling-name">${nextSoul.name}</span>
          </button>
        </footer>

        <!-- QUICK THUMBNAIL SWITCHER -->
        <div class="bk-quick-switcher-wrap">
          <h4 class="bk-quick-switcher-title">മറ്റു ദിവ്യ വ്യക്തിത്വങ്ങൾ (Quick Navigation)</h4>
          <div class="bk-quick-switcher-scroll">
            ${window.BK_JEWELS_DATA.map((j) => `
              <button type="button" 
                      class="bk-quick-thumb-btn ${j.slug === soul.slug ? 'active' : ''}" 
                      onclick="window.navigateToAdiRatna('${j.slug}')" 
                      title="${j.name}">
                <img src="${j.photo}" alt="${j.name}" loading="lazy" onerror="this.onerror=null; this.src='${j.photoFallback || j.photo}';">
                <span class="bk-quick-thumb-name">${j.name.split(' ')[0]} ${j.name.split(' ')[1] || ''}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Scroll active thumbnail into center of strip
    setTimeout(() => {
      const activeThumb = detailView.querySelector('.bk-quick-thumb-btn.active');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);
  }

  /**
   * Navigate back to the Grid View
   */
  function navigateBackToGrid(updateHistory = true) {
    currentSlug = null;

    // Stop video playback by clearing iframe src
    const iframe = document.querySelector('.bk-video-iframe');
    if (iframe) iframe.src = '';

    const gridView = document.getElementById('adiRatnaGridSection');
    const detailView = document.getElementById('adiRatnaDetailSection');

    if (detailView) detailView.style.display = 'none';
    if (gridView) {
      gridView.style.display = 'block';
      const headerOffset = 90;
      const elementPosition = gridView.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition > 0 ? offsetPosition : 0,
        behavior: 'smooth'
      });
    }

    if (updateHistory) {
      if (window.location.pathname.startsWith('/adi-ratna/')) {
        window.history.pushState(null, 'ആദി രത്നങ്ങൾ | ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്', '/adi-ratna');
      }
    }

    document.title = 'ആദി രത്നങ്ങൾ | ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്';
  }

  /**
   * Check URL on load or popstate
   */
  function handleUrlRouting() {
    const pathname = window.location.pathname || '';
    const hash = window.location.hash || '';

    // Route: /adi-ratna/[slug]
    const pathMatch = pathname.match(/^\/adi-ratna\/([a-z0-9-]+)/i);
    if (pathMatch && pathMatch[1]) {
      const slug = pathMatch[1];
      navigateToAdiRatna(slug, false);
      return;
    }

    // Route: /adi-ratna
    if (pathname === '/adi-ratna' || pathname === '/adi-ratna/') {
      if (window.bkApp) window.bkApp.switchTab('about', 'founder');
      navigateBackToGrid(false);
      return;
    }

    // Hash Route: #adi-ratna/[slug] or #adi-ratna-[slug] or #jewel-[slug]
    const hashMatch = hash.match(/^#(?:adi-ratna\/|adi-ratna-|jewel-)([a-z0-9-]+)/i);
    if (hashMatch && hashMatch[1]) {
      const slug = hashMatch[1];
      navigateToAdiRatna(slug, false);
      return;
    }

    // Query Param: ?slug=... or ?jewel=...
    const urlParams = new URLSearchParams(window.location.search);
    const paramSlug = urlParams.get('slug') || urlParams.get('jewel') || urlParams.get('adi-ratna');
    if (paramSlug) {
      navigateToAdiRatna(paramSlug, false);
    }
  }

  // Window event listeners
  window.addEventListener('popstate', handleUrlRouting);
  window.addEventListener('hashchange', handleUrlRouting);

  // Expose global methods
  window.renderAdiRatnaGrid = renderAdiRatnaGrid;
  window.navigateToAdiRatna = navigateToAdiRatna;
  window.navigateBackToGrid = navigateBackToGrid;
  window.openJewelProfile = function(slug) {
    // Legacy bridge
    navigateToAdiRatna(slug, true);
  };

  // Auto-init when DOM is ready
  function init() {
    initScrollObserver();
    renderAdiRatnaGrid();
    handleUrlRouting();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }

})();
