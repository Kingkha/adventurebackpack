import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import AuthProvider from './components/AuthProvider'
import Header from './components/Header'
import GoogleAnalytics from './components/GoogleAnalytics'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Adventure Backpack - Epic Adventure Activities & Extreme Sports Worldwide',
  description: 'Discover thrilling adventure activities, extreme sports, and epic outdoor experiences across the globe. From rock climbing to skydiving, find your next adrenaline rush and plan your ultimate adventure.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-orange-50 text-gray-800`}>
        <AuthProvider session={session}>
          <Header />
          {children}
        </AuthProvider>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <Analytics />
      </body>
    </html>
  )
}

