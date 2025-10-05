'use client'

import dynamic from 'next/dynamic'

// Dynamically import the banner component with no SSR
const CityViatorBanner = dynamic(
  () => import('./CityViatorBanner'),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded" style={{ width: 120, height: 600 }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      </div>
    )
  }
)

export default CityViatorBanner
