import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log('=== CHAT API START ===');
    
    const { messages } = await req.json();
    console.log('Messages received:', messages);
    
    // Test if OpenAI key is available
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key available:', apiKey ? 'YES' : 'NO');
    console.log('API Key starts with:', apiKey?.substring(0, 10));
    
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: 'You are a helpful adventure planner. Keep responses brief.',
    });
    
    console.log('Stream created successfully');
    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error('=== CHAT API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Chat API failed',
      details: error.message,
      type: error.constructor.name 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}