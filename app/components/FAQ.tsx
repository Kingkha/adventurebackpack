'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Script from 'next/script'

const faqs = [
  {
    question: 'What types of adventure activities does Adventure Backpack cover?',
    answer: 'Adventure Backpack covers a comprehensive range of thrilling activities including extreme sports (skydiving, bungee jumping, BASE jumping), mountain adventures (rock climbing, mountaineering, epic hiking), water sports (white water rafting, surfing, scuba diving), and adventure travel experiences (backpacking expeditions, wilderness camping, survival training). We focus on activities that provide adrenaline rushes and push personal boundaries while maintaining safety standards.'
  },
  {
    question: 'How does Adventure Backpack ensure activity safety and quality?',
    answer: 'We maintain rigorous safety standards by partnering only with certified operators, licensed guides, and reputable adventure companies. Our team personally tests activities, verifies safety protocols, and ensures all operators meet international safety standards. We provide detailed safety briefings, skill requirements, and risk assessments for each activity. Every recommendation comes from our direct experience with certified professionals.'
  },
  {
    question: 'Do I need previous experience for extreme sports and adventure activities?',
    answer: 'Not at all! We feature adventures for all skill levels, from complete beginners to experienced thrill-seekers. Many activities like tandem skydiving, guided rock climbing, or white water rafting are designed for first-timers with professional instruction. We clearly indicate skill requirements, provide beginner-friendly options, and offer progression paths from introductory experiences to advanced challenges. Every activity includes proper training and safety briefings.'
  },
  {
    question: 'How much do adventure activities typically cost?',
    answer: 'Adventure activity costs vary widely depending on location, duration, and complexity. Beginner experiences like tandem skydiving might range from $200-500, while multi-day expeditions can cost $1000-5000+. We provide detailed pricing information, highlight budget-friendly options, and suggest ways to reduce costs like group bookings or off-season adventures. Many activities offer better value than traditional tourist attractions while providing unforgettable experiences.'
  },
  {
    question: 'What should I bring for adventure activities?',
    answer: 'Equipment requirements vary by activity, but most operators provide specialized gear like helmets, harnesses, wetsuits, and safety equipment. We provide detailed packing lists for each adventure, highlighting what\'s included versus what you should bring. Generally, you\'ll need appropriate clothing, sturdy footwear, and personal items. For multi-day expeditions, we offer comprehensive gear guides and recommendations for purchasing or renting equipment.'
  },
  {
    question: 'Are adventure activities safe for solo travelers?',
    answer: 'Absolutely! Many adventure activities are perfectly suited for solo travelers, often providing opportunities to meet like-minded adventurers. Group activities like white water rafting or guided climbing create instant communities. We highlight solo-friendly adventures, recommend reputable operators with good safety records, and provide tips for solo adventure travel. Professional guides ensure safety regardless of group size.'
  },
  {
    question: 'What\'s the best age range for adventure activities?',
    answer: 'Adventure activities span all age groups! We feature family-friendly adventures suitable for children (guided nature hikes, beginner rock climbing), teen and young adult activities (skydiving, bungee jumping), and adventures perfect for active seniors (scenic hiking, cultural expeditions). Age requirements vary by activity and location, but there are thrilling experiences available for every age group with appropriate safety considerations.'
  },
  {
    question: 'How physically fit do I need to be for adventure activities?',
    answer: 'Fitness requirements vary dramatically by activity. Some adventures like tandem skydiving require minimal fitness, while multi-day hiking expeditions demand good cardiovascular health. We provide detailed fitness requirements, preparation tips, and alternative options for different fitness levels. Many activities are more about courage and willingness to try than peak physical condition, and we always suggest consulting healthcare providers for strenuous activities.'
  },
  {
    question: 'Can adventure activities be environmentally responsible?',
    answer: 'Absolutely! We prioritize eco-friendly adventure operators who practice sustainable tourism, respect wildlife, and minimize environmental impact. Many activities like hiking, rock climbing, and kayaking have minimal ecological footprints when done responsibly. We promote Leave No Trace principles, support conservation efforts, and highlight operators committed to environmental stewardship. Adventure travel can actually foster environmental awareness and support conservation efforts.'
  },
  {
    question: 'How often do you add new adventure activities to Adventure Backpack?',
    answer: 'We continuously discover and add new adventure activities, with major updates every month featuring seasonal activities, new destinations, and emerging extreme sports. Our team constantly tests new adventures, explores cutting-edge activities, and partners with innovative operators worldwide. We also regularly update existing content with new locations, improved safety information, and seasonal availability to ensure you have access to the latest and greatest adventure opportunities.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Frequently Asked Questions About Adventure Activities
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Curious about extreme sports and adventure activities? Get answers to common questions about thrilling experiences, safety considerations, and how to get started with adrenaline-pumping adventures.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <button
                className="flex justify-between items-center w-full p-5 text-left hover:bg-orange-50/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className="flex-shrink-0 ml-2">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-orange-600" />
                  )}
                </span>
              </button>
              <div 
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="p-5 border-t border-gray-100">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Still have questions about adventure activities and extreme sports? <a href="/contact" className="text-orange-600 hover:underline font-medium">Contact our adventure experts</a>
          </p>
        </div>
      </div>
    </section>
  )
}

