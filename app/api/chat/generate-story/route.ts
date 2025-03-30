import OpenAI from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are a professional storyteller who has been hired to write a series of short stories for a new anthology. The stories should be captivating, imaginative, and thought-provoking. They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. Each story should be unique and memorable, with compelling characters and unexpected plot twists. IMPORTANT: Keep each story concise with a maximum of 3 paragraphs. Make every word count and ensure the story has a clear beginning, middle, and end within this limited space.`,
        },
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    console.log('Received completion:', completion);

    return NextResponse.json({ 
      story: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate story',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 