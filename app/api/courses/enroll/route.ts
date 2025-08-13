import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
    const { course_id } = body

    if (!course_id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("user_courses")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 })
    }

    const { data: enrollment, error } = await supabase
      .from("user_courses")
      .insert({
        user_id: user.id,
        course_id,
        progress: 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
