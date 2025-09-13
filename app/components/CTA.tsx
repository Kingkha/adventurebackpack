import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0 text-left">
            <div className="inline-flex items-center justify-center mb-6 bg-blue-500/30 backdrop-blur-sm px-4 py-1 rounded-full">
              <TrendingUp className="h-4 w-4 text-yellow-200 mr-2" />
              <span className="text-yellow-200 text-sm font-medium">Join smart travelers</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Plan Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">Epic Adventure</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Join thousands of adventurers who use our AI-powered planner to discover amazing hiking trails, climbing routes, and outdoor experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/adventure-planner">
                <Button size="lg" className="w-full sm:w-auto py-6 px-8 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all rounded-lg">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Plan Your Adventure
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="w-full sm:w-auto py-6 px-8 border-white/30 bg-blue-700/50 text-white hover:bg-white/20 text-lg font-medium rounded-lg">
                  See Success Stories
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 border border-blue-400/20 bg-blue-700/30 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="mx-auto text-blue-200 text-sm">Travel Hack Results</div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <div className="bg-yellow-400/20 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Lightbulb className="h-5 w-5 text-yellow-200" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Flight Hack</p>
                  <p className="text-white text-sm font-semibold">Hidden City Ticketing Strategy</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 p-4 rounded-lg mb-4">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <span className="text-blue-200 text-sm">Standard Price:</span>
                  <span className="text-white text-sm font-semibold line-through">$850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200 text-sm">With Hack:</span>
                  <span className="text-yellow-300 text-sm font-bold">$320</span>
                </div>
                <div className="flex justify-between bg-green-500/20 p-2 rounded-lg mt-1">
                  <span className="text-blue-200 text-sm">Your Savings:</span>
                  <span className="text-green-300 text-sm font-bold">$530 (62%)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm text-blue-100 mb-3">Applied by travelers this month:</p>
              <div className="flex -space-x-2 overflow-hidden mb-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-600 bg-blue-500/50 flex items-center justify-center text-xs text-white">
                    {['JD', 'SM', 'RK', 'AT', 'MP', '12+'][i]}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-200">Success rate:</span>
                <div className="flex items-center">
                  <div className="h-2 w-24 bg-blue-900/50 rounded-full overflow-hidden mr-2">
                    <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 w-11/12"></div>
                  </div>
                  <span className="text-green-300 font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="flex flex-wrap gap-8 items-center justify-center max-w-2xl">
            <div className="text-blue-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Expert-verified hacks</span>
            </div>
            <div className="text-blue-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Updated weekly</span>
            </div>
            <div className="text-blue-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Community-tested</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

