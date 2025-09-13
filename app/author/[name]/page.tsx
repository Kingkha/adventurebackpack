import { notFound } from "next/navigation"
import Image from "next/image"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import AuthorPosts from "../../components/AuthorPosts"
import { getBlogPostsMeta } from "@/lib/getBlogPosts"
import { MapPin, Mail, Globe } from "lucide-react"

export default function AuthorPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name)
  const { posts } = getBlogPostsMeta()
  const authorPosts = posts.filter((post) => post.author === decodedName)

  if (authorPosts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 mt-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8">
            <h1 className="text-3xl font-bold mb-4">Author Not Found</h1>
            <p>We couldn't find any posts by an author named "{decodedName}". This might be because:</p>
            <ul className="list-disc list-inside mt-2">
              <li>The author name is misspelled</li>
              <li>This author hasn't published any posts yet</li>
              <li>The author's posts have been removed or are no longer available</li>
            </ul>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const authorData = {
    name: decodedName,
    role: decodedName === "Editor" ? "Secretlocale.com Editor" : "Secretlocale.com Contributor",
    bio:
      decodedName === "Editor"
        ? "As a Secretlocale.com Editor with over 10 years of travel writing experience, I'm dedicated to curating and creating high-quality travel content. With a passion for exploring new destinations and uncovering hidden gems, I've visited 50+ countries and specialize in authentic, off-the-beaten-path travel experiences. I hold certifications in travel writing and cultural tourism, and my work has been featured in major travel publications."
        : `${decodedName} is a valued contributor to Secretlocale.com with extensive travel experience and local expertise. They share their authentic travel experiences and insights with our community, helping readers discover genuine hidden destinations worldwide.`,
    location: "Secretlocale.com HQ",
    email: decodedName === "Editor" ? "editor@secretlocale.com" : `${decodedName.toLowerCase()}@secretlocale.com`,
    website: "https://secretlocale.com",
    image: decodedName === "Editor" ? "/apple-icon.png" : "/images/contributor-avatar.jpg",
    credentials: decodedName === "Editor" ? [
      "Professional Travel Writer Certification",
      "Cultural Tourism Specialist",
      "10+ Years Travel Writing Experience",
      "50+ Countries Explored",
      "Featured in Major Travel Publications"
    ] : [
      "Local Destination Expert",
      "Authentic Travel Experience",
      "Cultural Immersion Specialist"
    ],
    expertise: decodedName === "Editor" ? [
      "Hidden Travel Destinations",
      "Cultural Immersion",
      "Sustainable Tourism",
      "Local Travel Experiences",
      "Off-the-Beaten-Path Exploration"
    ] : [
      "Local Culture & Traditions",
      "Authentic Travel Experiences",
      "Hidden Gems Discovery"
    ]
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <Image
                src={authorData.image || "/placeholder.svg"}
                alt={authorData.name}
                width={300}
                height={300}
                className="h-48 w-full object-cover md:h-full md:w-48"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-green-500 font-semibold">{authorData.role}</div>
              <h1 className="mt-1 text-4xl font-bold text-gray-900">{authorData.name}</h1>
              <p className="mt-2 text-gray-600">{authorData.bio}</p>
              
              {/* Credentials Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Credentials & Expertise</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Credentials</h4>
                    <ul className="space-y-1">
                      {authorData.credentials.map((credential, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Areas of Expertise</h4>
                    <ul className="space-y-1">
                      {authorData.expertise.map((expertise, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-blue-500 mr-2">•</span>
                          {expertise}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {authorData.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  {authorData.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-2" />
                  {authorData.website}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AuthorPosts posts={authorPosts} />
      </main>
      <Footer />
    </div>
  )
}

