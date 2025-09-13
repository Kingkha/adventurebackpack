'use client'

import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errors = {
    AccountNotLinked: {
      title: "Account Not Linked",
      message: "This email is already associated with another account. Please sign in with your existing provider.",
    },
    Default: {
      title: "Authentication Error",
      message: "An error occurred during authentication. Please try again.",
    }
  }

  const errorDetails = errors[error as keyof typeof errors] || errors.Default

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          {errorDetails.title}
        </h1>
        <p className="text-gray-600">
          {errorDetails.message}
        </p>
        <a 
          href="/auth/signin" 
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  )
}

