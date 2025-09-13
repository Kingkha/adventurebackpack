import { exec } from 'child_process';
import path from 'path';

// Function to run the generation scripts
function runGenerationScripts() {
  console.log('Running blog cache and sitemap generation...');
  
  // Run the blog cache generation script
  exec('npx tsx ./scripts/generate-blog-cache.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating blog cache: ${error}`);
      return;
    }
    console.log('Blog cache generated successfully');
    
    // After blog cache is generated, run the sitemap generation
    exec('npx tsx ./scripts/generate-blog-sitemap.ts', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating sitemap: ${error}`);
        return;
      }
      console.log('Sitemap generated successfully');
    });
  });
}

// Run immediately on startup
runGenerationScripts();

// Then run every day at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    runGenerationScripts();
  }
}, 60000); // Check every minute

console.log('Scheduled publishing service started. Will check for new articles daily at midnight.'); 