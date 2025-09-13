import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from 'ai';
import prisma from '@/lib/prisma';

export const maxDuration = 30;

// Define the schema for the itinerary structure
const itinerarySchema = z.object({
  message: z.string(),
  itinerary: z.object({
    destination: z.string(),
    duration: z.number(),
    days: z.array(
      z.object({
        day: z.number(),
        activities: z.array(
          z.object({
            time: z.string(),
            description: z.string(),
            location: z.string()
          })
        )
      })
    )
  })
});

export async function POST(req: Request) {
  const body = await req.json();
  // Handle both direct messages and chat messages array
  let message = body.messages ? 
    body.messages[body.messages.length - 1].content : 
    body.message;
  
  console.log('Itinerary API Input:', message);
  // Add default duration if not specified
  if (!message.toLowerCase().includes("day") && !message.toLowerCase().includes("week")) {
    message += " for 2 days";
  }
  
 // console.log('Itinerary API Input:', message);

  try {
    // Check cache first
    const cachedItinerary = await prisma.itinerary.findFirst({
      where: {
        prompt: message
      }
    });

    if (cachedItinerary) {
      console.log('Itinerary API: Returning cached result');
      return Response.json(cachedItinerary.data);
    }

    const result = await generateObject({
      model: openai('gpt-4o-mini', {
        structuredOutputs: true,
      }),
      schemaName: 'itinerary',
      schemaDescription: 'A detailed travel itinerary with daily activities.',
      schema: itinerarySchema,
      prompt: message,
    });

    await prisma.itinerary.create({
      data: {
        userId: body.userId,
        destination: result.object.itinerary.destination || 'Unknown',
        duration: result.object.itinerary.duration || 1,
        data: result.object,
        prompt: message
      }
    });

    console.log('Itinerary API: Response generated and cached');
    return Response.json(result.object);
    
  } catch (error) {
    console.error('Itinerary API Error:', error);
    return Response.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}