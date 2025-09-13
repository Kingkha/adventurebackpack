import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only run for paths starting with /blog/
  if (pathname.startsWith('/blog/')) {
    // Replace underscores with hyphens
    const newPathname = pathname.replace(/_/g, '-')
    
    // If there's a change, redirect permanently (301)
    if (newPathname !== pathname) {
      const url = request.nextUrl.clone()
      url.pathname = newPathname
      return NextResponse.redirect(url, 301)
    }
  }

  // Otherwise, allow the request to continue
  return NextResponse.next()
}

// Tell Next.js which paths should use this middleware
export const config = {
  matcher: ['/blog/:path*']
}
