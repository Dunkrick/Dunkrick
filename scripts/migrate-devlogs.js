import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fm from 'front-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'devlog');
const OUTPUT_FILE = path.join(__dirname, '..', 'content', 'timeline.json');

const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

const entries = files.map(file => {
  const parsedContent = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const parsed = fm(parsedContent);
  return {
    filename: file,
    attributes: parsed.attributes,
    body: parsed.body,
  };
});

// Sort in reverse chronological order based on filename
entries.sort((a, b) => b.filename.localeCompare(a.filename));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2), 'utf8');
console.log(`Migrated ${entries.length} devlog entries to ${OUTPUT_FILE}`);
