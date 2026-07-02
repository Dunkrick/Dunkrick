import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_FILE = path.join(__dirname, 'assets', 'css', 'style.css');
const lines = fs.readFileSync(CSS_FILE, 'utf8').split('\n');

function getLines(start, end) {
  return lines.slice(start - 1, end).join('\n') + '\n\n';
}

const globals = 
  getLines(1, 137) + 
  getLines(708, 714) + 
  getLines(782, 792);

const layout = 
  getLines(138, 306) + 
  getLines(543, 550);

const components = 
  getLines(428, 542) + 
  getLines(612, 707) + 
  getLines(715, 781) + 
  getLines(793, 885);

const pages = 
  getLines(307, 427) + 
  getLines(551, 611) + 
  getLines(1272, 1393);

const devlog = 
  getLines(886, 1271);

fs.writeFileSync(path.join(__dirname, 'src', 'css', 'globals', 'globals.css'), globals);
fs.writeFileSync(path.join(__dirname, 'src', 'css', 'globals', 'layout.css'), layout);
fs.writeFileSync(path.join(__dirname, 'src', 'css', 'components', 'components.css'), components);
fs.writeFileSync(path.join(__dirname, 'src', 'css', 'pages', 'pages.css'), pages);
fs.writeFileSync(path.join(__dirname, 'src', 'css', 'pages', 'devlog.css'), devlog);

// The new main style.css that just imports these modules
const mainCSS = `@import '../../src/css/globals/globals.css';
@import '../../src/css/globals/layout.css';
@import '../../src/css/components/components.css';
@import '../../src/css/pages/pages.css';
@import '../../src/css/pages/devlog.css';
`;

fs.writeFileSync(CSS_FILE, mainCSS);

console.log('CSS Modularization Complete.');
