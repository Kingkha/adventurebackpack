import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "blog");
const contentDirectory = path.join(process.cwd(), "content");
const cacheFile = path.join(process.cwd(), "content", "blog-cache.json");

// Function to decode HTML entities (server-side version)
function decodeHtmlEntitiesServer(text: string): string {
  if (!text) return text
  
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// Ensure directories exist
function ensureDirectoriesExist() {
  // Create content directory if it doesn't exist
  if (!fs.existsSync(contentDirectory)) {
    console.log(`Creating content directory: ${contentDirectory}`);
    fs.mkdirSync(contentDirectory, { recursive: true });
  }

  // Create blog directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    console.log(`Creating blog directory: ${postsDirectory}`);
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  // Create public directory for sitemap if it doesn't exist
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    console.log(`Creating public directory: ${publicDir}`);
    fs.mkdirSync(publicDir, { recursive: true });
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
  subfolders?: string[]; // Add subfolders for deeper nesting
}

function processPostFile(filePath: string, slug: string, folder?: string, subfolders?: string[]): BlogPostMeta | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse front matter using gray-matter
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title) {
      console.warn(`Skipping file ${filePath}: Missing required title field`);
      return null;
    }
    
    // Check if date is in the future
    const postDate = new Date(data.date);
    const now = new Date();
    if (postDate > now) {
      console.log(`Skipping future post ${filePath}: Date is ${data.date}`);
      return null;
    }

    // Check if the article's date has been reached
    const articleDate = new Date(data.date);
    const currentDate = new Date();
    
    // If article date is in the future, skip it
    if (articleDate > currentDate) {
      console.log(`Skipping ${filePath}: Article date ${data.date} is in the future`);
      return null;
    }

    // Return metadata for the blog post
    return {
      slug: slug,
      title: decodeHtmlEntitiesServer(data.title || ""),
      date: data.date || "",
      excerpt: decodeHtmlEntitiesServer(data.excerpt || ""),
      featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
      author: data.author || "Editor",
      tags: Array.isArray(data.tags) ? data.tags : [],
      metaDescription: decodeHtmlEntitiesServer(data.metaDescription || data.excerpt || ""),
      folder: folder,
      subfolders: subfolders,
    };
  } catch (error: unknown) {
    console.error(`Error parsing file ${filePath}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

// Recursive function to process nested folders
function processNestedFolders(basePath: string, baseSegments: string[] = []): BlogPostMeta[] {
  const result: BlogPostMeta[] = [];
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(basePath)) {
    console.log(`Directory does not exist, skipping: ${basePath}`);
    return result;
  }
  
  // Get all items in the current directory
  const items = fs.readdirSync(basePath, { withFileTypes: true });
  
  // Process all files in the current directory
  const files = items.filter(item => !item.isDirectory() && (item.name.endsWith('.html') || item.name.endsWith('.md')));
  for (const file of files) {
    const filePath = path.join(basePath, file.name);
    const slug = file.name.replace(/\.(md|html)$/, "");
    
    // For folder indexes (files with same name as their parent folder)
    const isIndexFile = baseSegments.length > 0 && slug === baseSegments[baseSegments.length - 1];
    
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
  
  // Process all subdirectories
  const directories = items.filter(item => item.isDirectory());
  for (const dir of directories) {
    const dirPath = path.join(basePath, dir.name);
    const newSegments = [...baseSegments, dir.name];
    
    // Recursively process subdirectories
    const nestedPosts = processNestedFolders(dirPath, newSegments);
    result.push(...nestedPosts);
  }
  
  return result;
}

function generateBlogCache() {
  // Ensure all required directories exist
  ensureDirectoriesExist();

  let allPosts: BlogPostMeta[] = [];

  try {
    // 1. Get posts from blog directory if it exists
    if (fs.existsSync(postsDirectory)) {
      const blogFiles = fs.readdirSync(postsDirectory);
      const blogPosts = blogFiles
        .filter(filename => filename.endsWith('.html') || filename.endsWith('.md'))
        .map((filename): BlogPostMeta | null => {
          const filePath = path.join(postsDirectory, filename);
          const slug = filename.replace(/\.(md|html)$/, "");
          return processPostFile(filePath, slug);
        })
        .filter((post): post is BlogPostMeta => post !== null);

      allPosts = [...allPosts, ...blogPosts];
    } else {
      console.log(`Blog directory doesn't exist: ${postsDirectory}`);
    }

    // 2. Get posts from content subfolders if content directory exists
    if (fs.existsSync(contentDirectory)) {
      const contentSubfolders = fs.readdirSync(contentDirectory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== "blog")
        .map(dirent => dirent.name);

      // Process each top-level subfolder and its nested subfolders
      for (const folder of contentSubfolders) {
        const folderPath = path.join(contentDirectory, folder);
        
        // Process this folder and all nested subfolders
        const nestedPosts = processNestedFolders(folderPath, [folder]);
        allPosts = [...allPosts, ...nestedPosts];
      }
    } else {
      console.log(`Content directory doesn't exist: ${contentDirectory}`);
    }

    // Sort posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Create an empty cache file if no posts were found
    if (allPosts.length === 0) {
      console.log("No posts found, creating empty cache file");
      allPosts = [];
    }

    // Ensure parent directory exists
    const cacheDir = path.dirname(cacheFile);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Write to cache file
    fs.writeFileSync(cacheFile, JSON.stringify(allPosts, null, 2));
    console.log(`Cache generated with ${allPosts.length} posts at ${cacheFile}`);
  } catch (error) {
    console.error("Error during cache generation:", error);
    
    // Create an empty cache file if an error occurred
    fs.writeFileSync(cacheFile, JSON.stringify([], null, 2));
    console.log("Created empty cache file due to errors");
  }
}

generateBlogCache();
