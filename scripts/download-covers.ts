/**
 * download-covers.ts — Download & process museum art images
 *
 * Reads scripts/cover-art-candidates.json, downloads each top-scored
 * image, processes with sharp (if available), and writes:
 *   public/covers/museum/[bookId].jpg          (600×900, 85q)
 *   public/covers/museum/[bookId].webp         (600×900, 82q)
 *   public/covers/museum/thumbs/[bookId].jpg   (200×300, 75q)
 *
 * Then generates src/data/generated/cover-art-data.ts with the
 * populated GENERATED_BOOK_COVER_ART record.
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/download-covers.ts
 */

import * as fs from "fs"
import * as path from "path"
import * as https from "https"

// ── Try to load sharp ─────────────────────────────────────────────────────

let sharp: any
try {
  sharp = require("sharp")
} catch {
  sharp = null
  console.warn("⚠  sharp not installed — images will be saved as-is (no resize/crop)")
}

// ── Paths ─────────────────────────────────────────────────────────────────

const ROOT         = path.resolve(__dirname, "..")
const CANDIDATES   = path.join(__dirname, "cover-art-candidates.json")
const OUT_DIR      = path.join(ROOT, "public", "covers", "museum")
const THUMB_DIR    = path.join(OUT_DIR, "thumbs")
const WEBP_DIR     = OUT_DIR               // same dir, different extension
const GENERATED_TS = path.join(ROOT, "src", "data", "generated", "cover-art-data.ts")

// ── HTTP download ─────────────────────────────────────────────────────────

function downloadBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    function doGet(u: string, redirects = 0) {
      if (redirects > 5) { reject(new Error("Too many redirects")); return }
      const req = https.get(u, { timeout: 20000 }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doGet(res.headers.location, redirects + 1); return
        }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
        const chunks: Buffer[] = []
        res.on("data", (c: Buffer) => chunks.push(c))
        res.on("end", () => resolve(Buffer.concat(chunks)))
        res.on("error", reject)
      })
      req.on("error", reject)
      req.on("timeout", () => { req.destroy(); reject(new Error("timeout")) })
    }
    doGet(url)
  })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ── Main ──────────────────────────────────────────────────────────────────

interface Candidate {
  objectId: number
  title: string
  artist: string
  date: string
  imageUrl: string
  thumbnailUrl: string
  department: string
  medium: string
  creditLine: string
  objectUrl: string
  source: "met" | "art-institute-chicago" | "rijksmuseum"
  score: number
}

async function main() {
  if (!fs.existsSync(CANDIDATES)) {
    console.error("cover-art-candidates.json not found — run fetch-cover-art.ts first")
    process.exit(1)
  }

  // Create output directories
  for (const dir of [OUT_DIR, THUMB_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  }
  const genDir = path.dirname(GENERATED_TS)
  if (!fs.existsSync(genDir)) fs.mkdirSync(genDir, { recursive: true })

  const allCandidates: Record<string, Candidate[]> = JSON.parse(fs.readFileSync(CANDIDATES, "utf-8"))
  const booksWithArt = Object.entries(allCandidates).filter(([, v]) => v && v.length > 0)

  console.log(`Found ${booksWithArt.length} books with art candidates...`)
  console.log(sharp ? "✓ sharp available — images will be resized to 600×900" : "⚠  sharp missing — raw images only")
  console.log()

  const results: Record<string, Candidate & { localPath: string; localThumbnailPath: string }> = {}
  let downloaded = 0; let skipped = 0; let failed = 0
  let i = 0

  for (const [bookId, candidates] of booksWithArt) {
    i++
    const top = candidates[0]  // highest-scored candidate
    const jpgPath   = path.join(OUT_DIR, `${bookId}.jpg`)
    const webpPath  = path.join(OUT_DIR, `${bookId}.webp`)
    const thumbPath = path.join(THUMB_DIR, `${bookId}.jpg`)

    // Skip if already downloaded
    if (fs.existsSync(jpgPath) && fs.existsSync(thumbPath)) {
      skipped++
      results[bookId] = {
        ...top,
        localPath: `/covers/museum/${bookId}.jpg`,
        localThumbnailPath: `/covers/museum/thumbs/${bookId}.jpg`,
      }
      console.log(`[${String(i).padStart(3)}/${booksWithArt.length}] ↷  ${bookId.padEnd(34)} (already downloaded)`)
      continue
    }

    try {
      await sleep(150)
      const buf = await downloadBuffer(top.imageUrl)

      if (sharp) {
        // JPEG 600×900
        await sharp(buf)
          .resize(600, 900, { fit: "cover", position: "centre" })
          .jpeg({ quality: 85 })
          .toFile(jpgPath)

        // WebP 600×900
        await sharp(buf)
          .resize(600, 900, { fit: "cover", position: "centre" })
          .webp({ quality: 82 })
          .toFile(webpPath)

        // Thumbnail JPEG 200×300
        await sharp(buf)
          .resize(200, 300, { fit: "cover", position: "centre" })
          .jpeg({ quality: 75 })
          .toFile(thumbPath)
      } else {
        // No sharp — save raw buffer
        fs.writeFileSync(jpgPath, buf)
        fs.writeFileSync(thumbPath, buf)
      }

      downloaded++
      results[bookId] = {
        ...top,
        localPath: `/covers/museum/${bookId}.jpg`,
        localThumbnailPath: `/covers/museum/thumbs/${bookId}.jpg`,
      }
      console.log(`[${String(i).padStart(3)}/${booksWithArt.length}] ✓  ${bookId.padEnd(34)} "${top.title}" by ${top.artist || "Unknown"}`)
    } catch (err: any) {
      failed++
      // Store without local path (will use remote URL)
      results[bookId] = {
        ...top,
        localPath: "",
        localThumbnailPath: "",
      }
      console.log(`[${String(i).padStart(3)}/${booksWithArt.length}] ✗  ${bookId.padEnd(34)} download failed: ${err.message}`)
    }
  }

  console.log()
  console.log(`✓ Downloaded: ${downloaded}  ↷ Skipped: ${skipped}  ✗ Failed: ${failed}`)
  console.log()

  // ── Generate TypeScript data file ─────────────────────────────────────

  const entries = Object.entries(results)
    .map(([bookId, art]) => {
      const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$")
      return `  "${bookId}": {
    bookId: "${bookId}",
    objectId: ${art.objectId},
    title: \`${esc(art.title)}\`,
    artist: \`${esc(art.artist || "")}\`,
    date: \`${esc(art.date || "")}\`,
    imageUrl: \`${esc(art.imageUrl)}\`,
    thumbnailUrl: \`${esc(art.thumbnailUrl || art.imageUrl)}\`,
    localPath: "${art.localPath}",
    localThumbnailPath: "${art.localThumbnailPath}",
    department: \`${esc(art.department || "")}\`,
    medium: \`${esc(art.medium || "")}\`,
    creditLine: \`${esc(art.creditLine || "")}\`,
    objectUrl: \`${esc(art.objectUrl || "")}\`,
    source: "${art.source}",
    score: ${art.score},
  }`
    })
    .join(",\n")

  const ts = `// Auto-generated by scripts/download-covers.ts — do not edit manually
// ${entries ? Object.keys(results).length : 0} books with museum artwork

import type { BookCoverArt } from "@/data/cover-art"

export const GENERATED_BOOK_COVER_ART: Record<string, BookCoverArt> = {
${entries}
}
`

  fs.writeFileSync(GENERATED_TS, ts)
  console.log(`✓ Generated ${GENERATED_TS}`)
  console.log(`  (${Object.keys(results).length} books with museum cover art)`)
}

main().catch(err => { console.error(err); process.exit(1) })
