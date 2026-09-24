/* ==========================================================================
   Brahma Kumaris Kozhikode - Scroll-Driven Rajyoga Animation Engine (v2)
   - Scrolling DOWN: Animation advances forward (0s -> 10s)
   - Scrolling UP: Animation scrubs backwards in reverse (10s -> 0s)
   - Hardware-primed video surface (clears poster image immediately)
   - Fast seek watchdog & non-blocking seek pipeline
   - Smooth 60fps/120fps requestAnimationFrame lerp interpolation
   ========================================================================== */

(() => {
  const heroTrack = document.getElementById('rajyogaHero');
  const heroSticky = document.getElementById('rajyogaHeroSticky');
  const stage = document.getElementById('rajyogaStage');
  const scene = document.getElementById('rajyogaScene');
  const video = document.getElementById('rajyogaVideo');
  const progressBar = document.getElementById('rajyogaProgressBar');
  const scrollPrompt = document.getElementById('rajyogaScrollPrompt');
  const toggle = document.getElementById('rajyogaMotionToggle');
  const label = document.getElementById('rajyogaMotionLabel');
  const icon = document.getElementById('rajyogaMotionIcon');

  if (!heroTrack || !video) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

  let targetProgress = 0;
  let currentProgress = 0;
  let isSeeking = false;
  let pendingSeekTime = null;
  let seekWatchdog = null;
  let rafId = null;
  let isUserAutoplaying = false;
  let isVideoPrimed = false;

  // 3D Pointer Perspective
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  // Geometry cache
  let cachedScrollDistance = 600;

  function updateMetrics() {
    const stickyHeight = heroSticky ? heroSticky.offsetHeight : (window.innerHeight - 60);
    const trackHeight = heroTrack ? heroTrack.offsetHeight : window.innerHeight * 1.5;
    cachedScrollDistance = Math.max(350, trackHeight - stickyHeight);
  }

  function selectSource() {
    if (video.hasAttribute('src')) return;
    const width = window.innerWidth;
    // Prefer mobile / tablet for fast 60fps scrubbing with near-zero seek latency
    const isMobile = width <= 640;
    const isTablet = width <= 1200;
    const videoFile = isMobile ? 'rajyoga-mobile.mp4' : isTablet ? 'rajyoga-tablet.mp4' : 'rajyoga-hero.mp4';
    
    video.src = `assets/video/${videoFile}`;
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.load();
  }

  function primeVideoSurface() {
    if (isVideoPrimed) return;
    isVideoPrimed = true;
    // CRITICAL: Remove the poster attribute so Chrome displays the live video frame immediately
    video.removeAttribute('poster');
    video.muted = true;
    video.playsInline = true;
    
    // Quick play-pause cycle to prime the hardware decode compositor
    const playPromise = video.play();
    if (playPromise && playPromise.then) {
      playPromise.then(() => {
        if (!isUserAutoplaying) {
          video.pause();
          performSeek(currentProgress * (video.duration || 10));
        }
      }).catch(() => {
        performSeek(currentProgress * (video.duration || 10));
      });
    }
  }

  function performSeek(time) {
    if (!video || !video.duration || isNaN(video.duration)) return;
    const duration = video.duration;
    const clampedTime = Math.max(0, Math.min(duration - 0.03, time));

    // Deadband check
    if (Math.abs(video.currentTime - clampedTime) < 0.02) return;

    if (isSeeking || video.seeking) {
      pendingSeekTime = clampedTime;
      return;
    }

    isSeeking = true;
    pendingSeekTime = null;

    clearTimeout(seekWatchdog);
    seekWatchdog = setTimeout(() => {
      isSeeking = false;
      if (pendingSeekTime !== null) {
        const next = pendingSeekTime;
        pendingSeekTime = null;
        performSeek(next);
      }
    }, 70);

    try {
      if (typeof video.fastSeek === 'function') {
        video.fastSeek(clampedTime);
      } else {
        video.currentTime = clampedTime;
      }
    } catch {
      isSeeking = false;
    }
  }

  video.addEventListener('seeked', () => {
    isSeeking = false;
    clearTimeout(seekWatchdog);
    if (pendingSeekTime !== null) {
      const next = pendingSeekTime;
      pendingSeekTime = null;
      performSeek(next);
    }
  });

  video.addEventListener('loadeddata', primeVideoSurface);
  video.addEventListener('canplay', primeVideoSurface);
  video.addEventListener('loadedmetadata', () => {
    updateMetrics();
    primeVideoSurface();
    if (video.duration) {
      performSeek(currentProgress * video.duration);
    }
  });

  function updateVisualEffects(progress) {
    // 1. Progress Bar
    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // 2. CSS Variable for scene scale, glow, and aura
    if (scene) {
      scene.style.setProperty('--scroll-p', progress.toFixed(3));
    }

    // 3. Scroll Guidance Prompt
    if (scrollPrompt) {
      if (progress > 0.05) {
        scrollPrompt.style.opacity = '0';
        scrollPrompt.style.pointerEvents = 'none';
      } else {
        scrollPrompt.style.opacity = '1';
        scrollPrompt.style.pointerEvents = 'auto';
      }
    }
  }

  function animationLoop() {
    if (isUserAutoplaying) {
      if (video.duration && !video.paused) {
        currentProgress = video.currentTime / video.duration;
        targetProgress = currentProgress;
        updateVisualEffects(currentProgress);
      }
      rafId = requestAnimationFrame(animationLoop);
      return;
    }

    // Smooth Lerp (Linear Interpolation) with 0.18 response factor
    const delta = targetProgress - currentProgress;
    if (Math.abs(delta) < 0.001) {
      currentProgress = targetProgress;
    } else {
      currentProgress += delta * 0.18;
    }

    if (video.duration && !isNaN(video.duration)) {
      performSeek(currentProgress * video.duration);
    }

    updateVisualEffects(currentProgress);

    if (Math.abs(targetProgress - currentProgress) >= 0.001) {
      rafId = requestAnimationFrame(animationLoop);
    } else {
      rafId = null;
    }
  }

  function requestLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(animationLoop);
    }
  }

  // Scroll handler: reads scroll position and maps directly to animation progress
  function onScroll() {
    if (document.hidden) return;

    if (isUserAutoplaying) {
      isUserAutoplaying = false;
      video.pause();
      updateToggleUI();
    }

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    
    // As user scrolls down from top (0px), progress starts immediately!
    const rawProgress = scrollY / cachedScrollDistance;
    targetProgress = Math.max(0, Math.min(1, rawProgress));

    requestLoop();
  }

  function updateToggleUI() {
    if (!toggle || !label || !icon) return;
    const playing = !video.paused && isUserAutoplaying;
    label.textContent = playing ? 'Pause animation' : 'Play animation';
    icon.textContent = playing ? 'Ⅱ' : '▶';
  }

  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      if (isUserAutoplaying) {
        isUserAutoplaying = false;
        video.pause();
      } else {
        isUserAutoplaying = true;
        selectSource();
        primeVideoSurface();
        video.play().catch(() => {});
        requestLoop();
      }
      updateToggleUI();
    });
  }

  // 3D Desktop Pointer Tilt
  function resetDepth() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    stage?.classList.remove('has-depth');
    scene?.style.removeProperty('--hero-rx');
    scene?.style.removeProperty('--hero-ry');
  }

  if (stage) {
    stage.addEventListener('pointermove', (event) => {
      if (!desktopPointer.matches || reducedMotion.matches || document.hidden) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        const bounds = stage.getBoundingClientRect();
        stage.classList.add('has-depth');
        const rx = -(pointerY - bounds.top - bounds.height / 2) / bounds.height * 2.2;
        const ry = (pointerX - bounds.left - bounds.width / 2) / bounds.width * 2.2;
        scene.style.setProperty('--hero-rx', `${rx}deg`);
        scene.style.setProperty('--hero-ry', `${ry}deg`);
        pointerFrame = 0;
      });
    }, { passive: true });

    stage.addEventListener('pointerleave', resetDepth);
  }

  // Listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateMetrics();
    onScroll();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isUserAutoplaying) video.pause();
    } else {
      updateMetrics();
      onScroll();
    }
  });

  // Init
  selectSource();
  updateMetrics();
  onScroll();
  setTimeout(primeVideoSurface, 100);
})();
