/**
 * ==========================================================================
 * ADI RATAN & FOUNDER PROFILE MODAL CONTROLLER
 * Full Biography, Literary Malayalam Prose & Video Documentary Viewer
 * ==========================================================================
 */

(function() {
  let currentJewelIndex = 0;

  function openJewelProfile(jewelId) {
    if (!window.BK_JEWELS_DATA || !window.BK_JEWELS_DATA.length) {
      console.warn('BK_JEWELS_DATA not loaded yet');
      return;
    }
    const idx = window.BK_JEWELS_DATA.findIndex(j => j.id === jewelId);
    if (idx !== -1) {
      currentJewelIndex = idx;
      renderJewelModal();
      const modal = document.getElementById('bkJewelProfileModal');
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('bk-modal-open');
      }
    }
  }

  function closeJewelProfile() {
    const modal = document.getElementById('bkJewelProfileModal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('bk-modal-open');
      // Stop video playback by clearing iframe src
      const iframe = document.getElementById('bkModalVideoIframe');
      if (iframe) iframe.src = '';
    }
  }

  function prevJewelProfile() {
    if (!window.BK_JEWELS_DATA) return;
    currentJewelIndex = (currentJewelIndex - 1 + window.BK_JEWELS_DATA.length) % window.BK_JEWELS_DATA.length;
    renderJewelModal();
  }

  function nextJewelProfile() {
    if (!window.BK_JEWELS_DATA) return;
    currentJewelIndex = (currentJewelIndex + 1) % window.BK_JEWELS_DATA.length;
    renderJewelModal();
  }

  function renderJewelModal() {
    const jewel = window.BK_JEWELS_DATA[currentJewelIndex];
    if (!jewel) return;

    // Counter
    const counterEl = document.getElementById('bkModalCounter');
    if (counterEl) {
      counterEl.textContent = `${currentJewelIndex + 1} / ${window.BK_JEWELS_DATA.length}`;
    }

    // Photo & Meta
    const photoEl = document.getElementById('bkModalPhoto');
    if (photoEl) {
      photoEl.src = jewel.photo;
      photoEl.alt = `${jewel.nameEn} (${jewel.nameMl})`;
    }

    const lifespanEl = document.getElementById('bkModalLifespan');
    if (lifespanEl) lifespanEl.textContent = jewel.lifespan;

    const roleBadgeEl = document.getElementById('bkModalRoleBadge');
    if (roleBadgeEl) roleBadgeEl.textContent = jewel.titleEn;

    // Names & Titles
    const nameEnEl = document.getElementById('bkModalNameEn');
    if (nameEnEl) nameEnEl.textContent = jewel.nameEn;

    const nameMlEl = document.getElementById('bkModalNameMl');
    if (nameMlEl) nameMlEl.textContent = jewel.nameMl;

    const titleMlEl = document.getElementById('bkModalTitleMl');
    if (titleMlEl) titleMlEl.textContent = jewel.titleMl;

    const summaryEl = document.getElementById('bkModalSummaryMl');
    if (summaryEl) summaryEl.textContent = jewel.summaryMl;

    // Deep Literary Malayalam Biography Content
    const bioContentEl = document.getElementById('bkModalBioContent');
    if (bioContentEl) bioContentEl.innerHTML = jewel.bioMl;

    // Sacred Quote
    const quoteEl = document.getElementById('bkModalQuote');
    if (quoteEl) quoteEl.textContent = jewel.quoteMl;

    // Virtues Tags
    const virtuesEl = document.getElementById('bkModalVirtues');
    if (virtuesEl) {
      virtuesEl.innerHTML = (jewel.virtues || []).map(v => 
        `<span class="bk-virtue-tag">✨ ${v}</span>`
      ).join('');
    }

    // Embedded YouTube Documentary
    const videoWrap = document.getElementById('bkModalVideoWrap');
    const iframe = document.getElementById('bkModalVideoIframe');
    if (videoWrap && iframe) {
      if (jewel.videoId) {
        videoWrap.style.display = 'block';
        iframe.src = `https://www.youtube.com/embed/${jewel.videoId}?autoplay=0&rel=0`;
      } else {
        videoWrap.style.display = 'none';
        iframe.src = '';
      }
    }

    // Quick Thumbnail Strip
    renderJewelThumbnails();

    // Scroll container back to top on soul change
    const container = document.querySelector('.bk-jewel-modal-container');
    if (container) container.scrollTop = 0;
  }

  function renderJewelThumbnails() {
    const container = document.getElementById('bkJewelsThumbCarousel');
    if (!container || !window.BK_JEWELS_DATA) return;
    
    container.innerHTML = window.BK_JEWELS_DATA.map((j, idx) => `
      <button type="button" class="bk-thumb-btn ${idx === currentJewelIndex ? 'active' : ''}" 
              onclick="window.setJewelIndex(${idx})" 
              title="${j.nameEn} (${j.nameMl})">
        <img src="${j.photo}" alt="${j.nameEn}" loading="lazy">
        <span class="bk-thumb-label">${j.nameEn.split(' ')[0]} ${j.nameEn.split(' ')[1] || ''}</span>
      </button>
    `).join('');

    // Scroll active thumbnail into view
    const activeThumb = container.querySelector('.bk-thumb-btn.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Expose global methods
  window.openJewelProfile = openJewelProfile;
  window.closeJewelProfile = closeJewelProfile;
  window.prevJewelProfile = prevJewelProfile;
  window.nextJewelProfile = nextJewelProfile;
  window.setJewelIndex = function(idx) {
    currentJewelIndex = idx;
    renderJewelModal();
  };

  // Keyboard accessibility
  window.addEventListener('keydown', function(e) {
    const modal = document.getElementById('bkJewelProfileModal');
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeJewelProfile();
    if (e.key === 'ArrowLeft') prevJewelProfile();
    if (e.key === 'ArrowRight') nextJewelProfile();
  });

  // URL hash / search parameter deep-linking support
  function checkUrlForJewel() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#jewel-')) {
      const jid = hash.replace('#jewel-', '');
      openJewelProfile(jid);
    } else {
      const params = new URLSearchParams(window.location.search);
      const jid = params.get('jewel');
      if (jid) openJewelProfile(jid);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUrlForJewel);
  } else {
    setTimeout(checkUrlForJewel, 300);
  }
  window.addEventListener('hashchange', checkUrlForJewel);
})();
