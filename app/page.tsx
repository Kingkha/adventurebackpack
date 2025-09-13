import { Metadata } from 'next'
import React from 'react'
import Script from 'next/script'
import Header from './components/Header'
import Hero from './components/Hero'
import DestinationThemes from './components/DestinationThemes'
import TopLinks from './components/TopLinks'
import FeaturedArticles from './components/FeaturedArticles'
import LatestArticles from './components/LatestArticles'
import CitiesSection from './components/CitiesSection'
import AboutSection from './components/AboutSection'
import NewsletterSignup from './components/NewsletterSignup'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { getCitiesWithArticleTypes } from '@/lib/getBlogPosts'

export const metadata: Metadata = {
  title: 'Adventure Backpack - Epic Adventure Activities & Outdoor Experiences',
  description: 'Discover thrilling adventure activities, extreme sports, hiking expeditions, and outdoor adventures worldwide. Your ultimate guide to adrenaline-pumping experiences and epic backpacking journeys.',
  keywords: 'adventure activities, extreme sports, hiking, backpacking, outdoor adventures, rock climbing, mountain biking, white water rafting, skydiving, bungee jumping, adventure travel, wilderness exploration, trekking, camping, adventure tours',
  alternates: {
    canonical: 'https://adventurebackpack.com',
  },
  openGraph: {
    title: 'Adventure Backpack - Epic Adventure Activities & Outdoor Experiences',
    description: 'Discover thrilling adventure activities, extreme sports, and outdoor adventures worldwide. Your ultimate guide to adrenaline-pumping experiences and epic backpacking journeys.',
    url: 'https://adventurebackpack.com',
    siteName: 'Adventure Backpack',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Adventure Backpack - Epic Adventure Activities',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adventure Backpack - Epic Adventure Activities & Outdoor Experiences',
    description: 'Discover thrilling adventure activities, extreme sports, and outdoor adventures worldwide. Your ultimate guide to adrenaline-pumping experiences.',
    images: ['/og-image.webp'],
    creator: '@adventurebackpack',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function Home() {
  // Get cities with their articles for the homepage
  const cities = getCitiesWithArticleTypes(12)

  return (
    <>
      {/* WebSite Schema.org data */}
      <Script 
        id="schema-org-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Adventure Backpack",
            "url": "https://adventurebackpack.com",
            "description": "Discover epic adventure activities, extreme sports, hiking expeditions, and thrilling outdoor experiences worldwide.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://adventurebackpack.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Adventure Backpack",
              "logo": {
                "@type": "ImageObject",
                "url": "https://adventurebackpack.com/apple-icon.png",
                "width": 180,
                "height": 180
              }
            }
          })
        }}
      />
      
      {/* Organization Schema.org data */}
      <Script 
        id="schema-org-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Adventure Backpack",
            "url": "https://adventurebackpack.com",
            "logo": "https://adventurebackpack.com/apple-icon.png",
            "description": "Your ultimate guide to adventure activities, extreme sports, and thrilling outdoor experiences worldwide.",
            "foundingDate": "2024",
            "numberOfEmployees": "5-10",
            "industry": "Adventure Travel & Outdoor Recreation",
            "knowsAbout": [
              "Adventure activities",
              "Extreme sports",
              "Hiking and trekking",
              "Backpacking expeditions",
              "Rock climbing",
              "Mountain biking",
              "White water rafting",
              "Outdoor adventures",
              "Wilderness exploration"
            ],
            "award": [
              "Featured in adventure sports publications",
              "Trusted by thousands of adventure seekers worldwide"
            ],
            "sameAs": [
              "https://facebook.com/adventurebackpack", 
              "https://twitter.com/adventurebackpack",
              "https://instagram.com/adventurebackpack",
              "https://pinterest.com/adventurebackpack"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "email": "hello@adventurebackpack.com",
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            }
          })
        }}
      />

      {/* Person Schema for Editor/Author */}
      <Script 
        id="schema-org-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Adventure Backpack Editor",
            "jobTitle": "Adventure Content Editor",
            "worksFor": {
              "@type": "Organization",
              "name": "Adventure Backpack"
            },
            "description": "Experienced adventure sports enthusiast and content creator with expertise in extreme sports and outdoor activities.",
            "knowsAbout": [
              "Adventure activities",
              "Extreme sports",
              "Hiking and mountaineering",
              "Rock climbing",
              "Backpacking expeditions",
              "Outdoor safety",
              "Wilderness survival"
            ],
            "hasCredential": [
              "Wilderness First Aid certification",
              "Rock climbing instructor certification",
              "Adventure travel guide training"
            ],
            "alumniOf": {
              "@type": "Organization",
              "name": "Adventure Travel Trade Association"
            },
            "url": "https://adventurebackpack.com/author/Editor",
            "image": "https://adventurebackpack.com/apple-icon.png"
          })
        }}
      />

      {/* BreadcrumbList Schema.org data */}
      <Script 
        id="schema-org-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://adventurebackpack.com"
              }
            ]
          })
        }}
      />
      
      <div className="min-h-screen">
        <Header />
        <main itemScope itemType="https://schema.org/WebPage">
          <meta itemProp="name" content="Adventure Backpack - Epic Adventure Activities & Outdoor Experiences" />
          <meta itemProp="description" content="Discover thrilling adventure activities, extreme sports, hiking expeditions, and outdoor adventures worldwide." />
          <Hero />
          <DestinationThemes />
          <TopLinks cities={cities} />
          <CitiesSection cities={cities} />
          <FeaturedArticles />
          <LatestArticles />
          <AboutSection />
          <FAQ />
          <NewsletterSignup />
        </main>
        <Footer topCities={cities} />
      </div>
    </>
  )
}

