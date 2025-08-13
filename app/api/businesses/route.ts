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
    const userId = searchParams.get("userId")
    const isPublic = searchParams.get("public") === "true"

    let query = supabase.from("businesses").select("*")

    if (isPublic) {
      query = query.eq("is_verified", true)
    } else if (userId) {
      query = query.eq("user_id", userId)
    } else {
      query = query.eq("user_id", user.id)
    }

    const { data: businesses, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ businesses })
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
    const { name, description, category, website, socials } = body

    if (!name) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 })
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name,
        description,
        category,
        website,
        socials: socials || {},
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ business }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
