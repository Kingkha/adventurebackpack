import { siteConfig } from '@/lib/siteConfig'

export default function TermsOfService() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-green max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using {siteConfig.brand.name}, you acknowledge and agree to be bound by these Terms of Service and our Privacy Policy.</p>

          <h2>2. Service Description</h2>
          <p>{siteConfig.brand.name} {siteConfig.policies.terms.serviceDescription}</p>
          <ul>
            {siteConfig.policies.terms.services.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>3. User Accounts and Security</h2>
          <p>To access premium features, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate registration information</li>
            <li>Maintain password confidentiality</li>
            <li>Not share account access</li>
            <li>Notify us of any security breaches</li>
          </ul>

          <h2>4. Advice and Recommendations</h2>
          <p>{siteConfig.policies.terms.adviceDisclaimer}</p>
          <ul>
            {siteConfig.policies.terms.disclaimerItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>5. User Responsibilities</h2>
          <p>When using {siteConfig.brand.name}, you agree to:</p>
          <ul>
            {siteConfig.policies.terms.userResponsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>All content, including guides, features, and interfaces, is owned by {siteConfig.brand.name} and protected by intellectual property laws. Users may:</p>
          <ul>
            <li>Use our advice for personal planning</li>
            <li>Share tips with friends and family</li>
            <li>Not redistribute or commercialize our content</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>{siteConfig.brand.name} is not liable for:</p>
          <ul>
            {siteConfig.policies.terms.liabilityExclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>8. Changes to Service</h2>
          <p>{siteConfig.brand.name} reserves the right to modify, suspend, or discontinue any part of the service with or without notice. We will strive to communicate significant changes to our users.</p>

          <h2>9. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
        </div>
      </div>
    </section>
  )
} 
