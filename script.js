// ── 1. CUSTOM CURSOR LERP LOGIC ──
    const cursor = document.getElementById('cursor');
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    // Grow cursor on links and buttons
    document.querySelectorAll('a, button, .bento-cell').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      cx = lerp(cx, mx, 0.12);   // 0.12 smooth lag
      cy = lerp(cy, my, 0.12);
      // Center the 28px cursor (subtract half the width/height)
      cursor.style.transform = `translate(${cx - 14}px, ${cy - 14}px)`;
      requestAnimationFrame(tick);
    }
    tick(); // Start the loop

    // ── 2. NAV SCROLL ──
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ── 3. FADE-UP OBSERVER ──
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + 'ms';
      obs.observe(el);
    });

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

    // ── 1B: SVG DRAWN UNDERLINE TRIGGER ──
    const titleEls = document.querySelectorAll('.draw-trigger');
    const titleObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('drawn');
          titleObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    
    titleEls.forEach(el => titleObs.observe(el));
