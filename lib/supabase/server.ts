import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"

const SUPABASE_URL = "https://wumfnurgowmiezckfpkv.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bWZudXJnb3dtaWV6Y2tmcGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjYzNDQsImV4cCI6MjA3MDYwMjM0NH0.RWcxpQ4-6xouj9dest_pYiSk4Q7BH0uXIrX3ocKts9s"

export const isSupabaseConfigured = true

// Create a cached version of the Supabase client for Server Components
export const createClient = cache(() => {
  const cookieStore = cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
})
