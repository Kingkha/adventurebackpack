import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Metadata } from "next"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { BlogPostJsonLd, BreadcrumbJsonLd } from "../../components/BlogJsonLd"
import Image from "next/image"
import Link from "next/link"

// Set dynamic rendering to ensure we always check for the existence of the slug
export const dynamic = "force-dynamic"

// Helper function to build the path for nested content
function buildContentPath(pathSegments: string[]): string {
  return path.join(process.cwd(), "content", ...pathSegments)
}

// Function to check if a file exists in the specified nested path
// Works for any depth of nesting (e.g., hidden-gem-towns/italy/rome/colosseum.html)
function fileExists(pathSegments: string[]): boolean {
  const fileName = pathSegments[pathSegments.length - 1]
  const filePath = path.join(buildContentPath(pathSegments.slice(0, -1)), `${fileName}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a nested index file exists (for multi-level nesting)
// This supports any depth of nesting (e.g., hidden-gem-towns/italy/rome/rome.html)
function nestedIndexFileExists(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length === 0) return false
  
  const lastSegment = pathSegments[pathSegments.length - 1]
  const filePath = path.join(process.cwd(), "content", ...pathSegments, `${lastSegment}.html`)
  return fs.existsSync(filePath)
}

// Function to get the post content from a nested path
function getPost(pathSegments: string[], isNestedIndex = false) {
  let filePath;
  const fileName = pathSegments[pathSegments.length - 1]
  
  if (isNestedIndex) {
    // Handle the case for a nested index file (e.g., ghost-towns/american-west/american-west.html)
    filePath = path.join(process.cwd(), "content", ...pathSegments, `${fileName}.html`)
  } else {
    // Normal case for a post file
    filePath = path.join(buildContentPath(pathSegments.slice(0, -1)), `${fileName}.html`)
  }
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)
  
  return {
    slug: fileName,
    pathSegments: pathSegments,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    content,
    featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
    author: data.author || "Editor",
    tags: data.tags || [],
    metaDescription: data.metaDescription || data.excerpt,
  }
}

export async function generateMetadata({ params }: { params: { slug: string, rest: string[] } }): Promise<Metadata> {
  const { slug, rest } = params
  
  // Build the complete path segments array
  const pathSegments = [slug, ...(rest || [])]
  
  // Handle the index case (file with same name as its directory)
  if (rest.length === 0) {
    // This is a "folder index" case - e.g., /hidden-gem-towns
    const post = getPost([slug, slug])
    
    if (!post) {
      // Try checking if this is a nested folder index
      // For example, ghost-towns/american-west/american-west.html
      const nestedIndexPath = [slug, ...rest, slug]
      if (nestedIndexFileExists([slug, ...rest])) {
        const nestedPost = getPost([...nestedIndexPath], true)
        if (nestedPost) {
          return {
            title: `${nestedPost.title}`,
            description: nestedPost.metaDescription,
            openGraph: {
              title: nestedPost.title,
              description: nestedPost.metaDescription,
              type: "article",
              publishedTime: new Date(nestedPost.date).toISOString(),
              authors: [nestedPost.author],
              images: [
                {
                  url: nestedPost.featuredImage,
                  width: 1200,
                  height: 628,
                  alt: nestedPost.title,
                },
              ],
            },
            twitter: {
              card: "summary_large_image",
              title: nestedPost.title,
              description: nestedPost.metaDescription,
              images: [nestedPost.featuredImage],
            },
          }
        }
      }
      return {}
    }
    
    return {
      title: `${post.title}`,
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
  
  // Check if the last segment of rest matches the folder name (nested index file)
  // For example: /ghost-towns/american-west -> check ghost-towns/american-west/american-west.html
  if (rest.length > 0 && rest[rest.length - 1] === pathSegments[pathSegments.length - 2]) {
    const nestedPath = [...pathSegments.slice(0, -1)]
    if (nestedIndexFileExists(nestedPath)) {
      const post = getPost([...nestedPath, rest[rest.length - 1]], true)
      if (post) {
        return {
          title: `${post.title}`,
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
    }
  }
  
  // This is a nested post case - e.g., /hidden-gem-towns/italy or /hidden-gem-towns/italy/rome
  if (!fileExists(pathSegments)) {
    return {}
  }
  
  const post = getPost(pathSegments)
  
  if (!post) {
    return {}
  }
  
  return {
    title: `${post.title}`,
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

export default async function Post({ params }: { params: { slug: string, rest: string[] } }) {
  const { slug, rest } = params
  console.log(`Post component called with slug: ${slug}, rest: ${rest.join('/')}`)
  
  // Handle nested path index case
  // For URLs like /regions/north-america where we need to find north-america.html in the content/regions/north-america/ folder
  if (rest.length > 0) {
    const lastSegment = rest[rest.length - 1];
    const folderPath = [slug, ...rest];
    const indexFilePath = path.join(process.cwd(), "content", ...folderPath, `${lastSegment}.html`);
    
    console.log(`Checking for index file at: ${indexFilePath}`);
    
    if (fs.existsSync(indexFilePath)) {
      console.log(`Found index file at: ${indexFilePath}`);
      const fileContents = fs.readFileSync(indexFilePath, "utf8");
      const { data, content } = matter(fileContents);
      
      const post = {
        slug: lastSegment,
        pathSegments: folderPath,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content,
        featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
        author: data.author || "Editor",
        tags: data.tags || [],
        metaDescription: data.metaDescription || data.excerpt,
      };
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://adventurebackpack.com";
      const url = `${baseUrl}/${folderPath.join('/')}`;
      
      // Replace relative image URLs with absolute URLs
      const contentWithAbsoluteUrls = post.content
        .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
        .replace(/src="images\//g, `src="${baseUrl}/images/`);
      
      // Generate breadcrumb items
      const breadcrumbItems = [
        { name: "Home", item: baseUrl },
      ];
      
      // Add each path segment to breadcrumbs
      let currentPath = "";
      for (let i = 0; i < folderPath.length; i++) {
        const segment = folderPath[i];
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        breadcrumbItems.push({
          name: segment.replace(/-/g, " "),
          item: `${baseUrl}/${currentPath}`
        });
      }
      
      // Determine if we should show a "Back" link and to what level
      const parentPath = folderPath.slice(0, -1).join('/');
      const backLinkText = folderPath.length > 1
        ? `Back to ${folderPath[folderPath.length - 2].replace(/-/g, " ")}`
        : "Back to Home";
      
      return (
        <div className="min-h-screen flex flex-col">
          <BlogPostJsonLd
            title={post.title}
            description={post.metaDescription}
            images={[post.featuredImage]}
            datePublished={post.date}
            authorName={post.author}
            authorUrl={`${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, "-")}`}
            url={url}
          />
          <BreadcrumbJsonLd items={breadcrumbItems} />
          
          <Header />
          <main className="flex-grow container mx-auto px-4 py-12 mt-16">
            <div className="max-w-4xl mx-auto">
              {parentPath && (
                <div className="mb-6">
                  <Link 
                    href={`/${parentPath}`} 
                    className="text-green-600 hover:underline"
                  >
                    ← {backLinkText}
                  </Link>
                </div>
              )}
              
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="text-gray-600">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-gray-600">By {post.author}</div>
              </div>
              
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={1200}
                height={628}
                className="w-full h-auto rounded-lg mb-8"
                priority
              />
              
              <div 
                className="prose max-w-none prose-lg prose-green"
                dangerouslySetInnerHTML={{ __html: contentWithAbsoluteUrls }}
              />
              
              {post.tags.length > 0 && (
                <div className="mt-12">
                  <div className="text-lg font-semibold mb-2">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
    }
  }
  
  // Special case for ghost-towns/american-west
  if (slug === "ghost-towns" && rest.length === 1 && rest[0] === "american-west") {
    console.log("Detected ghost-towns/american-west special case")
    const filePath = path.join(process.cwd(), "content", "ghost-towns", "american-west", "american-west.html")
    
    if (fs.existsSync(filePath)) {
      console.log(`Found the file at ${filePath}`)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data, content } = matter(fileContents)
      
      const post = {
        slug: "american-west",
        pathSegments: ["ghost-towns", "american-west"],
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content,
        featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
        author: data.author || "Editor",
        tags: data.tags || [],
        metaDescription: data.metaDescription || data.excerpt,
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://adventurebackpack.com"
      const url = `${baseUrl}/ghost-towns/american-west`
      
      // Replace relative image URLs with absolute URLs
      const contentWithAbsoluteUrls = post.content
        .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
        .replace(/src="images\//g, `src="${baseUrl}/images/`)
      
      // Generate breadcrumb items
      const breadcrumbItems = [
        { name: "Home", item: baseUrl },
        { name: "ghost towns", item: `${baseUrl}/ghost-towns` },
        { name: "american west", item: url }
      ]
      
      return (
        <div className="min-h-screen flex flex-col">
          <BlogPostJsonLd
            title={post.title}
            description={post.metaDescription}
            images={[post.featuredImage]}
            datePublished={post.date}
            authorName={post.author}
            authorUrl={`${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, "-")}`}
            url={url}
          />
          <BreadcrumbJsonLd items={breadcrumbItems} />
          
          <Header />
          <main className="flex-grow container mx-auto px-4 py-12 mt-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="text-gray-600">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-gray-600">By {post.author}</div>
              </div>
              
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={1200}
                height={628}
                className="w-full h-auto rounded-lg mb-8"
                priority
              />
              
              <div 
                className="prose max-w-none prose-lg prose-green"
                dangerouslySetInnerHTML={{ __html: contentWithAbsoluteUrls }}
              />
              
              {post.tags.length > 0 && (
                <div className="mt-12">
                  <div className="text-lg font-semibold mb-2">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      )
    }
  }
  
  // Handle the "folder index" case - e.g., /hidden-gem-towns
  if (!rest || rest.length === 0) {
    let post = getPost([slug, slug])
    
    if (!post) {
      // Check if this is a deeply nested index file
      // Get all potential nested paths
      let found = false
      
      // Function to get a list of path segments for a nested folder
      // This function discovers all nested paths at any depth
      function getNestedPathSegments(baseFolder: string): string[][] {
        const results: string[][] = []
        
        // Start with the base folder
        const basePath = path.join(process.cwd(), "content", baseFolder)
        if (!fs.existsSync(basePath)) return results
        
        // Function to recursively check subfolders
        // This will find paths at any depth level (2nd, 3rd, 4th levels, etc)
        function checkSubfolders(currentPath: string, segments: string[]) {
          if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()) {
            // Add current segments list if it contains more than just the base folder
            if (segments.length > 1) {
              results.push([...segments])
            }
            
            // Get subfolders
            const items = fs.readdirSync(currentPath, { withFileTypes: true })
            for (const item of items) {
              if (item.isDirectory()) {
                const newPath = path.join(currentPath, item.name)
                const newSegments = [...segments, item.name]
                checkSubfolders(newPath, newSegments)
              }
            }
          }
        }
        
        // Start the recursive search
        checkSubfolders(basePath, [baseFolder])
        
        return results
      }
      
      const nestedPaths = getNestedPathSegments(slug)
      for (const pathSegments of nestedPaths) {
        // Check if this path has an index file with the same name as the last folder segment
        const lastSegment = pathSegments[pathSegments.length - 1]
        if (nestedIndexFileExists(pathSegments)) {
          const nestedPost = getPost([...pathSegments, lastSegment], true)
          if (nestedPost) {
            post = nestedPost
            found = true
            break
          }
        }
      }
      
      if (!found || !post) {
        notFound()
      }
    }
    
    // At this point post is guaranteed to be non-null due to the notFound() call above
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://adventurebackpack.com"
    let url = `${baseUrl}/${slug}`
    
    // If this is a nested index file, build the correct URL
    if (post.pathSegments && post.pathSegments.length > 2) {
      // Remove the duplicate last segment
      const urlSegments = [...post.pathSegments]
      if (urlSegments[urlSegments.length - 1] === urlSegments[urlSegments.length - 2]) {
        urlSegments.pop() // Remove the last duplicate segment
      }
      url = `${baseUrl}/${urlSegments.join('/')}`
    }
    
    // Replace relative image URLs with absolute URLs
    const contentWithAbsoluteUrls = post.content
      .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
      .replace(/src="images\//g, `src="${baseUrl}/images/`)
    
    // Generate breadcrumb items
    const breadcrumbItems = [
      { name: "Home", item: baseUrl },
      { name: slug.replace(/-/g, " "), item: url }
    ]
    
    // If this is a nested index, add extra breadcrumb items
    if (post.pathSegments && post.pathSegments.length > 2) {
      // Reset breadcrumbs
      breadcrumbItems.length = 1; // Keep just Home
      
      // Build breadcrumbs for all segments
      let currentPath = ""
      for (let i = 0; i < post.pathSegments.length - 1; i++) {
        // Skip the duplicate last segment
        if (i === post.pathSegments.length - 2 && 
            post.pathSegments[i] === post.pathSegments[post.pathSegments.length - 1]) {
          continue;
        }
        
        const segment = post.pathSegments[i]
        currentPath = currentPath ? `${currentPath}/${segment}` : segment
        breadcrumbItems.push({
          name: segment.replace(/-/g, " "),
          item: `${baseUrl}/${currentPath}`
        })
      }
    }
    
    return (
      <div className="min-h-screen flex flex-col">
        <BlogPostJsonLd
          title={post.title}
          description={post.metaDescription}
          images={[post.featuredImage]}
          datePublished={post.date}
          authorName={post.author}
          authorUrl={`${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, "-")}`}
          url={url}
        />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 mt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between mb-8">
              <div className="text-gray-600">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-gray-600">By {post.author}</div>
            </div>
            
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={628}
              className="w-full h-auto rounded-lg mb-8"
              priority
            />
            
            <div 
              className="prose max-w-none prose-lg prose-green"
              dangerouslySetInnerHTML={{ __html: contentWithAbsoluteUrls }}
            />
            
            {post.tags.length > 0 && (
              <div className="mt-12">
                <div className="text-lg font-semibold mb-2">Tags:</div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  // Check if this is a nested index file where last segment matches its parent folder
  if (rest.length > 0 && rest[rest.length - 1] === rest[rest.length - 2]) {
    const nestedPath = [slug, ...rest.slice(0, -1)]
    if (nestedIndexFileExists(nestedPath)) {
      const post = getPost([...nestedPath, rest[rest.length - 1]], true)
      if (post) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://adventurebackpack.com"
        const url = `${baseUrl}/${nestedPath.join('/')}`
        
        // Replace relative image URLs with absolute URLs
        const contentWithAbsoluteUrls = post.content
          .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
          .replace(/src="images\//g, `src="${baseUrl}/images/`)
        
        // Generate breadcrumb items with all path segments
        const breadcrumbItems = [
          { name: "Home", item: baseUrl },
        ]
        
        // Add each path segment to breadcrumbs
        let currentPath = ""
        for (let i = 0; i < nestedPath.length; i++) {
          const segment = nestedPath[i]
          currentPath = currentPath ? `${currentPath}/${segment}` : segment
          breadcrumbItems.push({
            name: segment.replace(/-/g, " "),
            item: `${baseUrl}/${currentPath}`
          })
        }
        
        return (
          <div className="min-h-screen flex flex-col">
            <BlogPostJsonLd
              title={post.title}
              description={post.metaDescription}
              images={[post.featuredImage]}
              datePublished={post.date}
              authorName={post.author}
              authorUrl={`${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, "-")}`}
              url={url}
            />
            <BreadcrumbJsonLd items={breadcrumbItems} />
            
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 mt-16">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="text-gray-600">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-gray-600">By {post.author}</div>
                </div>
                
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={628}
                  className="w-full h-auto rounded-lg mb-8"
                  priority
                />
                
                <div 
                  className="prose max-w-none prose-lg prose-green"
                  dangerouslySetInnerHTML={{ __html: contentWithAbsoluteUrls }}
                />
                
                {post.tags.length > 0 && (
                  <div className="mt-12">
                    <div className="text-lg font-semibold mb-2">Tags:</div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag}`}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </main>
            <Footer />
          </div>
        )
      }
    }
  }
  
  // Build the complete path segments array for the nested content
  const pathSegments = [slug, ...rest]
  
  // Check if the file exists in the nested structure
  if (!fileExists(pathSegments)) {
    notFound()
  }
  
  const post = getPost(pathSegments)
  
  if (!post) {
    notFound()
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://adventurebackpack.com"
  
  // Construct the full URL path from all segments
  const url = `${baseUrl}/${pathSegments.join('/')}`
  
  // Replace relative image URLs with absolute URLs
  const contentWithAbsoluteUrls = post.content
    .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
    .replace(/src="images\//g, `src="${baseUrl}/images/`)
  
  // Generate breadcrumb items with all path segments
  // This supports any depth of nesting (1, 2, 3+ levels)
  const breadcrumbItems = [
    { name: "Home", item: baseUrl },
  ]
  
  // Add each path segment to breadcrumbs
  let currentPath = ""
  for (let i = 0; i < pathSegments.length - 1; i++) {
    const segment = pathSegments[i]
    currentPath = currentPath ? `${currentPath}/${segment}` : segment
    breadcrumbItems.push({
      name: segment.replace(/-/g, " "),
      item: `${baseUrl}/${currentPath}`
    })
  }
  
  // Add the current page as the final breadcrumb
  breadcrumbItems.push({
    name: post.title,
    item: url
  })

  // Determine if we should show a "Back" link and to what level
  const backLinkPath = pathSegments.slice(0, -1).join('/');
  const backLinkText = pathSegments.length > 2 
    ? `Back to ${pathSegments[pathSegments.length - 2].replace(/-/g, " ")}` 
    : `Back to ${pathSegments[0].replace(/-/g, " ")}`;
  
  return (
    <div className="min-h-screen flex flex-col">
      <BlogPostJsonLd
        title={post.title}
        description={post.metaDescription}
        images={[post.featuredImage]}
        datePublished={post.date}
        authorName={post.author}
        authorUrl={`${baseUrl}/author/${post.author.toLowerCase().replace(/\s+/g, "-")}`}
        url={url}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            {/* Link back to parent page */}
            <Link 
              href={`/${backLinkPath}`} 
              className="text-green-600 hover:underline"
            >
              ← {backLinkText}
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-600">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-gray-600">By {post.author}</div>
          </div>
          
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={1200}
            height={628}
            className="w-full h-auto rounded-lg mb-8"
            priority
          />
          
          <div 
            className="prose max-w-none prose-lg prose-green"
            dangerouslySetInnerHTML={{ __html: contentWithAbsoluteUrls }}
          />
          
          {post.tags.length > 0 && (
            <div className="mt-12">
              <div className="text-lg font-semibold mb-2">Tags:</div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 