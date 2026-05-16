'use client'

import { siteConfig } from '@/lib/siteConfig'
import { CheckCircle2 } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {siteConfig.howItWorks.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {siteConfig.howItWorks.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.howItWorks.steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

