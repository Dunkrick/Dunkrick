import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import fm from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, 'content', 'devlog');
const TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');
const PAGES_DIR = path.join(__dirname, 'src', 'pages');

const LAYOUT_FILE = path.join(TEMPLATES_DIR, 'layout.html');
const layoutHtml = fs.readFileSync(LAYOUT_FILE, 'utf8');

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
  return html.replace(
    /<p>\s*<em>(EP-\d{3}:\s*[^<]+)<\/em>\s*<\/p>/g,
    '<blockquote class="ep-callout"><span class="ep-label">$1</span></blockquote>'
  );
}

// ── Page Metadata ──
const pageMeta = {
  'index.html': { 
    title: 'Rithwick Gurram - Product Engineer', 
    description: 'Product Engineer building complex systems and simple interfaces.', 
    url: '', 
    id: '',
    progress: '',
    cta: '',
    extraHead: `<!-- Structured Data for Google Search (Logo & Site Name) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rithwick Gurram",
    "url": "https://rithwick.me"
  }
  </script>`
  },
  'work.html': { 
    title: 'Rithwick Gurram - Product Engineer', 
    description: 'Product Engineer building complex systems and simple interfaces.', 
    url: 'work.html', 
    id: '',
    progress: '',
    cta: '',
    extraHead: ''
  },
  'project.html': { 
    title: 'Rithwick Gurram - Case Study', 
    description: 'Product Engineer building complex systems and simple interfaces.', 
    url: 'project.html', 
    id: 'project-container',
    progress: '',
    cta: '',
    extraHead: '',
    extraScripts: '<script type="module" src="assets/js/project.js"></script>'
  },
  'dream-wall.html': { 
    title: 'Building Dream-wall (Devlog) - Rithwick Gurram', 
    description: 'The unfiltered process of building a complex system.', 
    url: 'dream-wall.html', 
    id: '',
    progress: '<div class="reading-progress" id="reading-progress"></div>',
    cta: '',
    extraHead: ''
  }
};

// ── Build Pages ──

const pages = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));

for (const page of pages) {
  let content = fs.readFileSync(path.join(PAGES_DIR, page), 'utf8');
  const meta = pageMeta[page] || { title: 'Rithwick Gurram', description: '', url: page, id: '', progress: '', cta: '', extraHead: '' };

  // Special processing for devlog
  if (page === 'dream-wall.html') {
    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
    const entries = files.map(file => {
      const parsedContent = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      const parsed = fm(parsedContent);
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
    
    entries.sort((a, b) => b.filename.localeCompare(a.filename));
    
    const totalDays = entries.length;
    const totalEPs = entries.reduce((sum, e) => sum + e.epCount, 0);
    const totalVersions = 3;
    
    let htmlOutput = '';
    entries.forEach((entry) => {
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
    
    content = content.replace(/data-stat-days="[^"]*"/, `data-stat-days="${totalDays}"`);
    content = content.replace(/data-stat-versions="[^"]*"/, `data-stat-versions="${totalVersions}"`);
    content = content.replace(/data-stat-eps="[^"]*"/, `data-stat-eps="${totalEPs}"`);
    
    const startMarker = '<!-- DEVLOG_ENTRIES_START -->';
    const endMarker = '<!-- DEVLOG_ENTRIES_END -->';
    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const before = content.substring(0, startIndex + startMarker.length);
      const after = content.substring(endIndex);
      content = before + '\n' + htmlOutput + '        ' + after;
    }
    
    console.log(`[dream-wall] -> ${totalDays} entries, ${totalVersions} versions, ${totalEPs} EPs`);
  }

  // Inject into Layout
  let finalHtml = layoutHtml;
  finalHtml = finalHtml.replace(/\{\{TITLE\}\}/g, meta.title);
  finalHtml = finalHtml.replace(/\{\{DESCRIPTION\}\}/g, meta.description);
  finalHtml = finalHtml.replace(/\{\{URL\}\}/g, meta.url);
  finalHtml = finalHtml.replace(/\{\{MAIN_ID\}\}/g, meta.id ? `id="${meta.id}" ` : '');
  finalHtml = finalHtml.replace(/\{\{PROGRESS_BAR\}\}/g, meta.progress);
  finalHtml = finalHtml.replace(/\{\{FOOTER_CTA\}\}/g, meta.cta);
  finalHtml = finalHtml.replace(/\{\{EXTRA_HEAD\}\}/g, meta.extraHead || '');
  finalHtml = finalHtml.replace(/\{\{EXTRA_SCRIPTS\}\}/g, meta.extraScripts || '');
  finalHtml = finalHtml.replace(/\{\{CONTENT\}\}/g, content);

  fs.writeFileSync(path.join(__dirname, page), finalHtml, 'utf8');
  console.log(`Built ${page}`);
}
// ── Generate Sitemap ──
const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rithwick.me/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rithwick.me/work.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://rithwick.me/dream-wall.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://rithwick.me/project.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('Generated sitemap.xml');

console.log('Build completed successfully.');
