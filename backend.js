// We are going to use the native browser fetch() API!
// This is 100% foolproof and avoids any CDN or Safari blocking issues.

const SUPABASE_BASE = 'https://cadazfnomibslxomgnnz.supabase.co/rest/v1';
const SUPABASE_LIKES_URL = `${SUPABASE_BASE}/project_likes`;
const SUPABASE_MESSAGES_URL = `${SUPABASE_BASE}/contact_messages`;
const SUPABASE_PROJECTS_URL = `${SUPABASE_BASE}/portfolio_projects`;
const SUPABASE_KEY = 'sb_publishable_1WZ0O5UKoFqeKslq1nmOpQ_EySifkQm';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

function logDebug(msg) {
  console.log(msg);
}

logDebug(">>> Native Fetch Backend Started <<<");

// ── LIKES LOGIC ──

// Fetch the current likes from the database
async function fetchLikes() {
  logDebug("Fetching likes...");
  try {
    const response = await fetch(`${SUPABASE_LIKES_URL}?select=*`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    logDebug("Fetched successfully! Found " + data.length + " records.");

    // Update the UI
    data.forEach(row => {
      const button = document.querySelector(`.like-button[data-project="${row.project_id}"]`);
      if (button) {
        button.querySelector('.like-count').textContent = row.likes;
      }
    });
  } catch (err) {
    logDebug("Fetch Error: " + err.message);
  }
}

// Handle Like Click
async function handleLikeClick(event) {
  event.preventDefault(); 
  const button = event.currentTarget;
  const projectId = button.getAttribute('data-project');
  const countSpan = button.querySelector('.like-count');
  
  logDebug("Click detected on: " + projectId);

  // Optimistic UI update
  let currentLikes = parseInt(countSpan.textContent) || 0;
  currentLikes += 1;
  countSpan.textContent = currentLikes;

  // Visual feedback
  button.style.color = 'var(--accent)';
  const svg = button.querySelector('svg');
  if (svg) {
    svg.setAttribute('fill', 'var(--accent)');
    svg.style.transition = 'transform 0.2s';
    svg.style.transform = 'scale(1.2)';
    setTimeout(() => svg.style.transform = 'scale(1)', 200);
  }

  try {
    const response = await fetch(SUPABASE_LIKES_URL, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ project_id: projectId, likes: currentLikes })
    });

    if (!response.ok) throw new Error(await response.text());
    logDebug("Successfully saved to database!");
  } catch (err) {
    logDebug("Save Error: " + err.message);
  }
}


// ── CONTACT FORM LOGIC ──

async function handleContactSubmit(event) {
  event.preventDefault(); // Stop page from refreshing!
  
  const form = event.target;
  const statusEl = document.getElementById('contact-status');
  const submitBtn = document.getElementById('contact-submit');
  
  // Grab data from inputs
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  // Update UI to show loading state
  statusEl.style.display = 'block';
  statusEl.style.color = 'var(--text)';
  statusEl.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.5';

  try {
    // Send POST request to Supabase
    const response = await fetch(SUPABASE_MESSAGES_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ name, email, message })
    });

    if (!response.ok) throw new Error(await response.text());

    // Success UI!
    statusEl.style.color = '#10B981'; // Success Green
    statusEl.textContent = 'Message sent successfully!';
    form.reset(); // Clear the form
    
  } catch (err) {
    console.error("Contact Form Error:", err);
    statusEl.style.color = '#EF4444'; // Error Red
    statusEl.textContent = 'Failed to send message. Please try again.';
  } finally {
    // Re-enable the button
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    
    // Hide the success/error message after 5 seconds
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 5000);
  }
}

// ── CMS DYNAMIC RENDERING (PHASE 4) ──

async function fetchProjects() {
  const container = document.getElementById('dynamic-projects-grid');
  if (!container) return; // Only run on the homepage
  
  logDebug("Fetching CMS projects...");
  try {
    // We order by created_at ascending (or descending, your choice)
    const response = await fetch(`${SUPABASE_PROJECTS_URL}?select=*&order=created_at.asc`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) throw new Error(await response.text());
    
    const projects = await response.json();
    logDebug("Fetched " + projects.length + " projects from CMS!");
    
    if (projects.length === 0) {
      container.innerHTML = '<p style="color: var(--muted); padding: 24px;">No projects found yet. Add some in the Admin Portal!</p>';
      return;
    }

    container.innerHTML = ''; // Clear loading state or empty container
    
    // Dynamically build the HTML for each project
    projects.forEach((proj, index) => {
      // Ensure we have a valid ID for likes
      const projId = proj.id;
      const num = String(index + 1).padStart(2, '0');
      
      const html = `
      <div class="bento-cell project-layout">
        <div class="project-media" style="border:1px solid var(--border);border-radius:8px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.05); height: 220px;">
          <img src="${proj.image_url}" alt="${proj.title}" style="width:100%;height:100%;object-fit:cover;display:block;opacity:0.92;" onerror="this.src='https://via.placeholder.com/600x400?text=Image+Missing'"/>
        </div>

        <div class="project-info">
          <p class="project-eyebrow">${num} // ${proj.role || 'Project'}</p>
          <p class="heading-sans" style="font-size:clamp(1.4rem, 2.5vw, 2rem);color:var(--text);line-height:1.1;margin-bottom:16px;">${proj.title}</p>
          <p style="color:var(--muted);font-family:'Inter',sans-serif;font-size:15px;line-height:1.6;">${proj.description}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px;">
            <a href="${proj.project_url || '#'}" target="_blank" rel="noopener noreferrer" class="btn-ghost" style="padding-bottom:4px; font-size:13px;">View Project →</a>
            <button class="like-button" data-project="${projId}" style="background:none; border:none; color:var(--muted); cursor:pointer; display:flex; align-items:center; gap:6px; font-family:var(--font-body); font-size:13px; transition:color 0.3s; padding:0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span class="like-count">0</span>
            </button>
          </div>
        </div>
      </div>
      `;
      
      container.insertAdjacentHTML('beforeend', html);
    });
    
    // Re-attach like button listeners to the newly created HTML buttons!
    const likeButtons = container.querySelectorAll('.like-button');
    likeButtons.forEach(btn => btn.addEventListener('click', handleLikeClick));
    
    // Refetch likes to populate the newly created buttons
    fetchLikes();
    
  } catch (err) {
    console.error("Failed to fetch CMS projects:", err);
    container.innerHTML = `<p style="color: #EF4444; padding: 24px;">Failed to load projects: ${err.message}</p>`;
  }
}

// ── INIT ──

function init() {
  logDebug("Attaching listeners...");
  
  // 1. Fetch CMS Projects
  // This will automatically fetch likes and attach like listeners when done.
  fetchProjects();

  // 2. Setup Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
}

// Ensure DOM is fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
