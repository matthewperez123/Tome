/**
 * fetch-era-art.ts — Second-pass fetcher using broad era-based queries
 * Fills in gaps where fetch-cover-art.ts found 0 candidates.
 *
 * Strategy: search the Met with simple, broad queries that reliably
 * return high-quality paintings. No keyword over-fitting.
 */

import * as fs from "fs"
import * as path from "path"
import * as https from "https"

// ── Book tradition data ─────────────────────────────────────────────────────

const BOOKS: Array<{
  bookId: string
  title: string
  author: string
  tradition: string
  year: number
}> = [
  // Ancient Greek
  { bookId: "the-republic",          title: "The Republic",          author: "Plato",          tradition: "Ancient Greek", year: -380 },
  { bookId: "symposium",             title: "Symposium",             author: "Plato",          tradition: "Ancient Greek", year: -385 },
  { bookId: "apology",               title: "Apology",               author: "Plato",          tradition: "Ancient Greek", year: -399 },
  { bookId: "nicomachean-ethics",    title: "Nicomachean Ethics",    author: "Aristotle",      tradition: "Ancient Greek", year: -350 },
  { bookId: "the-histories",         title: "The Histories",         author: "Herodotus",      tradition: "Ancient Greek", year: -440 },
  { bookId: "the-persians",          title: "The Persians",          author: "Aeschylus",      tradition: "Ancient Greek", year: -472 },
  { bookId: "anabasis",              title: "Anabasis",              author: "Xenophon",       tradition: "Ancient Greek", year: -370 },
  // Roman
  { bookId: "the-aeneid",            title: "The Aeneid",            author: "Virgil",         tradition: "Roman",         year: -19 },
  { bookId: "metamorphoses",         title: "Metamorphoses",         author: "Ovid",           tradition: "Roman",         year: 8 },
  { bookId: "de-bello-gallico",      title: "De Bello Gallico",      author: "Caesar",         tradition: "Roman",         year: -50 },
  { bookId: "confessions",           title: "Confessions",           author: "Augustine",      tradition: "Roman",         year: 400 },
  { bookId: "meditations",           title: "Meditations",           author: "Marcus Aurelius",tradition: "Roman",         year: 180 },
  { bookId: "letters-to-lucilius",   title: "Letters to Lucilius",   author: "Seneca",         tradition: "Roman",         year: 65 },
  { bookId: "de-rerum-natura",       title: "De Rerum Natura",       author: "Lucretius",      tradition: "Roman",         year: -55 },
  { bookId: "on-friendship",         title: "On Friendship",         author: "Cicero",         tradition: "Roman",         year: -44 },
  // Medieval European
  { bookId: "inferno",               title: "Inferno",               author: "Dante",          tradition: "Medieval European", year: 1320 },
  { bookId: "purgatorio",            title: "Purgatorio",            author: "Dante",          tradition: "Medieval European", year: 1320 },
  { bookId: "paradiso",              title: "Paradiso",              author: "Dante",          tradition: "Medieval European", year: 1320 },
  { bookId: "the-canterbury-tales",  title: "The Canterbury Tales",  author: "Chaucer",        tradition: "Medieval European", year: 1400 },
  { bookId: "beowulf",               title: "Beowulf",               author: "Unknown",        tradition: "Medieval European", year: 1000 },
  { bookId: "the-decameron",         title: "The Decameron",         author: "Boccaccio",      tradition: "Medieval European", year: 1353 },
  { bookId: "le-morte-darthur",      title: "Le Morte d'Arthur",     author: "Malory",         tradition: "Medieval European", year: 1485 },
  // Renaissance
  { bookId: "hamlet",                title: "Hamlet",                author: "Shakespeare",    tradition: "Renaissance",   year: 1603 },
  { bookId: "macbeth",               title: "Macbeth",               author: "Shakespeare",    tradition: "Renaissance",   year: 1606 },
  { bookId: "othello",               title: "Othello",               author: "Shakespeare",    tradition: "Renaissance",   year: 1622 },
  { bookId: "the-tempest",           title: "The Tempest",           author: "Shakespeare",    tradition: "Renaissance",   year: 1611 },
  { bookId: "don-quixote",           title: "Don Quixote",           author: "Cervantes",      tradition: "Renaissance",   year: 1615 },
  { bookId: "the-prince",            title: "The Prince",            author: "Machiavelli",    tradition: "Renaissance",   year: 1532 },
  { bookId: "paradise-lost",         title: "Paradise Lost",         author: "Milton",         tradition: "Renaissance",   year: 1667 },
  // Enlightenment
  { bookId: "candide",               title: "Candide",               author: "Voltaire",       tradition: "Enlightenment", year: 1759 },
  { bookId: "gullivers-travels",     title: "Gulliver's Travels",    author: "Swift",          tradition: "Enlightenment", year: 1726 },
  { bookId: "the-social-contract",   title: "The Social Contract",   author: "Rousseau",       tradition: "Enlightenment", year: 1762 },
  { bookId: "discourse-on-method",   title: "Discourse on Method",   author: "Descartes",      tradition: "Enlightenment", year: 1637 },
  { bookId: "the-wealth-of-nations", title: "The Wealth of Nations", author: "Adam Smith",     tradition: "Enlightenment", year: 1776 },
  // Romantic
  { bookId: "pride-and-prejudice",   title: "Pride and Prejudice",   author: "Austen",         tradition: "Romantic",      year: 1813 },
  { bookId: "frankenstein",          title: "Frankenstein",          author: "Shelley",        tradition: "Romantic",      year: 1818 },
  { bookId: "les-miserables",        title: "Les Misérables",        author: "Hugo",           tradition: "Romantic",      year: 1862 },
  { bookId: "the-count-of-monte-cristo", title: "The Count of Monte Cristo", author: "Dumas", tradition: "Romantic",      year: 1846 },
  // Victorian
  { bookId: "jane-eyre",             title: "Jane Eyre",             author: "Charlotte Brontë", tradition: "Victorian",   year: 1847 },
  { bookId: "wuthering-heights",     title: "Wuthering Heights",     author: "Emily Brontë",   tradition: "Victorian",     year: 1847 },
  { bookId: "great-expectations",    title: "Great Expectations",    author: "Dickens",        tradition: "Victorian",     year: 1861 },
  { bookId: "a-tale-of-two-cities",  title: "A Tale of Two Cities",  author: "Dickens",        tradition: "Victorian",     year: 1859 },
  { bookId: "the-picture-of-dorian-gray", title: "Dorian Gray",     author: "Oscar Wilde",    tradition: "Victorian",     year: 1891 },
  { bookId: "the-importance-of-being-earnest", title: "Earnest",    author: "Oscar Wilde",    tradition: "Victorian",     year: 1895 },
  { bookId: "a-dolls-house",         title: "A Doll's House",        author: "Ibsen",          tradition: "Victorian",     year: 1879 },
  // Russian
  { bookId: "war-and-peace",         title: "War and Peace",         author: "Tolstoy",        tradition: "Russian",       year: 1869 },
  { bookId: "anna-karenina",         title: "Anna Karenina",         author: "Tolstoy",        tradition: "Russian",       year: 1878 },
  { bookId: "crime-and-punishment",  title: "Crime and Punishment",  author: "Dostoevsky",     tradition: "Russian",       year: 1866 },
  { bookId: "the-brothers-karamazov",title: "Brothers Karamazov",   author: "Dostoevsky",     tradition: "Russian",       year: 1880 },
  { bookId: "eugene-onegin",         title: "Eugene Onegin",         author: "Pushkin",        tradition: "Russian",       year: 1833 },
  { bookId: "the-cherry-orchard",    title: "The Cherry Orchard",    author: "Chekhov",        tradition: "Russian",       year: 1904 },
  { bookId: "notes-from-underground",title: "Notes from Underground",author: "Dostoevsky",    tradition: "Russian",       year: 1864 },
  // American
  { bookId: "moby-dick",             title: "Moby-Dick",             author: "Melville",       tradition: "American",      year: 1851 },
  { bookId: "little-women",          title: "Little Women",          author: "Alcott",         tradition: "American",      year: 1868 },
  { bookId: "the-scarlet-letter",    title: "The Scarlet Letter",    author: "Hawthorne",      tradition: "American",      year: 1850 },
  { bookId: "adventures-of-huckleberry-finn", title: "Huckleberry Finn", author: "Twain",     tradition: "American",      year: 1884 },
  { bookId: "walden",                title: "Walden",                author: "Thoreau",        tradition: "American",      year: 1854 },
  { bookId: "the-great-gatsby",      title: "The Great Gatsby",      author: "Fitzgerald",     tradition: "American",      year: 1925 },
  { bookId: "the-call-of-the-wild",  title: "The Call of the Wild",  author: "London",         tradition: "American",      year: 1903 },
  { bookId: "the-adventures-of-tom-sawyer", title: "Tom Sawyer",    author: "Twain",          tradition: "American",      year: 1876 },
  // French
  { bookId: "madame-bovary",         title: "Madame Bovary",         author: "Flaubert",       tradition: "French",        year: 1857 },
  { bookId: "les-fleurs-du-mal",     title: "Les Fleurs du Mal",     author: "Baudelaire",     tradition: "French",        year: 1857 },
  { bookId: "germinal",              title: "Germinal",              author: "Zola",           tradition: "French",        year: 1885 },
  { bookId: "the-three-musketeers",  title: "The Three Musketeers",  author: "Dumas",          tradition: "French",        year: 1844 },
  { bookId: "pere-goriot",           title: "Père Goriot",           author: "Balzac",         tradition: "French",        year: 1835 },
  { bookId: "the-stranger",          title: "The Stranger",          author: "Camus",          tradition: "French",        year: 1942 },
  // Modernist
  { bookId: "ulysses",               title: "Ulysses",               author: "Joyce",          tradition: "Modernist",     year: 1922 },
  { bookId: "mrs-dalloway",          title: "Mrs. Dalloway",         author: "Woolf",          tradition: "Modernist",     year: 1925 },
  { bookId: "the-metamorphosis",     title: "The Metamorphosis",     author: "Kafka",          tradition: "Modernist",     year: 1915 },
  { bookId: "the-trial",             title: "The Trial",             author: "Kafka",          tradition: "Modernist",     year: 1925 },
  { bookId: "heart-of-darkness",     title: "Heart of Darkness",     author: "Conrad",         tradition: "Modernist",     year: 1899 },
  { bookId: "to-the-lighthouse",     title: "To the Lighthouse",     author: "Woolf",          tradition: "Modernist",     year: 1927 },
  { bookId: "thus-spoke-zarathustra",title: "Thus Spoke Zarathustra",author: "Nietzsche",      tradition: "Modernist",     year: 1885 },
  // Eastern
  { bookId: "bhagavad-gita",         title: "Bhagavad Gita",         author: "Vyasa",          tradition: "Eastern",       year: -200 },
  { bookId: "the-art-of-war",        title: "The Art of War",        author: "Sun Tzu",        tradition: "Eastern",       year: -500 },
  { bookId: "tao-te-ching",          title: "Tao Te Ching",          author: "Laozi",          tradition: "Eastern",       year: -400 },
  { bookId: "the-tale-of-genji",     title: "The Tale of Genji",     author: "Murasaki",       tradition: "Eastern",       year: 1021 },
  { bookId: "rubaiyat-of-omar-khayyam", title: "Rubaiyat",          author: "Omar Khayyam",   tradition: "Eastern",       year: 1120 },
  { bookId: "the-masnavi",           title: "The Masnavi",           author: "Rumi",           tradition: "Eastern",       year: 1258 },
]

// ── Broad queries by tradition + specific overrides ─────────────────────────

const SPECIFIC_OVERRIDES: Record<string, string[]> = {
  // Dante searches
  "inferno":              ["Dante Inferno Hell painting", "Blake Dante drawing engraving"],
  "purgatorio":           ["Dante Purgatorio painting Italian", "Paradise medieval heaven painting"],
  "paradiso":             ["Dante Paradiso heaven light", "celestial paradise medieval painting"],
  // Shakespeare
  "hamlet":               ["Hamlet Shakespeare painting", "Ophelia painting", "Danish prince melancholy"],
  "macbeth":              ["Macbeth Shakespeare witches painting", "Scottish castle night dark"],
  "othello":              ["Othello Desdemona painting", "Venetian Moor portrait Renaissance"],
  "the-tempest":          ["Prospero Ariel Shakespeare painting", "island storm spirit Renaissance"],
  "don-quixote":          ["Don Quixote windmill painting", "knight errant Spanish painting"],
  "paradise-lost":        ["Satan fallen angel painting", "Milton Paradise Lost Blake engraving", "rebel angel heaven battle"],
  // Roman specific
  "the-aeneid":           ["Aeneas Dido painting", "Aeneas Troy Roman painting", "Dido Carthage painting"],
  "metamorphoses":        ["Apollo Daphne painting", "Ovid mythology transformation painting", "Narcissus Echo painting"],
  "de-bello-gallico":     ["Roman legions battle painting", "Julius Caesar Roman portrait"],
  "confessions":          ["Saint Augustine painting", "early Christian conversion painting"],
  "meditations":          ["Marcus Aurelius Roman emperor", "Stoic philosopher Roman bust portrait"],
  "letters-to-lucilius":  ["Seneca Roman philosopher painting", "Roman philosopher writing portrait"],
  "de-rerum-natura":      ["Lucretius Roman nature philosophy", "Roman pastoral landscape ancient"],
  // Ancient Greek specific
  "the-republic":         ["Plato Academy Athens painting", "Greek philosopher teaching fresco"],
  "symposium":            ["Plato Symposium banquet Greek", "ancient Greek drinking party"],
  "apology":              ["Death of Socrates painting", "Socrates hemlock prison painting"],
  "nicomachean-ethics":   ["Aristotle philosopher Greek painting", "School of Athens philosophy"],
  "the-histories":        ["Battle of Marathon Persian Wars painting", "Persian Wars Greek battle"],
  "the-persians":         ["Battle of Salamis ancient painting", "Persian navy Greek battle"],
  "anabasis":             ["Greek mercenaries march ancient", "ancient Greek soldiers sea"],
  // English Romantic
  "pride-and-prejudice":  ["Regency ball scene painting English", "Jane Austen portrait English", "English countryside manor painting"],
  "frankenstein":         ["Gothic laboratory painting", "creature night storm Romantic painting", "scientist experiment Romantic dark"],
  "les-miserables":       ["French revolution barricade painting", "Paris poor 19th century", "miserable peasants France painting"],
  "the-count-of-monte-cristo": ["Mediterranean sea prison 19th century", "French Romantic adventure dueling"],
  // Victorian
  "jane-eyre":            ["Victorian governess woman painting", "Bronte Yorkshire moor woman portrait", "Victorian woman reading interior"],
  "wuthering-heights":    ["Yorkshire moors stormy landscape painting", "Romantic moor wind dark", "English moors Bronte landscape"],
  "great-expectations":   ["Victorian orphan boy England Dickens", "Victorian London river marshes painting"],
  "a-tale-of-two-cities": ["French Revolution guillotine painting", "Revolution Paris London sacrifice painting"],
  "the-picture-of-dorian-gray": ["Victorian portrait handsome young man", "aesthetic movement portrait Victorian painting", "Oscar Wilde aesthete portrait"],
  "the-importance-of-being-earnest": ["Victorian parlor scene comedy", "English drawing room Victorian painting"],
  "a-dolls-house":        ["Ibsen Scandinavian woman painting", "Victorian woman domestic interior Norway painting"],
  // Russian
  "war-and-peace":        ["Napoleonic war Russia 1812 painting", "Russian winter battle landscape painting"],
  "anna-karenina":        ["Russian aristocratic woman 19th century portrait", "Russian railway winter painting"],
  "crime-and-punishment": ["Dostoevsky St Petersburg Russia dark painting", "Russian 19th century poverty interior"],
  "the-brothers-karamazov": ["Russian Orthodox religious painting", "Dostoevsky Russian church interior painting"],
  "eugene-onegin":        ["Pushkin Russian Romantic portrait", "Russian winter duel Romantic painting"],
  "the-cherry-orchard":   ["Chekhov Russian orchard estate autumn", "Russian country house autumn landscape"],
  "notes-from-underground": ["solitary figure interior dark Russian painting", "Dostoevsky underground Russia isolation"],
  // American
  "moby-dick":            ["whale ship hunting ocean painting", "American whaling ship sea storm painting"],
  "little-women":         ["American Civil War era women domestic", "19th century American girls family portrait"],
  "the-scarlet-letter":   ["Puritan New England colonial scene", "Hawthorne Puritan guilt woman forest"],
  "adventures-of-huckleberry-finn": ["Mississippi River raft American painting", "Mark Twain river boy painting"],
  "walden":               ["New England forest pond nature painting", "Thoreau Walden Pond landscape American"],
  "the-great-gatsby":     ["Art Deco 1920s American Jazz party", "1920s American mansion Long Island painting"],
  "the-call-of-the-wild": ["Alaskan wilderness sled dog wolf", "Klondike Gold Rush Yukon wilderness painting"],
  "the-adventures-of-tom-sawyer": ["Mississippi River boy adventure 19th century", "American frontier river boy Twain"],
  // French
  "madame-bovary":        ["French provincial bourgeois woman 19th century", "Realist French woman interior painting"],
  "les-fleurs-du-mal":    ["Symbolist French painting flowers woman", "Paris Symbolist decadent beauty dark"],
  "germinal":             ["coal miners working class 19th century painting", "French miners labor Zola industrial"],
  "the-three-musketeers": ["French musketeers sword 17th century", "Louis XIII court Baroque French cavaliers painting"],
  "pere-goriot":          ["Balzac Paris boarding house Realist painting", "French 19th century boarding house social painting"],
  "the-stranger":         ["Algeria Mediterranean sun heat painting", "North Africa French colonial landscape"],
  // Modernist
  "ulysses":              ["Dublin Ireland early 20th century painting", "Irish cityscape modernist painting"],
  "mrs-dalloway":         ["London 1920s woman Bloomsbury modernist", "English post-war interior woman painting"],
  "the-metamorphosis":    ["Expressionist figure alienation dark room painting", "German Expressionist Kafka transformation"],
  "the-trial":            ["Kafka bureaucracy Expressionist dark corridor", "Expressionist isolated figure dark painting"],
  "heart-of-darkness":    ["Congo river jungle dark Africa painting", "African river colonial darkness painting"],
  "to-the-lighthouse":    ["lighthouse sea coast painting", "Scottish island sea modernist Post-Impressionist"],
  "thus-spoke-zarathustra": ["mountain prophet solitary figure Romantic painting", "Nietzsche mountain Alpine lone figure"],
  // Eastern
  "bhagavad-gita":        ["Krishna Arjuna chariot battle Indian painting", "Hindu Bhagavad Gita miniature painting"],
  "the-art-of-war":       ["Chinese ancient military strategy scroll painting", "Chinese warrior ancient scroll"],
  "tao-te-ching":         ["Chinese landscape ink mountain river Taoist", "Chinese classical ink painting mountain"],
  "the-tale-of-genji":    ["Genji Japanese court painting Heian scroll", "Japanese court Heian period Lady Genji"],
  "rubaiyat-of-omar-khayyam": ["Persian miniature painting wine garden", "Omar Khayyam Persian garden love miniature"],
  "the-masnavi":          ["Rumi Sufi whirling dervish Persian", "Islamic Sufi Persian mystical painting miniature"],
  // Enlightenment
  "candide":              ["Voltaire 18th century French painting Rococo", "French 18th century satirical painting"],
  "gullivers-travels":    ["18th century seafarer voyage painting English", "Jonathan Swift satirical 18th century scene"],
  "the-social-contract":  ["French Revolution liberty painting 18th century", "Rousseau Enlightenment French portrait"],
  "discourse-on-method":  ["Descartes philosopher 17th century French portrait", "17th century French philosopher portrait"],
  "the-wealth-of-nations": ["18th century British merchant trade painting", "Scottish Enlightenment 18th century market"],
}

// Broad fallback queries by tradition
const TRADITION_BROAD_QUERIES: Record<string, string[]> = {
  "Ancient Greek": [
    "ancient Greek red figure vase painting",
    "Greek amphora mythology scene",
    "Greek mythology fresco painting ancient",
    "ancient Greek athlete hero vase",
    "Attic black figure vase",
  ],
  "Roman": [
    "ancient Roman fresco painting",
    "Roman portrait bust marble painting",
    "Roman mythology painting ancient",
    "Pompeii fresco ancient Roman",
    "Roman mosaic ancient Italy",
  ],
  "Medieval European": [
    "Italian gold ground panel painting medieval",
    "medieval illuminated manuscript miniature",
    "Italian Renaissance gold tempera panel painting",
    "Gothic altarpiece medieval panel painting",
    "medieval Italian devotional painting",
  ],
  "Renaissance": [
    "Renaissance portrait oil painting Italian",
    "Italian Renaissance oil painting panel",
    "Flemish Renaissance oil painting portrait",
    "Dutch Renaissance painting portrait",
    "Northern Renaissance portrait panel painting",
  ],
  "Enlightenment": [
    "18th century British portrait painting",
    "French Rococo painting 18th century",
    "English portrait 18th century oil painting",
    "Grand Tour portrait 18th century painting",
    "18th century European landscape oil painting",
  ],
  "Romantic": [
    "Romantic landscape painting 19th century",
    "English Romantic landscape oil painting",
    "19th century Romantic figure painting",
    "Pre-Raphaelite painting woman portrait",
    "Romantic era woman portrait oil painting",
  ],
  "Victorian": [
    "Victorian portrait oil painting English",
    "Pre-Raphaelite woman painting Victorian",
    "19th century British portrait woman oil painting",
    "Victorian genre scene painting English",
    "Victorian England landscape oil painting",
  ],
  "Russian": [
    "Russian painting 19th century oil",
    "Russian realist painting 19th century",
    "winter landscape Russian painting",
    "Russian portrait 19th century oil painting",
    "Russian icon painting orthodox",
  ],
  "American": [
    "American landscape 19th century oil painting",
    "Hudson River School landscape painting",
    "American portrait 19th century oil painting",
    "American genre scene painting 19th century",
    "Winslow Homer American painting",
  ],
  "French": [
    "French Impressionist painting oil",
    "French Realist painting 19th century oil",
    "19th century French oil painting woman",
    "Barbizon School French landscape painting",
    "French painting Salon 19th century",
  ],
  "Modernist": [
    "Post-Impressionist painting oil",
    "early 20th century modernist painting",
    "Expressionist painting oil 20th century",
    "Fauvism modernist painting 20th century",
    "Cézanne modernist painting",
  ],
  "Eastern": [
    "Japanese ink painting scroll",
    "Chinese landscape painting scroll classical",
    "Persian miniature painting Islamic",
    "Indian miniature painting Mughal",
    "Japanese Edo period painting scroll",
  ],
}

// ── HTTP helpers ──────────────────────────────────────────────────────────

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    function doGet(u: string, redirects = 0) {
      if (redirects > 5) { reject(new Error("Too many redirects")); return }
      https.get(u, { timeout: 10000 }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doGet(res.headers.location, redirects + 1); return
        }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
        let data = ""
        res.on("data", (c: string) => (data += c))
        res.on("end", () => resolve(data))
        res.on("error", reject)
      }).on("error", reject).on("timeout", () => reject(new Error("timeout")))
    }
    doGet(url)
  })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

// ── Met API helpers ───────────────────────────────────────────────────────

interface MetSearchResult { total: number; objectIDs: number[] | null }
interface MetObject {
  objectID: number; title: string; artistDisplayName: string;
  objectDate: string; primaryImage: string; primaryImageSmall: string;
  department: string; medium: string; objectURL: string;
  creditLine?: string; isPublicDomain: boolean
}

async function metSearch(query: string): Promise<number[]> {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&q=${encodeURIComponent(query)}`
  try {
    const raw = await httpsGet(url)
    const data: MetSearchResult = JSON.parse(raw)
    return data.objectIDs ?? []
  } catch { return [] }
}

async function metGetObject(id: number): Promise<MetObject | null> {
  try {
    const raw = await httpsGet(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
    const obj: MetObject = JSON.parse(raw)
    if (!obj.isPublicDomain) return null
    // Accept if either primaryImage or primaryImageSmall is available
    if (!obj.primaryImage && !obj.primaryImageSmall) return null
    // Normalize: use primaryImageSmall as fallback for imageUrl
    if (!obj.primaryImage && obj.primaryImageSmall) {
      obj.primaryImage = obj.primaryImageSmall
    }
    return obj
  } catch { return null }
}

function scoreObject(obj: MetObject, keywords: string[]): number {
  let score = 15  // base: has image (already checked)
  const med = (obj.medium ?? "").toLowerCase()
  const isPainting = /oil|tempera|watercolor|gouache|ink|fresco|pastel|acrylic/i.test(med)
  const is3D = /bronze|marble|ceramic|glass|textile|terracotta|wood|ivory|silver|gold|stone|granite/i.test(med)
  const isPhoto = /photograph/i.test(med)
  if (isPainting) score += 20
  if (is3D) score -= 5   // prefer flat art but allow 3D artifacts for ancient traditions
  if (isPhoto) score -= 20
  const haystack = `${obj.title} ${obj.artistDisplayName}`.toLowerCase()
  for (const kw of keywords) {
    if (haystack.includes(kw.toLowerCase())) score += 8
  }
  return Math.max(0, score)
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const candidatesPath = path.join(__dirname, "cover-art-candidates.json")
  const existing: Record<string, any[]> = fs.existsSync(candidatesPath)
    ? JSON.parse(fs.readFileSync(candidatesPath, "utf-8"))
    : {}

  const missing = BOOKS.filter(b => !existing[b.bookId] || existing[b.bookId].length === 0)
  console.log(`Found ${missing.length} books needing art...`)

  let found = 0; let failed = 0; let i = 0
  for (const book of missing) {
    i++
    const specificQueries = SPECIFIC_OVERRIDES[book.bookId] ?? []
    const broadQueries = TRADITION_BROAD_QUERIES[book.tradition] ?? []
    const allQueries = [...specificQueries, ...broadQueries]
    const keywords = [book.author.split(" ").pop()!, book.tradition, ...book.title.split(" ").slice(0, 2)]
      .map(s => s!.toLowerCase()).filter(Boolean)

    let candidates: any[] = []

    for (const query of allQueries) {
      if (candidates.length >= 3) break
      await sleep(80)
      const ids = await metSearch(query)
      if (!ids.length) continue

      // Sample up to 15 IDs from the results (spread across the result set)
      const sampleIndices = [0, 1, 2, 3, 4,
        Math.floor(ids.length * 0.2), Math.floor(ids.length * 0.4),
        Math.floor(ids.length * 0.6), Math.floor(ids.length * 0.8),
        ids.length - 1, ids.length - 2, ids.length - 3, ids.length - 4, ids.length - 5,
      ].filter(i => i >= 0 && i < ids.length)
      const sample = [...new Set(sampleIndices)].map(i => ids[i]).slice(0, 15)

      for (const id of sample) {
        await sleep(50)
        const obj = await metGetObject(id)
        if (!obj) continue
        const score = scoreObject(obj, keywords)
        if (score >= 10) {  // very permissive — any image that's not a photo
          candidates.push({
            objectId: obj.objectID,
            title: obj.title,
            artist: obj.artistDisplayName,
            date: obj.objectDate,
            imageUrl: obj.primaryImage,
            thumbnailUrl: obj.primaryImageSmall,
            department: obj.department,
            medium: obj.medium,
            creditLine: obj.creditLine ?? "",
            objectUrl: obj.objectURL,
            source: "met",
            score,
          })
          if (candidates.length >= 3) break
        }
      }
    }

    // Sort by score
    candidates.sort((a, b) => b.score - a.score)

    if (candidates.length > 0) {
      existing[book.bookId] = candidates
      found++
      const c = candidates[0]
      console.log(`[${String(i).padStart(3)}/${missing.length}] ✓ ${book.bookId.padEnd(32)} "${c.title}" by ${c.artist || "Unknown"} (score: ${c.score})`)
    } else {
      existing[book.bookId] = []
      failed++
      console.log(`[${String(i).padStart(3)}/${missing.length}] ✗ ${book.bookId.padEnd(32)} no art found`)
    }

    // Save progress after each book
    fs.writeFileSync(candidatesPath, JSON.stringify(existing, null, 2))
  }

  console.log(`\nDone. Found: ${found}  Failed: ${failed}`)
}

main().catch(err => { console.error(err); process.exit(1) })
