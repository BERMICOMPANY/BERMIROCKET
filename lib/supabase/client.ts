import { createBrowserClient } from "@supabase/ssr"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIcSUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIcSUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIcSUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIcSUPABASE_ANON_KEY.length > 0

// Create a singleton instance of the Supabase client for Client Components
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIcSUPABASE_URL!, process.env.NEXT_PUBLIcSUPABASE_ANON_KEY!)
}
