// Supabase setup
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cadazfnomibslxomgnnz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1WZ0O5UKoFqeKslq1nmOpQ_EySifkQm';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    document.getElementById('loading-state').innerHTML = '<p>Project not found. <a href="index.html#work">Return to work</a>.</p>';
    return;
  }

  let data = null;
  let error = null;

  if (projectId === 'happiclap') {
    data = {
      title: "Happiclap: E-commerce Redesign",
      role: "UX/UI Redesign",
      description: "Redesigned the homepage of a gifting platform to reduce bounce rates, establish clear visual hierarchy, and streamline product discovery.",
      project_url: "https://app.notion.com/p/Happiclap-Homepage-Redesign-3489d1ca459680c9b198cbea438954cb",
      live_url: "https://happiclap-ebon.vercel.app"
    };
  } else {
    try {
      const result = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('id', projectId)
        .single();
      data = result.data;
      error = result.error;
    } catch (e) {
      error = e;
    }
  }

  if (error || !data) {
    console.error("Error fetching project:", error);
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

  if (projectId === 'happiclap') {
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
