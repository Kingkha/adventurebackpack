import { getBlogPostsMeta, getAllTags, isFromBlogFolder, isFromContentSubfolder, isNamedAfterFolder } from "@/lib/getBlogPosts"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { decodeHtmlEntitiesServer } from "@/lib/utils"

// Get list of content subfolders
function getContentSubfolders() {
  const contentDir = path.join(process.cwd(), "content")
  try {
    return fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== "blog")
      .map(dirent => dirent.name)
  } catch (error) {
    console.error("Error reading content directories:", error)
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get("cursor")
  const tag = searchParams.get("tag")
  const category = searchParams.get("category")
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
  
  const { posts, nextCursor } = getBlogPostsMeta(cursor, limit, tag, category)
  const topTags = getAllTags(10)
  
  // Get all content subfolders
  const subfolders = getContentSubfolders()
  
  // Add properties to indicate source and folder for each post
  const postsWithSource = posts.map(post => {
    // Decode HTML entities in title and excerpt
    const decodedPost = {
      ...post,
      title: decodeHtmlEntitiesServer(post.title),
      excerpt: decodeHtmlEntitiesServer(post.excerpt),
      metaDescription: decodeHtmlEntitiesServer(post.metaDescription)
    }
    
    // Keep subfolder information if it already exists
    if (post.subfolders && post.subfolders.length > 0) {
      return {
        ...decodedPost,
        isFromBlogFolder: false,
        folder: post.folder || post.subfolders[0], // Ensure folder is set for backward compatibility
      }
    }
    
    // Start with checking if it's from the blog folder
    if (isFromBlogFolder(post.slug)) {
      return {
        ...decodedPost,
        isFromBlogFolder: true
      }
    }
    
    // Check if it's from a content subfolder
    for (const folder of subfolders) {
      if (isFromContentSubfolder(post.slug, folder)) {
        return {
          ...decodedPost,
          folder,
          isNamedAfterFolder: isNamedAfterFolder(post.slug, folder)
        }
      }
    }
    
    // Default: not from blog folder or any content subfolder
    return decodedPost
  })

  return NextResponse.json({ 
    posts: postsWithSource, 
    nextCursor, 
    topTags 
  })
}

