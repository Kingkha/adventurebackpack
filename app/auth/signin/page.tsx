'use client'

import { useEffect } from 'react'
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/adventure-planner'

  useEffect(() => {
    // Directly initiate Google OAuth
    signIn('google', { 
      callbackUrl: decodeURIComponent(callbackUrl),
      redirect: true
    })
  }, [callbackUrl])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Redirecting to Google Sign In...</h1>
            <p className="text-gray-600">Please wait while we redirect you to sign in with Google.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

