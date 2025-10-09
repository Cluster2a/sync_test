import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function buildSSG() {
  // Add browser API polyfills for SSR
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  };
  
  global.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  };
  
  // Routes to pre-render
  const routes = ['/'];
  
  // Read the client build HTML template
  const templatePath = path.resolve(__dirname, 'dist/client/index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  // Import the server entry point
  const { render } = await import('./dist/server/entry-server.js');
  
  // Create output directory for static pages
  const staticDir = path.resolve(__dirname, 'dist/static');
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }
  
  // Copy all client assets to static directory
  const clientDir = path.resolve(__dirname, 'dist/client');
  console.log('Copying client assets...');
  copyDir(clientDir, staticDir);
  
  // Generate static HTML for each route
  for (const route of routes) {
    try {
      console.log(`Rendering route: ${route}`);
      
      // Render the route
      const appHtml = render(route);
      
      // Replace the placeholder in template with rendered HTML
      const html = template.replace('<!--ssr-outlet-->', appHtml);
      
      // Write the static HTML file
      const filename = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
      const filePath = path.resolve(staticDir, filename);
      
      // Ensure directory exists for nested routes
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, html);
      console.log(`Generated: ${filePath}`);
    } catch (error) {
      console.error(`Error rendering route ${route}:`, error);
    }
  }
  
  console.log('Static site generation complete!');
}

buildSSG().catch(console.error);
