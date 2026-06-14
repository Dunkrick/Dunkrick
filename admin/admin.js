import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://cadazfnomibslxomgnnz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1WZ0O5UKoFqeKslq1nmOpQ_EySifkQm';

// Initialize the official Supabase JS client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// --- Session Management ---

async function checkSession() {
  // Check if a user is currently logged in
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    loginStatus.textContent = "Session Error: " + error.message;
    loginStatus.style.display = 'block';
  }

  if (data.session) {
    // User is logged in! Show the dashboard.
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    console.log("Logged in as:", data.session.user.email);
  } else {
    // Not logged in. Show the login form.
    dashboardView.classList.add('hidden');
    loginView.classList.remove('hidden');
  }
}

// --- Login Logic ---

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  loginBtn.textContent = 'Authenticating...';
  loginBtn.disabled = true;
  loginStatus.style.display = 'none';

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  loginBtn.textContent = 'Login';
  loginBtn.disabled = false;

  if (error) {
    alert("LOGIN ERROR: " + error.message);
    loginStatus.textContent = error.message;
    loginStatus.style.display = 'block';
  } else {
    alert("LOGIN SUCCESSFUL! Checking session now...");
    loginForm.reset();
    checkSession(); // This will swap the views
  }
});

// --- Logout Logic ---

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  checkSession(); // This will kick us back to the login screen
});

// --- Initialize ---

// Run the session check as soon as the page loads
checkSession();

// --- CMS Logic (Phase 3) ---

const projectForm = document.getElementById('project-form');
const projStatus = document.getElementById('proj-status');
const projSubmit = document.getElementById('proj-submit');

if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    projSubmit.textContent = 'Publishing...';
    projSubmit.disabled = true;
    projStatus.style.display = 'none';

    // 1. Gather the data from the form
    const newProject = {
      title: document.getElementById('proj-title').value,
      role: document.getElementById('proj-role').value,
      description: document.getElementById('proj-desc').value,
      image_url: document.getElementById('proj-image').value,
      project_url: document.getElementById('proj-url').value
    };

    // 2. Push to Supabase (Requires the user to be logged in, which they are!)
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([newProject]);

    projSubmit.textContent = 'Publish Project ↗';
    projSubmit.disabled = false;

    if (error) {
      projStatus.textContent = 'Error: ' + error.message;
      projStatus.style.color = '#EF4444'; // Red
      projStatus.style.display = 'block';
    } else {
      projStatus.textContent = 'Project published successfully!';
      projStatus.style.color = 'var(--accent)'; // Green/Accent
      projStatus.style.display = 'block';
      projectForm.reset();
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        projStatus.style.display = 'none';
      }, 3000);
    }
  });
}