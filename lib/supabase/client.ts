import { createBrowserClient } from "@supabase/ssr"

// Updated Supabase configuration with your credentials
const SUPABASE_URL = "https://wumfnurgowmiezckfpkv.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bWZudXJnb3dtaWV6Y2tmcGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjYzNDQsImV4cCI6MjA3MDYwMjM0NH0.RWcxpQ4-6xouj9dest_pYiSk4Q7BH0uXIrX3ocKts9s"

export const isSupabaseConfigured = true

// Create a singleton instance of the Supabase client for Client Components
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
