'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'
import { usePathname } from 'next/navigation'
import blogData from '../../content/blog-cache.json'
import { CitySection } from '@/lib/getBlogPosts'

interface FooterProps {
  topCities?: CitySection[]
}

// Hardcoded country structure with cities from blog posts
const countryCities = {
  'Japan': [
    { name: 'Tokyo', slug: 'tokyo-hidden-gems' },
    { name: 'Kyoto', slug: 'kyoto-hidden-gems' },
    { name: 'Osaka', slug: 'osaka-hidden-gems' },
    { name: 'Hiroshima', slug: 'hiroshima-hidden-gems' },
    { name: 'Fukuoka', slug: 'fukuoka-hidden-gems' },
    { name: 'Sapporo', slug: 'sapporo-hidden-gems' },
    { name: 'Yokohama', slug: 'yokohama-hidden-gems' },
    { name: 'Nara', slug: 'nara-hidden-gems' },
    { name: 'Kanazawa', slug: 'kanazawa-hidden-gems' },
    { name: 'Takayama', slug: 'takayama-hidden-gems' }
  ],
  'Thailand': [
    { name: 'Bangkok', slug: 'bangkok-hidden-gems' },
    { name: 'Chiang Mai', slug: 'chiangmai-hidden-gems' },
    { name: 'Ayutthaya', slug: 'ayuthaya-hidden-gems' },
    { name: 'Kanchanaburi', slug: 'kanchanaburi-hidden-gems' },
    { name: 'Lampang', slug: 'lampang-hidden-gems' },
    { name: 'Pattaya', slug: 'pattaya-hidden-gems' },
    { name: 'Sukhothai', slug: 'sukhothai-hidden-gems' },
    { name: 'Chiang Rai', slug: 'chiangrai-hidden-gems' },
    { name: 'Phuket Town', slug: 'phukettown-hidden-gems' },
    { name: 'Pai', slug: 'pai-hidden-gems' }
  ],
  'Vietnam': [
    { name: 'Hanoi', slug: 'hanoi-hidden-gems' },
    { name: 'Ho Chi Minh City', slug: 'hochiminhcity-hidden-gems' },
    { name: 'Hoi An', slug: 'hoian-hidden-gems' },
    { name: 'Da Nang', slug: 'danang-hidden-gems' },
    { name: 'Hue', slug: 'hue-hidden-gems' },
    { name: 'Sapa', slug: 'sapa-hidden-gems' },
    { name: 'Nha Trang', slug: 'nhatrang-hidden-gems' },
    { name: 'Can Tho', slug: 'cantho-hidden-gems' },
    { name: 'Ha Tien', slug: 'ha-tien-hidden-gems' },
    { name: 'Haiphong', slug: 'haiphong-hidden-gems' }
  ],
  'South Korea': [
    { name: 'Seoul', slug: 'seoul-hidden-gems' },
    { name: 'Busan', slug: 'busan-hidden-gems' },
    { name: 'Daegu', slug: 'daegu-hidden-gems' },
    { name: 'Incheon', slug: 'incheon-hidden-gems' },
    { name: 'Gangneung', slug: 'gangneung-hidden-gems' },
    { name: 'Gyeongju', slug: 'gyeongju-hidden-gems' },
    { name: 'Mokpo', slug: 'mokpo-hidden-gems' },
    { name: 'Seogwipo', slug: 'seogwipo-hidden-gems' },
    { name: 'Hualien', slug: 'hualien-hidden-gems' },
    { name: 'Naha', slug: 'naha-hidden-gems' }
  ],
  'Taiwan': [
    { name: 'Taipei', slug: 'taipei-hidden-gems' },
    { name: 'Kaohsiung', slug: 'kaohsiung-hidden-gems' },
    { name: 'Taichung', slug: 'taichung-hidden-gems' },
    { name: 'Tainan', slug: 'tainan-hidden-gems' },
    { name: 'Taitung', slug: 'taitung-hidden-gems' },
    { name: 'Nikkō', slug: 'nikkō-hidden-gems' },
    { name: 'Matsumoto', slug: 'matsumoto-hidden-gems' },
    { name: 'Kamakura', slug: 'kamakura-hidden-gems' },
    { name: 'Kumamoto', slug: 'kumamoto-hidden-gems' },
    { name: 'Kagoshima', slug: 'kagoshima-hidden-gems' }
  ],
  'UAE': [
    { name: 'Dubai', slug: 'dubai-hidden-gems' },
    { name: 'Abu Dhabi', slug: 'abudhabi-hidden-gems' }
  ],
  'Turkey': [
    { name: 'Istanbul', slug: 'istanbul-hidden-gems' }
  ],
  'Malaysia': [
    { name: 'Kuala Lumpur', slug: 'kualalumpur-hidden-gems' }
  ],
  'Israel': [
    { name: 'Jerusalem', slug: 'jerusalem-hidden-gems' }
  ]
}

export default function Footer({ topCities = [] }: FooterProps) {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  
  // European cities with their display names
  const europeanCities = [
    // Germany
    { name: 'Aachen', slug: 'aachen', country: 'Germany' },
    { name: 'Rostock', slug: 'rostock', country: 'Germany' },
    { name: 'Dortmund', slug: 'dortmund', country: 'Germany' },
    { name: 'Füssen', slug: 'fussen', country: 'Germany' },
    { name: 'Wiesbaden', slug: 'wiesbaden', country: 'Germany' },
    { name: 'Würzburg', slug: 'wurzburg', country: 'Germany' },
    { name: 'Linz', slug: 'linz', country: 'Austria' },
    
    // Spain
    { name: 'A Coruña', slug: 'a-coruna', country: 'Spain' },
    { name: 'Denia', slug: 'denia', country: 'Spain' },
    { name: 'Mali Lošinj', slug: 'mali-losinj', country: 'Croatia' },
    { name: 'Parga', slug: 'parga', country: 'Greece' },
    { name: 'Grado', slug: 'grado', country: 'Italy' },
    { name: 'Brescia', slug: 'brescia', country: 'Italy' },
    { name: 'El Puerto de Santa María', slug: 'el-puerto-de-santa-maria', country: 'Spain' },
    { name: 'Calvi', slug: 'calvi', country: 'France' },
    { name: 'Orta San Giulio', slug: 'orta-san-giulio', country: 'Italy' },
    { name: 'Ullapool', slug: 'ullapool', country: 'Scotland' },
    { name: 'Fontainebleau', slug: 'fontainebleau', country: 'France' },
    { name: 'Menton', slug: 'menton', country: 'France' },
    { name: 'Milazzo', slug: 'milazzo', country: 'Italy' },
    { name: 'Tarragona', slug: 'tarragona', country: 'Spain' },
    { name: 'Hvar Town', slug: 'hvar-town', country: 'Croatia' },
    { name: 'Montreux', slug: 'montreux', country: 'Switzerland' },
    { name: 'Chartres', slug: 'chartres', country: 'France' },
    { name: 'Cremona', slug: 'cremona', country: 'Italy' },
    { name: 'Tivat', slug: 'tivat', country: 'Montenegro' },
    { name: 'Helsingør', slug: 'helsingr', country: 'Denmark' },
    { name: 'Perpignan', slug: 'perpignan', country: 'France' },
    { name: 'Sirmione', slug: 'sirmione', country: 'Italy' },
    { name: 'Zakopane', slug: 'zakopane', country: 'Poland' },
    { name: 'Willemstad', slug: 'willemstad', country: 'Netherlands' },
    { name: 'Versailles', slug: 'versailles', country: 'France' },
    { name: 'Chambéry', slug: 'chambery', country: 'France' },
    { name: 'Sanlúcar de Barrameda', slug: 'sanlucar-de-barrameda', country: 'Spain' },
    { name: 'Locarno', slug: 'locarno', country: 'Switzerland' },
    { name: 'Poprad', slug: 'poprad', country: 'Slovakia' },
    
    // UK & Ireland
    { name: 'Dover', slug: 'dover', country: 'UK' },
    
    // Italy
    { name: 'Bellagio', slug: 'bellagio', country: 'Italy' },
    { name: 'Cortina d\'Ampezzo', slug: 'cortina-dampezzo', country: 'Italy' },
    { name: 'Viterbo', slug: 'viterbo', country: 'Italy' },
    { name: 'Cala Gonone', slug: 'cala-gonone', country: 'Italy' },
    { name: 'Silves', slug: 'silves', country: 'Portugal' },
    { name: 'Peso da Régua', slug: 'peso-da-regua', country: 'Portugal' },
    { name: 'Carvoeiro', slug: 'carvoeiro', country: 'Portugal' },
    { name: 'Vila Nova de Milfontes', slug: 'vila-nova-de-milfontes', country: 'Portugal' },
    { name: 'Argostoli', slug: 'argostoli', country: 'Greece' },
    { name: 'Kars', slug: 'kars', country: 'Turkey' },
    { name: 'Alanya', slug: 'alanya', country: 'Turkey' },
    { name: 'Urgup', slug: 'urgup', country: 'Turkey' },
    { name: 'Sanlıurfa', slug: 'sanlurfa', country: 'Turkey' },
    { name: 'Gaziantep', slug: 'gaziantep', country: 'Turkey' },
    { name: 'Batumi', slug: 'batumi', country: 'Georgia' },
    
    // Other European
    { name: 'Mdina', slug: 'mdina', country: 'Malta' },
    { name: 'Dakhla', slug: 'dakhla', country: 'Morocco' },
    { name: 'Taroudant', slug: 'taroudant', country: 'Morocco' },
    { name: 'Tafraoute', slug: 'tafraoute', country: 'Morocco' }
  ]

  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white mb-3 block">
              Adventure Backpack
            </Link>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your ultimate guide to European adventure destinations. Discover thrilling activities, extreme sports, and adrenaline-pumping experiences across Europe's most exciting cities.
            </p>
            
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-200 mb-2">What We Offer</h5>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Comprehensive city guides</li>
                <li>• Adventure activity recommendations</li>
                <li>• Local insider tips</li>
                <li>• Safety guidelines</li>
                <li>• Budget-friendly options</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-200 mb-2">Follow Our Adventures</h5>
              <div className="flex space-x-3">
                <Link href="https://facebook.com/adventurebackpack" 
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:text-orange-300 hover:bg-orange-600/20 transition-colors"
                  title="Follow us on Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href="https://twitter.com/adventurebackpack" 
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:text-orange-300 hover:bg-orange-600/20 transition-colors"
                  title="Follow us on Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href="https://instagram.com/adventurebackpack" 
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:text-orange-300 hover:bg-orange-600/20 transition-colors"
                  title="Follow us on Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="https://github.com/adventurebackpack" 
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:text-orange-300 hover:bg-orange-600/20 transition-colors"
                  title="Check out our GitHub">
                  <Github className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Trusted by thousands of adventurers worldwide</p>
              <p>Since 2024 • Made with ❤️ for explorers</p>
            </div>
          </div>
          
          {/* Column 2: European Cities - Pillar Articles Only */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-white">European Destinations</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {europeanCities.map((city) => (
                <div key={city.slug} className="text-center">
                  <Link 
                    href={`/${city.slug}-highlights`} 
                    className="text-orange-300 hover:text-orange-200 font-medium text-xs transition-colors block py-1 px-2 rounded hover:bg-gray-700/50"
                    title={`${city.name}, ${city.country}`}
                  >
                    {city.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Column 3: About & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">About & Legal</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-200 mb-2">About</h5>
                <ul className="space-y-1">
                  <li>
                    <Link href="/about" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/trust" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      Trust & Credibility
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-gray-300 hover:text-orange-300 transition-colors text-sm">
                      Adventure Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <a href="/sitemap.xml" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      Sitemap
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-200 mb-2">Legal</h5>
                <ul className="space-y-1">
                  <li>
                    <Link href="/privacy" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-gray-300 hover:text-orange-300 transition-colors text-sm" rel="nofollow">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Adventure Backpack. All rights reserved.
          </p>
          <p className="mt-2 md:mt-0 text-gray-500 text-sm">
            Made with ❤️ by adventurers
          </p>
        </div>
      </div>
    </footer>
  )
}


