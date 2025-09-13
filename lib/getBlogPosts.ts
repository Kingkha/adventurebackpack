import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { execSync } from "child_process"
import { decodeHtmlEntitiesServer } from "./utils"

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  featuredImage: string
  author: string
  tags: string[]
  metaDescription: string
  folder?: string // Parent folder
  subfolders?: string[] // For deeper nesting - array of path segments
}

export interface BlogPost extends BlogPostMeta {
  content: string
}

export interface PaginatedBlogPosts {
  posts: BlogPostMeta[]
  nextCursor: string | null
  totalPages?: number
}

export interface CitySection {
  city: string
  citySlug: string
  pillarArticle: BlogPostMeta | null
  supportingArticles: BlogPostMeta[]
  totalArticles: number
}

const postsDirectory = path.join(process.cwd(), "content", "blog")
const contentDirectory = path.join(process.cwd(), "content")
const cacheFile = path.join(process.cwd(), "content", "blog-cache.json")
const POSTS_PER_PAGE = 12

let blogCache: BlogPostMeta[] | null = null

// Function to check if a slug represents a post from the blog directory
export function isFromBlogFolder(slug: string): boolean {
  const decodedSlug = decodeURIComponent(slug)
  const filePath = path.join(postsDirectory, `${decodedSlug}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a post is from a subfolder in the content directory
export function isFromContentSubfolder(slug: string, folder?: string): boolean {
  if (!folder) return false
  
  const decodedSlug = decodeURIComponent(slug)
  const filePath = path.join(contentDirectory, folder, `${decodedSlug}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a file exists in a deeply nested path
export function fileExistsInNestedPath(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length < 2) return false
  
  const slug = pathSegments[pathSegments.length - 1]
  const folderPath = pathSegments.slice(0, -1)
  const decodedSlug = decodeURIComponent(slug)
  
  const filePath = path.join(contentDirectory, ...folderPath, `${decodedSlug}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a post has the same name as its parent folder
export function isNamedAfterFolder(slug: string, folder?: string): boolean {
  if (!folder) return false
  return slug === folder
}

// Function to get the correct URL path for a blog post
export function getPostUrl(slug: string, baseUrl: string = "", folder?: string, subfolders?: string[]): string {
  // If we have a nested structure with subfolders, build the path from all segments
  if (subfolders && subfolders.length > 0) {
    const pathSegments = [...subfolders, slug]
    return `${baseUrl}/${pathSegments.join('/')}`
  }
  
  // If the post is from the blog folder, don't include the /blog prefix
  if (isFromBlogFolder(slug)) {
    return `${baseUrl}/${slug}`
  }
  
  // If the post is in a subfolder and has the same name as the folder
  if (folder && isNamedAfterFolder(slug, folder)) {
    return `${baseUrl}/${folder}`
  }
  
  // If the post is in a subfolder but has a different name
  if (folder && isFromContentSubfolder(slug, folder)) {
    return `${baseUrl}/${folder}/${slug}`
  }
  
  // Default: include the /blog prefix
  return `${baseUrl}/blog/${slug}`
}

export function getBlogCache(): BlogPostMeta[] {
  if (!blogCache) {
    try {
      const cacheContent = fs.readFileSync(cacheFile, "utf8")
      blogCache = JSON.parse(cacheContent)
    } catch (error) {
      console.error("Error reading blog cache:", error)
      blogCache = [] // Return empty array if there's an error
    }
  }
  return blogCache || [] // Ensure we never return null
}

function getTopTags(limit = 10): { tag: string; count: number }[] {
  const allPosts = getBlogCache()
  const tagCounts: { [key: string]: number } = {}

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getBlogPostsMeta(
  cursor: string | null = null,
  limit: number = POSTS_PER_PAGE,
  tag: string | null = null,
  category: string | null = null,
): PaginatedBlogPosts {
  const allPosts = getBlogCache()

  const filteredPosts = allPosts.filter((post) => {
    if (tag && !post.tags.includes(tag)) return false
    if (category && post.slug.replace(/_/g, "-") !== category) return false
    return true
  })

  let startIndex = 0
  if (cursor) {
    startIndex = filteredPosts.findIndex((post) => post.slug === cursor) + 1
  }

  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit)
  const nextCursor = filteredPosts[startIndex + limit]?.slug || null
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  return {
    posts: paginatedPosts,
    nextCursor,
    totalPages
  }
}

export function getBlogPostBySlug(slug: string, folder?: string, nestedPath?: string[]): BlogPost | null {
  const decodedSlug = decodeURIComponent(slug)
  
  // First check in the blog directory
  let filePath = path.join(postsDirectory, `${decodedSlug}.html`)
  let foundFolder: string | undefined = undefined
  let foundSubfolders: string[] | undefined = undefined
  
  // If not found in blog directory and we have a nested path, check the nested structure
  if (!fs.existsSync(filePath) && nestedPath && nestedPath.length > 0) {
    filePath = path.join(contentDirectory, ...nestedPath, `${decodedSlug}.html`)
    if (fs.existsSync(filePath)) {
      foundFolder = nestedPath[0]
      foundSubfolders = nestedPath
    }
  }
  
  // If not found in blog directory and folder is provided, check in the specific subfolder
  if (!fs.existsSync(filePath) && folder) {
    filePath = path.join(contentDirectory, folder, `${decodedSlug}.html`)
    if (fs.existsSync(filePath)) {
      foundFolder = folder
    }
  }

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)

  return {
    slug: decodedSlug,
    title: decodeHtmlEntitiesServer(data.title),
    date: data.date,
    excerpt: decodeHtmlEntitiesServer(data.excerpt),
    content,
    featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
    author: data.author || "Editor",
    tags: data.tags || [],
    metaDescription: decodeHtmlEntitiesServer(data.metaDescription || data.excerpt),
    folder: foundFolder || folder,
    subfolders: foundSubfolders
  }
}

// Function to get a blog post from a nested path of segments
export function getBlogPostFromPath(pathSegments: string[]): BlogPost | null {
  if (!pathSegments || pathSegments.length < 1) return null
  
  const slug = pathSegments[pathSegments.length - 1]
  return getBlogPostBySlug(slug, pathSegments[0], pathSegments.slice(0, -1))
}

export function getAllTags(limit = 10): { tag: string; count: number }[] {
  try {
    return getTopTags(limit)
  } catch (error) {
    console.error("Error getting top tags:", error)
    return []
  }
}

export function getTotalPages(tag: string | null = null, category: string | null = null): number {
  const allPosts = getBlogCache()
  
  const filteredPosts = allPosts.filter((post) => {
    if (tag && !post.tags.includes(tag)) return false
    if (category && post.slug.replace(/_/g, "-") !== category) return false
    return true
  })
  
  return Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
}

// Function to get cities with their hidden gems articles and supporting content
export function getCitiesWithArticles(limit: number = 6): CitySection[] {
  const allPosts = getBlogCache()
  
  // Find all hidden gems articles (pillar articles)
  const hiddenGemsArticles = allPosts.filter(post => 
    post.slug.endsWith('-hidden-gems') && 
    !post.slug.includes('best-time-to') &&
    !post.slug.includes('budget-friendly') &&
    !post.slug.includes('budget-') &&
    !post.slug.includes('authentic-') &&
    !post.slug.includes('how-to-find') &&
    !post.slug.includes('traditional-') &&
    !post.slug.includes('local-') &&
    !post.slug.includes('unique-') &&
    !post.slug.includes('free-') &&
    !post.slug.includes('day-trips-') &&
    !post.slug.includes('one-day-') &&
    !post.slug.includes('3-day-') &&
    !post.slug.includes('3day-')
  )
  
  // Group articles by city
  const cityGroups: { [citySlug: string]: { city: string; articles: BlogPostMeta[] } } = {}
  
  hiddenGemsArticles.forEach(article => {
    const citySlug = article.slug.replace('-hidden-gems', '')
    const city = citySlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    if (!cityGroups[citySlug]) {
      cityGroups[citySlug] = { city, articles: [] }
    }
    cityGroups[citySlug].articles.push(article)
  })
  
  // Find supporting articles for each city
  const citiesWithArticles: CitySection[] = []
  
  Object.entries(cityGroups).forEach(([citySlug, cityData]) => {
    const pillarArticle = cityData.articles[0] // The hidden-gems article is the pillar
    
    // Find supporting articles for this city
    const supportingArticles = allPosts.filter(post => {
      // Articles that mention the city but are not the pillar article
      const cityName = citySlug.replace(/-/g, ' ')
      const cityWords = cityName.split(' ')
      
      return (
        post.slug !== pillarArticle.slug &&
        (post.slug.includes(citySlug) || 
         cityWords.some(word => post.slug.includes(word)) ||
         post.title.toLowerCase().includes(cityName.toLowerCase()) ||
         post.tags.some(tag => tag.toLowerCase().includes(cityName.toLowerCase()))) &&
        // Exclude certain types of articles that are not good supporting content
        !post.slug.includes('best-time-to-visit') &&
        !post.slug.includes('budget-friendly') &&
        !post.slug.includes('budget-') &&
        !post.slug.includes('authentic-') &&
        !post.slug.includes('how-to-find') &&
        !post.slug.includes('traditional-') &&
        !post.slug.includes('local-') &&
        !post.slug.includes('unique-') &&
        !post.slug.includes('free-') &&
        !post.slug.includes('day-trips-') &&
        !post.slug.includes('one-day-') &&
        !post.slug.includes('3-day-') &&
        !post.slug.includes('3day-')
      )
    }).slice(0, 4) // Limit to 4 supporting articles per city
    
    citiesWithArticles.push({
      city: cityData.city,
      citySlug,
      pillarArticle,
      supportingArticles,
      totalArticles: 1 + supportingArticles.length
    })
  })
  
  // Sort cities with priority for Tokyo and Kyoto
  const sortedCities = citiesWithArticles.sort((a, b) => {
    // Priority cities that should always be first
    const priorityCities = ['tokyo', 'kyoto']
    const aIsPriority = priorityCities.includes(a.citySlug)
    const bIsPriority = priorityCities.includes(b.citySlug)
    
    if (aIsPriority && !bIsPriority) return -1
    if (!aIsPriority && bIsPriority) return 1
    if (aIsPriority && bIsPriority) {
      // Tokyo first, then Kyoto
      if (a.citySlug === 'tokyo') return -1
      if (b.citySlug === 'tokyo') return 1
      if (a.citySlug === 'kyoto') return -1
      if (b.citySlug === 'kyoto') return 1
    }
    
    // For non-priority cities, sort by total articles
    return b.totalArticles - a.totalArticles
  })
  
  return sortedCities.slice(0, limit)
}

// Function to regenerate the blog cache manually
export function regenerateBlogCache(): void {
  try {
    // Reset the in-memory cache
    blogCache = null
    
    // Execute the cache generation script
    const scriptPath = path.join(process.cwd(), "scripts", "generate-blog-cache.ts")
    execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" })
    
    console.log("Blog cache regenerated successfully")
  } catch (error) {
    console.error("Error regenerating blog cache:", error)
    throw error
  }
}

// Function to regenerate the sitemap manually
export function regenerateSitemap(): void {
  try {
    // Execute the sitemap generation script
    const scriptPath = path.join(process.cwd(), "scripts", "generate-blog-sitemap.ts")
    execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" })
    
    console.log("Sitemap regenerated successfully")
  } catch (error) {
    console.error("Error regenerating sitemap:", error)
    throw error
  }
}

// Function to regenerate both cache and sitemap
export function regenerateCacheAndSitemap(): void {
  try {
    regenerateBlogCache()
    regenerateSitemap()
    console.log("Blog cache and sitemap regenerated successfully")
  } catch (error) {
    console.error("Error regenerating cache and sitemap:", error)
    throw error
  }
}

