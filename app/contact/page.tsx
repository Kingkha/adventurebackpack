import Header from "../components/Header"
import Footer from "../components/Footer"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig, getBaseUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: `Contact Us`,
  description: `${siteConfig.contactPage.metaDescription} - ${siteConfig.brand.name}`,
  alternates: {
    canonical: `${getBaseUrl()}/contact`,
  },
  openGraph: {
    title: `Contact ${siteConfig.brand.name} | ${siteConfig.brand.tagline}`,
    description: `${siteConfig.contactPage.metaDescription} - ${siteConfig.brand.name}`,
    url: `${getBaseUrl()}/contact`,
    siteName: siteConfig.brand.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact ${siteConfig.brand.name} | ${siteConfig.brand.tagline}`,
    description: `${siteConfig.contactPage.metaDescription} - ${siteConfig.brand.name}`,
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact {siteConfig.brand.name}</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 mb-8 text-center">
            {siteConfig.contactPage.intro} You can also reach us directly at <a href={`mailto:${siteConfig.contact.email}`} className="text-blue-700 hover:text-blue-800 underline">{siteConfig.contact.email}</a>.
          </p>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <Input type="text" id="subject" name="subject" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
