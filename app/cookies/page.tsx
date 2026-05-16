import Header from '../components/Header'
import Footer from '../components/Footer'
import CookiePolicy from '../components/CookiePolicy'
import type { Metadata } from "next"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"

export const metadata: Metadata = {
  title: `Cookie Policy`,
  description: `Read the cookie policy for ${siteConfig.brand.name}.`,
  alternates: {
    canonical: `${getBaseUrl()}/cookies`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function CookiePage() {
  return (
    <>
      <Header />
      <CookiePolicy />
      <Footer />
    </>
  )
}

