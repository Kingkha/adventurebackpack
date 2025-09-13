'use client'

import Link from 'next/link'
import { Button } from "../../components/ui/button"

export default function AboutSection() {
  return (
    <section 
      id="about" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-4 py-1 rounded-full">OUR MISSION</span>
            <h2 
              id="about-heading" 
              className="text-3xl md:text-4xl font-bold mt-4 text-gray-900"
            >
              What Is Adventure Backpack?
            </h2>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              <strong>Adventure Backpack</strong> is your ultimate guide to the world's most thrilling adventure activities and extreme sports experiences.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              We're passionate about pushing boundaries and discovering heart-pumping adventures around the globe. Our team of experienced adventurers, extreme sports athletes, and outdoor experts brings you the most epic activities from rock climbing and white water rafting to skydiving and mountain biking.
            </p>
            
            <p className="text-lg text-gray-700 mb-8">
              Whether you're seeking your first bungee jump, an epic multi-day hiking expedition, or the ultimate adrenaline rush through extreme sports, our detailed guides help you prepare for and conquer these incredible adventures safely and confidently.
            </p>
            
            <Link href="/about" aria-label="Learn more about Adventure Backpack's mission and team">
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg"
              >
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 