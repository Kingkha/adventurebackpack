'use client'

import { useEffect, useState } from 'react'

// Extend the Window interface to include Viator's VTR object
declare global {
  interface Window {
    VTR?: {
      init: () => void;
    };
  }
}

export interface CityData {
  City: string; // Changed from 'city' to 'City' to match CSV
  Region: string;
  Country: string;
  Continent: string;
  viator_destination_id: string;
  viator_destination_name: string;
  viator_type: string;
  viator_latitude: string;
  viator_longitude: string;
  viator_timezone: string;
  viator_currency: string;
  viator_iata_code: string;
  viator_match_score: string;
  viator_match_method: string;
}

interface CityViatorBannerProps {
  width?: number
  height?: number
  language?: string
  selection?: string
  campaign?: string
  className?: string
  slug?: string
  cityName?: string
}

export default function CityViatorBanner({
  width = 120,
  height = 600,
  language = 'en',
  selection = 'banner1',
  campaign = 'adventurebackpack-banner',
  className = '',
  slug = '',
  cityName
}: CityViatorBannerProps) {
  const [cityData, setCityData] = useState<CityData | null>(null)
  const [viatorUrl, setViatorUrl] = useState('https://www.viator.com/')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function loadCityData() {
      try {
        const params = new URLSearchParams();
        if (slug) params.append('slug', slug);
        if (cityName) params.append('cityName', cityName);
        
        console.log('CityViatorBanner: Loading city data for:', { slug, cityName });
        
        const response = await fetch(`/api/city-data?${params.toString()}`);
        const data = await response.json();
        
        console.log('CityViatorBanner: API response:', data);
        
        if (data.success && data.cityData) {
          setCityData(data.cityData);
          setViatorUrl(data.viatorUrl);
          console.log('CityViatorBanner: City detected:', data.cityData.viator_destination_name);
          console.log('CityViatorBanner: Setting loading to false');
        } else {
          console.log('CityViatorBanner: No city detected');
        }
      } catch (error) {
        console.error('Error loading city data:', error);
      } finally {
        console.log('CityViatorBanner: Setting loading to false in finally block');
        setLoading(false);
      }
    }

    loadCityData();
  }, [cityName, slug])

  useEffect(() => {
    // Load the Viator banner script if it hasn't been loaded already
    if (!document.querySelector('script[src*="banners.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://partners.vtrcdn.com/static/scripts/banners/banners.js'
      script.async = true
      script.onload = () => {
        console.log('Viator banner script loaded successfully')
        setScriptLoaded(true)
        // Try to reinitialize banners after script loads
        setTimeout(() => {
          if (window.VTR && window.VTR.init) {
            window.VTR.init()
          }
        }, 100)
      }
      script.onerror = () => {
        console.error('Failed to load Viator banner script')
      }
      document.head.appendChild(script)
    } else {
      // Script already loaded, try to initialize
      setTimeout(() => {
        if (window.VTR && window.VTR.init) {
          window.VTR.init()
        }
      }, 100)
    }
  }, [])

  // Re-initialize banners when cityData changes
  useEffect(() => {
    if (cityData) {
      setTimeout(() => {
        if (window.VTR && window.VTR.init) {
          console.log('Reinitializing Viator banners for city:', cityData.viator_destination_name)

          window.VTR.init()
        }
      }, 500)
    }
  }, [cityData])

  // Show loading only briefly, then show banner
  if (!mounted) {
    return (
      <div className={`viator-banner-container ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded" style={{ width, height }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-xs">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`viator-banner-container ${className}`}>
      {/* Just the Viator Banner Widget */}
      <div className="relative">
        <div
          data-id="viator-banner"
          data-partner-id="P00271059"
          data-url={viatorUrl}
          data-banner-width={width}
          data-banner-height={height}
          data-banner-language={language}
          data-banner-selection={selection}
          data-campaign={campaign}
        ></div>
        
        {/* Fallback visual banner if script doesn't load */}
        {!scriptLoaded && (
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg flex flex-col justify-center items-center p-3 hover:from-blue-600 hover:to-blue-800 transition-colors cursor-pointer shadow-sm"
            style={{ 
              width: width,
              height: height 
            }}
            onClick={() => window.open(viatorUrl, '_blank')}
          >
            <div className="text-center">
              <div className="text-sm font-bold mb-1">🎯 Viator</div>
              <div className="text-xs mb-1">
                {cityData ? `Tours in ${cityData.viator_destination_name}` : 'Amazing Tours'}
              </div>
              <div className="text-xs opacity-90">Click to explore</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

