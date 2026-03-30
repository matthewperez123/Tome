import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
