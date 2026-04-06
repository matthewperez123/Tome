/**
 * Bulk Catalog Generator v2
 *
 * Reads meta.json from all 793 content dirs + Calibre CSV for tags,
 * classifies traditions/eras/difficulties, outputs JSON for Supabase.
 *
 * Usage: EXISTING_IDS=id1,id2 npx tsx scripts/bulk-catalog.ts > /tmp/books.json
 */

import * as fs from "fs"
import * as path from "path"

const CSV_PATH = "/Users/matthewperez/Calibre Library/calibre/My books (983)/My books.csv"
const CONTENT_DIR = path.resolve(__dirname, "../public/content")
const COVERS_DIR = path.resolve(__dirname, "../public/covers")

// ── CSV Parsing ───────────────────────────────────

function parseCSV(text: string): Record<string, string>[] {
  const lines: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; continue }
      inQuotes = !inQuotes; continue
    }
    if (ch === "\n" && !inQuotes) { lines.push(current); current = ""; continue }
    if (ch === "\r" && !inQuotes) continue
    current += ch
  }
  if (current) lines.push(current)
  if (lines[0]?.charCodeAt(0) === 0xFEFF) lines[0] = lines[0].slice(1)

  const headers = splitLine(lines[0])
  return lines.slice(1).map(line => {
    const vals = splitLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h.trim()] = (vals[i] ?? "").trim() })
    return obj
  }).filter(r => r.title)
}

function splitLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { if (inQ && line[i + 1] === '"') { current += '"'; i++; continue }; inQ = !inQ; continue }
    if (ch === "," && !inQ) { result.push(current); current = ""; continue }
    current += ch
  }
  result.push(current)
  return result
}

// ── Classifiers ───────────────────────────────────

const AUTHOR_TRADITIONS: Record<string, { tradition: string; era: string }> = {
  "homer": { tradition: "Ancient Greek", era: "Ancient" },
  "sophocles": { tradition: "Ancient Greek", era: "Ancient" },
  "euripides": { tradition: "Ancient Greek", era: "Ancient" },
  "aristophanes": { tradition: "Ancient Greek", era: "Ancient" },
  "aeschylus": { tradition: "Ancient Greek", era: "Ancient" },
  "plato": { tradition: "Ancient Greek", era: "Ancient" },
  "aristotle": { tradition: "Ancient Greek", era: "Ancient" },
  "herodotus": { tradition: "Ancient Greek", era: "Ancient" },
  "thucydides": { tradition: "Ancient Greek", era: "Ancient" },
  "hesiod": { tradition: "Ancient Greek", era: "Ancient" },
  "xenophon": { tradition: "Ancient Greek", era: "Ancient" },
  "virgil": { tradition: "Roman", era: "Ancient" },
  "ovid": { tradition: "Roman", era: "Ancient" },
  "marcus aurelius": { tradition: "Roman", era: "Ancient" },
  "seneca": { tradition: "Roman", era: "Ancient" },
  "lucretius": { tradition: "Roman", era: "Ancient" },
  "cicero": { tradition: "Roman", era: "Ancient" },
  "tacitus": { tradition: "Roman", era: "Ancient" },
  "epictetus": { tradition: "Roman", era: "Ancient" },
  "julius caesar": { tradition: "Roman", era: "Ancient" },
  "horace": { tradition: "Roman", era: "Ancient" },
  "petronius": { tradition: "Roman", era: "Ancient" },
  "apuleius": { tradition: "Roman", era: "Ancient" },
  "suetonius": { tradition: "Roman", era: "Ancient" },
  "dante alighieri": { tradition: "Medieval European", era: "Medieval" },
  "geoffrey chaucer": { tradition: "Medieval European", era: "Medieval" },
  "thomas malory": { tradition: "Medieval European", era: "Medieval" },
  "boethius": { tradition: "Medieval European", era: "Medieval" },
  "augustine of hippo": { tradition: "Medieval European", era: "Medieval" },
  "giovanni boccaccio": { tradition: "Medieval European", era: "Medieval" },
  "william shakespeare": { tradition: "Renaissance", era: "Renaissance" },
  "miguel de cervantes saavedra": { tradition: "Renaissance", era: "Renaissance" },
  "miguel de cervantes": { tradition: "Renaissance", era: "Renaissance" },
  "niccolò machiavelli": { tradition: "Renaissance", era: "Renaissance" },
  "john milton": { tradition: "Renaissance", era: "Renaissance" },
  "christopher marlowe": { tradition: "Renaissance", era: "Renaissance" },
  "francis bacon": { tradition: "Renaissance", era: "Renaissance" },
  "ben jonson": { tradition: "Renaissance", era: "Renaissance" },
  "edmund spenser": { tradition: "Renaissance", era: "Renaissance" },
  "voltaire": { tradition: "Enlightenment", era: "Enlightenment" },
  "jonathan swift": { tradition: "Enlightenment", era: "Enlightenment" },
  "daniel defoe": { tradition: "Enlightenment", era: "Enlightenment" },
  "jean-jacques rousseau": { tradition: "Enlightenment", era: "Enlightenment" },
  "laurence sterne": { tradition: "Enlightenment", era: "Enlightenment" },
  "samuel richardson": { tradition: "Enlightenment", era: "Enlightenment" },
  "henry fielding": { tradition: "Enlightenment", era: "Enlightenment" },
  "tobias smollett": { tradition: "Enlightenment", era: "Enlightenment" },
  "oliver goldsmith": { tradition: "Enlightenment", era: "Enlightenment" },
  "jane austen": { tradition: "Victorian", era: "Modern" },
  "charles dickens": { tradition: "Victorian", era: "Modern" },
  "charlotte brontë": { tradition: "Victorian", era: "Modern" },
  "emily brontë": { tradition: "Victorian", era: "Modern" },
  "anne brontë": { tradition: "Victorian", era: "Modern" },
  "thomas hardy": { tradition: "Victorian", era: "Modern" },
  "george eliot": { tradition: "Victorian", era: "Modern" },
  "oscar wilde": { tradition: "Victorian", era: "Modern" },
  "anthony trollope": { tradition: "Victorian", era: "Modern" },
  "elizabeth gaskell": { tradition: "Victorian", era: "Modern" },
  "wilkie collins": { tradition: "Victorian", era: "Modern" },
  "robert louis stevenson": { tradition: "Victorian", era: "Modern" },
  "arthur conan doyle": { tradition: "Victorian", era: "Modern" },
  "bram stoker": { tradition: "Victorian", era: "Modern" },
  "h. g. wells": { tradition: "Victorian", era: "Modern" },
  "rudyard kipling": { tradition: "Victorian", era: "Modern" },
  "lewis carroll": { tradition: "Victorian", era: "Modern" },
  "george meredith": { tradition: "Victorian", era: "Modern" },
  "mrs. gaskell": { tradition: "Victorian", era: "Modern" },
  "samuel butler": { tradition: "Victorian", era: "Modern" },
  "george gissing": { tradition: "Victorian", era: "Modern" },
  "margaret oliphant": { tradition: "Victorian", era: "Modern" },
  "l. m. montgomery": { tradition: "Victorian", era: "Modern" },
  "frances hodgson burnett": { tradition: "Victorian", era: "Modern" },
  "e. nesbit": { tradition: "Victorian", era: "Modern" },
  "g. k. chesterton": { tradition: "Victorian", era: "Modern" },
  "john buchan": { tradition: "Victorian", era: "Modern" },
  "p. g. wodehouse": { tradition: "Victorian", era: "Modern" },
  "h. rider haggard": { tradition: "Victorian", era: "Modern" },
  "w. w. jacobs": { tradition: "Victorian", era: "Modern" },
  "m. r. james": { tradition: "Victorian", era: "Modern" },
  "elizabeth von arnim": { tradition: "Victorian", era: "Modern" },
  "mary shelley": { tradition: "Romantic", era: "Modern" },
  "percy bysshe shelley": { tradition: "Romantic", era: "Modern" },
  "william wordsworth": { tradition: "Romantic", era: "Modern" },
  "john keats": { tradition: "Romantic", era: "Modern" },
  "lord byron": { tradition: "Romantic", era: "Modern" },
  "walter scott": { tradition: "Romantic", era: "Modern" },
  "ann radcliffe": { tradition: "Romantic", era: "Modern" },
  "leo tolstoy": { tradition: "Russian", era: "Modern" },
  "fyodor dostoevsky": { tradition: "Russian", era: "Modern" },
  "anton chekhov": { tradition: "Russian", era: "Modern" },
  "ivan turgenev": { tradition: "Russian", era: "Modern" },
  "nikolai gogol": { tradition: "Russian", era: "Modern" },
  "alexander pushkin": { tradition: "Russian", era: "Modern" },
  "maxim gorky": { tradition: "Russian", era: "Modern" },
  "mikhail lermontov": { tradition: "Russian", era: "Modern" },
  "honoré de balzac": { tradition: "French", era: "Modern" },
  "gustave flaubert": { tradition: "French", era: "Modern" },
  "émile zola": { tradition: "French", era: "Modern" },
  "victor hugo": { tradition: "French", era: "Modern" },
  "alexandre dumas": { tradition: "French", era: "Modern" },
  "guy de maupassant": { tradition: "French", era: "Modern" },
  "stendhal": { tradition: "French", era: "Modern" },
  "marcel proust": { tradition: "French", era: "Modern" },
  "jules verne": { tradition: "French", era: "Modern" },
  "maurice leblanc": { tradition: "French", era: "Modern" },
  "gaston leroux": { tradition: "French", era: "Modern" },
  "anatole france": { tradition: "French", era: "Modern" },
  "mark twain": { tradition: "American", era: "Modern" },
  "herman melville": { tradition: "American", era: "Modern" },
  "nathaniel hawthorne": { tradition: "American", era: "Modern" },
  "edgar allan poe": { tradition: "American", era: "Modern" },
  "henry james": { tradition: "American", era: "Modern" },
  "f. scott fitzgerald": { tradition: "American", era: "Modern" },
  "ernest hemingway": { tradition: "American", era: "Modern" },
  "henry david thoreau": { tradition: "American", era: "Modern" },
  "jack london": { tradition: "American", era: "Modern" },
  "edith wharton": { tradition: "American", era: "Modern" },
  "louisa may alcott": { tradition: "American", era: "Modern" },
  "stephen crane": { tradition: "American", era: "Modern" },
  "kate chopin": { tradition: "American", era: "Modern" },
  "booth tarkington": { tradition: "American", era: "Modern" },
  "edgar rice burroughs": { tradition: "American", era: "Modern" },
  "anna julia cooper": { tradition: "American", era: "Modern" },
  "washington irving": { tradition: "American", era: "Modern" },
  "james fenimore cooper": { tradition: "American", era: "Modern" },
  "harriet beecher stowe": { tradition: "American", era: "Modern" },
  "frederick douglass": { tradition: "American", era: "Modern" },
  "w. e. b. du bois": { tradition: "American", era: "Modern" },
  "l. frank baum": { tradition: "American", era: "Modern" },
  "ambrose bierce": { tradition: "American", era: "Modern" },
  "o. henry": { tradition: "American", era: "Modern" },
  "james joyce": { tradition: "Modernist", era: "Modern" },
  "virginia woolf": { tradition: "Modernist", era: "Modern" },
  "franz kafka": { tradition: "Modernist", era: "Modern" },
  "joseph conrad": { tradition: "Modernist", era: "Modern" },
  "e. m. forster": { tradition: "Modernist", era: "Modern" },
  "ford madox ford": { tradition: "Modernist", era: "Modern" },
  "d. h. lawrence": { tradition: "Modernist", era: "Modern" },
  "henrik ibsen": { tradition: "Modernist", era: "Modern" },
  "erich maria remarque": { tradition: "Modernist", era: "Modern" },
  "george bernard shaw": { tradition: "Modernist", era: "Modern" },
  "katherine mansfield": { tradition: "Modernist", era: "Modern" },
  "w. somerset maugham": { tradition: "Modernist", era: "Modern" },
  "sun tzu": { tradition: "Eastern", era: "Ancient" },
  "lao tzu": { tradition: "Eastern", era: "Ancient" },
  "confucius": { tradition: "Eastern", era: "Ancient" },
  "rabindranath tagore": { tradition: "Eastern", era: "Modern" },
  "etsu inagaki sugimoto": { tradition: "Eastern", era: "Modern" },
}

const TAG_TRADITIONS: [string[], string][] = [
  [["greek mythology", "ancient greece", "greek drama", "greek tragedy"], "Ancient Greek"],
  [["rome", "roman", "latin literature"], "Roman"],
  [["medieval", "arthurian", "middle ages"], "Medieval European"],
  [["shakespeare", "renaissance english", "elizabethan"], "Renaissance"],
  [["enlightenment", "18th century"], "Enlightenment"],
  [["victorian", "19th century english", "england -- fiction", "british fiction"], "Victorian"],
  [["russia", "russian fiction", "russian literature"], "Russian"],
  [["france", "french fiction", "french literature"], "French"],
  [["america", "american fiction", "american literature", "united states"], "American"],
  [["modernist", "stream of consciousness", "20th century"], "Modernist"],
  [["japan", "china", "india", "persia", "arabic", "eastern", "buddhism"], "Eastern"],
]

function classify(author: string, tags: string): { tradition: string; era: string } {
  const al = author.toLowerCase()
  // Direct author match
  if (AUTHOR_TRADITIONS[al]) return AUTHOR_TRADITIONS[al]
  // Partial author match (handle "Honoré de Balzac" vs "honoré de balzac")
  for (const [name, info] of Object.entries(AUTHOR_TRADITIONS)) {
    if (al.includes(name) || name.includes(al)) return info
    // Also try last-name match
    const authorLast = al.split(" ").pop() ?? ""
    const nameLast = name.split(" ").pop() ?? ""
    if (authorLast.length > 3 && nameLast.length > 3 && authorLast === nameLast) return info
  }
  // Tag-based classification
  const text = `${tags} ${author}`.toLowerCase()
  for (const [keywords, tradition] of TAG_TRADITIONS) {
    if (keywords.some(k => text.includes(k))) return { tradition, era: "Modern" }
  }
  return { tradition: "World Literature", era: "Modern" }
}

function classifyDifficulty(tags: string, wordCount: number): "Beginner" | "Intermediate" | "Advanced" | "Scholar" {
  const t = tags.toLowerCase()
  if (t.includes("philosophy") || t.includes("political") || t.includes("economics")) return "Advanced"
  if (t.includes("children") || t.includes("young adult") || t.includes("fairy")) return "Beginner"
  if (wordCount < 25000) return "Beginner"
  if (wordCount < 80000) return "Intermediate"
  if (wordCount < 180000) return "Advanced"
  return "Scholar"
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function slugToAuthorId(a: string): string {
  return a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
}

// ── Main ──────────────────────────────────────

function main() {
  // 1. Parse CSV → build lookup by SE bookId AND by title slug
  const csvText = fs.readFileSync(CSV_PATH, "utf-8")
  const csvRows = parseCSV(csvText)
  const csvBySlug = new Map<string, Record<string, string>>()

  for (const row of csvRows) {
    // SE URL extract
    const seMatch = row.identifiers?.match(/url:https:\/\/standardebooks\.org\/ebooks\/([^,\s"]+)/)
    if (seMatch) {
      const parts = seMatch[1].replace(/\/$/, "").split("/")
      const bookId = parts[1] ?? parts[0]
      csvBySlug.set(bookId, row)
    }
    // Title slug fallback
    const ts = slugify(row.title ?? "")
    if (ts && !csvBySlug.has(ts)) csvBySlug.set(ts, row)
  }

  console.error(`CSV: ${csvRows.length} rows → ${csvBySlug.size} slug entries`)

  // 2. Existing IDs
  const existingIds = new Set((process.env.EXISTING_IDS ?? "").split(",").filter(Boolean))

  // 3. Scan content dirs
  const contentDirs = fs.readdirSync(CONTENT_DIR).filter(d =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  ).sort()

  console.error(`Content dirs: ${contentDirs.length}, existing in DB: ${existingIds.size}`)

  const books: any[] = []
  let csvMatched = 0

  for (const slug of contentDirs) {
    if (existingIds.has(slug)) continue

    // Read meta.json
    let meta: any = null
    try {
      meta = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, slug, "meta.json"), "utf-8"))
    } catch {
      console.error(`  SKIP: ${slug} — no meta.json`)
      continue
    }

    const title = meta.title ?? slug
    const author = meta.author ?? "Unknown"
    const chapterCount = meta.chapterCount ?? 0
    const totalWords = meta.totalWordCount ?? 0
    const totalMinutes = meta.totalMinutes ?? Math.round(totalWords / 250)

    // CSV enrichment
    const csv = csvBySlug.get(slug)
    if (csv) csvMatched++
    const tags = csv?.tags ?? ""
    const description = (csv?.comments ?? "").replace(/<[^>]+>/g, "").trim()
    const seUrl = csv?.identifiers?.match(/url:(https:\/\/standardebooks\.org\/ebooks\/[^,\s"]+)/)?.[1] ?? null

    let pubYear: number | null = null
    if (csv?.pubdate) {
      const y = parseInt(csv.pubdate.slice(0, 4))
      if (y > 100 && y < 2100) pubYear = y
    }

    const { tradition, era } = classify(author, tags)
    const difficulty = classifyDifficulty(tags, totalWords)
    const hours = Math.round(totalMinutes / 60)
    const estTime = hours > 0 ? `~${hours} hours` : `~${totalMinutes} min`

    const coverExt = fs.existsSync(path.join(COVERS_DIR, `${slug}.jpg`)) ? "jpg"
      : fs.existsSync(path.join(COVERS_DIR, `${slug}.webp`)) ? "webp"
      : fs.existsSync(path.join(COVERS_DIR, `${slug}.png`)) ? "png"
      : null

    books.push({
      id: slug,
      title,
      author,
      author_id: slugToAuthorId(author),
      year: pubYear,
      language: "English",
      tradition,
      era,
      genres: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 5) : [],
      difficulty,
      chapter_count: chapterCount,
      word_count: totalWords,
      reading_time_minutes: totalMinutes,
      estimated_reading_time: estTime,
      synopsis: description.slice(0, 500),
      themes: [],
      country: "",
      cover_colors: {},
      featured: false,
      standard_ebooks_url: seUrl,
      cover_image_path: coverExt ? `/covers/${slug}.${coverExt}` : null,
      source: "standard-ebooks",
      ingestion_status: "success",
    })
  }

  console.error(`Generated ${books.length} books (${csvMatched} enriched from CSV)`)

  // Tradition breakdown
  const tradCounts: Record<string, number> = {}
  books.forEach(b => { tradCounts[b.tradition] = (tradCounts[b.tradition] ?? 0) + 1 })
  console.error("Traditions:", JSON.stringify(tradCounts))

  console.log(JSON.stringify(books))
}

main()
