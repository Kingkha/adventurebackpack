"use client"

import { useEffect } from "react"

interface BlogPostJsonLdProps {
  title: string
  description: string
  images: string[]
  datePublished: string
  dateModified?: string
  authorName: string
  authorUrl: string
  url: string
}

export function BlogPostJsonLd({
  title,
  description,
  images,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  url,
}: BlogPostJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: description,
      image: images,
      datePublished: datePublished,
      dateModified: dateModified || datePublished,
      author: [
        {
          "@type": "Person",
          name: authorName,
          url: authorUrl,
          jobTitle: "Travel Content Editor",
          worksFor: {
            "@type": "Organization",
            name: "Adventure Backpack"
          },
          description: "Experienced travel content creator with expertise in hidden destinations and authentic travel experiences.",
          knowsAbout: [
            "Hidden travel destinations",
            "Cultural immersion",
            "Sustainable tourism",
            "Local travel experiences",
            "Off-the-beaten-path exploration"
          ],
          hasCredential: [
            "Travel writing certification",
            "Cultural tourism training",
            "Sustainable tourism practices"
          ],
          alumniOf: {
            "@type": "Organization",
            "name": "Travel Industry Association"
          }
        },
      ],
      publisher: {
        "@type": "Organization",
        name: "Adventure Backpack",
        logo: {
          "@type": "ImageObject",
          url: "https://adventurebackpack.com/apple-icon.png",
          width: 180,
          height: 180
        },
        foundingDate: "2023",
        numberOfEmployees: "5-10",
        industry: "Travel & Tourism",
        knowsAbout: [
          "Hidden travel destinations",
          "Off-the-beaten-path travel",
          "Authentic travel experiences",
          "Cultural immersion",
          "Sustainable tourism",
          "Local travel guides"
        ],
        award: [
          "Featured in travel publications",
          "Trusted by thousands of travelers worldwide"
        ]
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      isPartOf: {
        "@type": "Blog",
        name: "Adventure Backpack Blog",
        description: "Expert guides to hidden destinations and authentic travel experiences worldwide"
      },
      about: [
        {
          "@type": "Thing",
          name: "Hidden Travel Destinations"
        },
        {
          "@type": "Thing", 
          name: "Authentic Travel Experiences"
        },
        {
          "@type": "Thing",
          name: "Off-the-Beaten-Path Travel"
        }
      ],
      audience: {
        "@type": "Audience",
        audienceType: "Travelers seeking authentic experiences"
      }
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [title, description, images, datePublished, dateModified, authorName, authorUrl, url])

  return null
}

interface BlogListingJsonLdProps {
  posts: Array<{
    title: string
    excerpt: string
    slug: string
    date: string
    author: string
    featuredImage: string
    isFromBlogFolder?: boolean
    folder?: string
    subfolders?: string[]
  }>
  baseUrl: string
}

export function BlogListingJsonLd({ posts, baseUrl }: BlogListingJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          url: getPostUrl(post, baseUrl),
          datePublished: post.date,
          author: [
            {
              "@type": "Person",
              name: post.author,
            },
          ],
          image: [post.featuredImage],
        },
      })),
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [posts, baseUrl])

  return null
}

// Helper function to determine the correct URL
function getPostUrl(post: { slug: string; isFromBlogFolder?: boolean; folder?: string; subfolders?: string[] }, baseUrl: string): string {
  // If we have a nested structure with subfolders, build the path from all segments
  // This handles any depth of nesting (1, 2, 3+ levels)
  if (post.subfolders && post.subfolders.length > 0) {
    const pathSegments = [...post.subfolders, post.slug]
    return `${baseUrl}/${pathSegments.join('/')}`
  }
  
  // If from blog folder, don't include the /blog prefix
  if (post.isFromBlogFolder) {
    return `${baseUrl}/${post.slug}`
  }
  
  // If in a subfolder and has the same name as the folder
  if (post.folder && post.slug === post.folder) {
    return `${baseUrl}/${post.folder}`
  }
  
  // If in a subfolder but has a different name
  if (post.folder) {
    return `${baseUrl}/${post.folder}/${post.slug}`
  }
  
  // Default: include the /blog prefix
  return `${baseUrl}/blog/${post.slug}`
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    item: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.item,
      })),
    })
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [items])

  return null
}

