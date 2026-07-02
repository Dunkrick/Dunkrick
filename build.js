import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import fm from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, 'content', 'devlog');
const HTML_FILE = path.join(__dirname, 'dream-wall.html');

// ── Helpers ──

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function countEPs(htmlBody) {
  const matches = htmlBody.match(/EP-\d{3}/g);
  return matches ? matches.length : 0;
}

function wrapEPCallouts(html) {
  // Match <em>EP-XXX: ...</em> and wrap in a blockquote callout
  return html.replace(
    /<p>\s*<em>(EP-\d{3}:\s*[^<]+)<\/em>\s*<\/p>/g,
    '<blockquote class="ep-callout"><span class="ep-label">$1</span></blockquote>'
  );
}

// ── Read & Parse ──

const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

const entries = files.map(file => {
  const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const parsed = fm(content);
  const htmlBody = wrapEPCallouts(marked.parse(parsed.body));
  return {
    filename: file,
    attributes: parsed.attributes,
    body: htmlBody,
    rawBody: parsed.body,
    readingTime: estimateReadingTime(parsed.body),
    epCount: countEPs(htmlBody)
  };
});

// Sort entries descending by day (day-10.md before day-09.md, etc.)
entries.sort((a, b) => b.filename.localeCompare(a.filename));

// ── Compute Stats ──

const totalDays = entries.length;
const totalEPs = entries.reduce((sum, e) => sum + e.epCount, 0);
// Count version milestones (hardcoded markers + the active v3.0.0)
const totalVersions = 3;

// ── Generate Entry HTML ──

let htmlOutput = '';

entries.forEach((entry, index) => {
  // Insert v2.5.0 act break before day-07
  if (entry.filename === 'day-07.md') {
    htmlOutput += `
        </div>
        <div class="act-break fade-up">
          <div class="act-break-rule"></div>
          <div class="act-break-content">
            <span class="act-break-status">Completed</span>
            <h3 class="act-break-title">v2.5.0 — Production Ready</h3>
            <p class="act-break-desc">Migrated to a robust PostgreSQL + Prisma stack with a clean 3-tier TypeScript architecture. Finalized with strict validation and error handling.</p>
          </div>
          <div class="act-break-rule"></div>
        </div>
        <div class="timeline-container fade-up" style="margin-bottom: 64px;">
`;
  }

  // Insert v1.0 act break before day-03
  if (entry.filename === 'day-03.md') {
    htmlOutput += `
        </div>
        <div class="act-break fade-up">
          <div class="act-break-rule"></div>
          <div class="act-break-content">
            <span class="act-break-status">Completed</span>
            <h3 class="act-break-title">v1.0 — Core Foundation</h3>
            <p class="act-break-desc">Built the fundamental mechanics. Set up the Node.js environment, Express API, SQLite persistence, and a vanilla JavaScript frontend.</p>
          </div>
          <div class="act-break-rule"></div>
        </div>
        <div class="timeline-container fade-up" style="margin-bottom: 64px;">
`;
  }

  const isActive = entry.attributes.active ? 'entry-active' : '';
  const isCollapsible = !entry.attributes.active && entry.rawBody.trim().split(/\n\n+/).length > 3;

  htmlOutput += `
          <article class="timeline-entry ${isActive}${isCollapsible ? ' entry-collapsible entry-collapsed' : ''}">
            <div class="timeline-meta">
              <time class="timeline-date">${entry.attributes.date}</time>
              <span class="timeline-tag">${entry.attributes.tag}</span>
              <span class="timeline-reading-time">${entry.readingTime}</span>
            </div>
            <h2 class="timeline-title">${entry.attributes.title}</h2>
            <div class="timeline-content">
              ${entry.body}
            </div>${isCollapsible ? '\n            <button class="entry-expand-btn" aria-label="Expand entry">Continue reading</button>' : ''}
          </article>
`;
});

// ── Inject into HTML ──

let html = fs.readFileSync(HTML_FILE, 'utf8');

// Replace stats placeholders
html = html.replace(/data-stat-days="[^"]*"/, `data-stat-days="${totalDays}"`);
html = html.replace(/data-stat-versions="[^"]*"/, `data-stat-versions="${totalVersions}"`);
html = html.replace(/data-stat-eps="[^"]*"/, `data-stat-eps="${totalEPs}"`);

// Replace devlog entries
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

console.log(`Successfully built dream-wall.html devlog!`);
console.log(`  → ${totalDays} entries, ${totalVersions} versions, ${totalEPs} engineering principles`);
