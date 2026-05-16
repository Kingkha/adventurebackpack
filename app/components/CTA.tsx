'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { siteConfig } from '@/lib/siteConfig'

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800" aria-labelledby="cta-heading">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
          {siteConfig.cta.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          {siteConfig.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={siteConfig.cta.primaryButton.href}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              {siteConfig.cta.primaryButton.text}
            </Button>
          </Link>
          <Link href={siteConfig.cta.secondaryButton.href}>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              {siteConfig.cta.secondaryButton.text}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

