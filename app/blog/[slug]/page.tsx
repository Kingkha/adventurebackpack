import { getBlogPostBySlug, getPostUrl, isFromBlogFolder } from "@/lib/getBlogPosts"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Breadcrumb from "../../components/Breadcrumb"
import { BlogPostJsonLd, BreadcrumbJsonLd } from "../../components/BlogJsonLd"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export const revalidate = 60 // Revalidate every minute

// Function to extract H2 headings from HTML content
function extractH2Headings(content: string): { id: string; text: string }[] {
  if (!content) {
    return [];
  }
  
  // For HTML content
  if (content.startsWith("<")) {
    const regex = /<h2(?:\s[^>]*)?>(.*?)<\/h2>/g;
    const headings: { id: string; text: string }[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const text = match[1].replace(/<.*?>/g, ''); // Remove any nested HTML tags
      const decodedText = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      
      const id = 'heading-' + decodedText
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({
        id,
        text: decodedText
      });
    }
    
    return headings;
  } 
  // For Markdown content
  else {
    const lines = content.split('\n');
    return lines
      .filter(line => line.startsWith('## '))
      .map((line) => {
        const text = line.replace('## ', '');
        const decodedText = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        
        const id = 'heading-' + decodedText
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        return { id, text: decodedText };
      });
  }
}

// Process HTML content to add IDs to H2 tags - more efficient version
function addIdsToH2Tags(content: string, headings: { id: string; text: string }[]): string {
  if (!content.startsWith("<") || headings.length === 0) {
    return content;
  }
  
  // Create a map of heading text to IDs for quick lookup
  const headingMap = new Map(headings.map(h => [h.text, h.id]));
  
  // Use a single regex replacement
  return content.replace(/<h2(?:\s[^>]*)?>(.*?)<\/h2>/g, (match, captureGroup) => {
    const text = captureGroup.replace(/<.*?>/g, '');
    const decodedText = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    const id = headingMap.get(decodedText);
    if (id) {
      return `<h2 id="${id}">${captureGroup}</h2>`;
    }
    return match; // Keep original if no matching heading found
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return {
    title: `${post.title} | secretlocale.com`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 628,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [post.featuredImage],
    },
  }
}

function formatSlug(slug: string): string {
  return slug.replace(/_/g, " ")
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post || !post.content) {
    notFound()
  }

  const formattedSlug = formatSlug(params.slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://secretlocale.com"
  const isFromBlog = isFromBlogFolder(params.slug)
  const currentUrl = isFromBlog 
    ? `${baseUrl}/${params.slug}` 
    : `${baseUrl}/blog/${params.slug}`
  const authorUrl = `${baseUrl}/author/${encodeURIComponent(post.author || "Editor")}`

  // Extract H2 headings for table of contents
  const headings = extractH2Headings(post.content);
  
  // Process HTML content to add IDs to H2 tags - single efficient pass
  const processedContent = post.content.startsWith("<") 
    ? addIdsToH2Tags(post.content, headings)
    : post.content;

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: post.title, href: isFromBlog ? `/${params.slug}` : `/blog/${params.slug}` },
  ]

  const breadcrumbJsonItems = [
    { name: "Home", item: baseUrl },
    { name: "Blog", item: `${baseUrl}/blog` },
    { name: post.title, item: currentUrl },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <BlogPostJsonLd
        title={post.title}
        description={post.metaDescription}
        images={[post.featuredImage]}
        datePublished={new Date(post.date).toISOString()}
        authorName={post.author}
        authorUrl={authorUrl}
        url={currentUrl}
      />
      <BreadcrumbJsonLd items={breadcrumbJsonItems} />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <article className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              width={1200}
              height={628}
              className="w-full aspect-[1200/628] object-cover rounded-lg shadow-lg"
              priority={true}
            />
          </div>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 entry-title" aria-label="Blog post title">{post.title}</h1>
            <div className="flex justify-between items-center text-gray-500 mb-8">
              <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
              <Link
                href={`/author/${encodeURIComponent(post.author || "Editor")}`}
                className="hover:text-green-600 transition-colors"
              >
                By {post.author || "Editor"}
              </Link>
            </div>
            
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Table of Contents</h2>
                <nav aria-label="Table of contents">
                  <ul className="space-y-2">
                    {headings.map((heading, index) => (
                      <li key={index}>
                        <a 
                          href={`#${heading.id}`}
                          className="text-green-600 hover:text-green-800 hover:underline"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
            
            <div className="mb-8 p-4 bg-green-50 rounded-lg shadow-md">
              <p className="text-green-700 mb-4">
                Want to find the best travel deals for this destination? Chat with our travel hacking specialist!
              </p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link href={`/adventure-planner?adventure=${formatSlug(params.slug)}`} className="inline-flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Get Travel Hacks
                </Link>
              </Button>
            </div>
            <p className="text-gray-500 mb-4">
              Category:{" "}
              <Link
                href={`/adventure-planner?adventure=${formatSlug(params.slug)}`}
                className="hover:text-green-600 transition-colors"
              >
                {decodeURIComponent(formatSlug(params.slug))}
              </Link>
            </p>
            <div className="prose prose-lg max-w-none">
              {post.content.startsWith("<") ? (
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              ) : (
                <ReactMarkdown components={{
                  h2: ({node, children, ...props}) => {
                    const text = String(children).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                    const id = 'heading-' + text
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return <h2 id={id} {...props}>{children}</h2>;
                  }
                }}>
                  {post.content}
                </ReactMarkdown>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

