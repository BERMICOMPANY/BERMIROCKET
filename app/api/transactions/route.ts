import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("occurred_on", { ascending: false })
      .limit(limit)

    if (type && ["income", "expense"].includes(type)) {
      query = query.eq("type", type)
    }

    const { data: transactions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, currency, category, source, description, occurred_on } = body

    if (!type || !amount || !["income", "expense"].includes(type)) {
      return NextResponse.json({ error: "Invalid transaction data" }, { status: 400 })
    }

    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type,
        amount: Number.parseFloat(amount),
        currency: currency || "USD",
        category,
        source,
        description,
        occurred_on: occurred_on || new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
