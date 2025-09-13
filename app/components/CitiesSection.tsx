'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin } from 'lucide-react'
import { CitySection } from '@/lib/getBlogPosts'

interface CitiesSectionProps {
  cities: CitySection[]
}

export default function CitiesSection({ cities }: CitiesSectionProps) {
  if (!cities || cities.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Hidden Gems in Amazing Cities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore off-the-beaten-path destinations and authentic experiences in cities around the world
          </p>
        </div>

        <div className="space-y-20">
          {cities.map((citySection, index) => (
            <div key={citySection.citySlug} className="city-section">
              {/* City Header */}
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {citySection.city} Hidden Gems
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover the secret spots, local favorites, and authentic experiences that make {citySection.city} truly special
                </p>
                <Badge variant="secondary" className="mt-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {citySection.totalArticles} articles about {citySection.city}
                </Badge>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pillar Article - Takes up 2 columns on desktop */}
                <div className="lg:col-span-2">
                  {citySection.pillarArticle && (
                    <Card className="h-full group hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative h-64 lg:h-80 overflow-hidden">
                        <Image
                          src={citySection.pillarArticle.featuredImage.startsWith('adventurebackpack_images/') 
                            ? citySection.pillarArticle.featuredImage.replace('adventurebackpack_images/', '/images/')
                            : citySection.pillarArticle.featuredImage}
                          alt={citySection.pillarArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge variant="outline" className="mb-2 bg-white/90 text-gray-900">
                            Pillar Article
                          </Badge>
                          <h4 className="text-2xl font-bold text-white">
                            {citySection.pillarArticle.title}
                          </h4>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {citySection.pillarArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <Link 
                            href={`/${citySection.pillarArticle.slug}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group/link"
                          >
                            Read the complete guide
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                          <Button 
                            asChild 
                            variant="outline" 
                            className="group/btn"
                          >
                            <Link href={`/${citySection.citySlug}-hidden-gems`}>
                              Explore {citySection.city}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Supporting Articles - Takes up 1 column on desktop */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">
                      More About {citySection.city}
                    </h5>
                    {citySection.supportingArticles.length > 0 ? (
                      citySection.supportingArticles.map((article) => (
                        <Card key={article.slug} className="group hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={article.featuredImage.startsWith('adventurebackpack_images/') 
                                    ? article.featuredImage.replace('adventurebackpack_images/', '/images/')
                                    : article.featuredImage}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                  <Link href={`/${article.slug}`}>
                                    {article.title}
                                  </Link>
                                </h6>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {article.excerpt}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>More articles coming soon!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-12">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href={`/${citySection.citySlug}-hidden-gems`}>
                    Discover All {citySection.city} Hidden Gems
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="text-center mt-20">
          <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-50">
            <Link href="/blog">
              Explore All Cities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 