/* ==========================================================================
   Brahma Kumaris Kozhikode - Continuous Looping Rajyoga Animation Engine
   - Smooth continuous auto-looping animation of the 7 spiritual rays & meditating soul
   - Automatic responsive video source selection (Mobile, Tablet, Desktop)
   - IntersectionObserver battery & performance optimization (pauses when out of view)
   - Background tab visibility auto-pause/resume
   - Play/Pause toggle control with interactive icon state
   - Subtle 3D interactive pointer perspective tilt on fine pointer desktop
   ========================================================================== */

(() => {
  const heroSection = document.getElementById('rajyogaHero');
  const stage = document.getElementById('rajyogaStage');
  const scene = document.getElementById('rajyogaScene');
  const video = document.getElementById('rajyogaVideo');
  const toggle = document.getElementById('rajyogaMotionToggle');
  const label = document.getElementById('rajyogaMotionLabel');
  const icon = document.getElementById('rajyogaMotionIcon');

  if (!video) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

  let isPlaying = true;
  let pointerFrame = 0;

  // Select optimal video asset based on viewport
  function selectSource() {
    const width = window.innerWidth;
    let selectedFile = 'rajyoga-hero.mp4';
    if (width <= 640) {
      selectedFile = 'rajyoga-mobile.mp4';
    } else if (width <= 1024) {
      selectedFile = 'rajyoga-tablet.mp4';
    }

    const targetSrc = `assets/video/${selectedFile}`;
    if (!video.src || !video.src.includes(selectedFile)) {
      video.src = targetSrc;
      video.load();
    }
  }

  function startPlayback() {
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updateToggleUI();
        })
        .catch(() => {
          isPlaying = false;
          updateToggleUI();
          // Autoplay blocked by browser policy, play on first user interaction
          const resumeOnTouch = () => {
            video.play().then(() => {
              isPlaying = true;
              updateToggleUI();
            }).catch(() => {});
            window.removeEventListener('click', resumeOnTouch);
            window.removeEventListener('touchstart', resumeOnTouch);
          };
          window.addEventListener('click', resumeOnTouch, { once: true, passive: true });
          window.addEventListener('touchstart', resumeOnTouch, { once: true, passive: true });
        });
    }
  }

  function updateToggleUI() {
    if (!label || !icon) return;
    const active = !video.paused;
    label.textContent = active ? 'Pause' : 'Play';
    icon.textContent = active ? 'Ⅱ' : '▶';
  }

  // Toggle button click listener
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
        isPlaying = true;
      } else {
        video.pause();
        isPlaying = false;
      }
      updateToggleUI();
    });
  }

  // Optimize performance: pause video when hero is scrolled out of viewport
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (isPlaying && video.paused) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.1 });
    observer.observe(heroSection);
  }

  // Pause when browser tab is inactive
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!video.paused) video.pause();
    } else {
      if (isPlaying && video.paused) video.play().catch(() => {});
    }
  });

  // 3D Desktop Pointer Tilt (subtle, delicate 3D tilt on hover)
  function resetDepth() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    scene?.style.removeProperty('--hero-rx');
    scene?.style.removeProperty('--hero-ry');
  }

  if (stage) {
    stage.addEventListener('pointermove', (event) => {
      if (!desktopPointer.matches || reducedMotion.matches || document.hidden) return;
      if (!pointerFrame) {
        pointerFrame = requestAnimationFrame(() => {
          const bounds = stage.getBoundingClientRect();
          const rx = -((event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 2.5;
          const ry = ((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 2.5;
          scene.style.setProperty('--hero-rx', `${rx.toFixed(2)}deg`);
          scene.style.setProperty('--hero-ry', `${ry.toFixed(2)}deg`);
          pointerFrame = 0;
        });
      }
    }, { passive: true });

    stage.addEventListener('pointerleave', resetDepth);
  }

  // Handle window resize dynamically to swap appropriate video resolution if needed
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      selectSource();
      if (isPlaying && video.paused) video.play().catch(() => {});
    }, 250);
  }, { passive: true });

  // Initialize
  selectSource();
  startPlayback();
})();
