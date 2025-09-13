import Header from "../components/Header"
import Footer from "../components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trust & Credibility | Adventure Backpack - Safety Standards & Expert Adventure Guides",
  description: "Learn about Adventure Backpack's safety standards, expert credentials, and commitment to providing accurate, trustworthy adventure activity information. Discover our verification process and expert team.",
  keywords: "adventure safety standards, expert adventure guides, trustworthy adventure information, adventure credentials, safety verification process",
  alternates: {
    canonical: 'https://adventurebackpack.com/trust',
  },
  openGraph: {
    title: "Trust & Credibility | Adventure Backpack - Safety Standards & Expert Adventure Guides",
    description: "Learn about Adventure Backpack's safety standards, expert credentials, and commitment to providing accurate, trustworthy adventure activity information.",
    url: "https://adventurebackpack.com/trust",
    siteName: "Adventure Backpack",
    locale: "en_US",
    type: "website",
  },
}

export default function TrustPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Trust & Safety</h1>
        <div className="max-w-4xl mx-auto prose prose-lg">
          
          <div className="bg-orange-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">Our Commitment to Safety & Trust</h2>
            <p className="text-orange-800">
              At Adventure Backpack, we understand that trust and safety are the foundation of any adventure recommendation. 
              We are committed to providing accurate, verified, and trustworthy information to help you 
              plan thrilling adventure experiences with complete confidence and safety.
            </p>
          </div>

          <h2>Safety & Editorial Standards</h2>
          <p>
            We maintain the highest safety and editorial standards to ensure every adventure activity meets our rigorous quality and safety criteria:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-green-700">✓ Safety Verification Process</h3>
              <ul className="space-y-2">
                <li>Personal testing of all featured adventure activities</li>
                <li>Certified operator verification and safety audits</li>
                <li>Cross-referencing with international safety standards</li>
                <li>Regular safety updates and protocol reviews</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">✓ Expert Adventure Review</h3>
              <ul className="space-y-2">
                <li>Content reviewed by certified adventure professionals</li>
                <li>Safety protocols verified by licensed instructors</li>
                <li>Risk assessments and skill requirement analysis</li>
                <li>Editorial oversight by experienced adventure athletes</li>
              </ul>
            </div>
          </div>

          <h2>Our Expert Adventure Team</h2>
          <p>
            Our content is created by a team of qualified adventure professionals with extensive extreme sports experience:
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <h3 className="text-xl font-semibold mb-4">Team Credentials</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Professional Qualifications</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Wilderness First Aid & CPR Certifications</li>
                  <li>• Rock Climbing Instructor Certifications</li>
                  <li>• Adventure Travel Guide Licenses</li>
                  <li>• Extreme Sports Safety Certifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Experience & Expertise</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 15+ Years Combined Adventure Sports Experience</li>
                  <li>• 50+ Countries with Adventure Activities Tested</li>
                  <li>• 500+ Extreme Sports & Activities Personally Completed</li>
                  <li>• Safety Partnerships with 100+ Adventure Operators</li>
                </ul>
              </div>
            </div>
          </div>

          <h2>Content Creation Process</h2>
          <p>
            Every piece of content follows our rigorous 5-step process:
          </p>
          
          <div className="space-y-4 my-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">1</div>
              <div>
                <h4 className="font-semibold">Safety Research & Planning</h4>
                <p className="text-gray-600">Extensive safety research using certified operators, professional contacts, and adventure databases</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">2</div>
              <div>
                <h4 className="font-semibold">Personal Activity Testing</h4>
                <p className="text-gray-600">Our team personally tests adventure activities to verify safety protocols and authentic experiences</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">3</div>
              <div>
                <h4 className="font-semibold">Expert Safety Review</h4>
                <p className="text-gray-600">Content reviewed by adventure experts and certified instructors for accuracy and safety compliance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">4</div>
              <div>
                <h4 className="font-semibold">Safety Standards Check</h4>
                <p className="text-gray-600">Final review against our safety and editorial standards for quality, accuracy, and adventure readiness</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">5</div>
              <div>
                <h4 className="font-semibold">Ongoing Safety Updates</h4>
                <p className="text-gray-600">Regular safety protocol updates to ensure information remains current and meets latest safety standards</p>
              </div>
            </div>
          </div>

          <h2>Trust Indicators</h2>
          <p>
            We provide multiple trust indicators to help you verify our credibility:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 my-6">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Countries with Adventures</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Activities Tested</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Trusted Adventurers</div>
            </div>
          </div>

          <h2>Transparency & Disclosure</h2>
          <p>
            We believe in complete transparency about our content and relationships:
          </p>
          
          <ul className="my-4">
            <li><strong>No Paid Placements:</strong> We never accept payment for featuring activities without proper safety verification</li>
            <li><strong>Personal Experience:</strong> All recommendations are based on personal testing and authentic adventure experiences</li>
            <li><strong>Operator Partnerships:</strong> We disclose partnerships with adventure operators and safety certifications</li>
            <li><strong>Affiliate Transparency:</strong> Clear disclosure of any affiliate relationships with adventure gear or booking platforms</li>
            <li><strong>Safety Update Policy:</strong> We promptly update safety information and maintain public safety logs</li>
          </ul>

          <h2>Contact & Feedback</h2>
          <p>
            We welcome your feedback and questions about our content and editorial standards:
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Safety & Editorial Inquiries</h4>
                <p className="text-sm text-gray-600 mb-2">For questions about our safety standards or editorial process:</p>
                <a href="mailto:safety@adventurebackpack.com" className="text-orange-600 hover:underline">safety@adventurebackpack.com</a>
              </div>
              <div>
                <h4 className="font-semibold mb-2">General Contact</h4>
                <p className="text-sm text-gray-600 mb-2">For general questions or feedback:</p>
                <a href="mailto:hello@adventurebackpack.com" className="text-orange-600 hover:underline">hello@adventurebackpack.com</a>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Our Safety Promise to You</h3>
            <p className="text-green-700">
              We promise to provide you with the most accurate, helpful, and trustworthy adventure activity information possible. 
              Every recommendation comes from personal testing, certified operators, and thorough safety verification, ensuring you can pursue your 
              adventures with complete confidence and safety.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 