import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: window.location.href })
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            Please log in to continue using the AI chat feature.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white">
            {isLoading ? 'Logging in...' : 'Log in with Google'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

