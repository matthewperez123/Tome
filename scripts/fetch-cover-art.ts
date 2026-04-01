/**
 * Tome — Fetch Cover Art Candidates
 *
 * Queries the Met Museum Open Access API (CC0) for each book in
 * COVER_SEARCH_CONFIGS. Scores results and selects top 3 candidates per book.
 * Falls back to Art Institute of Chicago when Met returns fewer than 3 results.
 * Saves final output to scripts/cover-art-candidates.json.
 *
 * Usage:
 *   npx ts-node --project scripts/tsconfig.json scripts/fetch-cover-art.ts
 *
 * Re-run safe: books already present in cover-art-candidates.json are skipped.
 */

import * as fs from "fs"
import * as path from "path"
import * as https from "https"
import { COVER_SEARCH_CONFIGS, CoverSearchConfig } from "./cover-art-search"

// ── Types ─────────────────────────────────────────────────────────────────────

interface MetSearchResponse {
  total: number
  objectIDs: number[] | null
}

interface MetObject {
  objectID: number
  title: string
  artistDisplayName: string
  objectDate: string
  primaryImage: string
  primaryImageSmall: string
  department: string
  medium: string
  objectURL: string
  isPublicDomain: boolean
  hasImages: boolean
  artistBeginDate?: string
  artistEndDate?: string
  objectBeginDate?: number
  objectEndDate?: number
  creditLine?: string
  dimensions?: string
}

interface AicSearchHit {
  id: number
  title: string
  artist_title: string | null
  date_display: string | null
  image_id: string | null
}

interface AicSearchResponse {
  data: AicSearchHit[]
}

interface CoverCandidate {
  objectId: number | string
  title: string
  artist: string
  date: string
  imageUrl: string
  thumbnailUrl: string
  department: string
  medium: string
  creditLine: string
  objectUrl: string
  source: "met" | "aic"
  score: number
}

type CandidatesOutput = Record<string, CoverCandidate[]>

// ── Constants ─────────────────────────────────────────────────────────────────

const MET_SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search"
const MET_OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects"
const AIC_SEARCH_URL = "https://api.artic.edu/api/v1/artworks/search"
const AIC_IMAGE_BASE = "https://www.artic.edu/iiif/2"

const OUTPUT_FILE = path.join(__dirname, "cover-art-candidates.json")
const DELAY_MS = 100
const BATCH_SIZE = 5
const CANDIDATES_NEEDED = 3
const MAX_MET_IDS_PER_QUERY = 20  // only score first N IDs per query to limit API calls

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function httpGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Tome/1.0 cover-art-pipeline" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const location = res.headers.location
          if (location) {
            httpGet(location).then(resolve).catch(reject)
            return
          }
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`))
          res.resume()
          return
        }
        const chunks: Buffer[] = []
        res.on("data", (chunk: Buffer) => chunks.push(chunk))
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
        res.on("error", reject)
      })
      .on("error", reject)
  })
}

async function fetchJson<T>(url: string): Promise<T> {
  const text = await httpGet(url)
  return JSON.parse(text) as T
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreMetObject(obj: MetObject, config: CoverSearchConfig): number {
  let score = 0

  // Must be public domain — hard gate
  if (!obj.isPublicDomain) return -1

  // Has a usable primary image
  if (obj.primaryImage && obj.primaryImage.length > 0) score += 30

  // Painting/drawing medium
  const paintingMediums = ["Oil", "Tempera", "Watercolor", "Gouache", "Ink"]
  const medium = obj.medium ?? ""
  if (paintingMediums.some((m) => medium.includes(m))) score += 20

  // Keyword relevance — title + artist name
  const haystack = `${obj.title} ${obj.artistDisplayName}`.toLowerCase()
  const keywords = config.artKeywords ?? []
  let keywordBonus = 0
  for (const kw of keywords) {
    if (haystack.includes(kw.toLowerCase())) {
      keywordBonus += 15
    }
  }
  score += Math.min(keywordBonus, 30)

  // Preferred department
  const deptIdMap: Record<string, number> = {
    "Greek and Roman Art": 13,
    "European Paintings": 11,
    "Asian Art": 6,
    "Drawings and Prints": 9,
    "Drawings & Prints": 9,
  }
  const deptId = deptIdMap[obj.department]
  if (deptId !== undefined && (config.preferredDepartments ?? []).includes(deptId)) {
    score += 10
  }

  // Not a 3D object
  const avoid3d = ["Bronze", "Marble", "Ceramic", "Glass", "Textile", "Wood"]
  if (!avoid3d.some((m) => medium.includes(m))) score += 10

  // Deduct for photographs
  if (medium.includes("Photograph")) score -= 20

  return score
}

// ── Met API fetching ──────────────────────────────────────────────────────────

async function searchMet(query: string): Promise<number[]> {
  const encoded = encodeURIComponent(query)
  const url = `${MET_SEARCH_URL}?hasImages=true&isPublicDomain=true&q=${encoded}`
  try {
    const result = await fetchJson<MetSearchResponse>(url)
    return result.objectIDs ?? []
  } catch (err) {
    return []
  }
}

async function fetchMetObject(id: number): Promise<MetObject | null> {
  const url = `${MET_OBJECT_URL}/${id}`
  try {
    const obj = await fetchJson<MetObject>(url)
    await delay(DELAY_MS)
    return obj
  } catch {
    return null
  }
}

async function fetchMetCandidates(
  config: CoverSearchConfig
): Promise<CoverCandidate[]> {
  const seen = new Set<number>()
  const scored: Array<{ obj: MetObject; score: number }> = []

  for (const query of config.queries) {
    const ids = await searchMet(query)
    await delay(DELAY_MS)

    const idsToCheck = ids.slice(0, MAX_MET_IDS_PER_QUERY)
    for (const id of idsToCheck) {
      if (seen.has(id)) continue
      seen.add(id)

      const obj = await fetchMetObject(id)
      if (!obj) continue
      if (!obj.primaryImage) continue
      if (!obj.isPublicDomain) continue

      const score = scoreMetObject(obj, config)
      if (score > 0) {
        scored.push({ obj, score })
      }
    }

    // Stop querying if we already have enough strong candidates
    if (scored.length >= CANDIDATES_NEEDED * 3) break
  }

  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, CANDIDATES_NEEDED)

  return top.map(({ obj, score }) => ({
    objectId: obj.objectID,
    title: obj.title,
    artist: obj.artistDisplayName,
    date: obj.objectDate,
    imageUrl: obj.primaryImage,
    thumbnailUrl: obj.primaryImageSmall || obj.primaryImage,
    department: obj.department,
    medium: obj.medium,
    creditLine: obj.creditLine ?? "",
    objectUrl: obj.objectURL || `https://www.metmuseum.org/art/collection/search/${obj.objectID}`,
    source: "met" as const,
    score,
  }))
}

// ── AIC fallback ──────────────────────────────────────────────────────────────

async function fetchAicCandidates(
  config: CoverSearchConfig,
  needed: number
): Promise<CoverCandidate[]> {
  const candidates: CoverCandidate[] = []

  for (const query of config.queries) {
    if (candidates.length >= needed) break

    const encoded = encodeURIComponent(query)
    const url =
      `${AIC_SEARCH_URL}?q=${encoded}` +
      `&fields=id,title,artist_title,date_display,image_id` +
      `&params[bool][must][term][is_public_domain]=true`

    try {
      const result = await fetchJson<AicSearchResponse>(url)
      await delay(DELAY_MS)

      for (const hit of result.data) {
        if (!hit.image_id) continue
        if (candidates.length >= needed) break

        const imageUrl = `${AIC_IMAGE_BASE}/${hit.image_id}/full/843,/0/default.jpg`
        const thumbnailUrl = `${AIC_IMAGE_BASE}/${hit.image_id}/full/400,/0/default.jpg`
        const objectUrl = `https://www.artic.edu/artworks/${hit.id}`

        // Basic keyword score for AIC results
        const haystack = `${hit.title} ${hit.artist_title ?? ""}`.toLowerCase()
        const keywords = config.artKeywords ?? []
        let kwScore = 0
        for (const kw of keywords) {
          if (haystack.includes(kw.toLowerCase())) kwScore += 10
        }

        candidates.push({
          objectId: hit.id,
          title: hit.title,
          artist: hit.artist_title ?? "",
          date: hit.date_display ?? "",
          imageUrl,
          thumbnailUrl,
          department: "",
          medium: "",
          creditLine: "",
          objectUrl,
          source: "aic" as const,
          score: 40 + Math.min(kwScore, 30), // AIC baseline score
        })
      }
    } catch {
      // silently continue to next query
    }
  }

  return candidates
}

// ── Per-book pipeline ─────────────────────────────────────────────────────────

async function processBook(
  config: CoverSearchConfig,
  index: number,
  total: number
): Promise<CoverCandidate[]> {
  const label = `[${String(index + 1).padStart(3, " ")}/${total}] ${config.bookId}`

  try {
    let candidates = await fetchMetCandidates(config)

    if (candidates.length < CANDIDATES_NEEDED) {
      const needed = CANDIDATES_NEEDED - candidates.length
      const aicResults = await fetchAicCandidates(config, needed)
      candidates = [...candidates, ...aicResults]
    }

    console.log(`${label} → ${candidates.length} candidate(s) found`)
    return candidates
  } catch (err) {
    console.error(`${label} → ERROR: ${(err as Error).message}`)
    return []
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Load existing output file if present (re-run safety)
  let existing: CandidatesOutput = {}
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const raw = fs.readFileSync(OUTPUT_FILE, "utf8")
      existing = JSON.parse(raw) as CandidatesOutput
      console.log(`Loaded existing candidates for ${Object.keys(existing).length} book(s). Skipping those.`)
    } catch {
      console.warn("Could not parse existing candidates file — starting fresh.")
      existing = {}
    }
  }

  const allConfigs = COVER_SEARCH_CONFIGS
  const total = allConfigs.length

  // Filter out already-processed books
  const toProcess = allConfigs.filter((c) => !existing[c.bookId])

  if (toProcess.length === 0) {
    console.log("All books already processed. Nothing to do.")
    return
  }

  console.log(`Processing ${toProcess.length} book(s) in batches of ${BATCH_SIZE}...`)

  const output: CandidatesOutput = { ...existing }

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE)
    const globalIndices = batch.map((c) => allConfigs.indexOf(c))

    const results = await Promise.all(
      batch.map((config, batchIdx) =>
        processBook(config, globalIndices[batchIdx], total)
      )
    )

    for (let j = 0; j < batch.length; j++) {
      const config = batch[j]
      output[config.bookId] = results[j]
    }

    // Persist incrementally after each batch so a crash doesn't lose progress
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf8")
  }

  const totalCandidates = Object.values(output).reduce(
    (sum, arr) => sum + arr.length,
    0
  )
  console.log(
    `\nDone. ${Object.keys(output).length} books processed, ` +
      `${totalCandidates} total candidates saved to:\n  ${OUTPUT_FILE}`
  )
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
