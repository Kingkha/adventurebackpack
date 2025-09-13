import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

const contentDirectory = path.join(process.cwd(), "content");
const cacheFile = path.join(process.cwd(), "content", "blog-cache.json");
const sitemapFile = path.join(process.cwd(), "public", "sitemap.xml");

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

function processPostFile(filePath: string, slug: string, folder?: string, subfolders?: string[]): BlogPostMeta | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    if (!data.title || !data.date) {
      console.warn(`Skipping file ${filePath}: Missing required fields`);
      return null;
    }

    const articleDate = new Date(data.date);
    const currentDate = new Date();
    
    if (articleDate > currentDate) {
      console.log(`Skipping ${filePath}: Article date ${data.date} is in the future`);
      return null;
    }

    return {
      slug: slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
      author: data.author || "AdventureBackpack Editor",
      tags: Array.isArray(data.tags) ? data.tags : [],
      metaDescription: data.metaDescription || data.excerpt || "",
      folder: folder,
      subfolders: subfolders,
    };
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    return null;
  }
}

function processNestedFolders(basePath: string, baseSegments: string[] = []): BlogPostMeta[] {
  const result: BlogPostMeta[] = [];
  
  const items = fs.readdirSync(basePath, { withFileTypes: true });
  
  const files = items.filter(item => !item.isDirectory() && (item.name.endsWith('.html') || item.name.endsWith('.md')));
  for (const file of files) {
    const filePath = path.join(basePath, file.name);
    const slug = file.name.replace(/\.(md|html)$/, "");
    
    const post = processPostFile(
      filePath, 
      slug, 
      baseSegments.length > 0 ? baseSegments[0] : undefined,
      baseSegments.length > 1 ? baseSegments : undefined
    );
    
    if (post) {
      result.push(post);
    }
  }
  
  const directories = items.filter(item => item.isDirectory());
  for (const dir of directories) {
    const dirPath = path.join(basePath, dir.name);
    const newSegments = [...baseSegments, dir.name];
    const nestedPosts = processNestedFolders(dirPath, newSegments);
    result.push(...nestedPosts);
  }
  
  return result;
}

function generateBlogCache() {
  let allPosts: BlogPostMeta[] = [];

  const contentSubfolders = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of contentSubfolders) {
    const folderPath = path.join(contentDirectory, folder);
    const nestedPosts = processNestedFolders(folderPath, [folder]);
    allPosts = [...allPosts, ...nestedPosts];
  }

  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  fs.writeFileSync(cacheFile, JSON.stringify(allPosts, null, 2));
  return allPosts;
}

function generateSitemap(posts: BlogPostMeta[]) {
  const SITE_URL = "https://adventurebackpack.com";
  const escapeXML = (str: string) => 
    str.replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&apos;");

  // Get unique folder names to create folder index URLs (first level only)
  // Exclude "blog" folder since it's already hardcoded below
  const folders = [...new Set(
    posts
      .filter(post => post.folder && post.folder !== 'blog')
      .map(post => post.folder)
  )].filter(Boolean);

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

    // Case 2: If in a subfolder and has the same name as the folder, URL is /folder
    if (post.folder && post.slug === post.folder) {
      return `${SITE_URL}/${escapeXML(post.folder)}`;
    }
    
    // Case 3: If in a subfolder with different name, URL is /folder/slug
    // Exception: posts in "blog" folder should be served from root
    if (post.folder && post.folder !== 'blog') {
      return `${SITE_URL}/${escapeXML(post.folder)}/${escapeXML(post.slug)}`;
    }
    
    // Default case: blog post, URL is /slug
    return `${SITE_URL}/${escapeXML(post.slug)}`;
  }

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
  ${posts.map(post => {
    const url = getPostUrl(post);
    
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join("")}
</urlset>`;

  fs.writeFileSync(sitemapFile, sitemap);
}

export async function GET(request: Request) {
  try {
    console.log('Running blog cache and sitemap generation...');
    
    // Generate blog cache
    const posts = generateBlogCache();
    console.log('Blog cache generated successfully');
    
    // Generate sitemap
    generateSitemap(posts);
    console.log('Sitemap generated successfully');

    return new NextResponse('Cache and sitemap generated successfully', { status: 200 });
  } catch (error) {
    console.error('Error in cron job:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 