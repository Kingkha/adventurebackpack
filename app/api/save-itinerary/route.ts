import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const itinerary = await req.json()
    
    // First create or find the itinerary
    const savedItinerary = await prisma.itinerary.upsert({
      where: {
        prompt: itinerary.prompt
      },
      create: {
        destination: itinerary.destination,
        duration: itinerary.duration,
        data: itinerary,
        prompt: itinerary.prompt
      },
      update: {}
    })

    // Then create the user-itinerary association
    await prisma.savedItinerary.create({
      data: {
        userId: session.user.id,
        itineraryId: savedItinerary.id
      }
    })

    return NextResponse.json({ success: true, itinerary: savedItinerary })
  } catch (error) {
    console.error('Failed to save itinerary:', error)
    return NextResponse.json({ error: 'Failed to save itinerary' }, { status: 500 })
  }
}

