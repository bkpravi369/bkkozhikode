/* All 300 frames are retained; select a single appropriately sized video. */
(() => {
  const stage = document.getElementById('rajyogaStage');
  const scene = document.getElementById('rajyogaScene');
  const video = document.getElementById('rajyogaVideo');
  const toggle = document.getElementById('rajyogaMotionToggle');
  const label = document.getElementById('rajyogaMotionLabel');
  const icon = document.getElementById('rajyogaMotionIcon');
  if (!stage || !video || !toggle) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  const connection = navigator.connection;
  const limitedHardware = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const veryLimitedHardware = (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  const conserveData = () => connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
  let userChoice = null;
  let visible = false;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let playbackRequest = 0;
  let failed = false;

  const wantsPlayback = () => userChoice ?? !(reducedMotion.matches || conserveData() || veryLimitedHardware);

  function resetDepth() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    stage.classList.remove('has-depth');
    scene.style.removeProperty('--hero-rx');
    scene.style.removeProperty('--hero-ry');
  }

  function updateLabel() {
    label.textContent = video.paused ? 'Play animation' : 'Pause animation';
    icon.textContent = video.paused ? '▶' : 'Ⅱ';
    if (video.paused) resetDepth();
  }

  function selectSource() {
    if (video.hasAttribute('src')) return;
    const width = stage.clientWidth || window.innerWidth;
    const small = width <= 640 || limitedHardware || conserveData();
    const medium = width <= 1100 || connection?.effectiveType === '3g';
    video.src = `assets/video/rajyoga-${small ? 'mobile' : medium ? 'tablet' : 'hero'}.mp4`;
    // Keep this source across rotation/resizing; do not download a second video.
    video.load();
  }

  async function syncPlayback() {
    const request = ++playbackRequest;
    if (failed || !wantsPlayback() || !visible || document.hidden) {
      video.pause();
      resetDepth();
      return;
    }
    selectSource();
    try {
      await video.play();
      if (!wantsPlayback() || !visible || document.hidden) video.pause();
    } catch {
      if (request === playbackRequest) updateLabel();
    }
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    userChoice = video.paused;
    resetDepth();
    syncPlayback();
  });
  video.addEventListener('play', updateLabel);
  video.addEventListener('pause', updateLabel);
  video.addEventListener('error', () => {
    failed = true;
    video.pause();
    resetDepth();
    toggle.hidden = true;
    // Removing a failed source restores the first-frame poster.
    video.removeAttribute('src');
    video.load();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pagehide', () => { video.pause(); resetDepth(); });
  window.addEventListener('pageshow', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) userChoice = null;
    resetDepth();
    syncPlayback();
  });
  desktopPointer.addEventListener('change', resetDepth);
  connection?.addEventListener('change', syncPlayback);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
      syncPlayback();
    }, { threshold: [0, 0.1] }).observe(stage);
  } else {
    // Older browsers get the poster until the visitor explicitly starts it.
    visible = true;
    userChoice = false;
  }

  stage.addEventListener('pointermove', (event) => {
    if (!desktopPointer.matches || reducedMotion.matches || limitedHardware || conserveData() ||
        video.paused || !visible || document.hidden) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      // At most one geometry read/write per display frame, with no idle loop.
      const bounds = stage.getBoundingClientRect();
      stage.classList.add('has-depth');
      scene.style.setProperty('--hero-rx', `${-(pointerY - bounds.top - bounds.height / 2) / bounds.height * 2}deg`);
      scene.style.setProperty('--hero-ry', `${(pointerX - bounds.left - bounds.width / 2) / bounds.width * 2}deg`);
      pointerFrame = 0;
    });
  }, { passive: true });
  stage.addEventListener('pointerleave', resetDepth);
})();
