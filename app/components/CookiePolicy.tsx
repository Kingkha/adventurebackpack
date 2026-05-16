import { siteConfig } from '@/lib/siteConfig'

export default function CookiePolicy() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="prose prose-green max-w-none">
          <h2>1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device that help {siteConfig.brand.name} {siteConfig.policies.cookies.intro}</p>

          <h2>2. How {siteConfig.brand.name} Uses Cookies</h2>
          <p>We use cookies to:</p>
          <ul>
            {siteConfig.policies.cookies.usage.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>3. Types of Cookies We Use</h2>
          <h3>Essential Cookies</h3>
          <p>Required for core functionality:</p>
          <ul>
            <li>Authentication tokens</li>
            <li>Security features</li>
            <li>Session management</li>
          </ul>

          <h3>Functional Cookies</h3>
          <p>Enhance your experience by remembering:</p>
          <ul>
            {siteConfig.policies.cookies.functionalCookies.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Analytics Cookies</h3>
          <p>Help us improve by tracking:</p>
          <ul>
            {siteConfig.policies.cookies.analyticsCookies.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2>4. Third-Party Cookies</h2>
          <p>We use cookies from trusted partners:</p>
          <ul>
            <li>Google Analytics for usage analysis</li>
            <li>Authentication providers</li>
            <li>Social media integration</li>
          </ul>

          <h2>5. Managing Your Cookie Preferences</h2>
          <p>You can:</p>
          <ul>
            <li>Adjust cookie settings in your browser</li>
            <li>Use our cookie preference center</li>
            <li>Opt-out of non-essential cookies</li>
          </ul>
          <p>Note: Disabling essential cookies may limit your ability to use {siteConfig.brand.name}'s {siteConfig.policies.cookies.limitationNote}</p>
          
          <h2>6. Contact Us</h2>
          <p>For questions about our Cookie Policy, please contact us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
        </div>
      </div>
    </section>
  )
} 
