'use client'

import { useState } from 'react'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Send } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup - to be implemented
    console.log('Email submitted:', email)
    // Reset the form
    setEmail('')
    // Show success message or further steps
  }
  
  return (
    <section 
      id="newsletter" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-teal-50"
      aria-labelledby="newsletter-heading"
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 sm:p-10 border border-teal-100">
          <div className="text-center mb-8">
            <h3 
              id="newsletter-heading" 
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
            >
              Love Hidden Places?
            </h3>
            <h4 className="text-xl font-semibold text-teal-600 mb-4">Join Our Insider List</h4>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get the best offbeat travel ideas and secret destination recommendations – free in your inbox every month. No crowds, just authentic experiences.
            </p>
          </div>
          
          <form 
            onSubmit={handleSubmit} 
            className="max-w-xl mx-auto"
            aria-labelledby="newsletter-heading"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="email-input" className="sr-only">Email address</label>
                <Input 
                  id="email-input"
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-6 px-4 rounded-lg border-gray-200 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                  required
                  aria-required="true"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg py-6 px-6 font-medium"
                aria-label="Subscribe to our newsletter"
              >
                <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                Send Me Hidden Gems
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>We respect your privacy. Unsubscribe anytime. No spam, just travel inspiration.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1">Monthly newsletters</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1">Exclusive content</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1">Secret locations</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="/blog" 
              className="text-teal-600 font-medium text-sm cursor-pointer hover:underline"
              aria-label="Download our free ebook about secret villages in Europe"
            >
              Get our free ebook: "15 Secret Villages in Europe You've Never Heard Of"
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 