import { streamTutorResponse } from "@/lib/groq-ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json()

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    // Get user authentication
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get conversation history from database
    let conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []

    if (sessionId) {
      const { data: messages } = await supabase
        .from("ai_chat_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(10) // Last 10 messages for context

      if (messages) {
        conversationHistory = messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))
      }
    }

    // Generate streaming response
    const result = await streamTutorResponse(message, conversationHistory)

    // Save user message to database
    if (sessionId) {
      await supabase.from("ai_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: message,
      })
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
          })
        }
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
