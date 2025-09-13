'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useChat } from 'ai/react'
import { useSession, signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  MessageSquare, 
  AlertCircle, 
  User, 
  Mountain, 
  Compass, 
  MapPin, 
  Calendar,
  Clock,
  Users,
  DollarSign,
  Backpack,
  Camera,
  Navigation,
  Tent,
  TreePine,
  Waves
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'

export default function AdventurePlanner() {
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic') || searchParams.get('adventure')
  const { data: session, status } = useSession()
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat({
    api: '/api/chat'
  })
  const [messageCount, setMessageCount] = useState(0)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const adventureCategories = [
    { id: 'hiking', label: 'Hiking & Trekking', icon: Mountain, color: 'bg-green-500' },
    { id: 'climbing', label: 'Rock Climbing', icon: Mountain, color: 'bg-red-500' },
    { id: 'camping', label: 'Camping', icon: Tent, color: 'bg-orange-500' },
    { id: 'water', label: 'Water Sports', icon: Waves, color: 'bg-blue-500' },
    { id: 'wildlife', label: 'Wildlife & Nature', icon: TreePine, color: 'bg-emerald-500' },
    { id: 'photography', label: 'Adventure Photography', icon: Camera, color: 'bg-purple-500' }
  ]

  const quickPrompts = [
    "Plan a 3-day hiking adventure in the Rocky Mountains",
    "Best rock climbing spots for beginners in California",
    "Weekend camping trip with family-friendly activities",
    "Adventure photography locations in Patagonia",
    "Multi-day backpacking route through national parks",
    "Water sports adventure in tropical destinations"
  ]

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (topic && messages.length === 0) {
        handleInputChange({ target: { value: topic } } as React.ChangeEvent<HTMLInputElement>)
        setTimeout(() => {
          const formElement = document.querySelector('form') as HTMLFormElement;
          if (formElement) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            formElement.dispatchEvent(submitEvent);
          }
        }, 200);
      }
    }

    sendInitialMessage()
  }, [topic, messages.length, handleInputChange])

  useEffect(() => {
    if (session && showAuthDialog) {
      setShowAuthDialog(false)
      
      toast({
        title: "Welcome, Adventure Seeker!",
        description: "You're now ready to plan unlimited adventures!",
        duration: 3000,
      })
      
      setTimeout(() => {
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
        if (inputElement) {
          inputElement.focus()
        }
      }, 100)
    }
  }, [session, showAuthDialog])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    (document.activeElement as HTMLElement)?.blur()
    
    e.preventDefault()
    
    if (messageCount >= 3 && status === 'unauthenticated') {
      setShowAuthDialog(true)
      handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
      return
    }

    if (!input.trim()) return
    
    await handleSubmit(e)
    setMessageCount(prevCount => prevCount + 1)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    })
  }

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, isLoading])

  const handleLogin = () => {
    signIn('google', { 
      callbackUrl: window.location.href,
    })
  }

  const handleDialogClose = (open: boolean) => {
    if (!open && !session) {
      toast({
        title: "Adventure Awaits",
        description: "Please log in to continue planning adventures after 3 messages.",
        variant: "destructive",
        duration: 4000,
      })
      return
    }
    setShowAuthDialog(open)
  }

  const handleQuickPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => {
      const formElement = document.querySelector('form') as HTMLFormElement;
      if (formElement) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        formElement.dispatchEvent(submitEvent);
      }
    }, 200);
  }

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category.id)
    const prompt = `Help me plan a ${category.label.toLowerCase()} adventure`
    handleQuickPrompt(prompt)
  }

  return (
    <div className="pt-24 pb-12">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="text-center pb-8">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-4 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30">
            <Compass className="h-5 w-5 mr-2" />
            <span className="text-sm font-semibold">AI-Powered Adventure Planning</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
            AI Adventure Planner - Plan Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">Epic Adventure</span>
          </h1>
          
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto mb-8">
            Free AI-powered adventure planner tool for hiking, climbing, camping, and outdoor activities. Get personalized recommendations, detailed itineraries, gear suggestions, and expert tips for your next outdoor adventure.
          </p>

          {/* Adventure Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
            {adventureCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`${category.color} hover:opacity-90 text-white border-none shadow-lg transform transition-all hover:scale-105 ${
                    selectedCategory === category.id ? 'ring-2 ring-white' : ''
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>
        
        {/* Main Chat Interface */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/40 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Backpack className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">AI Adventure Planner</h2>
                <p className="text-emerald-100 text-sm">Your personal AI-powered adventure planning assistant</p>
              </div>
            </div>
            
            {status === 'authenticated' && (
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{session?.user?.name}</span>
              </div>
            )}
          </div>
          
          {/* Chat Area */}
          <ScrollArea className="flex-grow p-6 h-[500px] overflow-y-auto">
            {isLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                  <Mountain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Planning Your Adventure</h3>
                <p className="text-gray-600">Finding the perfect outdoor experiences for you...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-full mb-6 shadow-lg">
                  <Navigation className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">What Adventure Calls to You?</h2>
                <p className="text-gray-600 max-w-md mb-8">
                  Tell our AI adventure planner about your dream outdoor adventure, and we'll help you plan every detail with personalized recommendations!
                </p>
                
                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
                  {[
                    { icon: MapPin, title: "Destination Ideas", desc: "Where should I go?" },
                    { icon: Calendar, title: "Trip Planning", desc: "Plan my itinerary" },
                    { icon: DollarSign, title: "Budget Advice", desc: "Cost estimates" },
                    { icon: Users, title: "Group Adventures", desc: "Plan for my group" },
                    { icon: Clock, title: "Duration Planning", desc: "How long to stay?" },
                    { icon: Backpack, title: "Gear Recommendations", desc: "What to bring?" }
                  ].map((item, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-emerald-200" 
                          onClick={() => handleQuickPrompt(item.desc)}>
                      <CardContent className="p-4 text-center">
                        <div className="bg-emerald-100 p-3 rounded-full w-fit mx-auto mb-3">
                          <item.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="w-full max-w-3xl">
                  <h3 className="text-gray-700 font-medium mb-4">Or try one of these popular adventure planner requests:</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickPrompts.map((prompt, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 px-3 py-2 text-sm transition-colors"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 max-w-md">
                  <div className="flex items-center justify-center mb-2">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">AI ADVENTURE PLANNER TIP</span>
                  </div>
                  <p className="text-emerald-700 text-sm">
                    Be specific about your experience level, group size, and preferred activities for the best AI adventure planner recommendations!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl rounded-br-md p-4 shadow-lg' 
                        : 'bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm'
                    }`}>
                      {m.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <div className="bg-emerald-100 p-1 rounded-full mr-2">
                            <Compass className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-emerald-600">Adventure Planner</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 max-w-[85%] shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="bg-emerald-100 p-1 rounded-full mr-2">
                          <Compass className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-emerald-600">Planning your adventure...</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-[20px]" />
                {error && (
                  <div className="text-center text-red-500 mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="h-5 w-5 inline-block mr-2" />
                    Oops! Something went wrong. Please try again.
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          {/* Input Area */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <form onSubmit={onSubmit} className="flex space-x-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Describe your dream adventure... (e.g., 'Plan a 5-day hiking trip in the Alps for beginners with our AI adventure planner')"
                className="flex-grow rounded-xl bg-white px-4 py-3 border-gray-300 focus-visible:ring-emerald-500 text-base"
                type="text"
              />
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl px-6 py-3 shadow-lg transform transition-all hover:scale-105 disabled:hover:scale-100"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            
            {status === 'unauthenticated' && (
              <div className="text-sm text-gray-600 mt-3 text-center">
                {messageCount >= 3 ? (
                  <span className="text-amber-600 font-medium">
                    🏔️ Adventure limit reached! <button onClick={() => setShowAuthDialog(true)} className="text-emerald-600 underline font-bold">Sign in</button> to plan unlimited adventures!
                  </span>
                ) : (
                  <span>
                    <span className="font-medium text-emerald-600">🎒 {3 - messageCount} free adventure plans remaining.</span> 
                    <button onClick={() => setShowAuthDialog(true)} className="text-emerald-600 underline font-medium ml-1">Sign in</button> for unlimited planning!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authentication Dialog */}
      <Dialog 
        open={showAuthDialog} 
        onOpenChange={handleDialogClose}
      >
        <DialogContent className="sm:max-w-md rounded-2xl bg-white/95 backdrop-blur-sm border border-white/40 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-full w-fit mx-auto mb-4">
              <Mountain className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">Unlock Unlimited AI Adventure Planning</DialogTitle>
            <DialogDescription className="text-center space-y-3 pt-2">
              <p className="text-gray-600">You've used your 3 free AI adventure planner sessions.</p>
              <p className="font-semibold text-gray-800">Sign in to plan unlimited epic adventures with our AI adventure planner!</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 pt-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-emerald-500" />
                  <span>Unlimited planning</span>
                </div>
                <div className="flex items-center">
                  <Backpack className="h-4 w-4 mr-1 text-emerald-500" />
                  <span>Save favorites</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleLogin} 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-full py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4" 
                />
                <path 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853" 
                />
                <path 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                  fill="#FBBC05" 
                />
                <path 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335" 
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </Button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-4">
            By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
