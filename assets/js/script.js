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
});
