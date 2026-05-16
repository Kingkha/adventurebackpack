import Link from 'next/link'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/siteConfig'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: `Page Not Found – ${siteConfig.brand.name}`,
  description: `The page you are looking for does not exist. Browse all ${siteConfig.brand.name} guides to find what you need.`,
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-lg">
          <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors"
            >
              Go to homepage
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Browse all guides
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
