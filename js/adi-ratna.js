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
   * Helper to fetch localized field from soul data
   */
  function getSoulField(soul, field) {
    const lang = (window.bkGetLanguage && window.bkGetLanguage()) || 'ml';
    if (lang === 'en') {
      if (field === 'name') return soul.nameEn || soul.name;
      if (field === 'loukikName') return soul.loukikNameEn || soul.loukikName;
      if (field === 'role') return soul.roleEn || soul.role;
      if (field === 'years') return soul.yearsEn || soul.years;
      if (field === 'bio') return soul.bioEn || soul.bio;
      if (field === 'virtues') return soul.virtuesEn || soul.virtues;
      if (field === 'quote') return soul.quoteEn || soul.quote;
      if (field === 'summary') return soul.summaryEn || soul.summary;
    }
    return soul[field];
  }

  /**
   * Render the Main Grid Page (Founders + 21 Adi Ratnas)
   */
  function renderAdiRatnaGrid() {
    const container = document.getElementById('adiRatnaDynamicGridContainer');
    if (!container || !window.BK_JEWELS_DATA) return;

    const lang = (window.bkGetLanguage && window.bkGetLanguage()) || 'ml';
    const founders = window.BK_JEWELS_DATA.filter(j => j.category === 'founder');
    const adiRatnas = window.BK_JEWELS_DATA.filter(j => j.category === 'adi-ratna');

    let html = '';

    // SECTION 1: SUPREME INSTRUMENTS (FOUNDERS)
    html += `
      <div class="bk-founders-category-header">
        <span class="bk-category-kicker">${lang === 'en' ? '👑 Divine Founders · Supreme Instruments' : '👑 ദിവ്യ സ്ഥാപകർ · Supreme Instruments'}</span>
        <h3 class="bk-category-title">${lang === 'en' ? 'Prajapita Brahma Baba & Mateshwari Saraswati Mamma' : 'പിതാശ്രീ ബ്രഹ്മാ ബാബ & മാതേശ്വരി സരസ്വതി മമ്മ'}</h3>
        <p class="bk-category-desc">
          ${lang === 'en' 
            ? 'The pure spiritual instruments through whom Incorporeal God Shiva revealed divine wisdom and established the spiritual foundation for world renewal.' 
            : 'പരമാത്മാവായ ശിവന്റെ ദിവ്യ സന്ദേശം ഈ ഭൂമിയിൽ ആദ്യമായി പകർന്നുനൽകിയ പരമ പവിത്ര ആത്മാക്കൾ.'}
        </p>
      </div>

      <div class="bk-founders-luxury-grid">
        ${founders.map((soul, idx) => {
          const sName = getSoulField(soul, 'name');
          const sRole = getSoulField(soul, 'role');
          const sYears = getSoulField(soul, 'years');
          const sLoukik = getSoulField(soul, 'loukikName');
          const sSummary = getSoulField(soul, 'summary');
          const sVirtues = getSoulField(soul, 'virtues') || [];

          return `
          <article class="bk-founder-luxury-card bk-ratan-card-modern" 
                   data-slug="${soul.slug}" 
                   style="--card-index: ${idx};"
                   onclick="window.navigateToAdiRatna('${soul.slug}')" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${sName}">
            <div class="bk-card-ambient-aura"></div>
            <div class="bk-founder-media-wrap">
              <div class="bk-portrait-halo-frame">
                <img src="${soul.photo}" 
                     alt="${sName}" 
                     class="bk-portrait-img" 
                     loading="lazy" 
                     onerror="this.onerror=null; this.src='${soul.photoFallback || soul.photo}';">
                <div class="bk-portrait-warm-tint"></div>
              </div>
              <span class="bk-lifespan-pill">${sYears}</span>
            </div>

            <div class="bk-founder-details-wrap">
              <div class="bk-role-badge">${sRole}</div>
              <h4 class="bk-soul-name">${sName}</h4>
              <div class="bk-loukik-name">${lang === 'en' ? 'Worldly Name:' : 'ലൗകിക നാമം:'} <strong>${sLoukik}</strong></div>
              <p class="bk-soul-summary">${sSummary}</p>

              <div class="bk-virtues-chips-preview">
                ${sVirtues.slice(0, 3).map(v => `<span class="bk-chip-virtue">✨ ${v}</span>`).join('')}
              </div>

              <div class="bk-card-action-bar">
                <button type="button" class="bk-ratan-cta-btn" onclick="event.stopPropagation(); window.navigateToAdiRatna('${soul.slug}')">
                  <span>${lang === 'en' ? 'Read Full Biography' : 'കൂടുതൽ അറിയാൻ / ജീവിതരേഖ വായിക്കുക'}</span>
                  <span class="bk-cta-arrow">→</span>
                </button>
              </div>
            </div>
          </article>
        `;
        }).join('')}
      </div>
    `;

    // SECTION 2: ADI RATNAS (21 FOUNDING JEWELS)
    html += `
      <div class="bk-adi-ratnas-category-header">
        <span class="bk-category-kicker">${lang === 'en' ? '💎 Adi Ratnas · 21 Founding Jewels' : '💎 ആദി രത്നങ്ങൾ · 21 Founding Jewels'}</span>
        <h3 class="bk-category-title">${lang === 'en' ? 'Immortal Pillars of Tapasya and Renunciation' : 'തപസ്യയുടെയും ത്യാഗത്തിന്റെയും അനശ്വര സ്തംഭങ്ങൾ'}</h3>
        <p class="bk-category-desc">
          ${lang === 'en'
            ? '"The deeper the roots of a sacred tree penetrate, the mightier it stands. Likewise, the intense tapasya, purity, and sacrifice of these divine souls form the eternal strength of this movement."'
            : '"വൃക്ഷത്തിന്റെ വേരുകൾ എത്ര ആഴത്തിൽ പോകുന്നുവോ, അത്രയും ശക്തമായിരിക്കും ആ വൃക്ഷം. അതുപോലെ ഈ ദിവ്യ ആത്മാക്കളുടെ തപസ്യയും ത്യാഗവുമാണ് ഈ പ്രസ്ഥാനത്തിന്റെ കരുത്ത്."'}
        </p>
      </div>

      <div class="bk-adi-ratnas-cards-grid">
        ${adiRatnas.map((soul, idx) => {
          const sName = getSoulField(soul, 'name');
          const sRole = getSoulField(soul, 'role');
          const sYears = getSoulField(soul, 'years');
          const sLoukik = getSoulField(soul, 'loukikName');
          const sSummary = getSoulField(soul, 'summary');

          return `
          <article class="bk-ratan-card-modern" 
                   data-slug="${soul.slug}" 
                   style="--card-index: ${idx + 2};"
                   onclick="window.navigateToAdiRatna('${soul.slug}')" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${sName}">
            <div class="bk-card-ambient-aura"></div>
            
            <div class="bk-ratan-top-meta">
              <span class="bk-soul-role-pill">${sRole}</span>
              <span class="bk-years-badge">${sYears}</span>
            </div>

            <div class="bk-ratan-avatar-center">
              <div class="bk-avatar-glowing-ring">
                <img src="${soul.photo}" 
                     alt="${sName}" 
                     class="bk-avatar-portrait" 
                     loading="lazy" 
                     onerror="this.onerror=null; this.src='${soul.photoFallback || soul.photo}';">
                <div class="bk-portrait-warm-tint"></div>
              </div>
            </div>

            <div class="bk-ratan-card-body">
              <h4 class="bk-ratan-title">${sName}</h4>
              <div class="bk-ratan-loukik">${lang === 'en' ? 'Worldly Name:' : 'ലൗകിക നാമം:'} <strong>${sLoukik}</strong></div>
              <p class="bk-ratan-snippet">${sSummary}</p>
            </div>

            <div class="bk-ratan-card-footer">
              <button type="button" class="bk-ratan-cta-btn" onclick="event.stopPropagation(); window.navigateToAdiRatna('${soul.slug}')">
                <span>${lang === 'en' ? 'Read Full Biography' : 'കൂടുതൽ അറിയാൻ / ജീവിതരേഖ വായിക്കുക'}</span>
                <span class="bk-cta-arrow">→</span>
              </button>
            </div>
          </article>
        `;
        }).join('')}
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

    const lang = (window.bkGetLanguage && window.bkGetLanguage()) || 'ml';
    const sName = getSoulField(soul, 'name');
    const sRole = getSoulField(soul, 'role');

    // Update browser URL to /adi-ratna/[slug]
    if (updateHistory) {
      const newPath = `/adi-ratna/${soul.slug}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ slug: soul.slug, type: 'adi-ratna-detail' }, sName, newPath);
      }
    }

    // Update document title for SEO & bookmarking
    document.title = lang === 'en'
      ? `${sName} (${sRole}) | Brahma Kumaris Kozhikode`
      : `${sName} (${sRole}) | ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്`;

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

    const lang = (window.bkGetLanguage && window.bkGetLanguage()) || 'ml';
    const sName = getSoulField(soul, 'name');
    const sRole = getSoulField(soul, 'role');
    const sYears = getSoulField(soul, 'years');
    const sLoukik = getSoulField(soul, 'loukikName');
    const sBio = getSoulField(soul, 'bio');
    const sVirtues = getSoulField(soul, 'virtues') || [];
    const sQuote = getSoulField(soul, 'quote');

    const currentIndex = window.BK_JEWELS_DATA.findIndex(j => j.slug === soul.slug);
    const totalCount = window.BK_JEWELS_DATA.length;
    const prevSoul = window.BK_JEWELS_DATA[(currentIndex - 1 + totalCount) % totalCount];
    const nextSoul = window.BK_JEWELS_DATA[(currentIndex + 1) % totalCount];

    // Parse bio into styled subheadings and paragraphs
    const bioParagraphs = (sBio || '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        if (line.startsWith('#### ')) {
          return `<h4 class="bk-bio-subheading"><span class="bk-subheading-icon">✦</span> ${line.replace(/^####\s+/, '')}</h4>`;
        }
        if (line.startsWith('### ')) {
          return `<h3 class="bk-bio-subheading"><span class="bk-subheading-icon">✦</span> ${line.replace(/^###\s+/, '')}</h3>`;
        }
        return `<p class="bk-detail-paragraph">${line}</p>`;
      })
      .join('');

    detailView.innerHTML = `
      <div class="bk-detail-view-container">
        
        <!-- Breadcrumbs & Back Navigation Header -->
        <nav class="bk-detail-top-nav" aria-label="Breadcrumb">
          <button type="button" class="bk-back-to-grid-btn" onclick="window.navigateBackToGrid()">
            <span class="bk-back-arrow">←</span>
            <span>${lang === 'en' ? 'Back to All Adi Ratnas' : 'തിരികെ പേജിലേക്ക് (ആദിരത്നങ്ങൾ)'}</span>
          </button>
          
          <div class="bk-detail-breadcrumbs">
            <a href="/#about" onclick="event.preventDefault(); window.navigateBackToGrid();">${lang === 'en' ? 'Adi Ratnas' : 'ആദിരത്നങ്ങൾ'}</a>
            <span class="bk-bc-sep">/</span>
            <span class="bk-bc-current">${sName}</span>
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
                     alt="${sName}" 
                     class="bk-hero-portrait-img"
                     onerror="this.onerror=null; this.src='${soul.photoFallback || soul.photo}';">
                <div class="bk-portrait-warm-tint"></div>
              </div>

              <div class="bk-hero-badges-row">
                <span class="bk-hero-badge-years">📅 ${sYears}</span>
                <span class="bk-hero-badge-status">${soul.category === 'founder' 
                  ? (lang === 'en' ? '👑 Divine Founder' : '👑 ദിവ്യ സ്ഥാപകർ') 
                  : (lang === 'en' ? '💎 Adi Ratna' : '💎 ആദി രത്നം')}</span>
              </div>
            </div>

            <!-- Right: Identity, Loukik Name, Role, Quote -->
            <div class="bk-hero-content-col">
              <span class="bk-hero-kicker">${lang === 'en' ? 'Spiritual Biography · Authentic Profile' : 'ആത്മീയ ജീവചരിത്രം · Authentic Spiritual Profile'}</span>
              <h1 class="bk-hero-soul-name">${sName}</h1>
              
              <div class="bk-hero-role-badge">${sRole}</div>

              <div class="bk-hero-loukik-box">
                <span class="bk-loukik-label">${lang === 'en' ? 'Worldly Name:' : 'ലൗകിക നാമം:'}</span>
                <span class="bk-loukik-val">${sLoukik}</span>
              </div>

              ${sQuote ? `
                <div class="bk-hero-quote-card">
                  <div class="bk-quote-icon">“</div>
                  <blockquote class="bk-hero-quote-text">${sQuote}</blockquote>
                </div>
              ` : ''}

              <!-- Key Virtues Chips -->
              <div class="bk-hero-virtues-section">
                <h4 class="bk-virtues-heading">${lang === 'en' ? 'Spiritual Virtues & Powers' : 'ആത്മീയ ഗുണങ്ങൾ (Key Virtues)'}</h4>
                <div class="bk-virtues-chips-list">
                  ${sVirtues.map(v => `
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
            <span class="bk-sec-kicker">${lang === 'en' ? 'Historical Chronicle · Life Tapasya' : 'ചരിത്രരേഖ · Detailed Biography'}</span>
            <h2 class="bk-sec-title">${lang === 'en' ? 'Life Journey & Sacred Tapasya' : 'തപസ്യയും ജീവിതരേഖയും'}</h2>
            <div class="bk-sec-divider"></div>
          </div>

          <div class="bk-bio-content-body">
            ${bioParagraphs}
          </div>
        </section>

        <!-- PHOTO GALLERY SECTION: DIVYA SMARANAKAL -->
        ${(() => {
          const gallery = (soul.gallery && soul.gallery.length > 0) ? soul.gallery : (soul.galleryImages || []);
          if (!gallery || gallery.length <= 1) return '';
          return `
        <section class="bk-detail-gallery-section">
          <div class="bk-section-header-modern">
            <span class="bk-sec-kicker">${lang === 'en' ? 'Visual Archive · Divine Memories' : 'ചിത്രശേഖരം · Visual Memories'}</span>
            <h2 class="bk-sec-title">${lang === 'en' ? 'Photo Gallery – Sacred Memories' : 'ഫോട്ടോ ഗാലറി - ദിവ്യ സ്മരണകൾ'}</h2>
            <div class="bk-sec-divider"></div>
            <p class="bk-sec-subtitle">${lang === 'en' ? 'Sacred and colourful moments from a sublime spiritual life' : 'ആത്മീയ ജീവിതത്തിലെ അപൂർവ്വവും പവിത്രവുമായ നിറമുള്ള മുഹൂർത്തങ്ങൾ'}</p>
          </div>

          <div class="bk-gallery-modern-grid">
            ${gallery.map((img) => {
              const imgTitle = (lang === 'en' && img.titleEn) ? img.titleEn : (img.title || '');
              const imgCaption = (lang === 'en' && img.captionEn) ? img.captionEn : (img.caption || '');

              return `
              <figure class="bk-gallery-item-card" 
                      tabindex="0" 
                      role="button" 
                      aria-label="${imgTitle || 'Photo'}"
                      onclick="window.openAdiRatnaLightbox('${img.src}', '${imgTitle.replace(/'/g, "\\'")}', '${imgCaption.replace(/'/g, "\\'")}', '${img.fallback || img.src}')"
                      onkeydown="if(event.key==='Enter'||event.key===' ') window.openAdiRatnaLightbox('${img.src}', '${imgTitle.replace(/'/g, "\\'")}', '${imgCaption.replace(/'/g, "\\'")}', '${img.fallback || img.src}')">
                <div class="bk-gallery-media-box">
                  <img src="${img.src}" 
                       alt="${imgTitle || sName}" 
                       class="bk-gallery-thumb-img" 
                       ${img.position ? `style="object-position: ${img.position};"` : ''}
                       onerror="this.onerror=null; this.src='${img.fallback || img.src}';">
                  <div class="bk-gallery-overlay-gradient"></div>
                  <div class="bk-gallery-zoom-badge">
                    <span class="bk-zoom-icon">🔍</span>
                    <span class="bk-zoom-text">${lang === 'en' ? 'View Full Size' : 'വലുതാക്കി കാണുക'}</span>
                  </div>
                </div>
                <figcaption class="bk-gallery-caption-box">
                  <h5 class="bk-gallery-photo-title">${imgTitle}</h5>
                  ${imgCaption ? `<p class="bk-gallery-photo-desc">${imgCaption}</p>` : ''}
                </figcaption>
              </figure>
            `;
            }).join('')}
          </div>
        </section>
        `;
        })()}

        <!-- VERIFIED VIDEO SECTION: STRICTLY RENDERED ONLY IF VIDEO_URL IS NOT NULL -->
        ${(soul.videoUrl || soul.videoEmbedUrl) ? `
        <section class="bk-detail-video-section">
          <div class="bk-section-header-modern">
            <span class="bk-sec-kicker">${lang === 'en' ? 'Documentary & Message' : 'ദൃശ്യാവിഷ്കാരം · Official Documentary'}</span>
            <h2 class="bk-sec-title">${lang === 'en' ? 'Official Documentary & Spiritual Message' : 'ഔദ്യോഗിക ഡോക്യുമെന്ററി & ആത്മീയ സന്ദേശം'}</h2>
            <div class="bk-sec-divider"></div>
          </div>

          <div class="bk-video-player-card">
            <div class="bk-video-header-info">
              <div class="bk-video-title-wrap">
                <span class="bk-yt-badge">▶ YouTube</span>
                <h3 class="bk-video-main-title">${lang === 'en' && soul.videoTitleEn ? soul.videoTitleEn : (soul.videoTitle || (lang === 'en' ? 'Official Documentary' : 'ഔദ്യോഗിക ഡോക്യുമെന്ററി'))}</h3>
              </div>
              <span class="bk-video-source-pill">${lang === 'en' ? 'Brahma Kumaris Official Channel' : 'ബ്രഹ്മാകുമാരീസ് ഔദ്യോഗിക ചാനൽ'}</span>
            </div>

            <div class="bk-video-responsive-wrap">
              <iframe src="${(soul.videoUrl || soul.videoEmbedUrl)}?rel=0&modestbranding=1" 
                      title="${lang === 'en' && soul.videoTitleEn ? soul.videoTitleEn : (soul.videoTitle || sName)}"
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
            <span class="bk-sibling-direction">${lang === 'en' ? '← Previous Jewel' : '← മുൻപത്തെ ആദിരത്നം'}</span>
            <span class="bk-sibling-name">${getSoulField(prevSoul, 'name')}</span>
          </button>

          <button type="button" class="bk-back-to-grid-btn center" onclick="window.navigateBackToGrid()">
            <span>${lang === 'en' ? 'Back to All Adi Ratnas' : 'തിരികെ ആദിരത്നങ്ങളിലേക്ക് (Back to Grid)'}</span>
          </button>

          <button type="button" class="bk-nav-sibling-btn next" onclick="window.navigateToAdiRatna('${nextSoul.slug}')">
            <span class="bk-sibling-direction">${lang === 'en' ? 'Next Jewel →' : 'അടുത്ത ആദിരത്നം →'}</span>
            <span class="bk-sibling-name">${getSoulField(nextSoul, 'name')}</span>
          </button>
        </footer>

        <!-- QUICK THUMBNAIL SWITCHER -->
        <div class="bk-quick-switcher-wrap">
          <h4 class="bk-quick-switcher-title">${lang === 'en' ? 'Other Divine Personalities (Quick Navigation)' : 'മറ്റു ദിവ്യ വ്യക്തിത്വങ്ങൾ (Quick Navigation)'}</h4>
          <div class="bk-quick-switcher-scroll">
            ${window.BK_JEWELS_DATA.map((j) => {
              const jName = getSoulField(j, 'name');
              const parts = jName.split(' ');
              return `
              <button type="button" 
                      class="bk-quick-thumb-btn ${j.slug === soul.slug ? 'active' : ''}" 
                      onclick="window.navigateToAdiRatna('${j.slug}')" 
                      title="${jName}">
                <img src="${j.photo}" alt="${jName}" loading="lazy" onerror="this.onerror=null; this.src='${j.photoFallback || j.photo}';">
                <span class="bk-quick-thumb-name">${parts[0]} ${parts[1] || ''}</span>
              </button>
            `;
            }).join('')}
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

    const lang = (window.bkGetLanguage && window.bkGetLanguage()) || 'ml';
    const gridTitle = lang === 'en'
      ? 'Adi Ratnas (Jewels) | Brahma Kumaris Kozhikode'
      : 'ആദി രത്നങ്ങൾ | ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്';

    if (updateHistory) {
      if (window.location.pathname.startsWith('/adi-ratna/')) {
        window.history.pushState(null, gridTitle, '/adi-ratna');
      }
    }

    document.title = gridTitle;
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
  window.addEventListener('bk_language_changed', () => {
    if (currentSlug && window.BK_JEWELS_DATA) {
      const soul = window.BK_JEWELS_DATA.find(j => j.slug === currentSlug || j.id === currentSlug);
      if (soul) {
        const lang = (window.bkGetLanguage && window.bkGetLanguage()) || 'ml';
        const sName = getSoulField(soul, 'name');
        const sRole = getSoulField(soul, 'role');
        document.title = lang === 'en'
          ? `${sName} (${sRole}) | Brahma Kumaris Kozhikode`
          : `${sName} (${sRole}) | ബ്രഹ്മാകുമാരീസ് കോഴിക്കോട്`;
        renderAdiRatnaDetailView(soul);
      }
    } else {
      renderAdiRatnaGrid();
    }
  });

  /**
   * Open Lightbox Modal for Photo Gallery
   */
  function openAdiRatnaLightbox(src, title, caption, fallback) {
    let overlay = document.getElementById('bkAdiLightboxModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bkAdiLightboxModal';
      overlay.className = 'bk-adi-lightbox-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Photo Lightbox');
      overlay.innerHTML = `
        <div class="bk-adi-lightbox-container" onclick="event.stopPropagation()">
          <button type="button" class="bk-adi-lightbox-close-btn" onclick="window.closeAdiRatnaLightbox()" aria-label="Close Lightbox">✕</button>
          <div class="bk-adi-lightbox-img-wrap">
            <img id="bkAdiLightboxImg" src="" alt="" class="bk-adi-lightbox-img">
          </div>
          <div class="bk-adi-lightbox-caption">
            <h4 id="bkAdiLightboxTitle" class="bk-adi-lightbox-title"></h4>
            <p id="bkAdiLightboxText" class="bk-adi-lightbox-text"></p>
          </div>
        </div>
      `;
      overlay.addEventListener('click', closeAdiRatnaLightbox);
      document.body.appendChild(overlay);
    }

    const imgEl = document.getElementById('bkAdiLightboxImg');
    const titleEl = document.getElementById('bkAdiLightboxTitle');
    const textEl = document.getElementById('bkAdiLightboxText');

    if (imgEl) {
      imgEl.onerror = function() {
        if (fallback && this.src !== fallback) {
          this.src = fallback;
        }
      };
      imgEl.src = src;
      imgEl.alt = title || 'ഫോട്ടോ';
    }
    if (titleEl) titleEl.textContent = title || '';
    if (textEl) textEl.textContent = caption || '';

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Trap Escape key
    const escHandler = function(e) {
      if (e.key === 'Escape') {
        closeAdiRatnaLightbox();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);
  }

  function closeAdiRatnaLightbox() {
    const overlay = document.getElementById('bkAdiLightboxModal');
    if (overlay) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  // Expose global methods
  window.renderAdiRatnaGrid = renderAdiRatnaGrid;
  window.navigateToAdiRatna = navigateToAdiRatna;
  window.navigateBackToGrid = navigateBackToGrid;
  window.openAdiRatnaLightbox = openAdiRatnaLightbox;
  window.closeAdiRatnaLightbox = closeAdiRatnaLightbox;
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
