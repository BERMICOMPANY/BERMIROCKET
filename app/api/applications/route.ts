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
    const isAdmin = searchParams.get("admin") === "true"

    if (isAdmin) {
      // Admin view - check permissions
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 })
      }

      const { data: applications, error } = await supabase
        .from("applications")
        .select(`
          *,
          opportunities (title, type),
          profiles!applications_applicant_user_id_fkey (full_name, email)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ applications })
    } else {
      // User view - their own applications
      const { data: applications, error } = await supabase
        .from("applications")
        .select(`
          *,
          opportunities (title, type, status)
        `)
        .eq("applicant_user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ applications })
    }
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
    const { opportunity_id, answers, attachments } = body

    if (!opportunity_id) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 })
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("opportunity_id", opportunity_id)
      .eq("applicant_user_id", user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Already applied to this opportunity" }, { status: 400 })
    }

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        opportunity_id,
        applicant_user_id: user.id,
        answers: answers || {},
        attachments: attachments || {},
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
