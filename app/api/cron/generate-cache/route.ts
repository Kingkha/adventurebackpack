import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

  const folders = [...new Set(
    posts
      .filter(post => post.folder)
      .map(post => post.folder)
  )].filter(Boolean);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${folders.map(folder => `
  <url>
    <loc>${SITE_URL}/${escapeXML(folder as string)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
  ${posts.map(post => {
    const url = post.folder 
      ? `${SITE_URL}/${escapeXML(post.folder)}/${escapeXML(post.slug)}`
      : `${SITE_URL}/${escapeXML(post.slug)}`;
    
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