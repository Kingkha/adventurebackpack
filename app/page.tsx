import type { Metadata } from 'next'
import Script from 'next/script'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import TopDestinations from './components/TopDestinations'
import RegionNavigator from './components/RegionNavigator'
import EditorialFeed from './components/EditorialFeed'
import CitiesGrid from './components/CitiesGrid'
import CitiesSection from './components/CitiesSection'
import FreshnessSection from './components/FreshnessSection'
import TrustStrip from './components/TrustStrip'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import { getBlogCache, getCitiesWithArticles } from '@/lib/getBlogPosts'
import { getHomepageCollections } from '@/lib/homepageCollections'
import { siteConfig, getBaseUrl, getVerifiedSameAs } from '@/lib/siteConfig'

const SITE_URL = getBaseUrl()
const SITE_NAME = siteConfig.brand.name
const verifiedSameAs = getVerifiedSameAs()

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
}

export default function Home() {
  const cities = getCitiesWithArticles(6)
  const allPosts = getBlogCache()
  const { topDestinations, popularGuides, featuredGuides, latestGuides } = getHomepageCollections()
  const homepageSample = [...topDestinations, ...popularGuides, ...featuredGuides, ...latestGuides]
  const uniqueSample = Array.from(new Map(homepageSample.map((post) => [post.slug, post])).values()).slice(0, 20)
  const collectionSample = uniqueSample.map((post) => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "url": `${SITE_URL}${post.url.startsWith('/') ? post.url : `/${post.url}`}`,
  }))

  return (
    <>
      {/* WebSite Schema */}
      <Script
        id="schema-org-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": SITE_URL,
            "description": siteConfig.brand.description,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${SITE_URL}/blog?tag={search_term_string}`,
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": SITE_NAME,
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/apple-icon.png`,
                "width": 180,
                "height": 180
              }
            }
          })
        }}
      />

      {/* Organization Schema */}
      <Script
        id="schema-org-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": SITE_NAME,
            "url": SITE_URL,
            "logo": `${SITE_URL}/apple-icon.png`,
            "description": siteConfig.brand.description,
            "foundingDate": siteConfig.organization?.foundingDate,
            "knowsAbout": siteConfig.content.themes,
            ...(verifiedSameAs.length > 0 ? { "sameAs": verifiedSameAs } : {}),
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": siteConfig.contact.email,
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            }
          })
        }}
      />

      {/* Person Schema */}
      <Script
        id="schema-org-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": siteConfig.author.defaultName,
            "jobTitle": siteConfig.author.jobTitle,
            "worksFor": {
              "@type": "Organization",
              "name": SITE_NAME
            },
            "description": siteConfig.author.description,
            "knowsAbout": siteConfig.content.themes,
            "url": `${SITE_URL}/author/Editor`,
            "image": `${SITE_URL}/apple-icon.png`
          })
        }}
      />

      {/* Article Collection Schema */}
      <Script
        id="schema-org-article-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Collection",
            "name": `${SITE_NAME} Guides`,
            "description": siteConfig.brand.description,
            "url": SITE_URL,
            "publisher": {
              "@type": "Organization",
              "name": SITE_NAME
            },
            "about": siteConfig.content.themes,
            "audience": {
              "@type": "Audience",
              "audienceType": siteConfig.content.audience
            },
            "numberOfItems": allPosts.length,
            "hasPart": collectionSample
          })
        }}
      />

      <div className="min-h-screen">
        <main>
          <Hero />
          <StatsBar />
          <FreshnessSection />
          <TopDestinations />
          <EditorialFeed />
          <RegionNavigator />
          <CitiesGrid />
          <CitiesSection cities={cities} />
          <TrustStrip />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  )
}
