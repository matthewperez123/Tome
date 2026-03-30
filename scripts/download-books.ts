/**
 * Tome — Download Top 50 Books from Standard Ebooks
 *
 * Fetches full text HTML, parses into chapters, inserts into Supabase.
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/download-books.ts
 *
 * Uses the single-page XHTML text endpoint from Standard Ebooks.
 */

import { parse as parseHTML } from "node-html-parser"

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Supabase REST helpers ──────────────────────

async function supabaseQuery(path: string, opts?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts?.method === "POST" ? "return=minimal" : "return=representation",
      ...((opts?.headers as Record<string, string>) ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase ${path}: ${res.status} ${text}`)
  }
  const ct = res.headers.get("content-type")
  if (ct?.includes("json")) return res.json()
  return null
}

// ── Curated top 50 books (known to have good SE pages) ──

const TOP_50_TITLES = [
  "Pride and Prejudice", "Frankenstein", "The Great Gatsby", "Dracula",
  "Alice's Adventures in Wonderland", "A Christmas Carol", "The Picture of Dorian Gray",
  "The Importance of Being Earnest", "The Adventures of Sherlock Holmes",
  "Treasure Island", "The Time Machine", "The War of the Worlds",
  "The Call of the Wild", "Heart of Darkness", "The Metamorphosis",
  "The Scarlet Letter", "Adventures of Huckleberry Finn",
  "The Strange Case of Dr. Jekyll and Mr. Hyde", "Siddhartha",
  "Great Expectations", "Oliver Twist", "A Tale of Two Cities",
  "Crime and Punishment", "Notes from Underground",
  "The Death of Ivan Ilyich", "Anna Karenina",
  "Madame Bovary", "Candide", "The Prince",
  "Meditations", "The Art of War", "On the Shortness of Life",
  "Ethan Frome", "The Awakening", "Dubliners",
  "Northanger Abbey", "Persuasion", "Emma",
  "Sense and Sensibility", "Jane Eyre", "Wuthering Heights",
  "The Invisible Man", "The Hound of the Baskervilles",
  "White Fang", "Around the World in Eighty Days",
  "The Jungle Book", "The Secret Garden",
  "Animal Farm", "Narrative of Frederick Douglass",
  "Silas Marner",
]

// ── HTML parsing ───────────────────────────────

function parseChapters(html: string): { title: string; order: number; content_html: string }[] {
  const root = parseHTML(html, { comment: false })
  const chapters: { title: string; order: number; content_html: string }[] = []

  // Find all section/article elements with chapter-like content
  const sections = root.querySelectorAll("section[id], article[id]")

  if (sections.length === 0) {
    // Fallback: treat the whole body as one chapter
    const main = root.querySelector("main") ?? root.querySelector("body") ?? root
    const text = cleanHtml(main.innerHTML)
    if (text.length > 100) {
      chapters.push({ title: "Full Text", order: 1, content_html: text })
    }
    return chapters
  }

  let order = 0
  for (const section of sections) {
    const id = section.getAttribute("id") ?? ""

    // Skip non-content sections
    if (
      id.includes("titlepage") || id.includes("imprint") ||
      id.includes("colophon") || id.includes("uncopyright") ||
      id.includes("endnotes") || id.includes("loi") ||
      id.includes("halftitlepage")
    ) continue

    // Extract title
    let title = ""
    const header = section.querySelector("h1, h2, h3, header hgroup h2, header hgroup p[epub\\:type='title'], header h2")
    if (header) {
      title = header.textContent.trim()
    }
    if (!title) {
      title = id.replace(/-/g, " ").replace(/^(chapter|book|part|act|scene)\s*/i, (m) => m.charAt(0).toUpperCase() + m.slice(1))
    }

    // Get content (skip headers)
    const clone = section.clone()
    const headers = clone.querySelectorAll("header, hgroup")
    for (const h of headers) h.remove()

    const content = cleanHtml(clone.innerHTML)
    if (content.length < 50) continue

    order++
    chapters.push({ title: title || `Chapter ${order}`, order, content_html: content })
  }

  return chapters
}

function cleanHtml(html: string): string {
  return html
    // Remove SE-specific epub:type attributes
    .replace(/\s*epub:type="[^"]*"/g, "")
    // Remove data attributes
    .replace(/\s*data-[a-z-]+="[^"]*"/g, "")
    // Remove empty class attributes
    .replace(/\s*class=""/g, "")
    // Remove xml:lang
    .replace(/\s*xml:lang="[^"]*"/g, "")
    // Clean up whitespace
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim()
}

// ── Main ───────────────────────────────────────

async function main() {
  console.log("Fetching book list from Supabase...")

  const books = (await supabaseQuery(
    `books?select=id,title,standard_ebooks_url&title=in.(${TOP_50_TITLES.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(",")})`
  )) as { id: string; title: string; standard_ebooks_url: string | null }[]

  console.log(`Found ${books.length} books to download`)

  let success = 0
  let failed = 0

  for (const book of books) {
    if (!book.standard_ebooks_url) {
      console.log(`  SKIP: ${book.title} — no SE URL`)
      failed++
      continue
    }

    const textUrl = `${book.standard_ebooks_url}/text/single-page`
    console.log(`  Fetching: ${book.title}...`)

    try {
      const res = await fetch(textUrl, {
        headers: { "User-Agent": "Tome-App/1.0 (educational reading platform)" },
      })

      if (!res.ok) {
        console.log(`    FAIL: ${res.status} for ${book.title}`)
        failed++
        continue
      }

      const html = await res.text()
      const chapters = parseChapters(html)

      if (chapters.length === 0) {
        console.log(`    FAIL: No chapters parsed for ${book.title}`)
        failed++
        continue
      }

      // Delete existing chapters for this book
      await supabaseQuery(`chapters?book_id=eq.${book.id}`, { method: "DELETE" })

      // Insert chapters in batches
      const BATCH = 10
      for (let i = 0; i < chapters.length; i += BATCH) {
        const batch = chapters.slice(i, i + BATCH).map((c) => ({
          book_id: book.id,
          title: c.title,
          order: c.order,
          content_html: c.content_html,
        }))

        await supabaseQuery("chapters", {
          method: "POST",
          body: JSON.stringify(batch),
        })
      }

      // Mark book as content_available
      await supabaseQuery(`books?id=eq.${book.id}`, {
        method: "PATCH",
        body: JSON.stringify({ content_available: true }),
      })

      console.log(`    OK: ${chapters.length} chapters`)
      success++

      // Rate limit: wait 1s between books
      await new Promise((r) => setTimeout(r, 1000))
    } catch (err) {
      console.log(`    ERROR: ${book.title} — ${err}`)
      failed++
    }
  }

  console.log(`\nDone! ${success} books downloaded, ${failed} failed.`)
}

main()
