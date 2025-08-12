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

    // Get user's financial data
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(20)

    const { data: goals } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")

    const { data: profile } = await supabase.from("profiles").select("currency, location").eq("id", user.id).single()

    // Calculate financial summary
    const income = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0
    const expenses = transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0
    const savings = income - expenses

    const result = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `As PESA Coach, provide personalized financial insights for this user:

Financial Summary:
- Total Income: ${profile?.currency || "USD"} ${income}
- Total Expenses: ${profile?.currency || "USD"} ${expenses}
- Current Savings: ${profile?.currency || "USD"} ${savings}
- Active Goals: ${goals?.length || 0}
- Location: ${profile?.location || "Not specified"}

Recent Transactions: ${JSON.stringify(transactions?.slice(0, 5) || [])}
Active Goals: ${JSON.stringify(goals || [])}

Provide 3-4 specific, actionable financial insights and recommendations. Be encouraging and practical. Keep it under 200 words.`,
      temperature: 0.7,
      maxTokens: 300,
    })

    return NextResponse.json({ insights: result.text })
  } catch (error) {
    console.error("Financial insights error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
