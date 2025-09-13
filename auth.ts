import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

console.log('Auth Config Loading...')
console.log('Environment:', process.env.NODE_ENV)
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing')
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing')


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // Add other providers here
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
        // Fetch linked accounts
        const accounts = await prisma.account.findMany({
          where: { userId: user.id }
        });
        session.user.providers = accounts.map(account => account.provider);
      }
      return session;
    },
    signIn: async ({ user, account, profile }) => {
      if (account && user) {
        const existingAccount = await prisma.account.findFirst({
          where: { provider: account.provider, providerAccountId: account.providerAccountId }
        });
        
        if (!existingAccount) {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          });

          if (existingUser) {
            // If account already exists with different provider
            return '/auth/error?error=AccountNotLinked'
          }
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
}
