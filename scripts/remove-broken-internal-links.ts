#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { siteConfig } from '../lib/siteConfig';

// Get domain from config (remove https:// for regex pattern)
const SITE_DOMAIN = siteConfig.domain.baseUrl.replace('https://', '').replace('http://', '');
const SITE_URL = siteConfig.domain.baseUrl;

/**
 * Extract all valid URLs from sitemap.xml
 */
function extractValidUrlsFromSitemap(sitemapPath: string): Set<string> {
  console.log('📄 Reading sitemap.xml...');
  
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap not found at ${sitemapPath}`);
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const validUrls = new Set<string>();

  // Extract all URLs from sitemap (dynamic domain pattern)
  const urlPattern = new RegExp(`<loc>(${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^<]+)<\/loc>`, 'g');
  const urlMatches = sitemapContent.match(urlPattern);
  
  if (urlMatches) {
    for (const match of urlMatches) {
      const url = match.replace(/<\/?loc>/g, '');
      validUrls.add(url);
      
      // Also add the path without domain for easier matching
      const urlPath = url.replace(SITE_URL, '');
      if (urlPath) {
        validUrls.add(urlPath);
        
        // Add URL-encoded version of the path for proper matching
        const encodedPath = encodeURI(urlPath);
        if (encodedPath !== urlPath) {
          validUrls.add(encodedPath);
          validUrls.add(SITE_URL + encodedPath);
        }
      }
    }
  }

  console.log(`✅ Found ${validUrls.size / 2} valid URLs in sitemap`);
  return validUrls;
}

/**
 * Check if a file exists in the content directory
 */
function checkFileExists(urlPath: string): boolean {
  if (!urlPath || urlPath === '/') return false;
  
  // Remove leading slash and add .html extension
  const cleanPath = urlPath.replace(/^\//, '');
  const filePath = path.join(process.cwd(), 'content', cleanPath + '.html');
  
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Remove broken internal links from HTML content using regex replacement
 */
function removeBrokenLinks(htmlContent: string, validUrls: Set<string>): { 
  cleanedHtml: string; 
  removedCount: number; 
  removedLinks: string[] 
} {
  let removedCount = 0;
  const removedLinks: string[] = [];

  // Build dynamic regex pattern for site URLs
  const escapedDomain = SITE_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const linkPattern = new RegExp(`<a[^>]*href=["'](https?:\\/\\/${escapedDomain}\\/[^"'<>]+)["'][^>]*>(.*?)<\\/a>`, 'gi');

  // Use regex replacement to handle broken links
  const cleanedHtml = htmlContent.replace(
    linkPattern,
    (fullMatch, url, linkText) => {
      // Exclude CDN links (wp-content, uploads, images, etc.)
      if (url.includes('/wp-content/') || 
          url.includes('/uploads/') || 
          url.includes('/images/') ||
          url.includes(`cdn.${SITE_DOMAIN}`)) {
        return fullMatch; // Keep CDN links unchanged
      }

      // Check if URL exists in sitemap (try both encoded and decoded versions)
      const urlPath = url.replace(SITE_URL, '');
      const decodedUrl = decodeURI(url);
      const decodedPath = decodedUrl.replace(SITE_URL, '');
      
      // Check all possible variations in sitemap
      const inSitemap = validUrls.has(url) || 
                       validUrls.has(urlPath) ||
                       validUrls.has(decodedUrl) ||
                       validUrls.has(decodedPath);
      
      // Check if file exists in content directory (try both encoded and decoded paths)
      const fileExists = checkFileExists(urlPath) || checkFileExists(decodedPath);
      
      // Keep link if it exists in sitemap OR as a file
      const urlExists = inSitemap || fileExists;
      
      if (!urlExists) {
        console.log(`🔗 Removing broken link: ${url} (not in sitemap and file doesn't exist)`);
        removedCount++;
        removedLinks.push(url);
        return linkText; // Return just the text content
      } else if (fileExists && !inSitemap) {
        console.log(`✅ Keeping link: ${url} (file exists but not in sitemap)`);
      }
      
      return fullMatch; // Keep valid links unchanged
    }
  );

  return {
    cleanedHtml,
    removedCount,
    removedLinks
  };
}

/**
 * Process HTML files in a specific directory
 */
function processHtmlFilesInDirectory(dirPath: string, dirName: string, validUrls: Set<string>): {
  totalProcessed: number;
  totalLinksRemoved: number;
  filesWithRemovedLinks: number;
} {
  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Directory not found: ${dirPath}`);
    return { totalProcessed: 0, totalLinksRemoved: 0, filesWithRemovedLinks: 0 };
  }

  const files = fs.readdirSync(dirPath);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  
  if (htmlFiles.length === 0) {
    return { totalProcessed: 0, totalLinksRemoved: 0, filesWithRemovedLinks: 0 };
  }

  console.log(`🔍 Scanning ${dirName} folder: ${htmlFiles.length} HTML files...`);

  let totalProcessed = 0;
  let totalLinksRemoved = 0;
  let filesWithRemovedLinks = 0;

  for (const file of htmlFiles) {
    const filePath = path.join(dirPath, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { cleanedHtml, removedCount, removedLinks } = removeBrokenLinks(content, validUrls);
      
      if (removedCount > 0) {
        // Write the cleaned content back to the file
        fs.writeFileSync(filePath, cleanedHtml, 'utf-8');
        
        console.log(`📝 ${dirName}/${file}: Removed ${removedCount} broken link(s)`);
        removedLinks.forEach(link => console.log(`   - ${link}`));
        
        totalLinksRemoved += removedCount;
        filesWithRemovedLinks++;
      }
      
      totalProcessed++;
      
      // Progress indicator for large folders
      if (totalProcessed % 500 === 0) {
        console.log(`⚡ ${dirName}: Processed ${totalProcessed}/${htmlFiles.length} files...`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${dirName}/${file}:`, error);
    }
  }

  if (filesWithRemovedLinks > 0) {
    console.log(`✅ ${dirName}: ${filesWithRemovedLinks} files modified, ${totalLinksRemoved} links removed`);
  }

  return { totalProcessed, totalLinksRemoved, filesWithRemovedLinks };
}

/**
 * Process all content folders (blog, country folders, etc.)
 */
function processAllContentFolders(contentDir: string, validUrls: Set<string>): void {
  if (!fs.existsSync(contentDir)) {
    console.log('❌ Content directory not found');
    return;
  }

  console.log(`🔍 Scanning all content folders in ${contentDir}...`);
  
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const folders = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
  
  console.log(`📁 Found ${folders.length} content folders to process`);

  let grandTotalProcessed = 0;
  let grandTotalLinksRemoved = 0;
  let grandTotalFilesModified = 0;

  for (const folder of folders) {
    const folderPath = path.join(contentDir, folder);
    const { totalProcessed, totalLinksRemoved, filesWithRemovedLinks } = 
      processHtmlFilesInDirectory(folderPath, folder, validUrls);
    
    grandTotalProcessed += totalProcessed;
    grandTotalLinksRemoved += totalLinksRemoved;
    grandTotalFilesModified += filesWithRemovedLinks;
  }

  console.log('\n📊 Grand Total Summary:');
  console.log(`   Folders processed: ${folders.length}`);
  console.log(`   Files processed: ${grandTotalProcessed}`);
  console.log(`   Files modified: ${grandTotalFilesModified}`);
  console.log(`   Total broken links removed: ${grandTotalLinksRemoved}`);
}

/**
 * Main function
 */
function main(): void {
  const projectRoot = process.cwd();
  const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
  const contentDir = path.join(projectRoot, 'content');

  console.log('🚀 Starting broken internal links removal...');
  console.log(`📁 Project root: ${projectRoot}`);
  console.log(`📄 Sitemap path: ${sitemapPath}`);
  console.log(`📁 Content directory: ${contentDir}`);

  try {
    // Extract valid URLs from sitemap
    const validUrls = extractValidUrlsFromSitemap(sitemapPath);
    
    // Process all content folders (blog, countries, etc.)
    processAllContentFolders(contentDir, validUrls);
    
    console.log('\n✅ Broken internal links removal completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main();
}

export { main, extractValidUrlsFromSitemap, removeBrokenLinks, processAllContentFolders, checkFileExists };
