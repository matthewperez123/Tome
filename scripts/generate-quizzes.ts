/**
 * Tome — Quiz Question Generator
 *
 * Generates quizzes for all books:
 * - 10 questions per book with full content (5 types)
 * - 3 metadata questions per metadata-only book
 *
 * Usage: NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npx tsx scripts/generate-quizzes.ts
 */

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

type Book = {
  id: string
  title: string
  author: string
  year: number | null
  tradition: string
  genre: string | null
  difficulty: string | null
  content_available: boolean
}

// ── Literary knowledge base for question generation ──

const THEMES: Record<string, string[]> = {
  "Pride and Prejudice": ["social class", "marriage", "first impressions", "pride", "prejudice"],
  Frankenstein: ["creation", "responsibility", "isolation", "ambition", "monstrosity"],
  Dracula: ["fear of the unknown", "sexuality", "imperialism", "modernity", "superstition"],
  "The Great Gatsby": ["American Dream", "wealth", "class", "illusion", "corruption"],
  "Crime and Punishment": ["guilt", "redemption", "morality", "poverty", "justice"],
  "Heart of Darkness": ["colonialism", "civilization", "darkness", "imperialism", "morality"],
  "The Metamorphosis": ["alienation", "identity", "family", "absurdity", "isolation"],
  "Great Expectations": ["ambition", "social class", "loyalty", "guilt", "identity"],
  "Jane Eyre": ["independence", "morality", "class", "gender", "religion"],
  "Wuthering Heights": ["passion", "revenge", "social class", "nature", "obsession"],
}

const CHARACTERS: Record<string, string[][]> = {
  "Pride and Prejudice": [["Elizabeth Bennet", "protagonist"], ["Mr. Darcy", "love interest"], ["Mr. Wickham", "antagonist"], ["Jane Bennet", "eldest sister"]],
  Frankenstein: [["Victor Frankenstein", "creator"], ["The Creature", "creation"], ["Elizabeth Lavenza", "Victor's fiancée"], ["Robert Walton", "narrator"]],
  "Great Expectations": [["Pip", "protagonist"], ["Miss Havisham", "recluse"], ["Estella", "love interest"], ["Joe Gargery", "blacksmith"]],
  "Jane Eyre": [["Jane Eyre", "protagonist"], ["Mr. Rochester", "employer"], ["Bertha Mason", "secret wife"], ["St. John Rivers", "clergyman"]],
}

const OPENING_LINES: Record<string, string> = {
  "Pride and Prejudice": "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
  "A Tale of Two Cities": "It was the best of times, it was the worst of times.",
  "Anna Karenina": "Happy families are all alike; every unhappy family is unhappy in its own way.",
  "The Metamorphosis": "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.",
  Frankenstein: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings.",
  "Moby-Dick": "Call me Ishmael.",
  "1984": "It was a bright cold day in April, and the clocks were striking thirteen.",
}

// ── Question generators ──

function generateFullQuestions(book: Book): { type: string; prompt: string; options: string[]; correct_answer: string; explanation: string; order: number }[] {
  const questions: { type: string; prompt: string; options: string[]; correct_answer: string; explanation: string; order: number }[] = []
  let order = 0

  const themes = THEMES[book.title] ?? ["love", "duty", "morality", "society", "identity"]
  const chars = CHARACTERS[book.title]
  const opening = OPENING_LINES[book.title]
  const yearStr = book.year ? (book.year < 0 ? `${Math.abs(book.year)} BC` : `${book.year}`) : "unknown"

  // 3 Multiple Choice
  questions.push({
    type: "multiple_choice", order: ++order,
    prompt: `Who is the author of "${book.title}"?`,
    options: shuffleWithCorrect(book.author, getWrongAuthors(book.author, book.tradition)),
    correct_answer: book.author,
    explanation: `${book.title} was written by ${book.author}.`,
  })

  questions.push({
    type: "multiple_choice", order: ++order,
    prompt: `Which literary tradition does "${book.title}" belong to?`,
    options: shuffleWithCorrect(book.tradition, getWrongTraditions(book.tradition)),
    correct_answer: book.tradition,
    explanation: `${book.title} is classified under the ${book.tradition} tradition.`,
  })

  questions.push({
    type: "multiple_choice", order: ++order,
    prompt: `What is a central theme of "${book.title}"?`,
    options: shuffleWithCorrect(themes[0], [themes.length > 3 ? "time travel" : "cooking", "sports competition", "space exploration"]),
    correct_answer: themes[0],
    explanation: `${themes[0].charAt(0).toUpperCase() + themes[0].slice(1)} is one of the major themes explored in ${book.title}.`,
  })

  // 2 True/False
  questions.push({
    type: "true_false", order: ++order,
    prompt: `"${book.title}" was written in the ${book.tradition} literary period.`,
    options: ["True", "False"],
    correct_answer: "True",
    explanation: `${book.title} by ${book.author} is indeed part of the ${book.tradition} tradition.`,
  })

  questions.push({
    type: "true_false", order: ++order,
    prompt: `"${book.title}" is classified as a ${book.genre ?? "fiction"} work.`,
    options: ["True", "False"],
    correct_answer: "True",
    explanation: `The book is categorized as ${book.genre ?? "fiction"}.`,
  })

  // 2 Fill in the Blank
  if (opening) {
    const words = opening.split(" ")
    const blankIdx = Math.min(Math.floor(words.length / 2), words.length - 1)
    const answer = words[blankIdx].replace(/[.,;:!?"']/g, "")
    const blanked = words.map((w, i) => i === blankIdx ? "_____" : w).join(" ")
    questions.push({
      type: "fill_blank", order: ++order,
      prompt: `Complete the opening line: "${blanked}"`,
      options: [],
      correct_answer: answer.toLowerCase(),
      explanation: `The full opening line is: "${opening}"`,
    })
  } else {
    questions.push({
      type: "fill_blank", order: ++order,
      prompt: `"${book.title}" was written by _____.`,
      options: [],
      correct_answer: book.author.split(" ").pop()?.toLowerCase() ?? book.author.toLowerCase(),
      explanation: `The author is ${book.author}.`,
    })
  }

  questions.push({
    type: "fill_blank", order: ++order,
    prompt: `"${book.title}" belongs to the _____ literary tradition.`,
    options: [],
    correct_answer: book.tradition.toLowerCase(),
    explanation: `${book.title} is part of the ${book.tradition} tradition.`,
  })

  // 2 Matching (stored as JSON pairs)
  if (chars && chars.length >= 3) {
    const matchPairs: Record<string, string> = {}
    chars.slice(0, 3).forEach(([name, role]) => { matchPairs[name] = role })
    questions.push({
      type: "matching", order: ++order,
      prompt: `Match these characters from "${book.title}" to their roles:`,
      options: chars.slice(0, 3).map(([name]) => name),
      correct_answer: JSON.stringify(matchPairs),
      explanation: `${chars.slice(0, 3).map(([n, r]) => `${n} is the ${r}`).join(". ")}.`,
    })
  } else {
    questions.push({
      type: "matching", order: ++order,
      prompt: `Match these works to their literary traditions:`,
      options: [book.title],
      correct_answer: JSON.stringify({ [book.title]: book.tradition }),
      explanation: `${book.title} belongs to the ${book.tradition} tradition.`,
    })
  }

  questions.push({
    type: "matching", order: ++order,
    prompt: `Match the theme to its description in "${book.title}":`,
    options: themes.slice(0, 2),
    correct_answer: JSON.stringify(Object.fromEntries(themes.slice(0, 2).map(t => [t, t]))),
    explanation: `These are central themes explored throughout ${book.title}.`,
  })

  // 1 Short Answer
  questions.push({
    type: "short_answer", order: ++order,
    prompt: `In one or two words, describe the primary genre of "${book.title}".`,
    options: [],
    correct_answer: (book.genre ?? "fiction").toLowerCase(),
    explanation: `${book.title} is primarily a ${book.genre ?? "fiction"} work.`,
  })

  return questions
}

function generateMetadataQuestions(book: Book): { type: string; prompt: string; options: string[]; correct_answer: string; explanation: string; order: number }[] {
  const questions: { type: string; prompt: string; options: string[]; correct_answer: string; explanation: string; order: number }[] = []

  // Author identification
  questions.push({
    type: "multiple_choice", order: 1,
    prompt: `Who wrote "${book.title}"?`,
    options: shuffleWithCorrect(book.author, getWrongAuthors(book.author, book.tradition)),
    correct_answer: book.author,
    explanation: `${book.title} was written by ${book.author}.`,
  })

  // Era placement
  const eraLabel = getEraLabel(book.year)
  questions.push({
    type: "multiple_choice", order: 2,
    prompt: `In which era was "${book.title}" written?`,
    options: shuffleWithCorrect(eraLabel, getWrongEras(eraLabel)),
    correct_answer: eraLabel,
    explanation: `${book.title} (${book.year ?? "date unknown"}) belongs to the ${eraLabel} era.`,
  })

  // Genre classification
  questions.push({
    type: "true_false", order: 3,
    prompt: `"${book.title}" belongs to the ${book.tradition} literary tradition.`,
    options: ["True", "False"],
    correct_answer: "True",
    explanation: `${book.title} by ${book.author} is part of the ${book.tradition} tradition.`,
  })

  return questions
}

// ── Helpers ──

function shuffleWithCorrect(correct: string, wrong: string[]): string[] {
  const all = [correct, ...wrong.slice(0, 3)]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

const AUTHORS_BY_TRADITION: Record<string, string[]> = {
  "Ancient Greek": ["Homer", "Sophocles", "Plato", "Aristotle", "Euripides"],
  Roman: ["Virgil", "Ovid", "Seneca", "Marcus Aurelius", "Cicero"],
  "Medieval European": ["Dante", "Chaucer", "Boccaccio", "Malory"],
  Renaissance: ["Shakespeare", "Cervantes", "Machiavelli", "Milton"],
  Enlightenment: ["Voltaire", "Swift", "Defoe", "Rousseau"],
  Romantic: ["Austen", "Shelley", "Hugo", "Goethe", "Melville"],
  Victorian: ["Dickens", "Wilde", "Hardy", "Eliot", "Brontë"],
  Russian: ["Dostoevsky", "Tolstoy", "Chekhov", "Gogol", "Turgenev"],
  American: ["Fitzgerald", "Twain", "Hawthorne", "Wharton", "Thoreau"],
  French: ["Flaubert", "Zola", "Balzac", "Proust", "Camus"],
  Modernist: ["Joyce", "Woolf", "Kafka", "Conrad", "Hemingway"],
  "Post-Colonial": ["Conrad", "Kipling", "Forster", "Achebe"],
  Eastern: ["Sun Tzu", "Laozi", "Confucius", "Murasaki Shikibu"],
  Contemporary: ["Orwell", "Huxley", "Steinbeck", "Bradbury", "Golding"],
}

function getWrongAuthors(correct: string, tradition: string): string[] {
  const pool = Object.values(AUTHORS_BY_TRADITION).flat()
  return pool.filter(a => a !== correct && !correct.includes(a)).slice(0, 3)
}

function getWrongTraditions(correct: string): string[] {
  const all = Object.keys(AUTHORS_BY_TRADITION)
  return all.filter(t => t !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
}

function getEraLabel(year: number | null): string {
  if (!year) return "Modern"
  if (year < 500) return "Ancient"
  if (year < 1400) return "Medieval"
  if (year < 1700) return "Renaissance"
  if (year < 1800) return "Enlightenment"
  if (year < 1950) return "Modern"
  return "Contemporary"
}

function getWrongEras(correct: string): string[] {
  const all = ["Ancient", "Medieval", "Renaissance", "Enlightenment", "Modern", "Contemporary"]
  return all.filter(e => e !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
}

// ── Main ──

async function main() {
  console.log("Fetching books...")
  const books = (await supabaseQuery("books?select=id,title,author,year,tradition,genre,difficulty,content_available&order=title")) as Book[]
  console.log(`Found ${books.length} books`)

  const fullBooks = books.filter(b => b.content_available)
  const metaBooks = books.filter(b => !b.content_available)
  console.log(`${fullBooks.length} with content, ${metaBooks.length} metadata-only`)

  let quizCount = 0
  let questionCount = 0

  // Process full books (10 questions each)
  for (const book of fullBooks) {
    try {
      // Check if quiz already exists
      const existing = await supabaseQuery(`quizzes?book_id=eq.${book.id}&select=id`)
      if ((existing as { id: string }[]).length > 0) {
        console.log(`  SKIP: ${book.title} (quiz exists)`)
        continue
      }

      const quizId = crypto.randomUUID()
      await supabaseQuery("quizzes", {
        method: "POST",
        body: JSON.stringify({
          id: quizId,
          book_id: book.id,
          title: `${book.title}: Comprehension Quiz`,
          difficulty: book.difficulty ?? "intermediate",
        }),
      })

      const questions = generateFullQuestions(book)
      await supabaseQuery("questions", {
        method: "POST",
        body: JSON.stringify(questions.map(q => ({ ...q, quiz_id: quizId }))),
      })

      quizCount++
      questionCount += questions.length
      console.log(`  OK: ${book.title} — ${questions.length} questions`)
    } catch (err) {
      console.log(`  ERROR: ${book.title} — ${err}`)
    }
  }

  // Process metadata-only books (3 questions each) — batch by 20
  const BATCH = 20
  for (let i = 0; i < metaBooks.length; i += BATCH) {
    const batch = metaBooks.slice(i, i + BATCH)
    const quizzes: { id: string; book_id: string; title: string; difficulty: string }[] = []
    const allQuestions: { quiz_id: string; type: string; prompt: string; options: string[]; correct_answer: string; explanation: string; order: number }[] = []

    for (const book of batch) {
      const quizId = crypto.randomUUID()
      quizzes.push({
        id: quizId,
        book_id: book.id,
        title: `${book.title}: Quick Quiz`,
        difficulty: "beginner",
      })
      const qs = generateMetadataQuestions(book)
      for (const q of qs) {
        allQuestions.push({ ...q, quiz_id: quizId })
      }
    }

    try {
      await supabaseQuery("quizzes", { method: "POST", body: JSON.stringify(quizzes) })
      // Insert questions in sub-batches of 50
      for (let j = 0; j < allQuestions.length; j += 50) {
        await supabaseQuery("questions", { method: "POST", body: JSON.stringify(allQuestions.slice(j, j + 50)) })
      }
      quizCount += batch.length
      questionCount += allQuestions.length
      console.log(`  Batch ${Math.floor(i / BATCH) + 1}: ${batch.length} metadata quizzes, ${allQuestions.length} questions`)
    } catch (err) {
      console.log(`  Batch ERROR: ${err}`)
    }
  }

  console.log(`\nDone! ${quizCount} quizzes, ${questionCount} questions generated.`)
}

main()
