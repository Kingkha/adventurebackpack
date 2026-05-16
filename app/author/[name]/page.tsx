import { notFound } from "next/navigation"
import Image from "next/image"
import Script from "next/script"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AuthorPosts from "../../components/AuthorPosts"
import { getBlogPostsMeta } from "@/lib/getBlogPosts"
import { getBlogCache } from "@/lib/blogCache"
import { MapPin, Mail, Globe } from "lucide-react"
import { siteConfig, getBaseUrl } from '@/lib/siteConfig'
import type { Metadata } from "next"

export function generateStaticParams() {
  const posts = getBlogCache()
  const authors = [...new Set(posts.map((p) => p.author).filter(Boolean))]
  return authors.map((name) => ({ name }))
}

export function generateMetadata({ params }: { params: { name: string } }): Metadata {
  const decodedName = decodeURIComponent(params.name)
  const authorUrl = `${getBaseUrl()}/author/${encodeURIComponent(decodedName)}`
  return {
    title: `${decodedName} — Author`,
    description: `Read ${decodedName}'s travel guides and articles on ${siteConfig.brand.name}.`,
    alternates: {
      canonical: authorUrl,
    },
    openGraph: {
      title: `${decodedName} | Author at ${siteConfig.brand.name}`,
      description: `Read ${decodedName}'s travel guides and articles on ${siteConfig.brand.name}.`,
      url: authorUrl,
      siteName: siteConfig.brand.name,
      locale: 'en_US',
      type: 'profile',
      images: [
        {
          url: siteConfig.seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${decodedName} – ${siteConfig.brand.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedName} | Author at ${siteConfig.brand.name}`,
      description: `Read ${decodedName}'s travel guides and articles on ${siteConfig.brand.name}.`,
      images: [siteConfig.seo.ogImage],
    },
  }
}

export default function AuthorPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name)
  const { posts } = getBlogPostsMeta()
  const authorPosts = posts.filter((post) => post.author === decodedName)

  if (authorPosts.length === 0) {
    notFound()
  }

  const authorData = {
    name: decodedName,
    role: decodedName === "Editor" ? `${siteConfig.brand.name} Editor` : `${siteConfig.brand.name} Contributor`,
    description: decodedName === "Editor" 
      ? `As a ${siteConfig.brand.name} Editor ${siteConfig.authorPage.editorDescription}`
      : `${decodedName} ${siteConfig.authorPage.contributorDescription}`,
    location: siteConfig.contact.location,
    email: siteConfig.contact.email,
    website: getBaseUrl(),
    image: "/placeholder-user.jpg",
    credentials: decodedName === "Editor" 
      ? siteConfig.authorPage.editorCredentials 
      : siteConfig.authorPage.contributorCredentials,
    expertise: decodedName === "Editor" 
      ? siteConfig.authorPage.editorExpertise 
      : siteConfig.authorPage.contributorExpertise
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": authorData.name,
    "jobTitle": authorData.role,
    "description": authorData.description,
    "url": `${getBaseUrl()}/author/${encodeURIComponent(authorData.name)}`,
    "image": `${getBaseUrl()}${authorData.image}`,
    "email": authorData.email,
    "worksFor": {
      "@type": "Organization",
      "name": siteConfig.brand.name,
      "url": getBaseUrl(),
    },
    "knowsAbout": authorData.expertise,
    "hasCredential": authorData.credentials,
    // Only emit sameAs when editorSameAs is populated with real, verified profile URLs.
    // An empty array means no sameAs claim — safer than broken/unverified claims for a
    // cold-launch domain (see lib/siteConfig.ts editorSameAs comment).
    ...(decodedName === "Editor" && siteConfig.authorPage.editorSameAs.length > 0
      ? { "sameAs": siteConfig.authorPage.editorSameAs }
      : {}),
  }

  // rel=me links for author identity verification. Emitted only when the
  // editorSameAs array is populated with real, verified profile URLs.
  // Crucial for Mastodon/Bluesky/IndieWeb identity resolution and AI-surface
  // author confidence. Skipped for contributors (they don't have editorSameAs).
  const relMeLinks =
    decodedName === "Editor" ? siteConfig.authorPage.editorSameAs : []

  return (
    <>
    {relMeLinks.map((href) => (
      <link key={href} rel="me" href={href} />
    ))}
    <Script
      id="schema-org-person"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <Image
                src={authorData.image || "/placeholder.svg"}
                alt={authorData.name}
                width={300}
                height={300}
                className="h-48 w-full object-cover md:h-full md:w-48"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-green-500 font-semibold">{authorData.role}</div>
              <h1 className="mt-1 text-4xl font-bold text-gray-900">{authorData.name}</h1>
              <p className="mt-2 text-gray-600">{authorData.description}</p>
              
              {/* Credentials Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Credentials & Expertise</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Credentials</h4>
                    <ul className="space-y-1">
                      {authorData.credentials.map((credential, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Areas of Expertise</h4>
                    <ul className="space-y-1">
                      {authorData.expertise.map((expertise, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-blue-500 mr-2">•</span>
                          {expertise}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {authorData.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  {authorData.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-2" />
                  {authorData.website}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AuthorPosts posts={authorPosts} />
      </main>
      <Footer />
    </div>
    </>
  )
}
