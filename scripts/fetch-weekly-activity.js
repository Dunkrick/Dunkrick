import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIMELINE_FILE = path.join(__dirname, '..', 'content', 'timeline.json');

async function fetchActivity() {
  const token = process.env.GH_TOKEN;
  const username = process.env.GITHUB_ACTOR || 'rithwick-gurram'; // fallback username
  const isLLMEnabled = !!process.env.LLM_API_KEY;

  if (!token) {
    console.warn("Warning: GH_TOKEN not found in environment.");
  }

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Devlog-Automation-Script'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  console.log(`Fetching events for user: ${username}...`);
  const res = await fetch(`https://api.github.com/users/${username}/events`, { headers });
  
  if (!res.ok) {
     throw new Error(`Failed to fetch GitHub events: ${res.statusText}`);
  }

  const events = await res.json();
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const recentEvents = events.filter(e => new Date(e.created_at) > oneWeekAgo);
  
  let commits = [];
  
  recentEvents.forEach(e => {
    if (e.type === 'PushEvent') {
      e.payload.commits.forEach(c => {
         // Clean up merge commits or simple typos if needed
         if (!c.message.startsWith('Merge pull request')) {
            commits.push(`- ${c.message} (${e.repo.name})`);
         }
      });
    }
  });

  if (commits.length === 0) {
    console.log("No new commits found in the last week. Skipping devlog update.");
    return;
  }

  commits = [...new Set(commits)].slice(0, 30); // Take top 30 unique commits

  let bodyMarkdown = `### Weekly Progress\n\nHere are the major updates and commits from this week:\n\n${commits.join('\n')}\n\n*(This entry was auto-generated from GitHub activity)*`;

  // --- Scope for LLM Integration ---
  if (isLLMEnabled) {
     console.log("LLM_API_KEY detected. In the future, you can implement the API call here to summarize the 'commits' array into a nice story!");
     // Example: bodyMarkdown = await callGeminiAPI(commits, process.env.LLM_API_KEY);
  }
  // ---------------------------------

  const dateStr = new Date().toISOString().split('T')[0];
  const newEntry = {
    filename: `auto-${dateStr}.md`, // Kept for sorting compatibility
    attributes: {
      title: `Weekly Update`,
      date: dateStr,
      tag: "Engineering",
      active: true
    },
    body: bodyMarkdown
  };

  const rawEntries = JSON.parse(fs.readFileSync(TIMELINE_FILE, 'utf8'));
  
  // Set all old entries active to false (assuming only the newest is "active")
  rawEntries.forEach(entry => {
     if (entry.attributes) {
        entry.attributes.active = false;
     }
  });

  rawEntries.unshift(newEntry);
  
  // Sort reverse chronological
  rawEntries.sort((a, b) => {
     const dateA = a.attributes.date || '';
     const dateB = b.attributes.date || '';
     return dateB.localeCompare(dateA);
  });

  fs.writeFileSync(TIMELINE_FILE, JSON.stringify(rawEntries, null, 2), 'utf8');
  console.log(`Successfully appended weekly update with ${commits.length} commits.`);
}

fetchActivity().catch(console.error);
