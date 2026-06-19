// ── 0. INTRO SQUIGGLEVISION MATCH CUT ──
// Modify your greetings here. The last word should be "simple" for the match cut.
const introGreetings = ["Hello", "Let's", "Create", "Something", "simple"];

document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const introGreeting = document.getElementById("intro-greeting");
  const targetSimple = document.getElementById("target-simple");

  if (targetSimple) targetSimple.style.opacity = "0";

  if (introOverlay && introGreeting) {
    if (sessionStorage.getItem("introSeen")) {
      // Instantly hide if already seen in this session
      introOverlay.style.display = "none";
      if (targetSimple) targetSimple.style.opacity = "1";
    } else {
      sessionStorage.setItem("introSeen", "true");
      document.body.style.overflow = "hidden"; // lock scroll

      let wordIndex = 0;
      introGreeting.textContent = introGreetings[0];

      // Swap words every 400ms
      const swapInterval = setInterval(() => {
        wordIndex++;
        if (wordIndex < introGreetings.length) {
          introGreeting.textContent = introGreetings[wordIndex];
        } else {
          // Finished cycling, trigger MATCH CUT
          clearInterval(swapInterval);

          if (!targetSimple) {
            introOverlay.style.opacity = "0";
            setTimeout(() => { introOverlay.style.display = "none"; document.body.style.overflow = ""; }, 800);
            return;
          }

          // Give "simple" a tiny pause before flying
          setTimeout(() => {
            // Fade out the overlay background, revealing the site behind it
            introOverlay.style.transition = "background-color 0.8s ease";
            introOverlay.style.backgroundColor = "transparent";
            introOverlay.style.pointerEvents = "none";

            // Calculate centers for FLIP animation
            const targetRect = targetSimple.getBoundingClientRect();
            const introRect = introGreeting.getBoundingClientRect();
            
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const introCenterX = introRect.left + introRect.width / 2;
            const introCenterY = introRect.top + introRect.height / 2;
            
            // 1. Math for introGreeting flying TO the target
            const introFlyX = targetCenterX - introCenterX;
            const introFlyY = targetCenterY - introCenterY;
            const introScale = targetRect.width / introRect.width;
            
            // 2. Math for targetSimple jumping TO the center, then flying HOME
            const targetJumpX = introCenterX - targetCenterX;
            const targetJumpY = introCenterY - targetCenterY;
            const targetJumpScale = introRect.width / targetRect.width;
            
            // Instantly move targetSimple to the center of the screen (invisible)
            targetSimple.style.transition = "none";
            targetSimple.style.transform = `translate(${targetJumpX}px, ${targetJumpY}px) scale(${targetJumpScale})`;
            targetSimple.style.opacity = "0";
            
            // Trigger reflow so the browser registers the jump before we animate
            void targetSimple.offsetWidth;
            
            // Animate introGreeting to the target (fades out)
            introGreeting.style.transition = "transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease-in";
            introGreeting.style.transform = `translate(${introFlyX}px, ${introFlyY}px) scale(${introScale})`;
            introGreeting.style.opacity = "0";
            
            // Animate the REAL targetSimple back to its native home (fades in)
            targetSimple.style.transition = "transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s ease-out 0.2s";
            targetSimple.style.transform = `translate(0px, 0px) scale(1)`;
            targetSimple.style.opacity = "1";
            
            // Wait for flight to finish
            setTimeout(() => {
              // Destroy the intro overlay. The target is already natively in place!
              introOverlay.style.display = "none";
              document.body.style.overflow = ""; // unlock scroll
              if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
            }, 900);
          }, 300);
        }
      }, 400);
    }
  }
});

// ── 1. GSAP MAGNETIC CURSOR ──
const cursor = document.getElementById('cursor');

if (typeof gsap !== 'undefined') {
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

  let isMagnetic = false;

  const bgNumber = document.getElementById('bg-number-parallax');
  let bgXTo, bgYTo;
  if (bgNumber) {
    bgXTo = gsap.quickTo(bgNumber, "x", { duration: 1, ease: "power2.out" });
    bgYTo = gsap.quickTo(bgNumber, "y", { duration: 1, ease: "power2.out" });
  }

  document.addEventListener('mousemove', e => {
    if (!isMagnetic) {
      xTo(e.clientX);
      yTo(e.clientY);
    }
    if (bgNumber) {
      // Move opposite to mouse direction at 3% speed for a deep parallax feel
      const xMove = (e.clientX - window.innerWidth / 2) * -0.03;
      const yMove = (e.clientY - window.innerHeight / 2) * -0.03;
      bgXTo(xMove);
      bgYTo(yMove);
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
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        start: "top 90%",
        end: "bottom 70%",
        scrub: 1
      }
    });
  });

  // Parallax and Wakanda Decode on About Photo
  const aboutPhotoWrapper = document.querySelector('.about-photo-wrapper');
  if (aboutPhotoWrapper) {
    // Parallax the wrapper
    gsap.to(aboutPhotoWrapper, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-spread",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // True Canvas Matrix Morph
    const canvas = document.getElementById('about-ascii-canvas');
    const realPhoto = document.getElementById('about-real-photo');
    
    if (canvas && realPhoto) {
      const ctx = canvas.getContext('2d');
      
      Promise.all([
        fetch('assets/images/hero-plaid.txt').then(r => r.text()),
        new Promise(resolve => {
          if (realPhoto.complete && realPhoto.naturalHeight !== 0) resolve();
          else realPhoto.addEventListener('load', resolve);
        })
      ]).then(([asciiText]) => {
        // Parse the grid
        const lines = asciiText.split('\n').filter(line => line.length > 0);
        const rows = lines.length;
        const cols = lines[0].length;
        
        // Wait a tick for layout to resolve
        setTimeout(() => {
          const rect = realPhoto.getBoundingClientRect();
          if (rect.width === 0) return; // Prevent division by zero if hidden
          
          canvas.width = rect.width * window.devicePixelRatio;
          canvas.height = rect.height * window.devicePixelRatio;
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
          
          const cellWidth = rect.width / cols;
          const cellHeight = rect.height / rows;
          
          // Offscreen canvas to sample precise pixel colors
          const offscreen = document.createElement('canvas');
          offscreen.width = cols;
          offscreen.height = rows;
          const offCtx = offscreen.getContext('2d');
          // Draw the image scaled to the grid dimensions to sample colors easily
          offCtx.drawImage(realPhoto, 0, 0, cols, rows);
          const imgData = offCtx.getImageData(0, 0, cols, rows).data;
          
          // Build the grid data array
          const grid = [];
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const i = (y * cols + x) * 4;
              grid.push({
                char: lines[y] ? (lines[y][x] || ' ') : ' ',
                r: imgData[i],
                g: imgData[i+1],
                b: imgData[i+2],
                a: imgData[i+3] / 255
              });
            }
          }
          
          const renderState = { progress: 0 };
          const wakandaChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/`~";
          
          function render() {
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.font = `bold ${cellHeight * 1.15}px "Courier New", monospace`;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            
            // ── 3-Stage Mechanical Morph Math ──
            const p = renderState.progress;
            
            // Stage 1 (0.0 -> 0.4): Scramble
            const scrambleIntensity = Math.max(0, 1 - (p / 0.4));
            
            // Stage 2 (0.4 -> 0.7): Solidify Blocks & Fade Text
            let blockScale = 0;
            let textOpacity = 1;
            if (p > 0.4) {
              blockScale = Math.min(1, (p - 0.4) / 0.3);
              textOpacity = Math.max(0, 1 - blockScale); 
            }
            
            // Stage 3 (0.7 -> 1.0): Sharpen to High-Res Photo
            let canvasOpacity = 1;
            let photoOpacity = 0;
            if (p > 0.7) {
              photoOpacity = Math.min(1, (p - 0.7) / 0.3);
              canvasOpacity = Math.max(0, 1 - photoOpacity);
            }
            
            canvas.style.opacity = canvasOpacity;
            realPhoto.style.opacity = photoOpacity;
            
            if (canvasOpacity <= 0) return; // Completely morphed
            
            for (let y = 0; y < rows; y++) {
              for (let x = 0; x < cols; x++) {
                const cell = grid[y * cols + x];
                if (cell.a < 0.1 || cell.char === ' ') continue;
                
                // 1. Draw Text (if visible)
                if (textOpacity > 0) {
                  let charToDraw = cell.char;
                  if (scrambleIntensity > 0 && Math.random() < scrambleIntensity * 0.4) {
                    charToDraw = wakandaChars[Math.floor(Math.random() * wakandaChars.length)];
                  }
                  ctx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.a * textOpacity})`;
                  ctx.fillText(charToDraw, x * cellWidth, y * cellHeight);
                }
                
                // 2. Draw Solidifying Block (if active)
                if (blockScale > 0) {
                  // Grow the pixel block from the center outwards
                  const bw = cellWidth * blockScale;
                  const bh = cellHeight * blockScale;
                  // Subpixel overlap to prevent anti-aliasing gaps
                  const bx = (x * cellWidth) + (cellWidth - bw) / 2;
                  const by = (y * cellHeight) + (cellHeight - bh) / 2;
                  
                  ctx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.a})`;
                  ctx.fillRect(bx - 0.5, by - 0.5, bw + 1, bh + 1);
                }
              }
            }
          }
          
          // Initial static drawing
          render();
          
          ScrollTrigger.create({
            trigger: aboutPhotoWrapper,
            start: "top 60%",
            once: true,
            onEnter: () => {
              gsap.to(renderState, {
                progress: 1,
                duration: 2.0, // Extended duration to let mechanics breathe
                ease: "power2.inOut",
                onUpdate: render
              });
            }
          });
        }, 150);
      }).catch(err => console.error("Canvas matrix failed:", err));
    }
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

/* ── MOBILE MENU LOGIC ── */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

if (mobileMenuBtn && mobileMenuOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
  });

  // Close menu when clicking a link
  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}
