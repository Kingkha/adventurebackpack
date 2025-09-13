'use client'

import Link from 'next/link'
import { Card, CardContent } from "../../components/ui/card"
import { useMemo } from 'react'
import blogData from '../../content/blog-cache.json'

// Define TypeScript interface for blog articles
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

// Define interface for activity items
interface ActivityItem {
  emoji: string;
  title: string;
  description: string;
  link: string;
}

export default function DestinationThemes() {
  // Get pillar articles from blog cache
  const adventureActivities = useMemo(() => {
    // Look for pillar landing pages and main category pages
    const pillarArticles = blogData.filter((article: BlogArticle) => 
      article.slug === 'hidden-gem-towns' || 
      article.slug === 'historic-villages' || 
      article.slug === 'secret-beaches' || 
      article.slug === 'scenic-train-rides' ||
      article.slug === 'ghost-towns' ||
      article.slug === 'island-getaways' ||
      article.slug === 'spring-nature-walks' ||
      article.slug === 'winter-escapes' ||
      article.slug === 'usa-south' ||
      article.slug === 'france' ||
      article.slug === 'japan' ||
      article.slug === 'balkans'
    )

    // Map pillar articles to activity format
    return pillarArticles.map((article: BlogArticle): ActivityItem => {
      // Define emoji and description based on article type
      const getActivityInfo = (slug: string) => {
        switch (slug) {
          case 'hidden-gem-towns':
            return { emoji: '🏘️', title: 'Hidden Gem Towns', description: 'Discover off-the-beaten-path towns and villages with authentic charm.' }
          case 'historic-villages':
            return { emoji: '🏛️', title: 'Historic Villages', description: 'Step back in time through centuries-old villages and cultural heritage.' }
          case 'secret-beaches':
            return { emoji: '🏖️', title: 'Secret Beaches', description: 'Find pristine, secluded beaches away from the tourist crowds.' }
          case 'scenic-train-rides':
            return { emoji: '🚂', title: 'Scenic Train Rides', description: 'Journey through breathtaking landscapes on epic train adventures.' }
          case 'ghost-towns':
            return { emoji: '👻', title: 'Ghost Towns', description: 'Explore abandoned settlements and forgotten places with rich history.' }
          case 'island-getaways':
            return { emoji: '🏝️', title: 'Island Getaways', description: 'Escape to remote islands and tropical paradises for ultimate relaxation.' }
          case 'spring-nature-walks':
            return { emoji: '🌸', title: 'Spring Nature Walks', description: 'Immerse yourself in blooming landscapes and seasonal natural beauty.' }
          case 'winter-escapes':
            return { emoji: '❄️', title: 'Winter Escapes', description: 'Discover magical winter destinations and snowy wonderlands.' }
          case 'usa-south':
            return { emoji: '🇺🇸', title: 'USA South', description: 'Explore the rich culture and natural beauty of the American South.' }
          case 'france':
            return { emoji: '🇫🇷', title: 'France', description: 'Discover the charm, culture, and hidden gems of France.' }
          case 'japan':
            return { emoji: '🇯🇵', title: 'Japan', description: 'Experience the unique blend of tradition and modernity in Japan.' }
          case 'balkans':
            return { emoji: '🏔️', title: 'Balkans', description: 'Explore the diverse cultures and stunning landscapes of the Balkans.' }
          default:
            return { emoji: '🗺️', title: article.title, description: article.excerpt }
        }
      }

      const activityInfo = getActivityInfo(article.slug)
      
      return {
        emoji: activityInfo.emoji,
        title: activityInfo.title,
        description: activityInfo.description,
        link: `/${article.slug}`
      }
    }).slice(0, 6) // Limit to 6 activities
  }, [])

  return (
    <section 
      id="destination-themes" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="destination-themes-heading"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-4 py-1 rounded-full">EXPLORE BY ACTIVITY</span>
          <h2 
            id="destination-themes-heading" 
            className="text-3xl md:text-4xl font-bold mt-4 text-gray-900"
            itemProp="name"
          >
            Find Your Perfect Adventure
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto" itemProp="description">
            Discover epic adventure activities organized by adrenaline level and experience
          </p>
          <meta itemProp="numberOfItems" content={adventureActivities.length.toString()} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventureActivities.map((activity, index) => (
            <Link 
              href={activity.link} 
              key={index}
              aria-label={`Explore ${activity.title.toLowerCase()} - ${activity.description}`}
            >
              <Card 
                className="h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={(index + 1).toString()} />
                <CardContent className="p-6">
                  <div className="text-5xl mb-4" aria-hidden="true">{activity.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" itemProp="name">{activity.title}</h3>
                  <p className="text-gray-600 mb-4" itemProp="description">{activity.description}</p>
                  <div className="flex items-center text-orange-600 font-medium">
                    Explore activities
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                  <link itemProp="url" href={activity.link} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 