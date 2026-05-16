import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { CitySection } from '@/lib/getBlogPosts'

interface CitiesSectionProps {
  cities: CitySection[]
}

export default function CitiesSection({ cities }: CitiesSectionProps) {
  if (!cities || cities.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f7f3]">
      <div className="container mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div className="border-l-2 border-sky-600 pl-4">
            <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">City guides</p>
            <h2 className="font-editorial mt-1 text-3xl md:text-4xl text-slate-900">
              Featured Cities
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors"
          >
            All cities <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((citySection) => {
            const image = citySection.pillarArticle?.featuredImage
            const href = citySection.pillarArticle
              ? `/${citySection.pillarArticle.slug}`
              : `/blog?q=${encodeURIComponent(citySection.city)}`

            return (
              <Link
                key={citySection.citySlug}
                href={href}
                className="group relative overflow-hidden rounded-2xl block"
              >
                <div className="relative aspect-[3/2]">
                  {image ? (
                    <Image
                      src={image}
                      alt={citySection.city}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {citySection.city}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-sky-300 tracking-wide">
                      {citySection.totalArticles} guides
                    </p>
                    <span className="mt-3 inline-flex items-center text-xs font-semibold text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore city <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-4 sm:hidden text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            All cities <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
