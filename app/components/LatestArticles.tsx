import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { getBlogPostsMeta, getPostUrl } from '../../lib/getBlogPosts'

export default function LatestArticles() {
  // Get the latest blog posts (no cursor, limit to 6)
  const { posts } = getBlogPostsMeta(null, 6)
  
  return (
    <section id="latest-articles" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-4 py-1 rounded-full">LATEST ARTICLES</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">Latest Adventure Guides</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our latest adventure discoveries and extreme sports guides for thrill seekers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            // Determine the post URL using the helper function
            const postUrl = getPostUrl(post.slug, "", post.folder, post.subfolders)
            
            // Format the date
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            
            return (
              <Link href={postUrl} key={post.slug}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={post.featuredImage.startsWith('adventurebackpack_images/') 
                        ? post.featuredImage.replace('adventurebackpack_images/', '/images/')
                        : post.featuredImage} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {post.tags && post.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-orange-500 hover:bg-orange-600">{post.tags[0]}</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-500 text-xs mb-2">{formattedDate} • By {post.author}</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="pt-0 px-5 pb-5">
                    <div className="text-orange-600 text-sm font-medium flex items-center">
                      Read adventure guide
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/blog">
            <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg px-6 py-3 transition-colors">
              View All Adventure Guides
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
} 