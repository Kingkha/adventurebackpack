import "server-only"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { execSync } from "child_process"
import { decodeHtmlEntities } from "./utils"

export interface BlogPostMeta {
  slug: string
  url?: string
  title: string
  date: string
  lastUpdate?: string
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
// Read blog cache from public to avoid bundling large JSON in serverless functions
const cacheFile = path.join(process.cwd(), "public", "blog-cache.json")
const POSTS_PER_PAGE = 12

let blogCache: BlogPostMeta[] | null = null

// Function to fix featuredImage paths by adding country/city prefix if missing
export function fixFeaturedImagePath(
  featuredImage: string,
  slug?: string,
  folder?: string,
  subfolders?: string[]
): string {
  // If image is already a full path with country/city or is a placeholder, return as is
  if (!featuredImage || 
      featuredImage.startsWith('/placeholder') ||
      featuredImage.startsWith('http://') ||
      featuredImage.startsWith('https://')) {
    return featuredImage
  }

  // Extract country and city from slug or folder structure first
  // We need this to check if the image path already contains them
  let country: string | undefined
  let city: string | undefined

  // Try to extract from slug first (e.g., "japan/takayama/article-name" or "japan/takayama/takayama")
  if (slug && slug.includes('/')) {
    const slugParts = slug.split('/')
    if (slugParts.length >= 2) {
      country = slugParts[0] // e.g., "japan"
      city = slugParts[1]    // e.g., "takayama"
    }
  }

  // If not found in slug, try subfolders (e.g., ["japan", "takayama"])
  if (!country && subfolders && subfolders.length >= 2) {
    country = subfolders[0]
    city = subfolders[1]
  }

  // If still not found, try folder (e.g., folder="japan", need to find city from slug)
  if (!country && folder && folder !== 'blog') {
    country = folder
    // Try to extract city from slug if available
    if (slug && slug.includes('/')) {
      const slugParts = slug.split('/')
      if (slugParts.length >= 2) {
        city = slugParts[1]
      }
    }
  }

  // Check if image already has country/city path pattern
  // Pattern: /images/{country}/{city}/{filename} or images/{country}/{city}/{filename}
  if (country && city) {
    // Remove leading /images/ or images/ to check the path structure
    const pathWithoutPrefix = featuredImage.replace(/^\/?images\//, '')
    const pathParts = pathWithoutPrefix.split('/')
    
    // If path already starts with country/city, return as-is (with proper /images/ prefix)
    if (pathParts.length >= 2 && pathParts[0] === country && pathParts[1] === city) {
      // Ensure it has /images/ prefix
      if (featuredImage.startsWith('/images/')) {
        return featuredImage
      } else if (featuredImage.startsWith('images/')) {
        return `/${featuredImage}`
      } else {
        return `/images/${featuredImage}`
      }
    }
    
    // Check if path has duplicate country/city (e.g., japan/takayama/japan/takayama/filename)
    if (pathParts.length >= 4 && 
        pathParts[0] === country && pathParts[1] === city &&
        pathParts[2] === country && pathParts[3] === city) {
      // Remove duplicate segments
      const filename = pathParts.slice(4).join('/')
      return `/images/${country}/${city}/${filename}`
    }
  }

  // Check if image already has any country/city path pattern (generic check)
  // Pattern: /images/{country}/{city}/{filename}
  const imagePathPattern = /^\/?images\/([^\/]+)\/([^\/]+)\//
  const existingMatch = featuredImage.match(imagePathPattern)
  
  // If image already has country/city in path, return as is (with proper prefix)
  if (existingMatch) {
    if (featuredImage.startsWith('/images/')) {
      return featuredImage
    } else if (featuredImage.startsWith('images/')) {
      return `/${featuredImage}`
    } else {
      return `/images/${featuredImage}`
    }
  }

  // If we have country and city, reconstruct the image path
  if (country && city) {
    // Extract just the filename from the current path
    // Remove /images/ or images/ prefix first
    let imagePath = featuredImage.replace(/^\/?images\//, '')
    
    // Split into parts
    const pathParts = imagePath.split('/')
    
    // Extract just the filename (last part)
    const actualFilename = pathParts[pathParts.length - 1]
    
    // Reconstruct with country/city prefix
    return `/images/${country}/${city}/${actualFilename}`
  }

  // If we can't determine the path, return as is (might be a blog post or other structure)
  return featuredImage
}

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
  // Helper function to remove duplicate city names from path
  const removeDuplicateCity = (path: string): string => {
    const parts = path.split('/')
    // Check if last two segments are the same (duplicate city)
    // e.g., "finland/rovaniemi/rovaniemi" -> "finland/rovaniemi"
    // e.g., "city/city" -> "city"
    if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
      return parts.slice(0, -1).join('/')
    }
    return path
  }

  // If we have a nested structure with subfolders, build the path from all segments
  if (subfolders && subfolders.length > 0) {
    // If slug is already a full path (new cache format), check for duplicates
    if (slug.includes('/')) {
      const cleanedSlug = removeDuplicateCity(slug)
      return `${baseUrl}/${cleanedSlug}`
    }

    // Index files: avoid duplicate last segment
    if (slug === subfolders[subfolders.length - 1]) {
      return `${baseUrl}/${subfolders.join('/')}`
    }

    return `${baseUrl}/${[...subfolders, slug].join('/')}`
  }
  
  // Check if the slug already contains a path (e.g., "country/article-name")
  if (slug.includes('/')) {
    // Remove duplicate city names if present
    const cleanedSlug = removeDuplicateCity(slug)
    return `${baseUrl}/${cleanedSlug}`
  }
  
  // Check if slug already contains folder prefix (new cache format)
  if (folder && slug.startsWith(`${folder}/`)) {
    return `${baseUrl}/${slug}`
  }
  
  // If the post is in a subfolder and has the same name as the folder
  if (folder && isNamedAfterFolder(slug, folder)) {
    return `${baseUrl}/${folder}`
  }
  
  // If the post is in a subfolder but has a different name (legacy format)
  if (folder && isFromContentSubfolder(slug, folder)) {
    return `${baseUrl}/${folder}/${slug}`
  }
  
  // For all posts (including blog posts), use the slug directly without /blog prefix
  return `${baseUrl}/${slug}`
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

// Cached set of tag slugs that have actual hub pages (≥5 posts, non-generic, ≤30 chars)
let hubTagSlugsCache: Set<string> | null = null

export function getHubTagSlugs(): Set<string> {
  if (hubTagSlugsCache) return hubTagSlugsCache
  const { GENERIC_TAGS, tagToSlug, MAX_TAG_LENGTH, MIN_POSTS_PER_HUB } = require("./utils")
  const tagCounts: Record<string, number> = {}
  getBlogCache().forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
  hubTagSlugsCache = new Set(
    Object.entries(tagCounts)
      .filter(([tag, count]) => count >= MIN_POSTS_PER_HUB && !GENERIC_TAGS.has(tag) && tag.length <= MAX_TAG_LENGTH)
      .map(([tag]) => tagToSlug(tag))
  )
  return hubTagSlugsCache
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
    title: decodeHtmlEntities(data.title),
    date: data.date,
    lastUpdate: data.lastUpdate || data.date,
    excerpt: decodeHtmlEntities(data.excerpt),
    content,
    featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
    author: data.author || "Editor",
    tags: data.tags || [],
    metaDescription: decodeHtmlEntities(data.metaDescription || data.excerpt),
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
  
  const sortedCities = citiesWithArticles.sort((a, b) => {
    const diff = b.totalArticles - a.totalArticles
    if (diff !== 0) return diff
    return a.citySlug.localeCompare(b.citySlug)
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
    

  } catch (error) {
    console.error("Error regenerating blog cache:", error)
    throw error
  }
}

// Interface for country with cities and articles
export interface CountrySection {
  country: string
  countrySlug: string
  countryHubPage: BlogPostMeta | null
  cities: CityWithArticles[]
}

export interface CityWithArticles {
  city: string
  citySlug: string
  pillarArticles: BlogPostMeta[]
  mainArticles: BlogPostMeta[]
}

// Function to get all countries with their cities and articles
export function getCountriesWithCities(): CountrySection[] {
  const allPosts = getBlogCache()
  const contentDir = path.join(process.cwd(), "content")
  
  // Get all countries from content directory
  const countries: CountrySection[] = []
  
  try {
    const entries = fs.readdirSync(contentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === 'blog') continue
      
      const countrySlug = entry.name
      const countryPath = path.join(contentDir, countrySlug)
      const countryName = countrySlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')

      const countrySlugLower = countrySlug.toLowerCase()
      const countryHubPage = allPosts.find((post) => post.slug.toLowerCase() === countrySlugLower) ?? null
      
      // Get all cities (subdirectories) for this country
      const cityEntries = fs.readdirSync(countryPath, { withFileTypes: true })
      const cities: CityWithArticles[] = []
      
      for (const cityEntry of cityEntries) {
        if (!cityEntry.isDirectory()) continue
        
        const citySlug = cityEntry.name
        const cityName = citySlug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        
        // Find all articles for this city
        const cityArticles = allPosts.filter(post => {
          const slug = post.slug.toLowerCase()
          const citySlugLower = citySlug.toLowerCase()
          const countrySlugLower = countrySlug.toLowerCase()
          
          // Primary check: slug contains country/city path (e.g., "austria/graz/article-name")
          if (slug.includes(`${countrySlugLower}/${citySlugLower}/`) || 
              slug === `${countrySlugLower}/${citySlugLower}` ||
              slug.startsWith(`${countrySlugLower}/${citySlugLower}/`)) {
            return true
          }
          
          // Check subfolders if available
          if (post.subfolders && post.subfolders.length >= 2) {
            const postCountry = post.subfolders[0]?.toLowerCase()
            const postCity = post.subfolders[1]?.toLowerCase()
            if (postCountry === countrySlugLower && postCity === citySlugLower) {
              return true
            }
          }
          
          // Check folder if available
          if (post.folder && post.folder.toLowerCase() === countrySlugLower) {
            // Check if slug or tags contain city name
            if (slug.includes(citySlugLower)) {
              return true
            }
          }
          
          // Check tags for city name (usually 4th tag, or country in 3rd tag)
          if (post.tags && post.tags.length >= 3) {
            const countryTag = post.tags[2]?.toLowerCase()
            const cityTag = post.tags[3]?.toLowerCase()
            
            // Normalize tag values (remove special chars for comparison)
            const normalize = (str: string) => str.replace(/[^a-z0-9]/g, '').toLowerCase()
            
            if (countryTag && normalize(countryTag) === normalize(countryName)) {
              if (cityTag && (normalize(cityTag) === normalize(cityName) || 
                              normalize(cityTag) === normalize(citySlug))) {
                return true
              }
            }
          }
          
          return false
        })
        
        // Identify pillar articles
        const pillarArticles = cityArticles.filter(post => {
          const slug = post.slug.toLowerCase()

          // Explicit pillar tagging
          if (post.tags?.includes('Pillar Page') || post.tags?.includes('Pillar')) {
            return true
          }
          
          // Hub page (city-name.html) - exact match or ends with city name
          if (slug === `${countrySlug}/${citySlug}/${citySlug}` ||
              slug === `${countrySlug}/${citySlug}` ||
              slug.endsWith(`/${citySlug}`) ||
              post.tags?.includes('Hub Page')) {
            return true
          }
          
          // Winter travel guide (main pillar) - most common pattern
          if (slug.includes(`${citySlug}-winter-travel-guide-2026`) ||
              slug.includes(`${citySlug}-winter-travel-guide`) ||
              slug.includes(`/${citySlug}-winter-travel-guide`)) {
            return true
          }
          
          // Hidden gems articles
          if (slug.endsWith('-hidden-gems') && slug.includes(citySlug)) {
            return true
          }
          
          // Architecture guides
          if (slug.includes(`${citySlug}-architecture-guide`)) {
            return true
          }
          
          return false
        })
        
        // Main articles are all other articles for this city
        const mainArticles = cityArticles.filter(post => 
          !pillarArticles.some(pillar => pillar.slug === post.slug)
        )
        
        if (cityArticles.length > 0) {
          cities.push({
            city: cityName,
            citySlug,
            pillarArticles: pillarArticles.sort((a, b) => {
              // Prioritize winter travel guides
              const aIsWinterGuide = a.slug.includes('winter-travel-guide')
              const bIsWinterGuide = b.slug.includes('winter-travel-guide')
              if (aIsWinterGuide && !bIsWinterGuide) return -1
              if (!aIsWinterGuide && bIsWinterGuide) return 1
              return 0
            }),
            mainArticles: mainArticles.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          })
        }
      }
      
      if (cities.length > 0) {
        countries.push({
          country: countryName,
          countrySlug,
          countryHubPage,
          cities: cities.sort((a, b) => a.city.localeCompare(b.city))
        })
      }
    }
  } catch (error) {
    console.error("Error reading content directory:", error)
  }
  
  return countries.sort((a, b) => a.country.localeCompare(b.country))
}

// Function to regenerate the sitemap manually
export function regenerateSitemap(): void {
  try {
    // Execute the sitemap generation script
    const scriptPath = path.join(process.cwd(), "scripts", "generate-blog-sitemap.ts")
    execSync(`npx ts-node ${scriptPath}`, { stdio: "inherit" })
    

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

  } catch (error) {
    console.error("Error regenerating cache and sitemap:", error)
    throw error
  }
}
