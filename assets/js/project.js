async function loadProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    document.getElementById('loading-state').innerHTML = '<p>Project not found. <a href="index.html#work">Return to work</a>.</p>';
    return;
  }

  const projects = {
    'url-shortener': {
      title: "Go URL Shortener",
      role: "Backend Engineering / System Design",
      description: "A high-throughput URL shortener built in Go with PostgreSQL for persistence, Redis for caching and fixed-window rate limiting. Load-tested with k6.",
      project_url: "https://github.com/Dunkrick/url-shortener"
    },
    'nook': {
      title: "Nook",
      role: "Fullstack Engineering",
      description: "A TypeScript full-stack workspace application. Features JWT authentication, workspace and artifact ownership model, PostgreSQL, Google Cloud Storage signed URLs, Docker, GitHub Actions CI/CD, and Cloud Run deployment.",
      project_url: "https://github.com/Dunkrick/nook"
    },
    'macbook-landing': {
      title: "M3 Pro: One Machine. Everything.",
      role: "Creative Development / GSAP",
      description: "A highly personalized, Suburbia Skateboards-inspired brutalist landing page built as a creative showcase. Features interactive 3D MacBook Pro model rendering, scroll-bound typography reveals, and exploded component animations.",
      project_url: "https://github.com/Dunkrick/gsap_macbook_landing",
      live_url: "https://gsap-macbook-landing-tan-five.vercel.app/"
    },
    'meow-starter': {
      title: "Open Source: meow-starter",
      role: "Open Source Contribution",
      description: "Upstream PR adding regression tests for mobile module filtering. 103 tests passing across the test suite.",
      project_url: "https://github.com/nicholasgasior/meow-starter"
    }
  };

  let data = projects[projectId];

  if (projectId === 'happiclap') {
    window.location.replace('happiclap-case-study.html');
    return;
  }

  if (!data) {
    document.getElementById('loading-state').innerHTML = '<p>Could not load project details. <a href="index.html#work">Return to work</a>.</p>';
    return;
  }

  document.title = `${data.title} — Rithwick Gurram`;
  document.getElementById('proj-title').textContent = data.title;
  document.getElementById('proj-role').textContent = data.role || 'Project';
  document.getElementById('proj-desc').textContent = data.description;

  if (projectId === 'd8bab1ba-e04d-42de-a3a9-4fd215a31c76' || (data.title && data.title.includes('Churn'))) {
    data.project_url = "https://github.com/Dunkrick/growth-analytics";
    data.live_url = "https://growth-analytics-smoky.vercel.app/";
    document.getElementById('proj-link').textContent = "View GitHub ↗";
  } else {
    document.getElementById('proj-link').textContent = "View Case Study ↗";
  }

  const linkEl = document.getElementById('proj-link');
  if (data.project_url) {
    linkEl.href = data.project_url;
    linkEl.style.display = 'inline-block';
  } else {
    linkEl.style.display = 'none';
  }

  const liveLinkEl = document.getElementById('proj-live-link');
  if (data.live_url) {
    liveLinkEl.href = data.live_url;
    liveLinkEl.style.display = 'inline-block';
  } else {
    liveLinkEl.style.display = 'none';
  }

  const contentContainer = document.querySelector('.case-study-content');

  if (projectId === 'url-shortener') {
    contentContainer.innerHTML = `
      <div class="content-section">
        <h3>1. The Problem</h3>
        <p>Build a URL shortener that stays performant under load, with a documented system design and measurable results. Most tutorials stop at "it works" — I wanted to prove it works at scale.</p>
      </div>
      <div class="content-section">
        <h3>2. The Evidence</h3>
        <p>Baseline testing showed a simple Go + PostgreSQL implementation handled ~135 req/s with p95 latency ~100ms. Under sustained load, database connections became the bottleneck. The system needed a caching layer and rate limiting to be production-ready.</p>
      </div>
      <div class="content-section">
        <h3>3. The Insight</h3>
        <p>URL shortening is a read-heavy workload with a power-law distribution — a small percentage of links get the vast majority of traffic. Caching hot redirects in Redis eliminates repeated database round-trips. Fixed-window rate limiting per IP prevents abuse without complex token buckets.</p>
      </div>
      <div class="content-section">
        <h3>4. The Decision</h3>
        <p>Architecture: Go HTTP server → Redis (cache + rate limit) → PostgreSQL (persistence). Chose fixed-window rate limiting for simplicity and predictability. Wrote system design documentation before implementing to clarify trade-offs.</p>
      </div>
      <div class="content-section">
        <h3>5. The Build</h3>
        <p>Implemented in Go with standard library + pgx for PostgreSQL, go-redis for Redis. Structured as clean layers: handlers → services → repositories. Added k6 load test scripts simulating realistic traffic patterns.</p>
      </div>
      <div class="content-section">
        <h3>6. The Outcome</h3>
        <p>k6 load test: <strong>135.5 req/s</strong> with 0% errors before Redis cache. After caching: <strong>154.3 req/s</strong>. p95 latency dropped from <strong>99.5 ms to 76.1 ms</strong>. Rate limiting held steady under abuse simulation.</p>
      </div>
      <div class="content-section">
        <h3>7. Reflection</h3>
        <p>The biggest lesson: measure first, optimize second. The baseline was already decent — Redis gave a ~14% throughput boost and ~24% latency improvement. Sometimes the "obvious" optimization isn't worth the complexity. Documenting the system design upfront forced clarity on what actually mattered.</p>
      </div>
      <details class="arch-dropdown" style="margin-top: 32px;">
        <summary class="persuasive-click">View Tech Stack</summary>
        <div class="arch-content">
<pre><code>[Stack]
- Go
- PostgreSQL
- Redis (caching + rate limiting)
- Google Cloud Run
- k6 (load testing)
- System Design documentation</code></pre>
        </div>
      </details>
    `;
  } else if (projectId === 'nook') {
    contentContainer.innerHTML = `
      <div class="content-section">
        <h3>1. The Problem</h3>
        <p>Build a full-stack workspace application to understand how backend systems, databases, and frontend clients fit together. Not a toy — a real application with authentication, authorization, file uploads, and deployment pipeline.</p>
      </div>
      <div class="content-section">
        <h3>2. The Evidence</h3>
        <p>Starting from a 50-line Express + SQLite script (documented in the Building Nook devlog), each iteration revealed gaps: no authentication, no ownership model, no type safety, no deployment strategy. The devlog captures 16 days of architectural evolution across 3 major versions.</p>
      </div>
      <div class="content-section">
        <h3>3. The Insight</h3>
        <p>Authentication and authorization are distinct: auth confirms identity; ownership confirms permission. Pushing ownership checks to the database layer (Prisma where: { id, userId }) makes security a data constraint, not an application concern. TypeScript + Prisma gives end-to-end type safety from HTTP request to SQL query.</p>
      </div>
      <div class="content-section">
        <h3>4. The Decision</h3>
        <p>Stack: TypeScript (frontend + backend), PostgreSQL, Prisma ORM, JWT auth, Google Cloud Storage signed URLs for artifacts, Docker for dev parity, GitHub Actions CI/CD, Cloud Run deployment. Architecture: route → service → repository → database. Frontend: React with a service layer mirroring the backend pattern.</p>
      </div>
      <div class="content-section">
        <h3>5. The Build</h3>
        <p>Implemented JWT auth middleware injecting userId into requests. Services own business logic; routes only handle HTTP. Prisma schemas model workspaces, artifacts, and ownership. GCS signed URLs for secure uploads without proxying bytes. Vitest for unit tests, GitHub Actions for CI/CD.</p>
      </div>
      <div class="content-section">
        <h3>6. The Outcome</h3>
        <p>Deployed to Cloud Run with automated CI/CD. Authenticated users can create workspaces, upload artifacts via signed URLs, and collaborate with ownership enforcement at the database layer. 100% TypeScript coverage from route handler to database query.</p>
      </div>
      <div class="content-section">
        <h3>7. Reflection</h3>
        <p>Building Nook taught me that "full-stack" isn't about knowing two frameworks — it's about designing the contract between them. The service layer pattern (backend services ↔ frontend API client) creates symmetry. The devlog proved more valuable than the app itself: it shows how architectural decisions compound over time.</p>
      </div>
      <details class="arch-dropdown" style="margin-top: 32px;">
        <summary class="persuasive-click">View Tech Stack</summary>
        <div class="arch-content">
<pre><code>[Stack]
- TypeScript (frontend + backend)
- PostgreSQL
- Google Cloud Storage (signed URLs)
- Docker
- GitHub Actions
- Cloud Run
- JWT authentication
- Prisma ORM
- React
- Vitest</code></pre>
        </div>
      </details>
    `;
  } else if (projectId === 'happiclap') {
    contentContainer.innerHTML = `
      <div class="content-section">
        <h3>1. The Friction</h3>
        <p>Happiclap's original homepage suffered from high bounce rates due to cluttered navigation, unclear visual hierarchy, and confusing categorization. Users were overwhelmed by choices but lacked guidance.</p>
      </div>
      <div class="content-section">
        <h3>2. The Insight</h3>
        <p>Instead of adding more features, the solution required reducing cognitive load. We needed to restructure the architecture to prioritize "Bestsellers" and clear "Categories" to build immediate trust and simplify the shopping journey.</p>
      </div>
      <div class="content-section">
        <h3>3. The Execution</h3>
        <p>I shifted the layout from a chaotic grid to a highly structured, hierarchy-driven design using Figma. We implemented social proof and a clean, ultra-fast mobile-responsive interface.</p>
      </div>
      <div class="content-section">
        <h3>4. The Result</h3>
        <p>A streamlined user flow that guides customers directly from landing to checkout. Clarity creates conversions.</p>
      </div>
      <details class="arch-dropdown" style="margin-top: 32px;">
        <summary class="persuasive-click">View Tech Stack</summary>
        <div class="arch-content">
<pre><code>[Stack]
- Figma
- Notion
- TypeScript, JavaScript, CSS
- Human Computer Interaction
- WCAG 2.1
- Developer Tools</code></pre>
        </div>
      </details>
    `;
  } else if (projectId === 'd8bab1ba-e04d-42de-a3a9-4fd215a31c76' || (data.title && data.title.includes('Churn'))) {
    contentContainer.innerHTML = `
      <div class="content-section">
        <h3>1. The Problem</h3>
        <p>The platform was bleeding users at checkout, but stakeholders had zero visibility into where or why the drop-off was occurring.</p>
      </div>
      <div class="content-section">
        <h3>2. The Evidence</h3>
        <p>50,000+ rows of unstructured, messy customer log data.</p>
      </div>
      <div class="content-section">
        <h3>3. The Insight</h3>
        <p>The abandonment wasn't random; by mapping the data, I discovered it spiked precisely at the shipping calculation step due to hidden system latency.</p>
      </div>
      <div class="content-section">
        <h3>4. The Fix</h3>
        <p>Architected a data pipeline to parse the raw logs, clean the data, and render it into a high-performance analytics dashboard.</p>
      </div>
      <div class="content-section">
        <h3>5. The Outcome</h3>
        <p>Identified the exact bottleneck, providing actionable engineering metrics that ultimately contributed to a 15% reduction in cart abandonment.</p>
      </div>
      <details class="arch-dropdown" style="margin-top: 32px;">
        <summary class="persuasive-click">View Tech Stack</summary>
        <div class="arch-content">
<pre><code>[Stack]
- Jupyter Notebook
- Python</code></pre>
        </div>
      </details>
    `;
  } else if (projectId === 'macbook-landing') {
    contentContainer.innerHTML = `
      <div class="content-section">
        <h3>1. The Narrative</h3>
        <p>Rather than standard Apple marketing copy, this page tells a raw, honest story. From tearing through 4K timelines in DaVinci Resolve, to laying down tracks in GarageBand, iterating UI in Figma, running dev servers with Antigravity IDE, and rendering 3D scenes in Blender. This machine handles the heavy stuff and breezes through the rest.</p>
      </div>
      <div class="content-section">
        <h3>2. Design System & Aesthetics</h3>
        <p>Inspired by the high-energy editorial style of Suburbia Skateboards, the page moves away from typical clean corporate templates in favor of a raw, analog street-style aesthetic. It features a color-blocked rhythm (Deep Black, Paper White, Electric Blue, and Burnt Orange), tactile screen-print grain overlays, sharp borders, and sticker-style buttons.</p>
      </div>
      <div class="content-section">
        <h3>3. Key Features</h3>
        <p><strong>3D Model Customizer:</strong> Interactive switches to toggle between 14" and 16" scaling, and real-time color swatches updating Three.js materials.</p>
        <p><strong>Exploded Component Scroll:</strong> A scroll-controlled GSAP sequence that spins the MacBook 360° and systematically explodes it into its 5 hardware layers.</p>
        <p><strong>Image Scatter Scroll:</strong> A floating showcase of creative renders that dynamically scatter into a clean board-style layout upon scroll.</p>
      </div>
      <details class="arch-dropdown" style="margin-top: 32px;">
        <summary class="persuasive-click">View Tech Stack</summary>
        <div class="arch-content">
<pre><code>[Stack]
- React.js & TypeScript
- GSAP & ScrollTrigger
- Three.js & React Three Fiber (R3F)
- Tailwind CSS v4
- Vite</code></pre>
        </div>
      </details>
    `;
  } else if (projectId === 'meow-starter') {
    contentContainer.innerHTML = `
      <div class="content-section">
        <h3>1. The Problem</h3>
        <p>The meow-starter framework's mobile module filtering lacked test coverage, creating a risk of regressions when mobile-specific modules were loaded or skipped incorrectly.</p>
      </div>
      <div class="content-section">
        <h3>2. The Evidence</h3>
        <p>Analysis of the existing test suite revealed no tests validating the mobile-compatible vs desktop-only module distinction. The filtering logic existed but was unverified.</p>
      </div>
      <div class="content-section">
        <h3>3. The Insight</h3>
        <p>Module filtering is a critical path — if a desktop-only module loads on mobile (or vice versa), it breaks the developer experience. This needed explicit regression protection.</p>
      </div>
      <div class="content-section">
        <h3>4. The Decision</h3>
        <p>Add comprehensive regression tests covering: mobile-compatible module loading, desktop-only module skipping, and edge cases around module detection.</p>
      </div>
      <div class="content-section">
        <h3>5. The Build</h3>
        <p>Implemented test suite using the project's existing Vitest setup. Tests validate the filtering logic across different module configurations and environments.</p>
      </div>
      <div class="content-section">
        <h3>6. The Outcome</h3>
        <p>103 tests passing. The PR was merged upstream, adding a safety net for future contributors and preventing silent filtering regressions.</p>
      </div>
      <div class="content-section">
        <h3>7. Reflection</h3>
        <p>Small, focused contributions to dependency management tools have outsized impact. Testing infrastructure is often overlooked but compounds value across every downstream user.</p>
      </div>
      <details class="arch-dropdown" style="margin-top: 32px;">
        <summary class="persuasive-click">View Tech Stack</summary>
        <div class="arch-content">
<pre><code>[Stack]
- JavaScript / TypeScript
- Vitest
- Module resolution
- Open Source workflow</code></pre>
        </div>
      </details>
    `;
  }

  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('project-content').style.display = 'block';

  if (typeof gsap !== 'undefined') {
    gsap.to(".fade-up", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    });
  }
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProject);
} else {
  loadProject();
}