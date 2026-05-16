import Link from 'next/link'
import { getCountriesWithCities, getPostUrl } from '@/lib/getBlogPosts'
import type { BlogPostMeta } from '@/lib/getBlogPosts'
import { siteConfig } from '@/lib/siteConfig'

function isHubPage(post: BlogPostMeta, countrySlug: string, citySlug: string): boolean {
  const slug = post.slug.toLowerCase()
  const hubSlugA = `${countrySlug}/${citySlug}`
  const hubSlugB = `${countrySlug}/${citySlug}/${citySlug}`

  return (
    post.tags?.includes('Hub Page') === true ||
    post.tags?.includes('Hub') === true ||
    slug === hubSlugA ||
    slug === hubSlugB ||
    slug.endsWith(`/${citySlug}`)
  )
}

function isPrimaryPillarPage(post: BlogPostMeta): boolean {
  return (
    post.tags?.includes('Pillar Page') === true ||
    post.tags?.includes('Pillar') === true ||
    post.slug.toLowerCase().includes('winter-travel-guide')
  )
}

function getHref(post: BlogPostMeta): string {
  return post.url ?? getPostUrl(post.slug, '', post.folder, post.subfolders)
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const countries = getCountriesWithCities()

  return (
    <footer className="bg-gray-800 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Countries and Cities Section */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-white mb-6">{siteConfig.brand.name} Guides by Country</h3>
          
          <div className="space-y-12">
            {countries.map((country) => (
              <div key={country.countrySlug} className="border-b border-gray-700 pb-8 last:border-b-0">
                {country.countryHubPage ? (
                  <Link
                    href={getHref(country.countryHubPage)}
                    className="text-lg font-semibold text-white mb-4 block hover:underline"
                  >
                    {country.country} (Country Hub)
                  </Link>
                ) : (
                  <h4 className="text-lg font-semibold text-white mb-4">{country.country}</h4>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {country.cities.map((city) => (
                    <div key={`${country.countrySlug}-${city.citySlug}`} className="space-y-3">
                      <p className="text-white font-medium text-sm">{city.city}</p>
                      
                      {/* Pillar Articles */}
                      {city.pillarArticles.length > 0 ? (
                        <div>
                          {/* HUB_PILLAR_START */}
                          {(() => {
                            const hubPage = city.pillarArticles.find((post) =>
                              isHubPage(post, country.countrySlug, city.citySlug)
                            )

                            // Get all pillar articles (non-hub pages)
                            const pillarArticles = city.pillarArticles.filter(
                              (post) => !isHubPage(post, country.countrySlug, city.citySlug)
                            )

                            // Sort pillar articles: primary pillar pages first, then others
                            const sortedPillarArticles = [...pillarArticles].sort((a, b) => {
                              const aIsPrimary = isPrimaryPillarPage(a)
                              const bIsPrimary = isPrimaryPillarPage(b)
                              if (aIsPrimary && !bIsPrimary) return -1
                              if (!aIsPrimary && bIsPrimary) return 1
                              return 0
                            })

                            return (
                              <div>
                                <p className="text-xs text-gray-400 mb-2">Key pages:</p>
                                <ul className="space-y-1">
                                  {hubPage ? (
                                    <li key={hubPage.slug}>
                                      <Link
                                        href={getHref(hubPage)}
                                        className="text-xs text-blue-300 hover:text-blue-200 hover:underline block"
                                      >
                                        Hub Page: {hubPage.title}
                                      </Link>
                                    </li>
                                  ) : null}

                                  {sortedPillarArticles.length > 0 ? (
                                    sortedPillarArticles.map((pillarPage) => (
                                      <li key={pillarPage.slug}>
                                        <Link
                                          href={getHref(pillarPage)}
                                          className="text-xs text-blue-300 hover:text-blue-200 hover:underline block"
                                        >
                                          {pillarPage.title}
                                        </Link>
                                      </li>
                                    ))
                                  ) : null}

                                  {!hubPage && sortedPillarArticles.length === 0 ? (
                                    <li className="text-xs text-gray-400">No hub or pillar pages available</li>
                                  ) : null}
                                </ul>
                              </div>
                            )
                          })()}
                          {/* HUB_PILLAR_END */}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No pillar guides available</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-white mb-4 block">
              {siteConfig.brand.name}
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              {siteConfig.brand.description}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Featured Guides</h4>
            <ul className="space-y-2 mb-6">
              <li><Link href="/nottingham-activities" className="text-blue-300 hover:text-blue-200 font-semibold">Nottingham · NEW</Link></li>
              <li><Link href="/things-to-do-in-albuquerque" className="text-blue-300 hover:text-blue-200 font-semibold">Albuquerque · NEW</Link></li>
              <li><Link href="/amsterdam-activities" className="text-blue-300 hover:text-blue-200 font-semibold">Amsterdam · NEW</Link></li>
            </ul>
            <h4 className="text-lg font-semibold mb-4 text-white">Top Destinations</h4>
            <ul className="space-y-2">
              <li><Link href="/hanoi-adventures" className="text-gray-300 hover:text-blue-300">Hanoi</Link></li>
              <li><Link href="/bangkok-adventures" className="text-gray-300 hover:text-blue-300">Bangkok</Link></li>
              <li><Link href="/chiang-mai-adventures" className="text-gray-300 hover:text-blue-300">Chiang Mai</Link></li>
              <li><Link href="/kathmandu-adventures" className="text-gray-300 hover:text-blue-300">Kathmandu</Link></li>
              <li><Link href="/la-paz-adventures" className="text-gray-300 hover:text-blue-300">La Paz</Link></li>
              <li><Link href="/cape-town-adventures" className="text-gray-300 hover:text-blue-300">Cape Town</Link></li>
              <li><Link href="/queenstown-adventures" className="text-gray-300 hover:text-blue-300">Queenstown</Link></li>
              <li><Link href="/reykjavik-adventures" className="text-gray-300 hover:text-blue-300">Reykjavik</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-blue-300">About Us</Link></li>
              <li><Link href="/trust" className="text-gray-300 hover:text-blue-300">Trust & Credibility</Link></li>
              <li><Link href="/editorial-policy" className="text-gray-300 hover:text-blue-300">Editorial Policy</Link></li>
              <li><Link href="/methodology" className="text-gray-300 hover:text-blue-300">Methodology</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-blue-300">{siteConfig.footer.blogLinkText}</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-blue-300">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-300 hover:text-blue-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-blue-300">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-300 hover:text-blue-300">Cookie Policy</Link></li>
              <li><a href="/sitemap.xml" className="text-gray-300 hover:text-blue-300">Sitemap</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} {siteConfig.brand.name}. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-gray-400 text-sm">{siteConfig.footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
