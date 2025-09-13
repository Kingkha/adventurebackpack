'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useState, useMemo } from 'react'

// Import blog data
import blogData from '../../content/blog-cache.json'

// Define filters
const FILTER_ALL = 'All'
const FILTER_EUROPE = 'Europe'
const FILTER_USA = 'USA'

// Define TypeScript interfaces
interface BlogArticle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  tags: string[];
  metaDescription: string;
  folder: string;
}

interface FeaturedArticle {
  title: string;
  excerpt: string;
  category: string;
  region: string;
  image: string;
  slug: string;
}

export default function FeaturedArticles() {
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL)
  
  // Select top pillar articles from different categories/folders
  const topPillarArticles = useMemo(() => {
    // Get articles from different folder categories, taking the most recent from each
    const categories = ['hidden-gem-towns', 'historic-villages', 'ghost-towns', 'scenic-train-rides', 
                     'secret-beaches', 'island-getaways', 'spring-nature-walks', 'winter-escapes']
    
    // Map to get top article from each category
    const topArticles: BlogArticle[] = []
    
    // First add the main pillar landing pages for primary categories
    const pillarLandingPages = blogData.filter((article: BlogArticle) => 
      article.slug === 'hidden-gem-towns' || 
      article.slug === 'historic-villages' || 
      article.slug === 'secret-beaches' || 
      article.slug === 'scenic-train-rides' ||
      article.slug === 'ghost-towns'
    )
    
    topArticles.push(...pillarLandingPages)
    
    // Then add some specific regional highlights to round out the collection
    const regionalHighlights = blogData.filter((article: BlogArticle) => 
      article.slug === 'usa-south' || 
      article.slug === 'france' || 
      article.slug === 'japan' || 
      article.slug === 'balkans'
    )
    
    topArticles.push(...regionalHighlights)
    
    // Convert the blog data to match our component's expected format
    return topArticles.map((article: BlogArticle) => ({
      title: article.title,
      excerpt: article.excerpt,
      category: article.folder.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      region: determineRegion(article),
      image: article.featuredImage || '/placeholder.jpg',
      slug: `/${article.folder}/${article.slug}`
    })).slice(0, 9) // Limit to 9 articles
  }, [])
  
  // Helper function to determine region from tags
  function determineRegion(article: BlogArticle): string {
    if (article.tags.some((tag: string) => ['USA', 'American', 'Pacific Northwest', 'Midwest'].includes(tag))) {
      return 'USA'
    } else if (article.tags.some((tag: string) => [
      'Europe', 'European', 'France', 'Italy', 'Germany', 'Switzerland', 'Greece', 
      'Portugal', 'Spain', 'UK', 'United Kingdom', 'Balkans', 'Eastern Europe'
    ].includes(tag))) {
      return 'Europe'
    } else if (article.tags.some((tag: string) => ['Japan', 'Asia'].includes(tag))) {
      return 'Asia'
    } else if (article.tags.some((tag: string) => ['Latin America', 'South America', 'Central America'].includes(tag))) {
      return 'Latin America'
    } else if (article.tags.some((tag: string) => ['Middle East'].includes(tag))) {
      return 'Middle East'
    }
    return 'Global'
  }
  
  // Filter articles based on active filter
  const filteredArticles = useMemo(() => {
    if (activeFilter === FILTER_ALL) {
      return topPillarArticles
    }
    return topPillarArticles.filter(article => article.region === activeFilter)
  }, [topPillarArticles, activeFilter])

  return (
    <section id="featured-articles" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-teal-100 text-teal-800 text-sm font-medium px-4 py-1 rounded-full">FEATURED DESTINATIONS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">Explore Hidden Gems</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular secret destinations and experiences
          </p>
        </div>
        
        <div className="flex justify-center gap-3 mb-10">
          <Button 
            variant="outline" 
            className={`rounded-full border-gray-300 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 ${
              activeFilter === FILTER_ALL ? 'bg-teal-50 text-teal-600 border-teal-200' : ''
            }`}
            onClick={() => setActiveFilter(FILTER_ALL)}
          >
            All
          </Button>
          <Button 
            variant="outline" 
            className={`rounded-full border-gray-300 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 ${
              activeFilter === FILTER_EUROPE ? 'bg-teal-50 text-teal-600 border-teal-200' : ''
            }`}
            onClick={() => setActiveFilter(FILTER_EUROPE)}
          >
            Europe
          </Button>
          <Button 
            variant="outline" 
            className={`rounded-full border-gray-300 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 ${
              activeFilter === FILTER_USA ? 'bg-teal-50 text-teal-600 border-teal-200' : ''
            }`}
            onClick={() => setActiveFilter(FILTER_USA)}
          >
            USA
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <Link href={article.slug} key={index}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill 
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-teal-500 hover:bg-teal-600">{article.category}</Badge>
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">{article.region}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-0 px-5 pb-5">
                  <div className="text-teal-600 text-sm font-medium flex items-center">
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/hidden-gem-towns">
            <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white rounded-lg px-6 py-3">
              View All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 