import { Search, Lightbulb, BookOpen, Share, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const steps = [
  {
    title: 'Find Travel Hacks',
    description: 'Browse our vast collection of travel hacks by category or search for specific travel challenges you want to solve.',
    icon: <Search className="h-6 w-6 text-white" />,
    color: 'bg-blue-500'
  },
  {
    title: 'Learn the Strategy',
    description: 'Each hack includes step-by-step instructions, expert tips, and real examples of how to implement it successfully.',
    icon: <BookOpen className="h-6 w-6 text-white" />,
    color: 'bg-yellow-500'
  },
  {
    title: 'Apply the Hack',
    description: 'Put the travel hack into action on your next trip and enjoy the benefits of insider knowledge.',
    icon: <Lightbulb className="h-6 w-6 text-white" />,
    color: 'bg-purple-500'
  },
  {
    title: 'Share Your Results',
    description: 'Let us know how much you saved and share your own travel hacks with our community of savvy travelers.',
    icon: <Share className="h-6 w-6 text-white" />,
    color: 'bg-orange-500'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-4">How Travel Hacks Work</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Saving on Travel in Four Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our proven travel hacks have helped thousands of travelers save money and enhance their journeys:
          </p>
        </div>

        <div className="relative">
          {/* Desktop progress line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0">
            <div className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-purple-500 w-3/4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center mb-6">
                  <div className={`${step.color} rounded-full w-14 h-14 flex items-center justify-center shadow-lg flex-shrink-0`}>
                    {step.icon}
                  </div>
                  <div className="ml-4 lg:hidden">
                    <span className="text-gray-500 text-sm font-medium">Step {index + 1}</span>
                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full lg:mt-4">
                  <div className="lg:block hidden mb-4">
                    <span className="text-gray-500 text-sm font-medium">Step {index + 1}</span>
                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex justify-center mt-6">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-700 mb-6 text-lg">
            Ready to start planning your next epic outdoor adventure?
          </p>
          <Link href="/adventure-planner">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-6 rounded-lg text-lg font-medium">
              Plan Your Adventure Now
            </Button>
          </Link>
        </div>

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 shrink-0">
              <img 
                src="/travel-hack-results.webp" 
                alt="Travel hack savings results" 
                className="rounded-lg shadow-md max-w-full h-auto"
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Real Results from Real Travelers
              </h3>
              <p className="text-gray-700 mb-6">
                Our community has reported significant savings and travel upgrades by using our hacks. From scoring business class flights at economy prices to accessing exclusive hotel perks.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  $500+ flight savings
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                  Hotel room upgrades
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                  Priority treatment
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm">
                  Insider experiences
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

