import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { MAX_TAG_LENGTH } from "../config/tags";

// ─── Frontmatter schema ───────────────────────────────────────────────────────
const FrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  excerpt: z.string().min(1, "excerpt is required"),
  featuredImage: z.string().startsWith("/", "featuredImage must be a relative path"),
  author: z.string().min(1, "author is required"),
  tags: z.array(z.string()).min(1, "at least one tag is required"),
  metaDescription: z.string().min(50, "metaDescription should be at least 50 chars").max(165, "metaDescription should be ≤165 chars").optional(),
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "lastUpdated must be YYYY-MM-DD").optional(),
  lastUpdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "lastUpdate must be YYYY-MM-DD").optional(),
}).passthrough();

// Tag governance (CANONICAL_TAGS, GENERIC_TAGS, MAX_TAG_LENGTH) lives in
// config/tags.ts — the single source of truth. Edit that file when rebranding.
function sanitizeTags(rawTags: string[]): string[] {
  return rawTags.filter((t) => typeof t === "string" && t.length <= MAX_TAG_LENGTH);
}

// Validation stats collected across the run
const validationIssues: { file: string; issues: string[] }[] = [];

const postsDirectory = path.join(process.cwd(), "content", "blog");
const contentDirectory = path.join(process.cwd(), "content");
const publicDirectory = path.join(process.cwd(), "public");
const cacheFile = path.join(publicDirectory, "blog-cache.json");

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

// Function to fix common YAML front matter issues
function fixYamlFrontMatter(content: string): string {
  const lines = content.split('\n');
  const frontMatterStart = lines.findIndex(line => line.trim() === '---');
  const frontMatterEnd = lines.findIndex((line, index) => index > frontMatterStart && line.trim() === '---');
  
  if (frontMatterStart === -1 || frontMatterEnd === -1) {
    return content; // No front matter found
  }
  
  // Extract front matter lines
  const frontMatterLines = lines.slice(frontMatterStart + 1, frontMatterEnd);
  const bodyLines = lines.slice(frontMatterEnd + 1);
  
  // Fix YAML issues in front matter
  const fixedFrontMatter = fixYamlLines(frontMatterLines);
  
  // Reconstruct the content
  return [
    '---',
    ...fixedFrontMatter,
    '---',
    ...bodyLines
  ].join('\n');
}

// Function to fix YAML lines
function fixYamlLines(lines: string[]): string[] {
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip empty lines
    if (line.trim() === '') {
      result.push(line);
      i++;
      continue;
    }
    
    // Handle YAML key-value pairs
    if (line.includes(':') && !line.trim().startsWith('-')) {
      const colonIndex = line.indexOf(':');
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Check if this is a broken multi-line value
      if (value && !value.startsWith('"') && !value.startsWith("'") && !value.startsWith('|')) {
        // Look ahead for continuation lines that don't start with a key
        let j = i + 1;
        while (j < lines.length && 
               lines[j].trim() !== '' && 
               !lines[j].includes(':') && 
               !lines[j].trim().startsWith('-')) {
          // Handle broken words (like "C" + "áceres")
          const nextLine = lines[j].trim();
          if (value.length > 0 && !value.endsWith(' ') && !nextLine.startsWith(' ')) {
            // If the previous line doesn't end with space and next doesn't start with space,
            // it's likely a broken word, so don't add space
            value += nextLine;
          } else {
            value += ' ' + nextLine;
          }
          j++;
        }
        
        // Fix values that contain unescaped quotes or HTML
        if (needsQuoting(value)) {
          value = fixQuotedValue(value);
        }
        
        result.push(`${key}: ${value}`);
        i = j;
        continue;
      }
      
      // Handle regular single-line values that need fixing
      if (value && needsQuoting(value)) {
        value = fixQuotedValue(value);
        result.push(`${key}: ${value}`);
        i++;
        continue;
      }
    }
    
    // Default: keep the line as is
    result.push(line);
    i++;
  }
  
  return result;
}

// Function to check if a value needs quoting/escaping
function needsQuoting(value: string): boolean {
  // Already properly quoted with single quotes or is a literal block
  if (value.startsWith("'") || value.startsWith('|') || value.startsWith('>')) {
    return false;
  }
  
  // Already properly quoted with double quotes and no internal unescaped quotes
  if (value.startsWith('"') && value.endsWith('"')) {
    // Check if there are unescaped quotes inside
    const inner = value.slice(1, -1);
    return inner.includes('"') && !inner.includes('\\"');
  }
  
  // Needs quoting if it contains special characters
  return value.includes('"') || value.includes('<') || value.includes('>') || 
         value.includes('&') || value.includes('#') || value.includes('|');
}

// Function to properly escape and quote a value
function fixQuotedValue(value: string): string {
  // Remove existing quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  
  // Escape any existing backslashes first
  value = value.replace(/\\/g, '\\\\');
  
  // Escape double quotes
  value = value.replace(/"/g, '\\"');
  
  // Wrap in double quotes
  return `"${value}"`;
}

// Aggressive YAML fix for severely malformed files
function aggressiveYamlFix(content: string): string {
  const lines = content.split('\n');
  const frontMatterStart = lines.findIndex(line => line.trim() === '---');
  const frontMatterEnd = lines.findIndex((line, index) => index > frontMatterStart && line.trim() === '---');
  
  if (frontMatterStart === -1 || frontMatterEnd === -1) {
    return content; // No front matter found
  }
  
  // Extract front matter lines
  const frontMatterLines = lines.slice(frontMatterStart + 1, frontMatterEnd);
  const bodyLines = lines.slice(frontMatterEnd + 1);
  
  // Aggressively fix YAML by reconstructing it
  const fixedFrontMatter = aggressivelyFixYamlLines(frontMatterLines);
  
  // Reconstruct the content
  return [
    '---',
    ...fixedFrontMatter,
    '---',
    ...bodyLines
  ].join('\n');
}

// Aggressively fix YAML lines by reconstructing the structure
function aggressivelyFixYamlLines(lines: string[]): string[] {
  const result: string[] = [];
  let currentKey = '';
  let currentValue = '';
  let inMultiLineValue = false;
  let inTags = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (trimmedLine === '') {
      if (!inMultiLineValue) {
        result.push(line);
      }
      continue;
    }
    
    // Handle tags array
    if (trimmedLine === 'tags:') {
      if (inMultiLineValue && currentKey && currentValue) {
        result.push(`${currentKey}: ${fixQuotedValue(currentValue)}`);
        currentKey = '';
        currentValue = '';
        inMultiLineValue = false;
      }
      result.push(line);
      inTags = true;
      continue;
    }
    
    // Handle tag items
    if (inTags && trimmedLine.startsWith('- ')) {
      result.push(line);
      continue;
    }
    
    // Handle metaDescription with pipe
    if (trimmedLine === 'metaDescription: |') {
      if (inMultiLineValue && currentKey && currentValue) {
        result.push(`${currentKey}: ${fixQuotedValue(currentValue)}`);
        currentKey = '';
        currentValue = '';
        inMultiLineValue = false;
      }
      result.push(line);
      inTags = false;
      
      // Collect all following lines until we hit a key or end
      let j = i + 1;
      let metaContent = '';
      while (j < lines.length && !lines[j].includes(':')) {
        if (lines[j].trim() !== '') {
          metaContent += (metaContent ? ' ' : '') + lines[j].trim();
        }
        j++;
      }
      if (metaContent) {
        result.push(`  ${metaContent}`);
      }
      i = j - 1;
      continue;
    }
    
    // Handle key-value pairs
    if (trimmedLine.includes(':') && !trimmedLine.startsWith('-')) {
      inTags = false;
      
      // Finish previous multi-line value if any
      if (inMultiLineValue && currentKey && currentValue) {
        result.push(`${currentKey}: ${fixQuotedValue(currentValue)}`);
      }
      
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      
      if (value) {
        // Single line value
        if (needsQuoting(value)) {
          result.push(`${key}: ${fixQuotedValue(value)}`);
        } else {
          result.push(`${key}: ${value}`);
        }
        inMultiLineValue = false;
        currentKey = '';
        currentValue = '';
      } else {
        // Start of multi-line value
        currentKey = key;
        currentValue = '';
        inMultiLineValue = true;
      }
      continue;
    }
    
    // Handle continuation lines for multi-line values
    if (inMultiLineValue) {
      if (currentValue.length > 0 && !currentValue.endsWith(' ') && !trimmedLine.startsWith(' ')) {
        // Likely a broken word
        currentValue += trimmedLine;
      } else {
        currentValue += (currentValue ? ' ' : '') + trimmedLine;
      }
      continue;
    }
    
    // Default: keep the line as is
    result.push(line);
  }
  
  // Finish any remaining multi-line value
  if (inMultiLineValue && currentKey && currentValue) {
    result.push(`${currentKey}: ${fixQuotedValue(currentValue)}`);
  }
  
  return result;
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

  // Ensure public directory exists (for sitemap and blog-cache.json)
  if (!fs.existsSync(publicDirectory)) {
    console.log(`Creating public directory: ${publicDirectory}`);
    fs.mkdirSync(publicDirectory, { recursive: true });
  }
}

interface BlogPostMeta {
  slug: string;
  url: string;
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
  subfolders?: string[]; // Add subfolders for deeper nesting
}

function extractInlineImages(html: string): Array<{ src: string; alt?: string }> {
  const re = /<img\b([^>]*)>/gi;
  const srcRe = /src\s*=\s*["']([^"']+)["']/i;
  const altRe = /alt\s*=\s*["']([^"']*)["']/i;
  const out: Array<{ src: string; alt?: string }> = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const srcMatch = attrs.match(srcRe);
    if (!srcMatch) continue;
    const src = srcMatch[1].trim();
    if (!src || src.startsWith("data:")) continue;
    if (seen.has(src)) continue;
    seen.add(src);
    const altMatch = attrs.match(altRe);
    const alt = altMatch ? decodeHtmlEntitiesServer(altMatch[1].trim()) : undefined;
    out.push(alt ? { src, alt } : { src });
  }
  return out;
}

function buildPostUrl(fullSlug: string): string {
  const parts = fullSlug.split('/').filter(Boolean)
  if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
    return `/${parts.slice(0, -1).join('/')}`
  }
  return `/${parts.join('/')}`
}

function processPostFile(filePath: string, slug: string, folder?: string, subfolders?: string[]): BlogPostMeta | null {
  try {
    let fileContents = fs.readFileSync(filePath, "utf8");

    // Pre-process the file contents to fix common YAML issues
    fileContents = fixYamlFrontMatter(fileContents);

    let data: any;
    let content: string;

    try {
      // Parse front matter using gray-matter
      const parsed = matter(fileContents);
      data = parsed.data;
      content = parsed.content;
    } catch (yamlError) {
      // If YAML parsing fails, try a more aggressive fix
      console.warn(`YAML parsing failed for ${filePath}, attempting aggressive fix...`);
      fileContents = aggressiveYamlFix(fileContents);
      
      try {
        const parsed = matter(fileContents);
        data = parsed.data;
        content = parsed.content;
      } catch (secondError) {
        console.error(`Failed to parse ${filePath} even after aggressive fix:`, secondError instanceof Error ? secondError.message : String(secondError));
        
        // As a last resort, create a minimal post entry
        console.warn(`Creating minimal entry for ${filePath}`);
        const fileName = path.basename(filePath, path.extname(filePath));
        
        // Generate the full slug with country/folder prefix for content files
        let fullSlug = slug;
        if (folder && folder !== "blog") {
          if (subfolders && subfolders.length > 0) {
            fullSlug = `${subfolders.join('/')}/${slug}`;
          } else {
            if (slug === folder) {
              fullSlug = folder;
            } else {
              fullSlug = `${folder}/${slug}`;
            }
          }
        }
        const url = buildPostUrl(fullSlug)
        const normalizedSlug = url.replace(/^\//, "")
        
        return {
          slug: normalizedSlug,
          url,
          title: fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          date: new Date().toISOString().split('T')[0],
          lastUpdate: new Date().toISOString().split('T')[0],
          excerpt: `Content from ${fileName}`,
          featuredImage: "/placeholder.svg?height=400&width=800",
          author: "Editor",
          tags: ["Travel", "Guide"],
          metaDescription: `Content from ${fileName}`,
          folder: folder,
          subfolders: subfolders,
        };
      }
    }

    // ── Zod validation ────────────────────────────────────────────────────────
    const parsed = FrontmatterSchema.safeParse(data);
    const issues: string[] = [];
    if (!parsed.success) {
      for (const err of parsed.error.errors) {
        const field = err.path.join(".");
        // Hard failures — skip the file
        if (field === "title" || field === "date") {
          console.warn(`Skipping ${filePath}: ${err.message}`);
          return null;
        }
        issues.push(`${field}: ${err.message}`);
      }
    }
    // Warn about missing metaDescription
    if (!data.metaDescription && !data.excerpt) {
      issues.push("metaDescription: missing (Google will auto-generate)");
    }
    // Warn about inconsistent lastUpdated field name
    if (data.lastUpdate && data.lastUpdated) {
      issues.push("lastUpdated: both lastUpdate and lastUpdated present — use lastUpdated");
    }
    if (data.lastUpdate && !data.lastUpdated) {
      issues.push("lastUpdated: using deprecated 'lastUpdate' field — rename to 'lastUpdated'");
    }
    if (issues.length > 0) {
      validationIssues.push({ file: path.relative(process.cwd(), filePath), issues });
    }

    // ── Tag sanitization at ingest ─────────────────────────────────────────
    const rawTags = Array.isArray(data.tags) ? data.tags : [];
    const tags = sanitizeTags(rawTags);

    // Check if date is in the future
    const postDate = new Date(data.date);
    const now = new Date();
    const isHubOrPillar =
      tags.includes('Hub Page') ||
      tags.includes('Country Hub') ||
      tags.includes('Pillar') ||
      tags.includes('Pillar Page')
    if (postDate > now && !isHubOrPillar) {
      console.log(`Skipping future post ${filePath}: Date is ${data.date}`);
      return null;
    }

    // Generate the full slug with country/folder prefix for content files
    let fullSlug = slug;
    if (folder && folder !== "blog") {
      // For content files (not blog files), include the country/folder prefix
      if (subfolders && subfolders.length > 0) {
        // For nested subfolders, use the full path
        fullSlug = `${subfolders.join('/')}/${slug}`;
      } else {
        // Special case: if the file name matches the folder name (index files like japan/japan.html)
        // Use just the folder name as the slug (e.g., "japan" instead of "japan/japan")
        if (slug === folder) {
          fullSlug = folder;
        } else {
          // For other direct country folder files
          fullSlug = `${folder}/${slug}`;
        }
      }
    }
    const url = buildPostUrl(fullSlug)
    const normalizedSlug = url.replace(/^\//, "")

    // Return metadata for the blog post
    return {
      slug: normalizedSlug,
      url,
      title: decodeHtmlEntitiesServer(data.title || ""),
      date: data.date || "",
      lastUpdate: data.lastUpdate || data.date || "",
      excerpt: decodeHtmlEntitiesServer(data.excerpt || ""),
      featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
      inlineImages: extractInlineImages(content),
      author: data.author || "Editor",
      tags,
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

    // ── Validation report ──────────────────────────────────────────────────
    if (validationIssues.length > 0) {
      console.warn(`\n⚠  Frontmatter issues in ${validationIssues.length} file(s):`);
      for (const { file, issues } of validationIssues.slice(0, 20)) {
        console.warn(`  ${file}`);
        for (const issue of issues) console.warn(`    · ${issue}`);
      }
      if (validationIssues.length > 20) {
        console.warn(`  ... and ${validationIssues.length - 20} more. Fix these to improve SEO signals.`);
      }
    } else {
      console.log("✓  All frontmatter valid");
    }

    // ── Orphan detection ───────────────────────────────────────────────────
    const contentDir = path.join(process.cwd(), "content");
    if (fs.existsSync(contentDir)) {
      const topFolders = fs.readdirSync(contentDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name !== "blog");
      const orphans: string[] = [];
      for (const folder of topFolders) {
        const folderPath = path.join(contentDir, folder.name);
        const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".html") || f.endsWith(".md"));
        const hasIndex = files.includes(`${folder.name}.html`) || files.includes(`${folder.name}.md`);
        if (!hasIndex && files.length >= 5) {
          orphans.push(`  ${folder.name}/ (${files.length} articles, no ${folder.name}.html index)`);
        }
      }
      if (orphans.length > 0) {
        console.warn(`\n⚠  Orphaned content folders (no hub page):`);
        orphans.forEach((o) => console.warn(o));
        console.warn(`  Create an index file for each to link articles into a hub.`);
      } else {
        console.log("✓  All content folders have hub index files");
      }
    }
  } catch (error) {
    console.error("Error during cache generation:", error);
    
    // Create an empty cache file if an error occurred
    fs.writeFileSync(cacheFile, JSON.stringify([], null, 2));
    console.log("Created empty cache file due to errors");
  }
}

generateBlogCache();
