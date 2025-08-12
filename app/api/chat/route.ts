import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages array is required", { status: 400 })
    }

    // Get user authentication
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, skills, interests")
      .eq("id", user.id)
      .single()

    // Create system message with context
    const systemMessage = {
      role: "system" as const,
      content: `You are the AI Mission Commander for Bermi Rocket, an AI-powered youth empowerment platform. You're helping young entrepreneurs learn about business, AI, and technology.

User Context:
- Name: ${profile?.full_name || "Astronaut"}
- Skills: ${profile?.skills?.join(", ") || "Learning"}
- Interests: ${profile?.interests?.join(", ") || "Entrepreneurship"}

Your personality:
- Encouraging and supportive mentor
- Use space/rocket terminology occasionally (mission, launch, orbit, etc.)
- Provide practical, actionable advice
- Keep responses concise but helpful
- Focus on entrepreneurship, AI basics, business creation, and personal development

Always be positive, educational, and inspiring while maintaining professionalism.`,
    }

    // Combine system message with conversation
    const allMessages = [systemMessage, ...messages]

    // Generate streaming response
    const result = await streamText({
      model: groq("llama-3.1-70b-versatile"),
      messages: allMessages,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save user message to database if sessionId provided
    if (sessionId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "user") {
        await supabase.from("ai_chat_messages").insert({
          session_id: sessionId,
          role: "user",
          content: lastMessage.content,
          user_id: user.id,
        })
      }
    }

    // Return streaming response
    return result.toDataStreamResponse({
      onFinish: async (completion) => {
        // Save AI response to database
        if (sessionId && completion.text) {
          await supabase.from("ai_chat_messages").insert({
            session_id: sessionId,
            role: "assistant",
            content: completion.text,
            user_id: user.id,
          })
        }
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
