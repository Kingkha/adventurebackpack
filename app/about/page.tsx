import Header from "../components/Header"
import Footer from "../components/Footer"
import type { Metadata } from "next"
import { siteConfig, getBaseUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: `About Us`,
  description: `Meet ${siteConfig.brand.name}—the team of writers, local experts, and specialists uncovering authentic ${siteConfig.content.focus} worldwide.`,
  keywords: siteConfig.seo.defaultKeywords,
  alternates: {
    canonical: `${getBaseUrl()}/about`,
  },
  openGraph: {
    title: `About ${siteConfig.brand.name} - ${siteConfig.brand.tagline}`,
    description: `${siteConfig.brand.name} blends local expertise and insight to help you explore ${siteConfig.content.focus}.`,
    url: `${getBaseUrl()}/about`,
    siteName: siteConfig.brand.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `About ${siteConfig.brand.name} - ${siteConfig.brand.tagline}`,
    description: `${siteConfig.brand.name} blends local expertise and insight to help you explore ${siteConfig.content.focus}.`,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About {siteConfig.brand.name}</h1>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-xl text-gray-700 mb-6">
            {siteConfig.brand.name} {siteConfig.aboutPage.intro}
          </p>
          
          <h2>Our Story</h2>
          <p>
            Founded in {siteConfig.organization.foundingDate} by editors and specialists, {siteConfig.brand.name} {siteConfig.aboutPage.story}
          </p>
          
          <h2>Our Expertise & Experience</h2>
          <p>
            {siteConfig.aboutPage.teamIntro}
          </p>
          
          <ul>
            {siteConfig.aboutPage.teamRoles.map((role, index) => (
              <li key={index}><strong>{role.title}:</strong> {role.description}</li>
            ))}
          </ul>
          
          <h2>Our Research Process</h2>
          <p>
            Every guide we publish is locally grounded and verified:
          </p>
          
          <ul>
            {siteConfig.aboutPage.researchProcess.map((item, index) => (
              <li key={index}><strong>{item.title}:</strong> {item.description}</li>
            ))}
          </ul>
          
          <h2>What We Do</h2>
          <p>
            Using our global network and deep research, {siteConfig.brand.name} {siteConfig.aboutPage.whatWeDo}
          </p>
          
          <h2>Our Commitment to Authenticity</h2>
          <p>
            We are committed to:
          </p>
          
          <ul>
            {siteConfig.aboutPage.commitments.map((item, index) => (
              <li key={index}><strong>{item.title}:</strong> {item.description}</li>
            ))}
          </ul>
          
          <h2>Trust & Credibility</h2>
          <p>
            Our editors maintain high editorial standards. Content is vetted for accuracy, authenticity, availability, and on-the-ground relevance before publication.
          </p>
          
          <h2>Join Us on Your Next Adventure</h2>
          <p>
            Whether you're planning a journey, exploring traditions, seeking authentic experiences, or looking for local activities, {siteConfig.brand.name} is here to guide you. Contact us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> with your questions or tips.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">Our Credentials</h3>
            <ul className="space-y-2">
              {siteConfig.aboutPage.credentials.map((credential, index) => (
                <li key={index}>✓ {credential}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
