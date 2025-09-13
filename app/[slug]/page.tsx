import { getBlogPostBySlug, isFromBlogFolder, fileExistsInNestedPath, getBlogPostFromPath } from "@/lib/getBlogPosts"
import { redirect, notFound } from "next/navigation"
import type { Metadata } from "next"
import path from "path"
import fs from "fs"

// Set this page to be dynamic to ensure it always checks for the existence of the slug
export const dynamic = "force-dynamic";

// Function to check if a folder exists in the content directory
function folderExists(folder: string): boolean {
  const folderPath = path.join(process.cwd(), "content", folder)
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()
}

// Function to check if index file exists (named same as folder)
function indexFileExists(folder: string): boolean {
  const filePath = path.join(process.cwd(), "content", folder, `${folder}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a nested index file exists (for multi-level nesting)
function nestedIndexFileExists(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length === 0) return false
  
  const lastSegment = pathSegments[pathSegments.length - 1]
  const filePath = path.join(process.cwd(), "content", ...pathSegments, `${lastSegment}.html`)
  console.log(`Checking if nested index file exists: ${filePath}`)
  return fs.existsSync(filePath)
}

// Explicitly check if the ghost-towns/american-west special case exists
function checkGhostTownsAmericanWest(): boolean {
  const filePath = path.join(process.cwd(), "content", "ghost-towns", "american-west", "american-west.html")
  console.log(`Checking special ghost-towns case: ${filePath}`)
  return fs.existsSync(filePath)
}

// Function to check if a folder is a subfolder of another folder
function isSubfolderContent(folder: string, subfolder: string): boolean {
  const folderPath = path.join(process.cwd(), "content", folder, subfolder)
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()
}

// Function to get a list of path segments for a nested folder
function getNestedPathSegments(baseFolder: string): string[][] {
  const results: string[][] = []
  
  // Start with the base folder
  const basePath = path.join(process.cwd(), "content", baseFolder)
  if (!fs.existsSync(basePath)) return results
  
  // Function to recursively check subfolders
  function checkSubfolders(currentPath: string, segments: string[]) {
    if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()) {
      // Add current segments list if it contains more than just the base folder
      if (segments.length > 1) {
        results.push([...segments])
      }
      
      // Get subfolders
      const items = fs.readdirSync(currentPath, { withFileTypes: true })
      for (const item of items) {
        if (item.isDirectory()) {
          const newPath = path.join(currentPath, item.name)
          const newSegments = [...segments, item.name]
          checkSubfolders(newPath, newSegments)
        }
      }
    }
  }
  
  // Start the recursive search
  checkSubfolders(basePath, [baseFolder])
  
  return results
}

// Reuse the same metadata generation logic from the blog post page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params

  // First check if this is a blog post
  const post = await getBlogPostBySlug(slug)
  if (post) {
    return {
      title: `${post.title} | secretlocale.com`,
      description: post.metaDescription,
      openGraph: {
        title: post.title,
        description: post.metaDescription,
        type: "article",
        publishedTime: new Date(post.date).toISOString(),
        authors: [post.author],
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 628,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.metaDescription,
        images: [post.featuredImage],
      },
    }
  }

  // If not a blog post, see if it's a content folder
  if (folderExists(slug)) {
    // Check for nested index files (e.g., ghost-towns/american-west/american-west.html)
    const nestedPaths = getNestedPathSegments(slug)
    for (const pathSegments of nestedPaths) {
      if (nestedIndexFileExists(pathSegments)) {
        const nestedPost = getBlogPostFromPath([...pathSegments, pathSegments[pathSegments.length - 1]])
        if (nestedPost) {
          return {
            title: `${nestedPost.title} | secretlocale.com`,
            description: nestedPost.metaDescription,
            openGraph: {
              title: nestedPost.title,
              description: nestedPost.metaDescription,
              type: "article",
              publishedTime: new Date(nestedPost.date).toISOString(),
              authors: [nestedPost.author],
              images: [
                {
                  url: nestedPost.featuredImage,
                  width: 1200,
                  height: 628,
                  alt: nestedPost.title,
                },
              ],
            },
            twitter: {
              card: "summary_large_image",
              title: nestedPost.title,
              description: nestedPost.metaDescription,
              images: [nestedPost.featuredImage],
            },
          }
        }
      }
    }

    // If no nested index file, return standard folder metadata
    return {
      title: `${slug.replace(/-/g, " ")} | secretlocale.com`,
      description: `Explore our collection of ${slug.replace(/-/g, " ")} articles and guides.`,
    }
  }

  return {}
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log(`SlugPage called with slug: ${slug}`)
  
  // Special case for ghost-towns/american-west which seems problematic
  if (slug === "ghost-towns") {
    const ghostTownsPath = path.join(process.cwd(), "content", "ghost-towns")
    console.log(`Looking in ghost-towns directory: ${ghostTownsPath}`)
    const subfolders = fs.readdirSync(ghostTownsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    console.log(`Ghost-towns subfolders: ${subfolders.join(", ")}`)
    
    // Check specifically for american-west folder and its index file
    if (subfolders.includes("american-west")) {
      const americanWestExists = checkGhostTownsAmericanWest()
      console.log(`Ghost-towns/american-west index file exists: ${americanWestExists}`)
      
      if (americanWestExists) {
        const ContentPage = (await import("./[...rest]/page")).default;
        return <ContentPage params={{ 
          slug: "ghost-towns", 
          rest: ["american-west"]
        }} />;
      }
    }
  }
  
  // Check if this slug exists in the blog folder
  if (isFromBlogFolder(slug)) {
    // If this is a blog post, reuse the blog post page component
    // We import it dynamically to avoid circular dependencies
    const BlogPost = (await import("../blog/[slug]/page")).default;
    return <BlogPost params={{ slug }} />;
  }
  
  // Check if this is a content subfolder 
  if (folderExists(slug)) {
    // See if there's an index file for this folder
    if (indexFileExists(slug)) {
      // Import the catch-all route handler for the index file
      const ContentPage = (await import("./[...rest]/page")).default;
      return <ContentPage params={{ slug, rest: [] }} />;
    }
    
    // Check for any nested index files (e.g., ghost-towns/american-west/american-west.html)
    const nestedPaths = getNestedPathSegments(slug)
    
    // Check each nested path for an index file
    for (const pathSegments of nestedPaths) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      const indexFilePath = path.join(process.cwd(), "content", ...pathSegments, `${lastSegment}.html`)
      
      if (fs.existsSync(indexFilePath)) {
        console.log(`Found nested index file: ${indexFilePath}`)
        
        // We found a nested index file, so build the path to render via catch-all route
        const restSegments = pathSegments.slice(1) // Skip the first segment which is the base folder
        
        const ContentPage = (await import("./[...rest]/page")).default;
        return <ContentPage params={{ 
          slug, 
          rest: [...restSegments]  // We don't need to add the last segment again
        }} />;
      }
    }
    
    // If no index file, we'll render a directory listing or some other appropriate page
    // This will be handled by the [...rest] catch-all route
    const ContentPage = (await import("./[...rest]/page")).default;
    return <ContentPage params={{ slug, rest: [] }} />;
  }
  
  // If it's not a blog post or a content folder, return a 404 page
  notFound();
} 