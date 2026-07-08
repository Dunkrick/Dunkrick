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

  // ── 7. MODERN AUDIO SYNTHESIS ──
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  function playClick(type) {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'persuasive') {
      // Modern, deep pop (e.g. for Theme Toggles, CTAs)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      
      osc.start(now);
      osc.stop(now + 0.03);
    } else {
      // Modern, sharp minimalist tick (e.g. for standard links)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      
      osc.start(now);
      osc.stop(now + 0.015);
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

  // ── 6. DYNAMIC GREETING (IST) ──
  const greetingEl = document.getElementById('dynamic-greeting');
  if (greetingEl) {
    const getISTHour = () => {
      const now = new Date();
      // 'en-US' locale with Asia/Kolkata timezone to extract the correct hour
      const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false, hour: 'numeric' });
      return parseInt(istString, 10);
    };
    
    const hour = getISTHour();
    let greeting = "Good evening";
    if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good afternoon";
    }
    greetingEl.textContent = greeting;
  }

  // ── 7. LIVE GITHUB CONTRIBUTIONS ──
  const ghCountEl = document.getElementById('gh-contributions-count');
  if (ghCountEl) {
    // We use a community API to bypass GitHub's client-side CORS restriction for free
    fetch('https://github-contributions-api.jogruber.de/v4/dunkrick?y=last')
      .then(res => res.json())
      .then(data => {
        if (data && data.total && data.total.lastYear !== undefined) {
          ghCountEl.textContent = data.total.lastYear;
        } else {
          ghCountEl.textContent = "259";
        }
      })
      .catch(() => {
        ghCountEl.textContent = "259"; // Fallback if API fails
      });
  }

  // ── 8. CURSOR IMAGE REVEAL (WORK PAGE) ──
  const cursorImg = document.getElementById('cursor-img-reveal');
  const projectRows = document.querySelectorAll('.project-row');

  if (cursorImg && projectRows.length > 0) {
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      if (isHovering) {
        targetX = e.clientX;
        targetY = e.clientY;
      }
    });

    function animateCursor() {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        cursorImg.style.left = currentX + 'px';
        cursorImg.style.top = currentY + 'px';
      }
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    projectRows.forEach(row => {
      row.addEventListener('mouseenter', (e) => {
        isHovering = true;
        const imgPath = row.getAttribute('data-image');
        if (imgPath) {
          cursorImg.style.backgroundImage = `url(${imgPath})`;
        }
        cursorImg.classList.add('active');
        
        currentX = e.clientX;
        currentY = e.clientY;
        targetX = e.clientX;
        targetY = e.clientY;
        cursorImg.style.left = currentX + 'px';
        cursorImg.style.top = currentY + 'px';
      });
      
      row.addEventListener('mouseleave', () => {
        isHovering = false;
        cursorImg.classList.remove('active');
      });
    });
  }

  // ── 9. READING PROGRESS BAR (devlog page only) ──
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // ── 10. DEVLOG ENTRY EXPAND / COLLAPSE ──
  document.querySelectorAll('.entry-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = btn.closest('.timeline-entry');
      if (entry) {
        const isCollapsed = entry.classList.contains('entry-collapsed');
        entry.classList.toggle('entry-collapsed');
        btn.textContent = isCollapsed ? 'Show less' : 'Continue reading';
      }
    });
  });

  // ── 11. DEVLOG STATS AUTO-UPDATE ──
  document.querySelectorAll('[data-stat-days]').forEach(el => {
    el.textContent = el.getAttribute('data-stat-days');
  });
  document.querySelectorAll('[data-stat-versions]').forEach(el => {
    el.textContent = el.getAttribute('data-stat-versions');
  });
  document.querySelectorAll('[data-stat-eps]').forEach(el => {
    el.textContent = el.getAttribute('data-stat-eps');
  });

  // ── 12. FLOATING HOVER REVEAL ──
  const hoverTrigger = document.querySelector('.hover-reveal-trigger');
  const hoverImage = document.querySelector('.hover-reveal-image');

  if (hoverTrigger && hoverImage && typeof gsap !== 'undefined') {
    // We use GSAP quickTo for highly performant mouse tracking
    const xTo = gsap.quickTo(hoverImage, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(hoverImage, "y", { duration: 0.4, ease: "power3" });

    hoverTrigger.addEventListener('mouseenter', () => {
      gsap.to(hoverImage, {
        opacity: 1,
        autoAlpha: 1, // handles visibility too
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.5)"
      });
    });

    hoverTrigger.addEventListener('mousemove', (e) => {
      // Offset by half width/height so mouse is centered, but we do that in CSS with translate(-50%, -50%). 
      // Actually quickTo just sets the x/y properties. We need to pass clientX and clientY.
      xTo(e.clientX);
      yTo(e.clientY);
    });

    hoverTrigger.addEventListener('mouseleave', () => {
      gsap.to(hoverImage, {
        opacity: 0,
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in"
      });
    });
  }

});
