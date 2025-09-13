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
  
  return (
    <footer className="bg-gray-800 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand and Mission */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white flex items-center">
              Adventure Backpack
            </Link>
            <p className="mt-3 text-gray-400">
              Discover the world's most thrilling adventure activities, extreme sports, and adrenaline-pumping experiences.
            </p>
            
            <div className="mt-6 flex space-x-4">
              <Link href="https://facebook.com/adventurebackpack" 
                className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-orange-300 hover:border-orange-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/adventurebackpack" 
                className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-orange-300 hover:border-orange-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/adventurebackpack" 
                className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-orange-300 hover:border-orange-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://github.com/adventurebackpack" 
                className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-orange-300 hover:border-orange-300 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Column 2: Extreme Sports */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Extreme Sports</h4>
            <ul className="space-y-2 mb-6">
              <li><Link href="/rock-climbing" className="hover:text-orange-300 transition-colors">Rock Climbing</Link></li>
              <li><Link href="/skydiving" className="hover:text-orange-300 transition-colors">Skydiving</Link></li>
              <li><Link href="/bungee-jumping" className="hover:text-orange-300 transition-colors">Bungee Jumping</Link></li>
              <li><Link href="/base-jumping" className="hover:text-orange-300 transition-colors">BASE Jumping</Link></li>
              <li><Link href="/paragliding" className="hover:text-orange-300 transition-colors">Paragliding</Link></li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 text-white">Water Sports</h4>
            <ul className="space-y-2">
              <li><Link href="/white-water-rafting" className="hover:text-orange-300 transition-colors">White Water Rafting</Link></li>
              <li><Link href="/surfing" className="hover:text-orange-300 transition-colors">Surfing</Link></li>
              <li><Link href="/kitesurfing" className="hover:text-orange-300 transition-colors">Kitesurfing</Link></li>
              <li><Link href="/scuba-diving" className="hover:text-orange-300 transition-colors">Scuba Diving</Link></li>
              <li><Link href="/freediving" className="hover:text-orange-300 transition-colors">Freediving</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Mountain Adventures */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Mountain Adventures</h4>
            <ul className="space-y-2 mb-6">
              <li><Link href="/mountain-biking" className="hover:text-orange-300 transition-colors">Mountain Biking</Link></li>
              <li><Link href="/epic-hiking" className="hover:text-orange-300 transition-colors">Epic Hiking</Link></li>
              <li><Link href="/mountaineering" className="hover:text-orange-300 transition-colors">Mountaineering</Link></li>
              <li><Link href="/alpine-skiing" className="hover:text-orange-300 transition-colors">Alpine Skiing</Link></li>
              <li><Link href="/snowboarding" className="hover:text-orange-300 transition-colors">Snowboarding</Link></li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 text-white">Adventure Travel</h4>
            <ul className="space-y-2">
              <li><Link href="/backpacking" className="hover:text-orange-300 transition-colors">Backpacking</Link></li>
              <li><Link href="/wilderness-camping" className="hover:text-orange-300 transition-colors">Wilderness Camping</Link></li>
              <li><Link href="/survival-training" className="hover:text-orange-300 transition-colors">Survival Training</Link></li>
              <li><Link href="/expedition-planning" className="hover:text-orange-300 transition-colors">Expedition Planning</Link></li>
              <li><Link href="/adventure-photography" className="hover:text-orange-300 transition-colors">Adventure Photography</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Adventure Destinations */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Top Adventure Destinations</h4>
            <ul className="space-y-2 mb-6">
              <li><Link href="/new-zealand-adventures" className="hover:text-orange-300 transition-colors">New Zealand</Link></li>
              <li><Link href="/nepal-adventures" className="hover:text-orange-300 transition-colors">Nepal</Link></li>
              <li><Link href="/patagonia-adventures" className="hover:text-orange-300 transition-colors">Patagonia</Link></li>
              <li><Link href="/swiss-alps-adventures" className="hover:text-orange-300 transition-colors">Swiss Alps</Link></li>
              <li><Link href="/costa-rica-adventures" className="hover:text-orange-300 transition-colors">Costa Rica</Link></li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 text-white">Adventure Gear</h4>
            <ul className="space-y-2">
              <li><Link href="/climbing-gear" className="hover:text-orange-300 transition-colors">Climbing Gear</Link></li>
              <li><Link href="/hiking-equipment" className="hover:text-orange-300 transition-colors">Hiking Equipment</Link></li>
              <li><Link href="/camping-gear" className="hover:text-orange-300 transition-colors">Camping Gear</Link></li>
              <li><Link href="/adventure-clothing" className="hover:text-orange-300 transition-colors">Adventure Clothing</Link></li>
              <li><Link href="/safety-equipment" className="hover:text-orange-300 transition-colors">Safety Equipment</Link></li>
            </ul>
          </div>
          
          {/* Column 5: Adventure Categories & About */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Adventure Categories</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/beginner-adventures" className="hover:text-orange-300 transition-colors">
                  Beginner Adventures
                </Link>
              </li>
              <li>
                <Link href="/intermediate-challenges" className="hover:text-orange-300 transition-colors">
                  Intermediate Challenges
                </Link>
              </li>
              <li>
                <Link href="/extreme-adventures" className="hover:text-orange-300 transition-colors">
                  Extreme Adventures
                </Link>
              </li>
              <li>
                <Link href="/family-adventures" className="hover:text-orange-300 transition-colors">
                  Family Adventures
                </Link>
              </li>
              <li>
                <Link href="/solo-adventures" className="hover:text-orange-300 transition-colors">
                  Solo Adventures
                </Link>
              </li>
              <li>
                <Link href="/group-adventures" className="hover:text-orange-300 transition-colors">
                  Group Adventures
                </Link>
              </li>
              <li>
                <Link href="/adventure-courses" className="hover:text-orange-300 transition-colors">
                  Adventure Courses
                </Link>
              </li>
              <li>
                <Link href="/safety-training" className="hover:text-orange-300 transition-colors">
                  Safety Training
                </Link>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 text-white">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  Trust & Credibility
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-300 transition-colors">
                  Adventure Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-orange-300 transition-colors" rel="nofollow">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Adventure Backpack. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-gray-500 text-sm">Made with ❤️ by adventurers for adventurers</p>
        </div>
      </div>
    </footer>
  )
}


