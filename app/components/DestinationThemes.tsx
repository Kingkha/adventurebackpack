'use client'

import Link from 'next/link'
import { Card, CardContent } from "../../components/ui/card"

const adventureActivities = [
  {
    emoji: '🧗',
    title: 'Rock Climbing',
    description: 'Scale epic cliff faces and challenging rock formations worldwide.',
    link: '/rock-climbing'
  },
  {
    emoji: '🪂',
    title: 'Skydiving',
    description: 'Experience the ultimate adrenaline rush with tandem and solo jumps.',
    link: '/skydiving'
  },
  {
    emoji: '🚣',
    title: 'White Water Rafting',
    description: 'Navigate thrilling rapids and wild rivers on epic rafting adventures.',
    link: '/white-water-rafting'
  },
  {
    emoji: '🚵',
    title: 'Mountain Biking',
    description: 'Conquer challenging trails and epic downhill mountain bike routes.',
    link: '/mountain-biking'
  },
  {
    emoji: '🥾',
    title: 'Epic Hiking',
    description: 'Trek through stunning landscapes on multi-day hiking expeditions.',
    link: '/epic-hiking'
  },
  {
    emoji: '🏄',
    title: 'Extreme Water Sports',
    description: 'Master surfing, kitesurfing, and other adrenaline water activities.',
    link: '/extreme-water-sports'
  }
]

export default function DestinationThemes() {
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