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
    const enrolled = searchParams.get("enrolled") === "true"

    if (enrolled) {
      // Get user's enrolled courses with progress
      const { data: userCourses, error } = await supabase
        .from("user_courses")
        .select(`
          *,
          courses (*)
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ courses: userCourses })
    } else {
      // Get all published courses
      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ courses })
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

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, content, difficulty, duration_minutes } = body

    if (!title) {
      return NextResponse.json({ error: "Course title is required" }, { status: 400 })
    }

    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        title,
        description,
        content: content || {},
        difficulty: difficulty || "beginner",
        duration_minutes: duration_minutes || 60,
        created_by: user.id,
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
