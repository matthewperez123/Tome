/**
 * Supabase Browser Client
 *
 * Use this in Client Components ("use client").
 * Creates a singleton browser client with cookie-based auth.
 */

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Build-time-safe placeholders so static prerender doesn't throw when
// env vars are not in scope (e.g. preview build without Vercel env).
// Real env vars are required at runtime for any actual API call to succeed.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

let browserClient: SupabaseClient | null = null

export function createClient() {
  browserClient ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return browserClient
}
