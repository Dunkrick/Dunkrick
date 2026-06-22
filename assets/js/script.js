document.addEventListener("DOMContentLoaded", () => {
  // ── 1. GSAP SUBTLE ANIMATIONS ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Staggered subtle fade-ups (Shedsgns style)
    ScrollTrigger.batch(".fade-up", {
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      }),
      start: "top 95%"
    });
  }

  // Set initial states for .fade-up elements to prevent flash before GSAP kicks in
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.filter = 'blur(4px)';
  });

  // ── 2. NAV SCROLL ──
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── 3. COMMAND PALETTE & EASTER EGG ──
  const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
  const cmdInput = document.getElementById('cmd-input');
  const navCmdTrigger = document.getElementById('nav-cmd-trigger');
  const cmdKeyHint = document.getElementById('cmd-key-hint');

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  if (!isMac && cmdKeyHint) {
    cmdKeyHint.textContent = 'Ctrl K';
  }

  function toggleCmdPalette(forceOpen) {
    if (!cmdBackdrop) return;
    const isHidden = cmdBackdrop.classList.contains('cmd-hidden');
    const shouldOpen = forceOpen !== undefined ? forceOpen : isHidden;

    if (shouldOpen) {
      cmdBackdrop.classList.remove('cmd-hidden');
      setTimeout(() => cmdInput && cmdInput.focus(), 50);
    } else {
      cmdBackdrop.classList.add('cmd-hidden');
      if (cmdInput) cmdInput.blur();
    }
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggleCmdPalette();
    }
    if (e.key === 'Escape') {
      toggleCmdPalette(false);
    }
  });

  if (navCmdTrigger) navCmdTrigger.addEventListener('click', () => toggleCmdPalette(true));
  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', (e) => {
      if (e.target === cmdBackdrop) toggleCmdPalette(false);
    });
  }

  document.querySelectorAll('.cmd-link').forEach(link => {
    link.addEventListener('click', () => toggleCmdPalette(false));
  });

  // ── 4. MOBILE MENU LOGIC ──
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileMenuOverlay.classList.toggle('active');
      document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
    });

    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 5. THEME TOGGLE ──
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.querySelector('.theme-icon-sun');
  const iconMoon = document.querySelector('.theme-icon-moon');
  const cmdActionTheme = document.querySelectorAll('.cmd-action-theme');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (iconSun && iconMoon) {
      if (theme === 'dark') {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
      } else {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
      }
    }
  }

  // Init theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  cmdActionTheme.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleTheme();
      toggleCmdPalette(false);
    });
  });

  // ── 6. WIREFRAME MODE TOGGLE ──
  const cmdActionWireframe = document.querySelectorAll('.cmd-action-wireframe');
  cmdActionWireframe.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('wireframe-mode');
      toggleCmdPalette(false);
    });
  });

  // ── 7. RETRO AUDIO SYNTHESIS ──
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  function createNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 0.1; // 100ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function playClick(type) {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer();

    const noiseFilter = audioCtx.createBiquadFilter();
    const noiseEnvelope = audioCtx.createGain();

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    const oscEnvelope = audioCtx.createGain();

    osc.connect(oscEnvelope);
    oscEnvelope.connect(audioCtx.destination);

    if (type === 'persuasive') {
      // Chunky retro Mac button click
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      
      noiseEnvelope.gain.setValueAtTime(0.8, now);
      noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.04);
      
      oscEnvelope.gain.setValueAtTime(0.4, now);
      oscEnvelope.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      noise.start(now);
      noise.stop(now + 0.05);
      osc.start(now);
      osc.stop(now + 0.04);
    } else {
      // Subtle mechanical switch click
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 4000;
      
      noiseEnvelope.gain.setValueAtTime(0.4, now);
      noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.01);
      
      oscEnvelope.gain.setValueAtTime(0.2, now);
      oscEnvelope.gain.exponentialRampToValueAtTime(0.01, now + 0.01);

      noise.start(now);
      noise.stop(now + 0.02);
      osc.start(now);
      osc.stop(now + 0.01);
    }
  }

  // Attach global click listener
  document.addEventListener('click', (e) => {
    const interactiveEl = e.target.closest('a, button, .cmd-link, details');
    if (interactiveEl) {
      if (interactiveEl.classList.contains('persuasive-click')) {
        playClick('persuasive');
      } else {
        playClick('subtle');
      }
    }
  });

});
