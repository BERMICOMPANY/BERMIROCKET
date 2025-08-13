import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get("public") === "true"

    let query = supabase.from("opportunities").select("*")

    if (isPublic) {
      query = query.eq("status", "published").order("created_at", { ascending: false })
    } else {
      // Admin view - check auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }

      query = query.order("created_at", { ascending: false })
    }

    const { data: opportunities, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ opportunities })
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

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { title, type, summary, details, requirements, close_at, url } = body

    if (!title || !type) {
      return NextResponse.json({ error: "Title and type are required" }, { status: 400 })
    }

    const { data: opportunity, error } = await supabase
      .from("opportunities")
      .insert({
        created_by_admin_id: user.id,
        title,
        type,
        summary,
        details: details || {},
        requirements: requirements || {},
        close_at,
        url,
        status: "published",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ opportunity }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
