import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import type { TomeBook } from "@/data/books"

/** @deprecated Use SupabaseBook instead */
export type Book = SupabaseBook

export type SupabaseBook = {
  id: string
  title: string
  author: string
  author_id: string
  year: number | null
  language: string | null
  original_language: string | null
  tradition: string
  era: string
  genres: string[] | null
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Scholar"
  chapter_count: number
  word_count: number
  reading_time_minutes: number
  estimated_reading_time: string | null
  synopsis: string | null
  themes: string[] | null
  country: string | null
  cover_colors: { primary: string; secondary: string; accent: string } | null
  featured: boolean
  standard_ebooks_url: string | null
  cover_image_path: string | null
  source: string | null
  ingestion_status: string | null
}

export function mapToTomeBook(row: SupabaseBook): TomeBook {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    authorId: row.author_id,
    year: row.year ?? 0,
    tradition: row.tradition,
    era: row.era,
    genres: row.genres ?? [],
    difficulty: row.difficulty,
    chapters: row.chapter_count,
    wordCount: row.word_count,
    estimatedReadingTime: row.estimated_reading_time ?? `~${Math.round(row.reading_time_minutes / 60)} hours`,
    synopsis: row.synopsis ?? "",
    themes: row.themes ?? [],
    country: row.country ?? "",
    coverColors: row.cover_colors ?? { primary: "#1e1b4b", secondary: "#312e81", accent: "#6366f1" },
    featured: row.featured,
    standardEbooksUrl: row.standard_ebooks_url ?? undefined,
    coverImagePath: row.cover_image_path ?? undefined,
    source: (row.source as "standard-ebooks" | "metadata-only") ?? undefined,
    language: row.language ?? "English",
    readingLanguage: "English",
  }
}
