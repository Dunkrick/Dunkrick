const html = document.documentElement;
  
  

  const sections = document.querySelectorAll('.cs-section[id]');
  const sideLinks = document.querySelectorAll('.cs-sidebar-link[data-sec]');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        sideLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.cs-sidebar-link[data-sec="${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => secObs.observe(s));

  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.cs-fade-up').forEach((el, i) => {
    el.style.transitionDelay = (i * 40) + 'ms';
    fadeObs.observe(el);
  });