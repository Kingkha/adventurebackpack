import Header from '../components/Header'
import Footer from '../components/Footer'
import PrivacyPolicy from '../components/PrivacyPolicy'
import type { Metadata } from "next"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"

export const metadata: Metadata = {
  title: `Privacy Policy`,
  description: `Read the privacy policy for ${siteConfig.brand.name}.`,
  alternates: {
    canonical: `${getBaseUrl()}/privacy`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <PrivacyPolicy />
      <Footer />
    </>
  )
}

