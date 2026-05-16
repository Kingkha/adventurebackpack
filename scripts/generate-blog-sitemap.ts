import fs from "fs";
import path from "path";
import { siteConfig, getBaseUrl } from "../lib/siteConfig";
import { GENERIC_TAGS, MAX_TAG_LENGTH, MIN_POSTS_PER_HUB } from "../config/tags";

function tagToSlug(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SITE_URL = getBaseUrl();
const PUBLIC_DIR = path.join(process.cwd(), "public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");       // always the index
const SITEMAP_POSTS_PATH = path.join(PUBLIC_DIR, "sitemap-posts.xml"); // post URLs (chunked if needed)
const SITEMAP_TAGS_PATH = path.join(PUBLIC_DIR, "sitemap-tags.xml");
const SITEMAP_CHUNK_SIZE = 1000;
const CACHE_FILE = path.join(process.cwd(), "public", "blog-cache.json");

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
  lastUpdate?: string;
  excerpt: string;
  featuredImage: string;
  inlineImages?: Array<{ src: string; alt?: string }>;
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
  // Remove duplicate city names from slug if present
  // e.g., "finland/rovaniemi/rovaniemi" -> "finland/rovaniemi"
  let cleanedSlug = post.slug
  if (cleanedSlug.includes('/')) {
    const parts = cleanedSlug.split('/')
    if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
      cleanedSlug = parts.slice(0, -1).join('/')
    }
  }
  
  // Case 1: If from blog folder (slug doesn't contain folder prefix), URL is /slug
  if (isFromBlogFolder(cleanedSlug.split('/').pop() || cleanedSlug)) {
    return `${SITE_URL}/${escapeXML(cleanedSlug)}`;
  }
  
  // Case 2: For content files, the slug already includes the country/folder prefix
  // Just use the cleaned slug directly
  return `${SITE_URL}/${escapeXML(cleanedSlug)}`;
}

function generateBlogSitemap() {
  try {
    // Ensure directories exist
    ensureDirectoriesExist();
    
    // Get posts from cache
    const posts = getBlogCache();
    console.log(`Read ${posts.length} posts from cache`);
    
    // Get unique folder names to create folder index URLs (first level only)
    // Only include folders that don't have an index file with the same name
    // Exclude first-level country folders (like 'spain', 'france', etc.)
    const folders = [...new Set(
      posts
        .filter(post => post.folder)
        .filter(post => !isNamedAfterFolder(post.slug, post.folder)) // Exclude index files
        .filter(post => {
          // Exclude first-level country folders - these are folders that don't have subfolders
          // or are direct country names without deeper nesting
          return post.subfolders && post.subfolders.length > 1;
        })
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

    // Build tag hub pages for specific (non-generic) tags with >= 5 posts
    const tagCounts: Record<string, number> = {};
    posts.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
    const tagSlugsSeen = new Set<string>();
    const tagSlugs: string[] = [];
    Object.entries(tagCounts)
      .filter(([tag, count]) => count >= MIN_POSTS_PER_HUB && !GENERIC_TAGS.has(tag) && tag.length <= MAX_TAG_LENGTH)
      .forEach(([tag]) => {
        const slug = tagToSlug(tag);
        if (!tagSlugsSeen.has(slug)) {
          tagSlugsSeen.add(slug);
          tagSlugs.push(slug);
        }
      });

    // Ensure the public directory exists
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const today = new Date().toISOString();

    // Static routes that live outside the post cache. Kept in the posts
    // sitemap so the sitemap index has two children regardless of post count.
    const staticRoutes: Array<{ path: string; changefreq: string; priority: string }> = [
      { path: "/", changefreq: "daily", priority: "1.0" },
      { path: "/blog", changefreq: "daily", priority: "0.8" },
      { path: "/about", changefreq: "monthly", priority: "0.7" },
      { path: "/trust", changefreq: "monthly", priority: "0.7" },
      { path: "/editorial-policy", changefreq: "monthly", priority: "0.7" },
      { path: "/methodology", changefreq: "monthly", priority: "0.7" },
      { path: "/contact", changefreq: "monthly", priority: "0.5" },
      { path: "/privacy", changefreq: "yearly", priority: "0.3" },
      { path: "/terms", changefreq: "yearly", priority: "0.3" },
      { path: "/cookies", changefreq: "yearly", priority: "0.3" },
    ];

    function toAbsoluteImageUrl(featuredImage: string | undefined): string | null {
      if (!featuredImage) return null;
      if (/^https?:\/\//i.test(featuredImage)) return featuredImage;
      const withSlash = featuredImage.startsWith("/") ? featuredImage : `/${featuredImage}`;
      return `${SITE_URL}${withSlash}`;
    }

    function renderStaticUrl(route: { path: string; changefreq: string; priority: string }): string {
      return `  <url>\n    <loc>${escapeXML(SITE_URL + route.path)}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`;
    }

    // ── Posts sitemap(s) — chunked if above threshold ─────────────────────
    // Emits one <image:image> per unique image (featured + inline body images)
    // so Google can index every image from the same sitemap. Inline images
    // carry their own <image:title> from the <img alt> so each entry is
    // distinct; the featured image falls back to the post title.
    function renderPostUrl(post: BlogPostMeta): string {
      const url = getPostUrl(post);
      const lastmod = new Date(post.lastUpdate || post.date).toISOString();

      const images: Array<{ loc: string; title: string }> = [];
      const seen = new Set<string>();
      const pushImage = (src: string | undefined, title: string) => {
        const abs = toAbsoluteImageUrl(src);
        if (!abs || seen.has(abs)) return;
        seen.add(abs);
        images.push({ loc: abs, title });
      };
      pushImage(post.featuredImage, post.title);
      (post.inlineImages || []).forEach((img) => pushImage(img.src, img.alt || post.title));

      const imageBlock = images
        .map((img) => `\n    <image:image>\n      <image:loc>${escapeXML(img.loc)}</image:loc>\n      <image:title>${escapeXML(img.title)}</image:title>\n    </image:image>`)
        .join("");
      return `  <url>\n    <loc>${escapeXML(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>${imageBlock}\n  </url>`;
    }

    const URLSET_OPEN = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
    const URLSET_CLOSE = `</urlset>`;

    const postSitemapFiles: string[] = []; // relative filenames for the index

    if (posts.length > SITEMAP_CHUNK_SIZE) {
      // Multiple chunk files: sitemap-posts-0.xml, sitemap-posts-1.xml, ...
      // Static routes go in the first chunk so they're always discoverable.
      for (let i = 0; i * SITEMAP_CHUNK_SIZE < posts.length; i++) {
        const chunk = posts.slice(i * SITEMAP_CHUNK_SIZE, (i + 1) * SITEMAP_CHUNK_SIZE);
        const chunkFilename = `sitemap-posts-${i}.xml`;
        const staticBlock = i === 0 ? staticRoutes.map(renderStaticUrl).join("\n") + "\n" : "";
        const chunkXml = `${URLSET_OPEN}\n${staticBlock}${chunk.map(renderPostUrl).join("\n")}\n${URLSET_CLOSE}`;
        fs.writeFileSync(path.join(PUBLIC_DIR, chunkFilename), chunkXml);
        postSitemapFiles.push(chunkFilename);
      }
      console.log(`Posts split into ${postSitemapFiles.length} chunk(s) of ${SITEMAP_CHUNK_SIZE}`);
    } else {
      // Single sitemap-posts.xml with static routes + all posts
      const postXml = `${URLSET_OPEN}\n${staticRoutes.map(renderStaticUrl).join("\n")}\n${posts.map(renderPostUrl).join("\n")}\n${URLSET_CLOSE}`;
      fs.writeFileSync(SITEMAP_POSTS_PATH, postXml);
      postSitemapFiles.push("sitemap-posts.xml");
    }

    // ── Tag sitemap ───────────────────────────────────────────────────────
    const tagSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${tagSlugs.map((slug) => `\n  <url>\n    <loc>${SITE_URL}/tag/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join("")}\n</urlset>`;
    fs.writeFileSync(SITEMAP_TAGS_PATH, tagSitemap);
    console.log(`Tag sitemap: ${tagSlugs.length} hub pages → sitemap-tags.xml`);

    // ── News sitemap ─────────────────────────────────────────────────────
    // Google News sitemap for posts published in the last 48 hours. Publisher
    // Center approval is separate, but the sitemap must exist and validate for
    // approval to succeed. Per spec, news sitemaps cap at 1,000 URLs max.
    const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;
    const cutoff = Date.now() - NEWS_WINDOW_MS;
    const newsPosts = posts
      .filter((p) => {
        const d = new Date(p.date).getTime();
        return !isNaN(d) && d >= cutoff;
      })
      .slice(0, 1000);

    const SITEMAP_NEWS_PATH = path.join(PUBLIC_DIR, "sitemap-news.xml");
    if (newsPosts.length > 0) {
      const publicationName = siteConfig.brand.name;
      const newsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsPosts
  .map((p) => {
    const url = escapeXML(getPostUrl(p));
    const pubDate = new Date(p.date).toISOString();
    return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXML(publicationName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXML(p.title)}</news:title>
    </news:news>
  </url>`;
  })
  .join("\n")}
</urlset>`;
      fs.writeFileSync(SITEMAP_NEWS_PATH, newsXml);
      console.log(`News sitemap: ${newsPosts.length} recent posts → sitemap-news.xml`);
    } else if (fs.existsSync(SITEMAP_NEWS_PATH)) {
      // No recent posts — remove stale news sitemap so Google doesn't keep
      // crawling empty content. Next run will recreate it when posts arrive.
      fs.unlinkSync(SITEMAP_NEWS_PATH);
      console.log("News sitemap: no posts in last 48h, removed stale sitemap-news.xml");
    }

    // ── sitemap.xml = always the index ────────────────────────────────────
    const allSitemapFiles = [...postSitemapFiles, "sitemap-tags.xml"];
    if (newsPosts.length > 0) allSitemapFiles.push("sitemap-news.xml");
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allSitemapFiles.map((f) => `  <sitemap>\n    <loc>${SITE_URL}/${f}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`).join("\n")}\n</sitemapindex>`;
    fs.writeFileSync(SITEMAP_PATH, sitemapIndex);
    console.log(`sitemap.xml → index referencing: ${allSitemapFiles.join(", ")}`);
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
  <url>
    <loc>${SITE_URL}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cookies</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
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
