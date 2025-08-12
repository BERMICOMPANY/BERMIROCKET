"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const fullName = formData.get("fullName")
  const bio = formData.get("bio")
  const phone = formData.get("phone")
  const location = formData.get("location")
  const currency = formData.get("currency")
  const dateOfBirth = formData.get("dateOfBirth")
  const skills =
    formData
      .get("skills")
      ?.toString()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || []
  const interests =
    formData
      .get("interests")
      ?.toString()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || []

  try {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email!,
      full_name: fullName?.toString(),
      bio: bio?.toString(),
      phone: phone?.toString(),
      location: location?.toString(),
      currency: currency?.toString() || "USD",
      date_of_birth: dateOfBirth?.toString() || null,
      skills,
      interests,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/")
    return { success: "Profile updated successfully!" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function getProfile() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}
