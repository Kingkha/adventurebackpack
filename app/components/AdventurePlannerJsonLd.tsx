"use client"

import { useEffect } from "react"

interface AdventurePlannerJsonLdProps {
  title: string
  description: string
  url: string
}

export function AdventurePlannerJsonLd({
  title,
  description,
  url,
}: AdventurePlannerJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "AI Adventure Planner",
      "description": "Free AI-powered adventure planner tool for hiking, climbing, camping and outdoor trips. Get personalized itineraries, gear recommendations and expert tips.",
      "url": url,
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free AI adventure planning tool"
      },
      "featureList": [
        "AI-powered trip planning",
        "Personalized adventure recommendations",
        "Gear recommendations",
        "Expert outdoor tips",
        "Hiking itinerary planning",
        "Camping trip planning",
        "Rock climbing route planning",
        "Water sports adventure planning",
        "Wildlife and nature tour planning",
        "Adventure photography guidance"
      ],
      "screenshot": "https://adventurebackpack.com/og-image.webp",
      "author": {
        "@type": "Organization",
        "name": "Adventure Backpack",
        "url": "https://adventurebackpack.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://adventurebackpack.com/apple-icon.png",
          "width": 180,
          "height": 180
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "Adventure Backpack",
        "url": "https://adventurebackpack.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://adventurebackpack.com/apple-icon.png",
          "width": 180,
          "height": 180
        }
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "Adventure enthusiasts, outdoor travelers, hikers, climbers, campers"
      },
      "about": [
        {
          "@type": "Thing",
          "name": "Adventure Planning"
        },
        {
          "@type": "Thing",
          "name": "Outdoor Activities"
        },
        {
          "@type": "Thing",
          "name": "Trip Planning"
        },
        {
          "@type": "Thing",
          "name": "Hiking"
        },
        {
          "@type": "Thing",
          "name": "Rock Climbing"
        },
        {
          "@type": "Thing",
          "name": "Camping"
        }
      ],
      "keywords": "adventure planner, ai adventure planner, trip planner, outdoor adventures, hiking planner, camping trips, rock climbing, adventure travel, outdoor activities, expedition planning, ai trip planner, adventure itinerary, outdoor trip planning, hiking itinerary, camping planner, adventure guide",
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "softwareVersion": "1.0",
      "dateCreated": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "AI Adventure Planner",
        "description": "AI-powered tool for planning outdoor adventures and trips",
        "applicationCategory": "TravelApplication",
        "operatingSystem": "Web Browser"
      }
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [title, description, url])

  return null
}

interface FAQJsonLdProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [faqs])

  return null
}

interface HowToJsonLdProps {
  name: string
  description: string
  steps: Array<{
    name: string
    text: string
  }>
}

export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": name,
      "description": description,
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text
      })),
      "totalTime": "PT5M",
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Internet connection"
        },
        {
          "@type": "HowToSupply", 
          "name": "Web browser"
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": "AI Adventure Planner"
        }
      ]
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [name, description, steps])

  return null
}
