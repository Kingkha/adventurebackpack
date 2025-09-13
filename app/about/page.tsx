import Header from "../components/Header"
import Footer from "../components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Adventure Backpack - Expert Adventure Guides & Extreme Sports",
  description: "Learn about Adventure Backpack's expert team of adventure athletes, extreme sports specialists, and outdoor guides. Discover our mission to bring you the world's most thrilling adventures.",
  keywords: "adventure experts, extreme sports, adventure activities, outdoor guides, adventure athletes, adrenaline sports, adventure travel specialists",
  alternates: {
    canonical: 'https://adventurebackpack.com/about',
  },
  openGraph: {
    title: "About Adventure Backpack - Expert Adventure Guides & Extreme Sports",
    description: "Meet our expert team of adventure athletes, extreme sports specialists, and outdoor guides dedicated to bringing you the world's most thrilling adventures.",
    url: "https://adventurebackpack.com/about",
    siteName: "Adventure Backpack",
    locale: "en_US",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Adventure Backpack</h1>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-xl text-gray-700 mb-6">
            Adventure Backpack is the ultimate platform for discovering thrilling adventure activities and extreme sports around the world. Our mission is to help adventure seekers 
            find epic experiences that push boundaries and create unforgettable adrenaline-fueled memories.
          </p>
          
          <h2>Our Story</h2>
          <p>
            Founded in 2024 by a team of extreme sports athletes and adventure enthusiasts, Adventure Backpack was born out of the
            desire to share the world's most thrilling activities with fellow adrenaline junkies. We believe that the most incredible experiences 
            happen when you step outside your comfort zone and embrace the extraordinary.
          </p>
          
          <h2>Our Expertise & Experience</h2>
          <p>
            Our team consists of professional adventure athletes, extreme sports specialists, and certified outdoor guides with decades of combined 
            experience across 50+ countries. Each team member brings unique expertise:
          </p>
          
          <ul>
            <li><strong>Extreme Sports Athletes:</strong> Professional athletes in rock climbing, skydiving, white water rafting, and more</li>
            <li><strong>Certified Adventure Guides:</strong> Licensed guides with wilderness first aid and safety certifications</li>
            <li><strong>Adventure Content Creators:</strong> Professional journalists and videographers specializing in extreme sports</li>
            <li><strong>Safety Experts:</strong> Specialists in adventure safety protocols and risk management</li>
          </ul>
          
          <h2>Our Research Process</h2>
          <p>
            Every destination we feature undergoes rigorous research and verification:
          </p>
          
          <ul>
            <li><strong>Personal Visits:</strong> Our team personally visits each location to ensure accuracy and authenticity</li>
            <li><strong>Local Partnerships:</strong> We collaborate with local communities and experts for insider knowledge</li>
            <li><strong>Continuous Updates:</strong> Regular reviews and updates to maintain current, accurate information</li>
            <li><strong>Community Feedback:</strong> We incorporate traveler experiences and local recommendations</li>
          </ul>
          
          <h2>What We Do</h2>
          <p>
            Using our global network of adventure professionals and extensive field testing, Adventure Backpack curates the world's most epic 
            adventure activities, extreme sports, and adrenaline-pumping experiences. Our platform helps you discover thrilling adventures, 
            prepare safely for extreme activities, and push your limits with confidence.
          </p>
          
          <h2>Our Commitment to Safety & Excellence</h2>
          <p>
            We are committed to:
          </p>
          
          <ul>
            <li><strong>Safety First:</strong> Only featuring activities with proper safety protocols and certified operators</li>
            <li><strong>Expert Verification:</strong> All activities are personally tested and verified by our adventure professionals</li>
            <li><strong>Risk Assessment:</strong> Providing detailed safety information and skill requirements for each activity</li>
            <li><strong>Quality Standards:</strong> Partnering only with reputable adventure operators and certified guides</li>
          </ul>
          
          <h2>Trust & Credibility</h2>
          <p>
            Our content has been featured in major travel publications and trusted by thousands of travelers worldwide. 
            We maintain high editorial standards and only recommend destinations and experiences we've personally verified.
          </p>
          
          <h2>Join Us on Your Next Adventure</h2>
          <p>
            Whether you're seeking your first bungee jump, an epic mountain climbing expedition, or the ultimate skydiving experience, Adventure Backpack is here to 
            guide you to the world's most thrilling adventures. Contact us at <a href="mailto:hello@adventurebackpack.com">hello@adventurebackpack.com</a> with 
            your adventure suggestions or questions!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">Our Credentials</h3>
            <ul className="space-y-2">
              <li>✓ 50+ countries with adventure activities documented</li>
              <li>✓ 500+ extreme sports and activities tested</li>
              <li>✓ Professional adventure guide certifications</li>
              <li>✓ Safety partnerships with 100+ adventure operators</li>
              <li>✓ Featured in major adventure sports publications</li>
              <li>✓ Trusted by 10,000+ adventure seekers worldwide</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

