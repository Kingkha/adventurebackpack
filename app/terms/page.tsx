import Header from '../components/Header'
import Footer from '../components/Footer'
import TermsOfService from '../components/TermsOfService'
import type { Metadata } from "next"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"

export const metadata: Metadata = {
  title: `Terms of Service`,
  description: `Read the terms of service for ${siteConfig.brand.name}.`,
  alternates: {
    canonical: `${getBaseUrl()}/terms`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <TermsOfService />
      <Footer />
    </>
  )
}

