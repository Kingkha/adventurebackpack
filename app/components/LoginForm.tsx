'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login to Access AI Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-4">Please log in to continue using the AI chat feature.</p>
        <Button 
          onClick={() => signIn('google', { callbackUrl: '/adventure-planner' })}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Log In with Gmail
        </Button>
      </CardContent>
    </Card>
  )
}

