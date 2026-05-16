import { siteConfig } from '@/lib/siteConfig'

export default function PrivacyPolicy() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-green max-w-none">
          <h2>1. Information We Collect</h2>
          <p>At {siteConfig.brand.name}, we collect and process the following information:</p>
          <ul>
            {siteConfig.policies.privacy.dataCollected.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>Your information enables us to:</p>
          <ul>
            {siteConfig.policies.privacy.dataUsage.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>We implement robust security measures including:</p>
          <ul>
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security audits and updates</li>
            <li>Secure cloud storage with leading providers</li>
            <li>Automated backup systems</li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>We integrate with trusted services including:</p>
          <ul>
            <li>Google Authentication for secure login</li>
            <li>Stripe for payment processing</li>
            <li>Analytics tools for service improvement</li>
            <li>Cloud service providers for hosting</li>
          </ul>

          <h2>5. Your Rights and Controls</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request data correction or deletion</li>
            <li>Export your saved history</li>
            <li>Opt-out of marketing communications</li>
            <li>Control your privacy settings</li>
          </ul>

          <h2>6. Updates to Privacy Policy</h2>
          <p>We may update this policy periodically. Users will be notified of significant changes via email or app notifications.</p>
          
          <h2>7. Contact Information</h2>
          <p>For privacy-related inquiries, please contact our Data Protection Officer at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
        </div>
      </div>
    </section>
  )
} 
