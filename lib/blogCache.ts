import fs from "fs"
import path from "path"

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  lastUpdate?: string
  excerpt: string
  featuredImage: string
  inlineImages?: Array<{ src: string; alt?: string }>
  author: string
  tags: string[]
  metaDescription: string
  folder?: string
  subfolders?: string[]
}

export interface PaginatedBlogPosts {
  posts: BlogPostMeta[]
  nextCursor: string | null
  totalPages?: number
}

const cacheFile = path.join(process.cwd(), "public", "blog-cache.json")
const POSTS_PER_PAGE = 12

let blogCache: BlogPostMeta[] | null = null

export function getBlogCache(): BlogPostMeta[] {
  if (!blogCache) {
    try {
      const cacheContent = fs.readFileSync(cacheFile, "utf8")
      blogCache = JSON.parse(cacheContent)
    } catch (_error) {
      blogCache = []
    }
  }
  return blogCache || []
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
  return { posts: paginatedPosts, nextCursor, totalPages }
}

export function getAllTags(limit = 10): { tag: string; count: number }[] {
  try {
    return getTopTags(limit)
  } catch (_error) {
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

export interface CitySection {
  city: string
  citySlug: string
  pillarArticle: BlogPostMeta | null
  supportingArticles: BlogPostMeta[]
  totalArticles: number
}

export function getCitiesWithArticles(limit: number = 6): CitySection[] {
  const allPosts = getBlogCache()
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

  const cityGroups: { [citySlug: string]: { city: string; articles: BlogPostMeta[] } } = {}
  hiddenGemsArticles.forEach(article => {
    const citySlug = article.slug.replace('-hidden-gems', '')
    const city = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    if (!cityGroups[citySlug]) cityGroups[citySlug] = { city, articles: [] }
    cityGroups[citySlug].articles.push(article)
  })

  const citiesWithArticles: CitySection[] = []
  Object.entries(cityGroups).forEach(([citySlug, cityData]) => {
    const pillarArticle = cityData.articles[0]
    const supportingArticles = allPosts.filter(post => {
      const cityName = citySlug.replace(/-/g, ' ')
      const cityWords = cityName.split(' ')
      return (
        post.slug !== pillarArticle.slug &&
        (post.slug.includes(citySlug) || 
         cityWords.some(word => post.slug.includes(word)) ||
         post.title.toLowerCase().includes(cityName.toLowerCase()) ||
         post.tags.some(tag => tag.toLowerCase().includes(cityName.toLowerCase()))) &&
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
    }).slice(0, 4)

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
