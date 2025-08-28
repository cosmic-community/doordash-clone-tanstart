import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function injectConsoleCapture() {
  try {
    const buildDir = '.vinxi';
    const publicDir = join(buildDir, 'build', 'client');
    
    // Find all HTML files in the build directory
    const htmlFiles = await findHTMLFiles(publicDir);
    
    // Script tag to inject
    const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
    
    for (const htmlFile of htmlFiles) {
      const content = await readFile(htmlFile, 'utf-8');
      
      // Check if script is already injected
      if (content.includes('/dashboard-console-capture.js')) {
        console.log(`Console capture already injected in ${htmlFile}`);
        continue;
      }
      
      // Inject script tag in the head
      const injectedContent = content.replace(
        '</head>',
        `  ${scriptTag}\n</head>`
      );
      
      await writeFile(htmlFile, injectedContent);
      console.log(`Console capture injected into ${htmlFile}`);
    }
    
    console.log('Console capture injection completed');
  } catch (error) {
    console.error('Error injecting console capture:', error);
    process.exit(1);
  }
}

async function findHTMLFiles(dir) {
  const htmlFiles = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await findHTMLFiles(fullPath);
        htmlFiles.push(...subFiles);
      } else if (entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist, ignore
  }
  
  return htmlFiles;
}

injectConsoleCapture();