'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "../../components/ui/button"
import { User, Menu, Search, Map, Compass } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function Header() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on a page that should have opaque header by default
  const isOpaqueByDefault = pathname?.startsWith('/blog') || 
                           pathname?.includes('/ghost-towns/') || 
                           pathname?.includes('/hidden-gem-towns/') || 
                           pathname?.includes('/scenic-train-rides/') || 
                           pathname?.includes('/secret-beaches/') || 
                           pathname?.includes('/historic-villages/') || 
                           pathname?.includes('/island-getaways/') || 
                           pathname?.includes('/spring-nature-walks/') || 
                           pathname?.includes('/winter-escapes/') || 
                           false
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAuth = () => {
    if (session) {
      signOut()
    } else {
      signIn('google')
    }
  }

  return (
    <header className={`w-full py-4 px-4 sm:px-6 lg:px-8 fixed top-0 z-50 transition-all duration-300 ${
      scrolled || isOpaqueByDefault ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`text-2xl font-bold flex items-center ${
          scrolled || isOpaqueByDefault ? 'text-gray-900' : 'text-white'
        }`}>
          <div className="relative mr-2 w-7 h-7">
            <Image 
              src="/apple-icon.png" 
              alt="Adventure Backpack logo" 
              width={28} 
              height={28} 
              className="object-contain"
            />
          </div>
          Adventure Backpack
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/adventure-planner" className={`hover:text-orange-500 transition-colors ${
            scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-gray-100'
          }`}>Adventure Planner</Link>
          <Link href="/about" className={`hover:text-orange-500 transition-colors ${
            scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-gray-100'
          }`}>About</Link>
        </nav>
        
        <div className="flex space-x-4 items-center">
          {/* Search button */}
          <Button 
            size="sm"
            variant={(scrolled || isOpaqueByDefault) ? "outline" : "secondary"}
            className={`transition-colors ${
              scrolled || isOpaqueByDefault
                ? 'border-gray-300 text-gray-600 hover:bg-gray-50' 
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm shadow-sm border border-white/30'
            }`}
            onClick={() => window.location.href='/blog'}
          >
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          
          {/* Explore Map button */}
          <Button 
            size="sm"
            className={`transition-colors text-sm sm:text-base flex items-center ${
              scrolled || isOpaqueByDefault
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
            }`}
            onClick={() => window.location.href='/blog'}
          >
            <Map className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Find Adventures</span>
            <span className="sm:hidden">Adventures</span>
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className={`h-6 w-6 ${scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-white'}`} />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-3">
          <Link href="/adventure-planner" className="text-gray-700 hover:text-orange-500">Adventure Planner</Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-500">About</Link>
          <Link href="/" className="flex items-center text-orange-600 font-medium">
            <Compass className="h-4 w-4 mr-2" />
            Start Adventure Guide
          </Link>
        </div>
      )}
      <Script 
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js" 
        data-gyg-partner-id="26CH4CT"
        strategy="lazyOnload"
      />
    </header>
  )
}

