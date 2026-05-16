'use client'

import { siteConfig } from '@/lib/siteConfig'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" aria-labelledby="faq-heading">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl font-bold text-center text-gray-900 mb-4">
            {siteConfig.faq.title} About {siteConfig.brand.name}
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {siteConfig.faq.description}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {siteConfig.faq.questions.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

