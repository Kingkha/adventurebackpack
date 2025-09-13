'use client'

import { Button } from "../../components/ui/button"
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section 
      className="relative h-screen min-h-[600px] overflow-hidden" 
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Background image - a hidden scenic location */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/og-image.webp"
          alt="Epic mountain adventure scene showcasing the type of thrilling outdoor activities and extreme sports featured on Adventure Backpack"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/50 mix-blend-multiply" />
      </div>
      
      <div className="container mx-auto relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center justify-center mb-6 bg-orange-500/20 backdrop-blur-sm px-6 py-2 rounded-full">
            <span className="text-orange-300 font-medium">Epic adventure activities & extreme sports</span>
          </div>
          
          <h1 
            id="hero-heading" 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight"
          >
            Unleash Your <span className="text-orange-400">Adventure Spirit</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
            Discover thrilling adventure activities, extreme sports, and epic outdoor experiences that will push your limits.
          </p>
          
          <Link href="/adventure-activities" aria-label="Start exploring epic adventure activities worldwide">
            <Button 
              size="lg" 
              className="py-6 px-8 text-lg rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg font-semibold"
            >
              Start Your Adventure
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center mt-12 gap-x-6 gap-y-2" aria-label="Key features of Adventure Backpack">
            <span className="flex items-center">
              <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-200 text-sm">Extreme sports & activities</span>
            </span>
            <span className="flex items-center">
              <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-200 text-sm">Adrenaline-pumping experiences</span>
            </span>
            <span className="flex items-center">
              <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-200 text-sm">Expert adventure guides</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

