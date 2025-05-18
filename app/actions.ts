"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function executeSqlQuery(query: string) {
  const supabase = createServerClient()

  try {
    // Execute the raw SQL query
    const { data, error } = await supabase.rpc("execute_sql_query", { sql_query: query })

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data }
  } catch (error) {
    console.error("Error executing SQL query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
      data: null,
    }
  }
}
