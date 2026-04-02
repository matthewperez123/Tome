import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Gracefully handle missing env vars — the app works without Supabase
// (static content from public/content/ is the primary data source)
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export type Book = {
  id: string
  title: string
  author: string
  year: number | null
  tradition: string
  genre: string | null
  difficulty: string | null
  description: string | null
  cover_colors: string[] | null
  standard_ebooks_url: string | null
  word_count: number | null
  reading_time_minutes: number | null
  content_available: boolean
}
