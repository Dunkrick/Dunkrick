// We are going to use the native browser fetch() API!
// This is 100% foolproof and avoids any CDN or Safari blocking issues.

const SUPABASE_URL = 'https://cadazfnomibslxomgnnz.supabase.co/rest/v1/project_likes';
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

// Fetch the current likes from the database
async function fetchLikes() {
  logDebug("Fetching likes...");
  try {
    // Adding select=* to get all columns
    const response = await fetch(`${SUPABASE_URL}?select=*`, {
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
  // Prevent the link from triggering if the button is nested
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
    // Send the UPSERT request to Supabase
    const response = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        ...headers,
        // The 'Prefer' header tells Supabase to Update if it already exists (Upsert)
        'Prefer': 'resolution=merge-duplicates' 
      },
      body: JSON.stringify({
        project_id: projectId,
        likes: currentLikes
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    logDebug("Successfully saved to database!");
  } catch (err) {
    logDebug("Save Error: " + err.message);
  }
}

// Connect everything
function init() {
  logDebug("Attaching listeners...");
  fetchLikes();

  const likeButtons = document.querySelectorAll('.like-button');
  logDebug(`Found ${likeButtons.length} buttons on the page.`);
  
  likeButtons.forEach(btn => {
    btn.addEventListener('click', handleLikeClick);
  });
}

// Ensure DOM is fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
