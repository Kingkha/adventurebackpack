'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "../../components/ui/button"
import { Menu, Search, Map, Compass, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/siteConfig'

const destinations = [
  { name: 'Hanoi', href: '/hanoi-adventures' },
  { name: 'Bangkok', href: '/bangkok-adventures' },
  { name: 'Chiang Mai', href: '/chiang-mai-adventures' },
  { name: 'Kathmandu', href: '/kathmandu-adventures' },
  { name: 'La Paz', href: '/la-paz-adventures' },
  { name: 'Cape Town', href: '/cape-town-adventures' },
  { name: 'Queenstown', href: '/queenstown-adventures' },
  { name: 'Reykjavik', href: '/reykjavik-adventures' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [destinationsOpen, setDestinationsOpen] = useState(false)
  const destinationsRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Keep the header opaque on non-home routes for legibility.
  const isOpaqueByDefault =
    (pathname ? pathname !== '/' : false) ||
    siteConfig.header.opaqueRoutes.some(route => pathname?.includes(route))
  
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destinationsRef.current && !destinationsRef.current.contains(event.target as Node)) {
        setDestinationsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (destinationsOpen) {
          setDestinationsOpen(false)
          // Return focus to the trigger button
          const trigger = destinationsRef.current?.querySelector('button')
          trigger?.focus()
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [destinationsOpen, mobileMenuOpen])

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
              alt={`${siteConfig.brand.name} logo`} 
              width={28} 
              height={28} 
              className="object-contain"
            />
          </div>
          {siteConfig.brand.name}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {/* Destinations dropdown */}
          <div className="relative" ref={destinationsRef}>
            <button
              onClick={() => setDestinationsOpen(!destinationsOpen)}
              aria-expanded={destinationsOpen}
              aria-haspopup="menu"
              aria-controls="destinations-menu"
              className={`flex items-center gap-1 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-sm ${
                scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-gray-100'
              }`}
            >
              Destinations
              <ChevronDown className={`h-4 w-4 transition-transform ${destinationsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {destinationsOpen && (
              <div
                id="destinations-menu"
                role="menu"
                className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
              >
                {destinations.map((d) => (
                  <Link
                    key={d.href}
                    href={d.href}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:bg-blue-50 focus-visible:text-blue-600"
                    onClick={() => setDestinationsOpen(false)}
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/blog" className={`hover:text-blue-500 transition-colors ${
            scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-gray-100'
          }`}>Blog</Link>
          <Link href="/about" className={`hover:text-blue-500 transition-colors ${
            scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-gray-100'
          }`}>About</Link>
        </nav>
        
        <div className="flex space-x-4 items-center">
          {/* Search button */}
          <Button
            asChild
            size="sm"
            variant={(scrolled || isOpaqueByDefault) ? "outline" : "secondary"}
            className={`transition-colors ${
              scrolled || isOpaqueByDefault
                ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm shadow-sm border border-white/30'
            }`}
          >
            <Link href="/blog" aria-label="Search articles">
              <Search className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </Button>

          {/* Explore Attractions button */}
          <Button
            asChild
            size="sm"
            className={`transition-colors text-sm sm:text-base flex items-center ${
              scrolled || isOpaqueByDefault
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            <Link href="/blog">
              <Map className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">{siteConfig.header.exploreButtonText}</span>
              <span className="sm:hidden">{siteConfig.header.exploreButtonTextMobile}</span>
            </Link>
          </Button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <Menu className={`h-6 w-6 ${scrolled || isOpaqueByDefault ? 'text-gray-700' : 'text-white'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-3">
          <Link href="/blog" className="text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Destinations</p>
            <div className="grid grid-cols-2 gap-2">
              {destinations.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="text-gray-700 hover:text-blue-500 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/" className="flex items-center text-blue-600 font-medium pt-1 border-t border-gray-100" onClick={() => setMobileMenuOpen(false)}>
            <Compass className="h-4 w-4 mr-2" />
            {siteConfig.header.startHereText}
          </Link>
        </div>
      )}
    </header>
  )
}
