import { Suspense } from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import { AdventurePlannerJsonLd, FAQJsonLd, HowToJsonLd } from '../components/AdventurePlannerJsonLd'

export const metadata: Metadata = {
  title: 'AI Adventure Planner - Free Trip Planning Tool for Outdoor Adventures | Adventure Backpack',
  description: 'Free AI adventure planner tool for hiking, climbing, camping & outdoor trips. Get personalized itineraries, gear recommendations & expert tips for your next epic adventure.',
  keywords: 'adventure planner, ai adventure planner, trip planner, outdoor adventures, hiking planner, camping trips, rock climbing, adventure travel, outdoor activities, expedition planning, ai trip planner, adventure itinerary, outdoor trip planning, hiking itinerary, camping planner, adventure guide',
  openGraph: {
    title: 'AI Adventure Planner - Free Trip Planning Tool for Outdoor Adventures',
    description: 'Free AI adventure planner tool for hiking, climbing, camping & outdoor trips. Get personalized itineraries, gear recommendations & expert tips for your next epic adventure.',
    url: 'https://adventurebackpack.com/adventure-planner',
    siteName: 'Adventure Backpack',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'AI Adventure Planner - Free Trip Planning Tool for Outdoor Adventures',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Adventure Planner - Free Trip Planning Tool',
    description: 'Free AI adventure planner tool for hiking, climbing, camping & outdoor trips. Get personalized itineraries & expert tips.',
    images: ['/og-image.webp'],
  },
  alternates: {
    canonical: 'https://adventurebackpack.com/adventure-planner',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

const DynamicAdventurePlanner = dynamic(() => import('../components/AdventurePlanner'), {
  ssr: false,
})

export default async function AdventurePlannerPage() {
  const session = await getServerSession(authOptions)

  const faqs = [
    {
      question: "What is an AI adventure planner and how does it work?",
      answer: "Our AI adventure planner is a free, intelligent tool that helps you plan outdoor adventures, hiking trips, camping expeditions, and other outdoor activities. Simply describe your dream adventure, specify your experience level and group size, and our AI will generate personalized recommendations including destinations, detailed itineraries, gear suggestions, and expert safety tips tailored to your preferences."
    },
    {
      question: "What types of adventures can I plan with this AI tool?",
      answer: "Our AI adventure planner covers a wide range of outdoor activities including hiking and trekking route planning with difficulty assessments, camping trip planning with comprehensive gear recommendations, rock climbing route suggestions for all skill levels, water sports adventures including kayaking, rafting, and diving, wildlife and nature tour recommendations, adventure photography location suggestions, multi-day backpacking expedition planning, and group adventure planning for families and friends."
    },
    {
      question: "Is the AI adventure planner really free to use?",
      answer: "Yes! Our AI adventure planner is completely free to use. You get 3 free adventure planning sessions without registration, and unlimited planning when you sign in with your Google account. There are no hidden fees, premium subscriptions, or credit card requirements. We believe everyone should have access to expert-level adventure planning tools."
    },
    {
      question: "How accurate are the AI adventure planner recommendations?",
      answer: "Our AI adventure planner learns from thousands of successful outdoor expeditions and expert knowledge to provide highly accurate recommendations. The AI considers factors like weather conditions, seasonal variations, difficulty levels, safety requirements, and local regulations to ensure your adventure is both exciting and safe. All recommendations are tailored to your specific skill level and preferences."
    },
    {
      question: "Can I get gear recommendations for my adventure?",
      answer: "Absolutely! Our AI adventure planner provides detailed gear recommendations based on your specific adventure type, duration, weather conditions, and skill level. This includes clothing, equipment, safety gear, and essential items for your outdoor activities. The recommendations are practical and budget-conscious, helping you prepare for your adventure without unnecessary expenses."
    },
    {
      question: "Why choose our AI adventure planner over other trip planning tools?",
      answer: "Unlike traditional trip planners that focus on hotels and restaurants, our AI adventure planner specializes in outdoor activities and understands the unique requirements of adventure travel. It provides expert-level recommendations for gear, safety, logistics, and route planning that you won't find in generic travel planning tools. Plus, it's completely free and designed specifically for outdoor enthusiasts."
    }
  ]

  const howToSteps = [
    {
      name: "Describe Your Adventure",
      text: "Tell the AI about your dream adventure - where you want to go, what activities interest you, your experience level, and any specific requirements or preferences."
    },
    {
      name: "Get Personalized Recommendations",
      text: "The AI will analyze your input and provide personalized recommendations including destinations, activities, timing, and difficulty levels that match your preferences."
    },
    {
      name: "Review Your Itinerary",
      text: "Receive a detailed itinerary with day-by-day plans, including activities, locations, timing, and important considerations for your adventure."
    },
    {
      name: "Get Gear Recommendations",
      text: "Receive comprehensive gear lists tailored to your specific adventure, including clothing, equipment, safety gear, and essential items."
    },
    {
      name: "Plan Your Adventure",
      text: "Use the detailed recommendations to book accommodations, purchase gear, and prepare for your epic outdoor adventure with confidence."
    }
  ]

  return (
    <>
      <AdventurePlannerJsonLd
        title="AI Adventure Planner - Free Trip Planning Tool for Outdoor Adventures"
        description="Free AI adventure planner tool for hiking, climbing, camping & outdoor trips. Get personalized itineraries, gear recommendations & expert tips for your next epic adventure."
        url="https://adventurebackpack.com/adventure-planner"
      />
      <FAQJsonLd faqs={faqs} />
      <HowToJsonLd
        name="How to Use the AI Adventure Planner"
        description="Learn how to use our free AI adventure planner to plan your next outdoor adventure with personalized recommendations and expert tips."
        steps={howToSteps}
      />
      <div className="min-h-screen relative">
      {/* Dynamic gradient background with adventure theme */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-green-600 z-0"></div>
      
      {/* Animated mountain silhouette background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute bottom-0 w-full h-64 opacity-20" viewBox="0 0 1200 300" fill="none">
          <path d="M0 300L50 250L100 280L200 200L300 240L400 180L500 220L600 160L700 200L800 140L900 180L1000 120L1100 160L1200 100V300H0Z" fill="currentColor" className="text-green-800"/>
          <path d="M0 300L80 260L160 290L240 230L320 270L400 210L480 250L560 190L640 230L720 170L800 210L880 150L960 190L1040 130L1120 170L1200 110V300H0Z" fill="currentColor" className="text-green-700 opacity-60"/>
        </svg>
      </div>
      
      {/* Adventure-themed background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0L0 15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Floating adventure icons */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 opacity-10 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"/>
          </svg>
        </div>
        <div className="absolute top-32 right-20 opacity-10 animate-pulse" style={{animationDelay: '2s'}}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2L13.09,8.26L22,9L17.5,13.74L18.18,22L12,18.27L5.82,22L6.5,13.74L2,9L10.91,8.26L12,2Z"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-20 opacity-10 animate-pulse" style={{animationDelay: '4s'}}>
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
          </svg>
        </div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 w-full">
        <Header />
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">Planning Your Adventure</h3>
              <p className="text-emerald-100">Discovering epic outdoor experiences...</p>
            </div>
          </div>
        }>
          <div className="w-full px-0 sm:px-2 md:px-4 mx-auto">
            <DynamicAdventurePlanner />
          </div>
        </Suspense>
        
        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions About Our AI Adventure Planner
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What is an AI adventure planner and how does it work?
                </h3>
                <p className="text-gray-700">
                  Our AI adventure planner is a free, intelligent tool that helps you plan outdoor adventures, hiking trips, camping expeditions, and other outdoor activities. Simply describe your dream adventure, specify your experience level and group size, and our AI will generate personalized recommendations including destinations, detailed itineraries, gear suggestions, and expert safety tips tailored to your preferences.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What types of adventures can I plan with this AI tool?
                </h3>
                <p className="text-gray-700 mb-4">
                  Our AI adventure planner covers a wide range of outdoor activities including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Hiking and trekking route planning with difficulty assessments</li>
                  <li>Camping trip planning with comprehensive gear recommendations</li>
                  <li>Rock climbing route suggestions for all skill levels</li>
                  <li>Water sports adventures including kayaking, rafting, and diving</li>
                  <li>Wildlife and nature tour recommendations</li>
                  <li>Adventure photography location suggestions</li>
                  <li>Multi-day backpacking expedition planning</li>
                  <li>Group adventure planning for families and friends</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Is the AI adventure planner really free to use?
                </h3>
                <p className="text-gray-700">
                  Yes! Our AI adventure planner is completely free to use. You get 3 free adventure planning sessions without registration, and unlimited planning when you sign in with your Google account. There are no hidden fees, premium subscriptions, or credit card requirements. We believe everyone should have access to expert-level adventure planning tools.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How accurate are the AI adventure planner recommendations?
                </h3>
                <p className="text-gray-700">
                  Our AI adventure planner learns from thousands of successful outdoor expeditions and expert knowledge to provide highly accurate recommendations. The AI considers factors like weather conditions, seasonal variations, difficulty levels, safety requirements, and local regulations to ensure your adventure is both exciting and safe. All recommendations are tailored to your specific skill level and preferences.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Can I get gear recommendations for my adventure?
                </h3>
                <p className="text-gray-700">
                  Absolutely! Our AI adventure planner provides detailed gear recommendations based on your specific adventure type, duration, weather conditions, and skill level. This includes clothing, equipment, safety gear, and essential items for your outdoor activities. The recommendations are practical and budget-conscious, helping you prepare for your adventure without unnecessary expenses.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Why choose our AI adventure planner over other trip planning tools?
                </h3>
                <p className="text-gray-700">
                  Unlike traditional trip planners that focus on hotels and restaurants, our AI adventure planner specializes in outdoor activities and understands the unique requirements of adventure travel. It provides expert-level recommendations for gear, safety, logistics, and route planning that you won't find in generic travel planning tools. Plus, it's completely free and designed specifically for outdoor enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Our AI Adventure Planner is the Best Free Trip Planning Tool
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Intelligence</h3>
                <p className="text-gray-600">Advanced AI algorithms analyze your preferences, skill level, and requirements to provide personalized adventure recommendations that traditional trip planners can't match.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Completely Free</h3>
                <p className="text-gray-600">No hidden fees, no premium subscriptions, no credit card required. Get expert-level adventure planning completely free with unlimited access after sign-in.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h3>
                <p className="text-gray-600">Every recommendation includes safety considerations, weather awareness, and emergency preparedness tips to ensure your adventure is both thrilling and safe.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Local Knowledge</h3>
                <p className="text-gray-600">Access to insider knowledge about hidden gems, best times to visit, local regulations, and off-the-beaten-path locations that only experienced adventurers know about.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Planning</h3>
                <p className="text-gray-600">Get detailed itineraries, gear lists, budget estimates, transportation options, and accommodation suggestions - everything you need for a successful adventure.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Results</h3>
                <p className="text-gray-600">Get personalized adventure recommendations in seconds. No waiting, no complicated forms - just describe your dream adventure and get instant expert advice.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
      </div>
    </>
  )
}
