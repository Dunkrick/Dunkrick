// ── 1. GSAP MAGNETIC CURSOR ──
    const cursor = document.getElementById('cursor');
    
    if (typeof gsap !== 'undefined') {
      const xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"});
      const yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});
      
      let isMagnetic = false;

      document.addEventListener('mousemove', e => {
        if (!isMagnetic) {
          xTo(e.clientX - 14);
          yTo(e.clientY - 14);
        }
      });

      document.querySelectorAll('a, button, .bento-cell').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hovered');
        });
        
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hovered');
          isMagnetic = false;
        });

        // Apply magnetic pull to buttons and specific links
        if (el.tagName.toLowerCase() === 'button' || el.classList.contains('cmd-link') || el.classList.contains('contact-email')) {
          el.addEventListener('mousemove', e => {
            isMagnetic = true;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            const pullX = (e.clientX - cx) * 0.15;
            const pullY = (e.clientY - cy) * 0.15;
            
            xTo(cx + pullX - 14);
            yTo(cy + pullY - 14);
            
            gsap.to(el, {
              x: pullX,
              y: pullY,
              duration: 0.3,
              ease: "power2.out"
            });
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
          });
        }
      });
    }

    // ── 2. NAV SCROLL ──
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ── 3. GSAP SCROLLTRIGGERS ──
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Staggered fade-ups using batch
      ScrollTrigger.batch(".fade-up", {
        onEnter: batch => gsap.to(batch, {
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)", 
          stagger: 0.1, 
          duration: 0.7, 
          ease: "back.out(1.5)",
          overwrite: "auto"
        }),
        start: "top 90%"
      });

      // Drawing SVG Underlines
      document.querySelectorAll('.drawn-underline path').forEach(path => {
        const trigger = path.closest('.draw-trigger') || path;
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trigger,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });

      // Parallax on About Photo
      const aboutPhoto = document.querySelector('.about-photo-hero');
      if (aboutPhoto) {
        gsap.to(aboutPhoto, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-spread",
            start: "top bottom",
            end: "bottom top",
            scrub: true // instant response
          }
        });
      }
    }

    // ── 3A: COUNT-UP WITH END GLITCH on stat numbers ──
    function animateCount(el, target, suffix, duration) {
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(eased * target);
        el.innerHTML = current + '<span style="color:var(--accent);">' + suffix + '</span>';

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Glitch: overshoot by 1, snap back
          el.innerHTML = (target + 1) + '<span style="color:var(--accent);">' + suffix + '</span>';
          setTimeout(() => {
            el.innerHTML = target + '<span style="color:var(--accent);">' + suffix + '</span>';
          }, 80);
        }
      };
      requestAnimationFrame(update);
    }

    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          animateCount(el, target, suffix, 900);
          statObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => statObs.observe(el));

    // ── 3B: STAGGERED CREATIVITY CARD REVEALS ──
    const ccDelays = { 'cc-film': 0, 'cc-writing': 100, 'cc-experiments': 200, 'cc-currently': 300 };
    const ccObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = ccDelays[e.target.id] || 0;
          setTimeout(() => e.target.classList.add('visible'), delay);
          ccObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.creativity-card').forEach(el => ccObs.observe(el));

    // (Old SVG IntersectionObserver removed in favor of GSAP ScrollTrigger)

    // ── 4. HAPPICLAP SLIDER (REMOVED) ──
    // The Happiclap before/after slider logic has been removed because 
    // projects are now rendered dynamically via the CMS in standard bento-cells.

    // ── COMMAND PALETTE & EASTER EGG ──
    const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
    const cmdInput = document.getElementById('cmd-input');
    const navCmdTrigger = document.getElementById('nav-cmd-trigger');
    const cmdKeyHint = document.getElementById('cmd-key-hint');
    const cmdToggleRaw = document.getElementById('cmd-toggle-raw');

    // OS detection for shortcut text
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
        setTimeout(() => cmdInput.focus(), 50);
      } else {
        cmdBackdrop.classList.add('cmd-hidden');
        cmdInput.blur();
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

    if (cmdToggleRaw) {
      cmdToggleRaw.addEventListener('click', () => {
        document.body.classList.toggle('raw-mode');
        toggleCmdPalette(false);
      });
    }

    document.querySelectorAll('.cmd-link').forEach(link => {
      link.addEventListener('click', () => toggleCmdPalette(false));
    });

    // ── MAGNETIC BUTTONS ──
    const magneticButtons = document.querySelectorAll('.btn-primary');

    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Subtle pull
        const pullX = x * 0.15;
        const pullY = y * 0.15;
        
        btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        // Reset to allow CSS :hover to take over or return to default
        btn.style.transform = '';
      });
    });

// ── MAGNETIC BUTTON EFFECT ──
const magneticBtnsGsap = document.querySelectorAll('.magnetic-btn');

magneticBtnsGsap.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Pull the button towards the cursor
    gsap.to(btn, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.5,
      ease: 'power3.out'
    });
  });

  btn.addEventListener('mouseleave', () => {
    // Snap back to original position
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    });
  });
});
