import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ API key not configured" }, { status: 500 })
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's learning data
    const { data: userCourses } = await supabase.from("user_courses").select("*, courses(*)").eq("user_id", user.id)

    const { data: profile } = await supabase.from("profiles").select("skills, interests").eq("id", user.id).single()

    const result = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `As an AI Learning Coach, create a personalized learning path for this user:

User Profile:
- Skills: ${profile?.skills?.join(", ") || "Not specified"}
- Interests: ${profile?.interests?.join(", ") || "Not specified"}
- Current Courses: ${userCourses?.length || 0}

Enrolled Courses: ${JSON.stringify(
        userCourses?.map((uc) => ({
          title: uc.courses?.title,
          progress: uc.progress,
          status: uc.status,
        })) || [],
      )}

Provide a personalized learning path with:
1. Next recommended courses/topics
2. Skills to focus on developing
3. Specific learning goals for the next month
4. How their current progress aligns with their interests

Keep it encouraging and actionable, under 200 words.`,
      temperature: 0.7,
      maxTokens: 300,
    })

    return NextResponse.json({ learningPath: result.text })
  } catch (error) {
    console.error("Learning insights error:", error)
    return NextResponse.json({ error: "Failed to generate learning path" }, { status: 500 })
  }
}
