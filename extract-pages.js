import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = ['index.html', 'work.html', 'project.html', 'dream-wall.html'];

for (const page of pages) {
  const filePath = path.join(__dirname, page);
  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, 'utf8');
  
  // Extract content between <main> and </main>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    let content = mainMatch[1].trim();
    
    // We also need to extract title and description for frontmatter, but we can do that manually later 
    // or just assume standard titles for now.
    fs.writeFileSync(path.join(__dirname, 'src', 'pages', page), content);
  }
}

console.log('Pages extracted.');
