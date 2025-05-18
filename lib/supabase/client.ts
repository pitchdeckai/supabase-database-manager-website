import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance of the Supabase client
let client: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  }
  return client
}
