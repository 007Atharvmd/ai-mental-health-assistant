import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    systemPrompt: `You are an AI-driven mental health assistant. Your role is to provide supportive and empathetic responses to users seeking mental health support. Analyze the user's sentiment, detect potential crises, and provide appropriate resources or recommendations. If you detect a severe crisis, always recommend professional help and provide emergency contact information.`,
  })
  return result.toDataStreamResponse()
}

