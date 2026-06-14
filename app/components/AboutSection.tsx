'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "../../components/ui/button"
import { siteConfig } from '@/lib/siteConfig'

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">OUR MISSION</span>
            <h2 
              id="about-heading" 
              className="text-3xl md:text-4xl font-bold mt-4 text-gray-900"
            >
              What Is {siteConfig.brand.name}?
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/3 relative aspect-square rounded-2xl overflow-hidden">
              <Image 
                src="/og-image.webp" 
                alt={siteConfig.aboutSection.imageAlt}
                fill 
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            
            <div className="md:w-2/3">
              <p className="text-lg text-gray-700 mb-4">
                {siteConfig.brand.description}
              </p>
              
              <p className="text-lg text-gray-700 mb-4">
                {siteConfig.aboutSection.paragraph1}
              </p>
              
              <p className="text-lg text-gray-700 mb-5">
                {siteConfig.aboutSection.paragraph2}
              </p>
              
              <Button
                asChild
                variant="outline"
                className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white rounded-lg"
              >
                <Link href="/about" aria-label={`Learn more about ${siteConfig.brand.name}'s mission and team`}>
                  {siteConfig.aboutSection.buttonText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

