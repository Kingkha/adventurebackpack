import type { Metadata } from 'next'
import { Inter, Libre_Baskerville } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from './components/Header'
import GoogleAnalytics from './components/GoogleAnalytics'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from 'react'
import { siteConfig, getBaseUrl } from '@/lib/siteConfig'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-editorial',
  display: 'swap',
})

const SITE_URL = getBaseUrl()
const SITE_NAME = siteConfig.brand.name

const verification = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
}
const otherVerification: Record<string, string | string[]> = {}
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  otherVerification['msvalidate.01'] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.defaultKeywords.split(', '),
  applicationName: SITE_NAME,
  authors: [{ name: siteConfig.author.defaultName }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: siteConfig.seo.favicon,
    apple: siteConfig.seo.appleIcon,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'x-default': SITE_URL,
      'en': SITE_URL,
    },
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – ${siteConfig.brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [siteConfig.seo.ogImage],
    ...(siteConfig.social.twitter
      ? { site: siteConfig.social.twitter, creator: siteConfig.social.twitter }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    ...(verification.google ? { google: verification.google } : {}),
    ...(verification.yandex ? { yandex: verification.yandex } : {}),
    ...(verification.yahoo ? { yahoo: verification.yahoo } : {}),
    ...(Object.keys(otherVerification).length > 0 ? { other: otherVerification } : {}),
  },
  category: siteConfig.content.industry,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS Feed`} href="/feed.xml" />
      </head>
      <body className={`${inter.variable} ${libreBaskerville.variable} font-sans bg-white text-gray-800`}>
        <Script id="stay22-let-me-allez" strategy="afterInteractive">
          {`(function (s, t, a, y, twenty, two) {
  s.Stay22 = s.Stay22 || {};
  s.Stay22.params = { lmaID: '6a5d05290d30f9c7d2a2d320' };
  twenty = t.createElement(a);
  two = t.getElementsByTagName(a)[0];
  twenty.async = 1;
  twenty.src = y;
  two.parentNode.insertBefore(twenty, two);
})(window, document, 'script', 'https://scripts.stay22.com/letmeallez.js');`}
        </Script>
        <Header />
        {children}
        <Suspense fallback={null}>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
