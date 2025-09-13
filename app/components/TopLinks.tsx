'use client'

import Link from 'next/link'
import { CitySection } from '@/lib/getBlogPosts'

interface TopLinksProps {
  cities: CitySection[]
}

// Article types with their display names and descriptions
const articleTypes = [
  {
    type: 'experiences',
    displayName: 'Experiences',
    description: 'Unique local experiences and cultural immersion'
  },
  {
    type: 'adventures', 
    displayName: 'Adventures',
    description: 'Thrilling outdoor activities and extreme sports'
  },
  {
    type: 'culture',
    displayName: 'Culture',
    description: 'Local traditions, arts, and cultural heritage'
  },
  {
    type: 'landmarks',
    displayName: 'Landmarks',
    description: 'Iconic monuments and must-see attractions'
  },
  {
    type: 'nightlife',
    displayName: 'Nightlife',
    description: 'Bars, clubs, and evening entertainment'
  },
  {
    type: 'events',
    displayName: 'Events',
    description: 'Festivals, celebrations, and special occasions'
  },
  {
    type: 'highlights',
    displayName: 'Highlights',
    description: 'Top attractions and must-visit spots'
  },
  {
    type: 'activities',
    displayName: 'Activities',
    description: 'Things to do and recreational pursuits'
  }
]

export default function TopLinks({ cities }: TopLinksProps) {
  // Get top cities (first 8) for the links
  const topCities = cities.slice(0, 8)
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Adventure Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the world's most exciting cities through our comprehensive guides covering experiences, adventures, culture, landmarks, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topCities.map((city) => (
            <div key={city.citySlug} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                {city.city}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {articleTypes.map((articleType) => {
                  const slug = `${city.citySlug}-${articleType.type}`
                  return (
                    <Link
                      key={slug}
                      href={`/${slug}`}
                      className="group block p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                      <div className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        {articleType.displayName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {articleType.description}
                      </div>
                    </Link>
                  )
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/${city.citySlug}-highlights`}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center"
                >
                  View all {city.city} guides →
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            Explore All Destinations
          </Link>
        </div>
      </div>
    </section>
  )
}
