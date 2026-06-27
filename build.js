import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import fm from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, 'content', 'devlog');
const HTML_FILE = path.join(__dirname, 'dream-wall.html');

// Helper to format date
function formatDate(dateStr) {
  return dateStr;
}

// Read all markdown files
const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

const entries = files.map(file => {
  const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const parsed = fm(content);
  return {
    filename: file,
    attributes: parsed.attributes,
    body: marked.parse(parsed.body)
  };
});

// Sort entries descending by day (assuming format day-XX.md)
entries.sort((a, b) => b.filename.localeCompare(a.filename));

// Generate HTML
let htmlOutput = '';

entries.forEach((entry, index) => {
  // If it's day-03, we insert the v1.0 card before it
  if (entry.filename === 'day-03.md') {
    htmlOutput += `
        </div>
        <!-- VERSION 1.0 -->
        <div class="fade-up" style="margin-bottom: 32px;">
          <div class="mini-bento-card" style="align-items: flex-start; cursor: default;">
            <div class="card-content">
              <span class="card-eyebrow" style="display: flex; align-items: center; gap: 6px; color: var(--text-muted);">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted);"></span> Completed
              </span>
              <h3 class="card-title">v1.0 — Core Foundation</h3>
              <p class="card-desc" style="margin-top: 8px;">Built the fundamental mechanics. Set up the Node.js environment, Express API, SQLite persistence, and a vanilla JavaScript frontend.</p>
            </div>
          </div>
        </div>
        <div class="timeline-container fade-up" style="margin-bottom: 64px;">
`;
  }

  const isActive = entry.attributes.active ? 'entry-active' : '';
  
  htmlOutput += `
          <article class="timeline-entry ${isActive}">
            <div class="timeline-meta">
              <time class="timeline-date">${entry.attributes.date}</time>
              <span class="timeline-tag">${entry.attributes.tag}</span>
            </div>
            <h2 class="timeline-title">${entry.attributes.title}</h2>
            <div class="timeline-content">
              ${entry.body}
            </div>
          </article>
`;
});

// Read the dream-wall.html
let html = fs.readFileSync(HTML_FILE, 'utf8');

// Replace everything between the markers
const startMarker = '<!-- DEVLOG_ENTRIES_START -->';
const endMarker = '<!-- DEVLOG_ENTRIES_END -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found in dream-wall.html");
  process.exit(1);
}

const before = html.substring(0, startIndex + startMarker.length);
const after = html.substring(endIndex);

const newHtml = before + '\n' + htmlOutput + '        ' + after;

fs.writeFileSync(HTML_FILE, newHtml, 'utf8');

console.log('Successfully built dream-wall.html devlog!');
