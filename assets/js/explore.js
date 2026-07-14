/**
 * Explore Page Interactivity
 * Built with GSAP & ScrollTrigger
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("explore-page")) return;

  // 1. SCRAMBLE TEXT EFFECT FOR TERMINAL/STATUS
  // We'll scramble the status values on scroll when they enter the viewport
  const scrambleElements = document.querySelectorAll(".scramble-text");
  
  scrambleElements.forEach(el => {
    const originalText = el.getAttribute("data-text");
    const chars = "!@#$%^&*()_+{}:<>?|[];',./~`1234567890abcdefghijklmnopqrstuvwxyz";
    
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => {
        let iterations = 0;
        const maxIterations = 15;
        const interval = setInterval(() => {
          el.innerText = originalText.split("").map((letter, index) => {
            if(index < iterations) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("");
          
          if(iterations >= originalText.length) {
            clearInterval(interval);
            el.innerText = originalText;
          }
          iterations += 1/3;
        }, 30);
      },
      once: true
    });
  });

  // 2. MAGNETIC WRAP EFFECT FOR CARDS
  // When hovering, the card slightly pulls toward the mouse
  const magneticItems = document.querySelectorAll(".magnetic-wrap");
  
  magneticItems.forEach(item => {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      // Calculate mouse position relative to the center of the element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // We limit the movement to make it subtle
      gsap.to(item, {
        x: x * 0.05,
        y: y * 0.05,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  // 3. MASONRY FILTERING WITH GSAP
  const filterBtns = document.querySelectorAll(".studio-filter-btn");
  const masonryItems = document.querySelectorAll(".masonry-item");

  let currentFilter = document.querySelector(".studio-filter-btn.active")?.getAttribute("data-filter") || "home";

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const filterValue = btn.getAttribute("data-filter");
      if (filterValue === currentFilter) return;
      currentFilter = filterValue;

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const grid = document.querySelector(".masonry-grid");
      
      // 1. Record starting height
      const startHeight = grid.offsetHeight;

      // 2. Instantly swap states to calculate new layout
      masonryItems.forEach(item => {
        gsap.killTweensOf(item);
        if (item.classList.contains(filterValue)) {
          gsap.set(item, { display: "flex", opacity: 0, scale: 0.9 });
        } else {
          gsap.set(item, { display: "none" });
        }
      });

      // 3. Record ending height
      const endHeight = grid.offsetHeight;

      // 4. Animate the grid container's height so the footer slides perfectly
      gsap.fromTo(grid, 
        { height: startHeight },
        { height: endHeight, duration: 0.4, ease: "power2.out", clearProps: "height" }
      );

      // 5. Animate the incoming items popping in
      const incoming = Array.from(masonryItems).filter(item => item.classList.contains(filterValue));
      gsap.to(incoming, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.5)",
        stagger: 0.03
      });
    });
  });

  // Initialize the grid with the currently active filter
  const activeBtn = document.querySelector(".studio-filter-btn.active");
  if (activeBtn) {
    const filterValue = activeBtn.getAttribute("data-filter");
    masonryItems.forEach(item => {
      if (!item.classList.contains(filterValue)) {
        item.classList.add("filtering-out");
        gsap.set(item, { scale: 0.8, opacity: 0, display: "none" });
      }
    });
  }

  // 4. SCROLLTRIGGER STAGGER REVEAL FOR MASONRY ITEMS
  gsap.from(".masonry-item", {
    y: 50,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".masonry-grid",
      start: "top 85%"
    }
  });

});
