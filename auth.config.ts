import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdventurePlanner = nextUrl.pathname.startsWith('/adventure-planner')
      
      if (isAdventurePlanner && !isLoggedIn && nextUrl.searchParams.get('requireAuth') === 'true') {
        return false
      }

      return true
    },
  },
} satisfies NextAuthConfig

