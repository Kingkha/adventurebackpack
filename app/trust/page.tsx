import { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { siteConfig, getBaseUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: `Trust & Credibility`,
  description: `Learn about ${siteConfig.brand.name}'s editorial standards, experts, and commitment to accurate, trustworthy ${siteConfig.content.focus} information.`,
  keywords: siteConfig.seo.defaultKeywords,
  alternates: {
    canonical: `${getBaseUrl()}/trust`,
  },
  openGraph: {
    title: `Trust & Credibility | ${siteConfig.brand.name} - Editorial Standards & ${siteConfig.brand.tagline}`,
    description: `Learn about ${siteConfig.brand.name}'s editorial standards, experts, and commitment to accurate, trustworthy ${siteConfig.content.focus} information.`,
    url: `${getBaseUrl()}/trust`,
    siteName: siteConfig.brand.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Trust & Credibility | ${siteConfig.brand.name} - Editorial Standards & ${siteConfig.brand.tagline}`,
    description: `Learn about ${siteConfig.brand.name}'s editorial standards, experts, and commitment to accurate, trustworthy ${siteConfig.content.focus} information.`,
  },
}

export default function TrustPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trust & Credibility</h1>
            <p className="text-xl text-gray-600">
              {siteConfig.trustPage.intro}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Editorial Standards</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert-Driven Content</h3>
                <p className="text-gray-700">
                  At {siteConfig.brand.name}, {siteConfig.trustPage.expertContent}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification Process</h3>
                <p className="text-gray-700">
                  {siteConfig.trustPage.verificationProcess}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Expertise</h3>
                <p className="text-gray-700">
                  {siteConfig.trustPage.localExpertise}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-700">
                  {siteConfig.trustPage.transparency}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Expert Team</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {siteConfig.trustPage.expertTeam.map((expert, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{expert.title}</h3>
                  <p className="text-gray-700">{expert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quality Assurance</h2>
            
            <div className="space-y-4">
              {siteConfig.trustPage.qualityAssurance.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Have questions about our editorial standards or want to report an issue with our content?
                We're here to help and always welcome feedback from our community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`mailto:${siteConfig.contact.email}`} 
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </a>
                
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Contact Form
                </a>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Response Time:</strong> We typically respond to all inquiries within 24-48 hours.
                  For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  )
} 
