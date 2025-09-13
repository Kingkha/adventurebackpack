import { Suspense } from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adventure Planner AI - Plan Epic Adventures & Outdoor Trips | Adventure Backpack',
  description: 'Plan your next epic adventure with our AI-powered adventure planner. Get personalized recommendations for hiking, climbing, camping, and outdoor activities worldwide.',
  keywords: 'adventure planner, trip planner, outdoor adventures, hiking planner, camping trips, rock climbing, adventure travel, outdoor activities, expedition planning',
  openGraph: {
    title: 'Adventure Planner AI - Plan Epic Adventures & Outdoor Trips',
    description: 'Plan your next epic adventure with our AI-powered adventure planner. Get personalized recommendations for outdoor activities worldwide.',
    url: 'https://adventurebackpack.com/adventure-planner',
    siteName: 'Adventure Backpack',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Adventure Backpack AI Adventure Planner',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adventure Planner AI - Plan Epic Adventures',
    description: 'Plan your next epic adventure with our AI-powered adventure planner',
    images: ['/og-image.webp'],
  }
}

const DynamicAdventurePlanner = dynamic(() => import('../components/AdventurePlanner'), {
  ssr: false,
})

export default async function AdventurePlannerPage() {
  const session = await getServerSession(authOptions)

  return (
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
        <Footer />
      </div>
    </div>
  )
}
