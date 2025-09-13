import fs from "fs";
import path from "path";

const SITE_URL = "https://adventurebackpack.com"; // Replace with your actual domain  
const PUBLIC_DIR = path.join(process.cwd(), "public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const CACHE_FILE = path.join(process.cwd(), "content", "blog-cache.json");

// Ensure directories exist
function ensureDirectoriesExist() {
  // Create content directory if it doesn't exist
  const contentDir = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentDir)) {
    console.log(`Creating content directory: ${contentDir}`);
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // Create public directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.log(`Creating public directory: ${PUBLIC_DIR}`);
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
}

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  tags: string[];
  metaDescription: string;
  folder?: string;
  subfolders?: string[];
}

// A direct implementation to check if a file exists in the blog folder
function isFromBlogFolder(slug: string): boolean {
  const filePath = path.join(process.cwd(), "content", "blog", `${slug}.html`);
  return fs.existsSync(filePath);
}

// Check if a post has the same name as its parent folder
function isNamedAfterFolder(slug: string, folder?: string): boolean {
  if (!folder) return false;
  return slug === folder;
}

const escapeXML = (str: string) => 
  str.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&apos;");

// Get blog posts from the cache file
function getBlogCache(): BlogPostMeta[] {
  try {
    // If cache file doesn't exist, create empty cache
    if (!fs.existsSync(CACHE_FILE)) {
      console.log(`Cache file not found at ${CACHE_FILE}, creating empty cache`);
      const cacheDir = path.dirname(CACHE_FILE);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify([], null, 2));
      return [];
    }
    
    const cacheContent = fs.readFileSync(CACHE_FILE, "utf8");
    return JSON.parse(cacheContent);
  } catch (error) {
    console.error("Error reading blog cache:", error);
    return []; // Return empty array if there's an error
  }
}

// Helper function to determine the correct URL path for a post
function getPostUrl(post: { slug: string; folder?: string; subfolders?: string[] }): string {
  // Case 1: If we have a nested structure with subfolders, build the path from all segments
  if (post.subfolders && post.subfolders.length > 0) {
    // If the file has the same name as its parent folder (index file)
    if (post.slug === post.subfolders[post.subfolders.length - 1]) {
      // Remove the duplicate last segment
      return `${SITE_URL}/${post.subfolders.map(segment => escapeXML(segment)).join('/')}`;
    }
    
    // Regular nested file
    return `${SITE_URL}/${[...post.subfolders, post.slug].map(segment => escapeXML(segment)).join('/')}`;
  }

  // Case 2: If from blog folder, URL is /slug
  if (isFromBlogFolder(post.slug)) {
    return `${SITE_URL}/${escapeXML(post.slug)}`;
  }
  
  // Case 3: If in a subfolder and has the same name as the folder, URL is /folder
  if (post.folder && isNamedAfterFolder(post.slug, post.folder)) {
    return `${SITE_URL}/${escapeXML(post.folder)}`;
  }
  
  // Case 4: If in a subfolder with different name, URL is /folder/slug
  // Exception: posts in "blog" folder should be served from root
  if (post.folder && post.folder !== 'blog') {
    return `${SITE_URL}/${escapeXML(post.folder)}/${escapeXML(post.slug)}`;
  }
  
  // Default case: blog post, URL is /slug
  return `${SITE_URL}/${escapeXML(post.slug)}`;
}

function generateBlogSitemap() {
  try {
    // Ensure directories exist
    ensureDirectoriesExist();
    
    // Get posts from cache
    const posts = getBlogCache();
    console.log(`Read ${posts.length} posts from cache`);
    
    // Get unique folder names to create folder index URLs (first level only)
    // Exclude "blog" folder since it's already hardcoded above
    const folders = [...new Set(
      posts
        .filter(post => post.folder && post.folder !== 'blog')
        .map(post => post.folder)
    )].filter(Boolean);
    
    // Get unique nested subfolder paths for deeper levels
    const nestedPaths = [...new Set(
      posts
        .filter(post => post.subfolders && post.subfolders.length > 1)
        .map(post => {
          if (post.subfolders) {
            // Skip the last segment if it's the same as the slug (index file)
            if (post.slug === post.subfolders[post.subfolders.length - 1]) {
              return post.subfolders.slice(0, -1).join('/');
            }
            // Return the full subfolder path
            return post.subfolders.join('/');
          }
          return null;
        })
    )].filter(Boolean);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/trust</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${folders.map(folder => `
  <url>
    <loc>${SITE_URL}/${escapeXML(folder as string)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
  ${nestedPaths.map(path => `
  <url>
    <loc>${SITE_URL}/${escapeXML(path as string)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  ${posts
    .map(post => {
      const url = getPostUrl(post);
      
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

    // Ensure the public directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Create a minimal sitemap with just the homepage in case of error
    try {
      const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/trust</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

      // Ensure the public directory exists
      if (!fs.existsSync(PUBLIC_DIR)) {
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      }

      fs.writeFileSync(SITEMAP_PATH, minimalSitemap);
      console.log(`Created minimal sitemap due to errors at ${SITEMAP_PATH}`);
    } catch (fallbackError) {
      console.error("Failed to create minimal sitemap:", fallbackError);
    }
  }
}

// Run the sitemap generator
generateBlogSitemap();
