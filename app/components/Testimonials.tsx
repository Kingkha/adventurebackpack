import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah L.',
    location: 'New York, USA',
    quote: 'The hidden city ticketing hack saved me $430 on my flight to Europe! The step-by-step guide made it super easy to implement and avoid rookie mistakes.',
    avatar: '/reviewer1.jpeg?height=60&width=60'
  },
  {
    name: 'James T.',
    location: 'London, UK',
    quote: 'I used the hotel email template strategy and got upgraded to a suite that was $200 more per night. All it took was a simple email 72 hours before check-in!',
    avatar: '/reviewer2.jpeg?height=60&width=60'
  },
  {
    name: 'Maria G.',
    location: 'Sydney, Australia',
    quote: 'The packing cube system has been a game-changer. I can now fit 2 weeks of clothes in a carry-on, saving $75 in checked bag fees each trip.',
    avatar: '/reviewer3.jpeg?height=60&width=60'
  },
  {
    name: 'Robert K.',
    location: 'Toronto, Canada',
    quote: 'Thanks to the airport lounge hack, I\'ve enjoyed free food, drinks and comfortable seating during layovers without paying for business class tickets!',
    avatar: '/reviewer3.jpeg?height=60&width=60'
  },
  {
    name: 'Elena P.',
    location: 'Barcelona, Spain',
    quote: 'The credit card points strategy helped me book a completely free flight to Asia worth over $900. The hack guide was clear and easy to follow.',
    avatar: '/reviewer1.jpeg?height=60&width=60'
  },
  {
    name: 'David M.',
    location: 'Chicago, USA',
    quote: 'I saved 58% on my honeymoon hotel using the last-minute booking strategy. We got the exact same room that others paid full price for!',
    avatar: '/reviewer2.jpeg?height=60&width=60'
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full">SUCCESS STORIES</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">
            Real Savings from Real Travelers
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            See how our community is using travel hacks to save money and upgrade their experiences:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-blue-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              
              <div className="mt-4 flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-xs text-gray-500">Verified savings</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-yellow-50 p-8 rounded-xl inline-block max-w-2xl">
            <p className="text-gray-800 text-lg font-medium mb-2">Our travelers have saved a combined</p>
            <p className="text-4xl font-bold text-blue-600 mb-2">$2.4 Million+ <span className="text-gray-500 text-lg">this year</span></p>
            <p className="text-gray-600">Using our flight deals, hotel hacks, and budget travel strategies</p>
          </div>
        </div>
      </div>
    </section>
  )
}

