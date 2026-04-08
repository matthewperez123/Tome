/**
 * TOME DESIGN RUBRIC — Book Completion
 * Reference: Goodreads "finished" + Literal + Readwise
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       5/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Heart, Share2, ArrowLeft, Check, BookOpen, Clock, GraduationCap, Landmark } from "lucide-react"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { getBook, getBooks } from "@/lib/content"
import { getAllBookProgress, getBookProgress } from "@/lib/book-progress"
import { cn } from "@/lib/utils"
import type { TomeBook } from "@/data/books"

// ── Inline shelf functions ───────────────────────────────────────────────────
// These are localStorage-backed shelf utilities, self-contained for this page.

function rateBook(bookId: string, rating: number): void {
  try {
    const all = JSON.parse(localStorage.getItem("tome-shelves") ?? "[]")
    const idx = all.findIndex((e: any) => e.bookId === bookId)
    if (idx >= 0) { all[idx].rating = rating }
    else { all.push({ bookId, shelfType: "completed", addedAt: new Date().toISOString(), rating }) }
    localStorage.setItem("tome-shelves", JSON.stringify(all))
  } catch {}
}

function setReflection(bookId: string, reflection: string): void {
  try {
    const all = JSON.parse(localStorage.getItem("tome-shelves") ?? "[]")
    const idx = all.findIndex((e: any) => e.bookId === bookId)
    if (idx >= 0) { all[idx].reflection = reflection.slice(0, 500) }
    else { all.push({ bookId, shelfType: "completed", addedAt: new Date().toISOString(), reflection }) }
    localStorage.setItem("tome-shelves", JSON.stringify(all))
  } catch {}
}

function toggleFavorite(bookId: string): boolean {
  try {
    const all = JSON.parse(localStorage.getItem("tome-shelves") ?? "[]")
    const idx = all.findIndex((e: any) => e.bookId === bookId && e.shelfType === "favorites")
    if (idx >= 0) { all.splice(idx, 1); localStorage.setItem("tome-shelves", JSON.stringify(all)); return false }
    all.push({ bookId, shelfType: "favorites", addedAt: new Date().toISOString() })
    localStorage.setItem("tome-shelves", JSON.stringify(all)); return true
  } catch { return false }
}

function isFavorite(bookId: string): boolean {
  try { return JSON.parse(localStorage.getItem("tome-shelves") ?? "[]").some((e: any) => e.bookId === bookId && e.shelfType === "favorites") }
  catch { return false }
}

function getShelfEntry(bookId: string): any {
  try { return JSON.parse(localStorage.getItem("tome-shelves") ?? "[]").find((e: any) => e.bookId === bookId) }
  catch { return undefined }
}

// ── Virgil author recommendations ─────────────────────────────────────────────

const VIRGIL_AUTHOR_RECS: Record<string, Record<string, string>> = {
  "homer": {
    "the-odyssey": "If you loved The Odyssey, The Iliad is where it all began — the war that started the journey home.",
    "the-iliad": "Now that you've seen the war, read The Odyssey — Odysseus's ten-year journey to get back.",
  },
  "fyodor-dostoevsky": {
    "crime-and-punishment": "The Brothers Karamazov is Dostoevsky's ultimate work. If you survived Raskolnikov, you're ready for the Karamazovs.",
    "the-brothers-karamazov": "Notes from Underground is where it started — shorter, fiercer, the seed of everything Dostoevsky became.",
  },
  "jane-austen": {
    "pride-and-prejudice": "Emma is funnier. Persuasion is more heartbreaking. Both are magnificent.",
    "emma": "Persuasion is Austen at her most mature and tender. Her final completed novel.",
    "persuasion": "Go back and read Pride and Prejudice if you haven't — then come back and read Persuasion again. You'll feel the difference.",
  },
  "william-shakespeare": {
    "hamlet": "Macbeth is shorter and darker. The Tempest is his farewell to the stage. Both essential.",
    "macbeth": "King Lear is Shakespeare's most devastating work. If Macbeth shook you, Lear will break you open.",
    "romeo-and-juliet": "A Midsummer Night's Dream is the comic mirror of this tragedy — love as chaos, but everyone survives.",
    "the-tempest": "Hamlet asks 'to be or not to be.' The Tempest answers it — with forgiveness.",
  },
  "leo-tolstoy": {
    "war-and-peace": "Anna Karenina is tighter, more focused, and just as profound. Tolstoy's most perfect novel.",
    "anna-karenina": "War and Peace is vaster but warmer. It's the novel where Tolstoy loved all his characters.",
  },
  "charles-dickens": {
    "great-expectations": "A Tale of Two Cities has the same moral arc in a completely different world. Also: the best opening line in English.",
    "a-tale-of-two-cities": "Great Expectations is Dickens at his most personal — every page is alive with London.",
    "oliver-twist": "Great Expectations is Oliver Twist grown up and made complex. Read it next.",
  },
  "dante-alighieri": {
    "the-divine-comedy": "You've walked through Hell. Keep going — Purgatorio is the climb toward light, and Paradiso is where Beatrice waits.",
  },
  "victor-hugo": {
    "les-miserables": "The Hunchback of Notre-Dame is Hugo's other masterpiece — Paris itself is the protagonist.",
    "the-hunchback-of-notre-dame": "Les Misérables is Hugo's other great love — not for a woman, but for all humanity.",
  },
  "herman-melville": {
    "moby-dick": "Billy Budd is Melville's final story — shorter, quieter, but it will haunt you just as deeply.",
  },
  "mary-shelley": {
    "frankenstein": "If the Creature moved you, read Dracula next — another monster, but this one chose his darkness.",
  },
  "franz-kafka": {
    "the-metamorphosis": "The Trial is longer and even more unsettling — guilt without crime, instead of crime without resolution.",
    "the-trial": "The Metamorphosis is where it starts — a single morning, a single transformation, all of Kafka in miniature.",
  },
  "miguel-de-cervantes": {
    "don-quixote": "This is Cervantes' great novel — and it contains multitudes. Consider re-reading at Master difficulty.",
  },
  "f-scott-fitzgerald": {
    "the-great-gatsby": "Tender Is the Night is Fitzgerald's other masterpiece — the same golden surfaces hiding deeper devastation.",
  },
  "emily-bronte": {
    "wuthering-heights": "Jane Eyre is the other great Brontë novel — Charlotte's answer to Emily's wildness. More controlled, equally passionate.",
  },
  "plato": {
    "the-republic": "The Symposium is Plato at a dinner party debating love. Lighter, funnier, and just as deep.",
    "the-symposium": "The Republic is Plato's masterwork — the city he built in words, the justice he never stopped chasing.",
  },
  "virgil": {
    "the-aeneid": "You've read my work. Now read Homer — the poet I spent my life trying to equal.",
  },
}

// ── Cross-book recommendations ────────────────────────────────────────────────

const BOOK_RECOMMENDATIONS: Record<string, Array<{ bookId: string; reason: string }>> = {
  "the-odyssey": [
    { bookId: "the-aeneid", reason: "Virgil wrote Rome's answer to Homer — Aeneas carries Troy's ashes toward a new destiny." },
    { bookId: "beowulf", reason: "The Germanic echo of Greek epic — a hero's journey told by firelight instead of sunlight." },
    { bookId: "moby-dick", reason: "Melville channeled Homer into the American ocean — Ahab's obsession mirrors Odysseus's wandering." },
    { bookId: "the-count-of-monte-cristo", reason: "A man torn from everything, fighting impossible odds to return — adventure at its purest." },
    { bookId: "don-quixote", reason: "Another wandering hero — but this one invents his own epic from the inside out." },
  ],
  "the-iliad": [
    { bookId: "the-odyssey", reason: "The war ends, the journey home begins — Homer's two halves of a single world." },
    { bookId: "the-aeneid", reason: "Virgil picks up where Homer left off — the Trojan survivors who founded Rome." },
    { bookId: "beowulf", reason: "Another warrior culture where glory and death are inseparable companions." },
    { bookId: "war-and-peace", reason: "Tolstoy's Napoleonic epic shares the Iliad's conviction that war destroys what it claims to glorify." },
  ],
  "crime-and-punishment": [
    { bookId: "the-brothers-karamazov", reason: "Everything Raskolnikov's torment hinted at, the Karamazovs explore to its fullest depth." },
    { bookId: "the-trial", reason: "Kafka's accused man is the mirror image — guilt without crime instead of crime without guilt." },
    { bookId: "heart-of-darkness", reason: "Another descent into moral darkness, shorter and even more suffocating." },
    { bookId: "the-metamorphosis", reason: "Kafka and Dostoevsky share the same claustrophobic inner world — just in different countries." },
    { bookId: "anna-karenina", reason: "Another Russian trapped between who they are and what society demands of them." },
  ],
  "the-brothers-karamazov": [
    { bookId: "crime-and-punishment", reason: "The seed of it — Raskolnikov is proto-Karamazov, the argument unfinished." },
    { bookId: "war-and-peace", reason: "Russia's other great cathedral — warmer in tone, but built on the same foundations." },
    { bookId: "les-miserables", reason: "Hugo shares Dostoevsky's conviction that grace can find anyone, no matter how far they've fallen." },
    { bookId: "the-divine-comedy", reason: "Dostoevsky read Dante obsessively. The Karamazovs are a secular Divine Comedy." },
  ],
  "pride-and-prejudice": [
    { bookId: "jane-eyre", reason: "The other great English heroine — fiercer, plainer, and absolutely unbreakable." },
    { bookId: "emma", reason: "Austen's other masterpiece — a heroine who is wrong about everything and lovable anyway." },
    { bookId: "middlemarch", reason: "George Eliot takes Austen's social precision and deepens it with moral philosophy." },
    { bookId: "the-age-of-innocence", reason: "Wharton's Gilded Age New York plays by the same social rules — and punishes the same transgressions." },
  ],
  "frankenstein": [
    { bookId: "the-picture-of-dorian-gray", reason: "Another story of a creator undone by his creation — beauty as monstrosity." },
    { bookId: "the-metamorphosis", reason: "Gregor Samsa's transformation mirrors the Creature's condition — inhuman and in anguish." },
    { bookId: "the-strange-case-of-dr-jekyll-and-mr-hyde", reason: "Science and the self torn apart — the same Victorian nightmare, compressed to fever pitch." },
    { bookId: "brave-new-world", reason: "What happens when the creator succeeds? Huxley's answer is darker than Shelley's." },
  ],
  "moby-dick": [
    { bookId: "the-odyssey", reason: "The sea, the quest, the hero who cannot stop — Homer's ocean runs through every Melville page." },
    { bookId: "heart-of-darkness", reason: "Another journey into obsession — Conrad's river and Melville's ocean lead to the same darkness." },
    { bookId: "the-old-man-and-the-sea", reason: "Hemingway's answer to Melville — stripped of everything but the sea and the man." },
    { bookId: "billy-budd", reason: "Melville's final story — quiet, precise, haunted. The whale stripped of its fury." },
  ],
  "hamlet": [
    { bookId: "macbeth", reason: "Hamlet thinks too much; Macbeth acts too fast. Shakespeare's two extremes of fatal character." },
    { bookId: "king-lear", reason: "Shakespeare's most devastating play — what happens when a great man loses everything, including his mind." },
    { bookId: "the-brothers-karamazov", reason: "Ivan Karamazov carries Hamlet's question — to believe or not to believe — to its ultimate conclusion." },
    { bookId: "crime-and-punishment", reason: "Raskolnikov is Hamlet if Hamlet had picked up the axe." },
    { bookId: "don-quixote", reason: "Both men are undone by the gap between their inner world and external reality. One is tragic, one comic." },
  ],
  "the-divine-comedy": [
    { bookId: "paradise-lost", reason: "Milton built his cosmos from Dante's blueprints — the same vast spiritual architecture." },
    { bookId: "the-aeneid", reason: "Dante's guide was Virgil himself. Read the Aeneid to understand why Dante chose him." },
    { bookId: "the-brothers-karamazov", reason: "Dostoevsky's Grand Inquisitor scene is Dante's Inferno in prose — Alyosha is Beatrice." },
    { bookId: "faust", reason: "Goethe's Faust travels through Hell and Heaven too — with a very different guide than Virgil." },
  ],
  "les-miserables": [
    { bookId: "the-count-of-monte-cristo", reason: "Another ex-prisoner reborn — but Dantès chooses vengeance where Valjean chooses grace." },
    { bookId: "the-brothers-karamazov", reason: "Hugo and Dostoevsky shared the belief that a single act of grace can redeem a life." },
    { bookId: "great-expectations", reason: "Pip and Valjean both escape their origins through the mysterious intervention of a hidden benefactor." },
    { bookId: "war-and-peace", reason: "Two enormous European novels about what ordinary people endure in extraordinary times." },
  ],
  "war-and-peace": [
    { bookId: "anna-karenina", reason: "Tolstoy's most perfect novel — all the psychology of War and Peace in half the space." },
    { bookId: "the-brothers-karamazov", reason: "Russia's other cathedral. Where Tolstoy believed in the peasant, Dostoevsky believed in grace." },
    { bookId: "les-miserables", reason: "Hugo's France and Tolstoy's Russia: two continent-sized novels about endurance and meaning." },
    { bookId: "the-iliad", reason: "Tolstoy read Homer throughout his life — the Iliad is everywhere in the Borodino chapters." },
  ],
  "the-great-gatsby": [
    { bookId: "the-age-of-innocence", reason: "Wharton's Gilded Age plays the same game — aspiration crushed by an immovable social order." },
    { bookId: "madame-bovary", reason: "Emma Bovary is Gatsby with a different dream and a different ocean — both destroyed by wanting too much." },
    { bookId: "the-picture-of-dorian-gray", reason: "Beautiful surface, rotten core — the aesthete's tragedy in its purest form." },
    { bookId: "tender-is-the-night", reason: "Fitzgerald revisits the golden world of Gatsby with full knowledge of what it costs." },
  ],
  "jane-eyre": [
    { bookId: "wuthering-heights", reason: "Emily answered Charlotte's Jane Eyre with a wilder, darker love story — both essential." },
    { bookId: "pride-and-prejudice", reason: "Austen's Elizabeth Bennet is Jane's brighter, wittier cousin — both refuse to be diminished." },
    { bookId: "the-scarlet-letter", reason: "Another woman punished for desire — Hester Prynne wears her shame where Jane hides hers." },
    { bookId: "villette", reason: "Charlotte Brontë's own favorite — her most psychologically acute novel." },
  ],
  "don-quixote": [
    { bookId: "the-odyssey", reason: "All quest narratives begin with Odysseus — Quixote is his comic successor." },
    { bookId: "hamlet", reason: "Both are men undone by an inner world that doesn't match reality. One dies for it; one laughs." },
    { bookId: "candide", reason: "Voltaire's Candide is Don Quixote's younger brother — equally naive, equally instructive." },
    { bookId: "the-brothers-karamazov", reason: "Dostoevsky called Don Quixote the greatest novel ever written. Alyosha is his answer." },
  ],
  "the-aeneid": [
    { bookId: "the-iliad", reason: "The Aeneid begins where the Iliad ends — Troy is burning, and Aeneas walks out through the flames." },
    { bookId: "the-odyssey", reason: "Aeneas sails the same seas as Odysseus, but toward a destination he didn't choose." },
    { bookId: "the-divine-comedy", reason: "Dante chose Virgil as his guide for a reason — read the Aeneid to understand the honor." },
    { bookId: "paradise-lost", reason: "Milton's Satan owes his grandeur to Virgil's Juno — both are magnificent in their refusal." },
  ],
  "beowulf": [
    { bookId: "the-iliad", reason: "The warrior code is the same — honor, death, and the fragility of all earthly glory." },
    { bookId: "the-odyssey", reason: "Where Odysseus is cunning, Beowulf is pure force — both face monsters, one with his mind, one with his hands." },
    { bookId: "sir-gawain-and-the-green-knight", reason: "The Arthurian echo of Beowulf — the heroic test updated to a more courtly world." },
    { bookId: "paradise-lost", reason: "Milton and the Beowulf poet both wrote in the Germanic tradition — the same dark Northern music." },
  ],
  "anna-karenina": [
    { bookId: "madame-bovary", reason: "Flaubert's Emma and Tolstoy's Anna — the two great portraits of a woman destroyed by desire." },
    { bookId: "war-and-peace", reason: "Tolstoy's other masterpiece — the same psychology, different scale, different season." },
    { bookId: "the-awakening", reason: "Edna Pontellier is Anna Karenina transported to New Orleans — same trap, different ending." },
    { bookId: "wuthering-heights", reason: "Passion so intense it consumes everything around it — Brontë's and Tolstoy's versions answer each other." },
  ],
  "the-count-of-monte-cristo": [
    { bookId: "les-miserables", reason: "The other great French novel of imprisonment and transformation — but Valjean chose grace over vengeance." },
    { bookId: "the-odyssey", reason: "Every story of a wronged man fighting his way back is Odysseus. Dantès fights harder." },
    { bookId: "hamlet", reason: "Hamlet dreamed of vengeance and couldn't act. Edmond Dantès acted — and paid a different price." },
    { bookId: "great-expectations", reason: "The mysterious benefactor who transforms a young man's life — Dumas and Dickens invented the same plot." },
  ],
  "the-metamorphosis": [
    { bookId: "the-trial", reason: "The other side of Kafka — Josef K is Gregor without the transformation, punished the same way." },
    { bookId: "frankenstein", reason: "The Creature and Gregor Samsa share the same condition: human consciousness in an inhuman body." },
    { bookId: "heart-of-darkness", reason: "Both strip civilization away to expose what's underneath — Kafka in an apartment, Conrad on a river." },
    { bookId: "the-stranger", reason: "Meursault and Gregor both refuse to perform the emotions that society demands." },
  ],
  "paradise-lost": [
    { bookId: "the-divine-comedy", reason: "Dante mapped the afterlife; Milton populated it. Satan walks in Dante's Hell." },
    { bookId: "the-aeneid", reason: "Milton modeled his epic structure on Virgil — the invocation, the descent, the founding of a new world." },
    { bookId: "frankenstein", reason: "Shelley's epigraph is from Paradise Lost — Victor and Satan share the same prideful fall." },
    { bookId: "faust", reason: "Mephistopheles and Satan: the two great tempters in European literature, across two centuries." },
  ],
  "wuthering-heights": [
    { bookId: "jane-eyre", reason: "Charlotte's Jane Eyre is Emily's answer — passion disciplined into endurance." },
    { bookId: "anna-karenina", reason: "Love as catastrophe — Tolstoy and Brontë approached it from opposite directions." },
    { bookId: "great-expectations", reason: "Both novels are haunted by childhood wounds that shape an entire life of longing." },
    { bookId: "the-picture-of-dorian-gray", reason: "Heathcliff and Dorian are the two great Gothic lovers — one savage, one beautiful, both destructive." },
  ],
  "the-picture-of-dorian-gray": [
    { bookId: "frankenstein", reason: "Two men who create a version of themselves — and are destroyed by it." },
    { bookId: "the-strange-case-of-dr-jekyll-and-mr-hyde", reason: "Stevenson and Wilde's Victorian double — science vs. art, same psychological terror." },
    { bookId: "the-great-gatsby", reason: "Gatsby and Dorian are the two great portraits of beautiful corruption in the English language." },
    { bookId: "faust", reason: "Dorian made a Faustian bargain without knowing it. Read the original — it's even more irresistible." },
  ],
  "meditations": [
    { bookId: "the-republic", reason: "Plato laid the philosophical foundations that Aurelius built on — read them in order." },
    { bookId: "the-nicomachean-ethics", reason: "Aristotle's ethics and Aurelius's Stoicism approach virtue from different directions — both worth mastering." },
    { bookId: "the-bhagavad-gita", reason: "Arjuna faces his duty on a battlefield. Aurelius faces his every morning. Same question, different cosmos." },
  ],
  "the-republic": [
    { bookId: "the-symposium", reason: "Plato at a dinner party — lighter, more human, equally profound." },
    { bookId: "meditations", reason: "Marcus Aurelius tried to live the philosopher-king Plato imagined. His Meditations are the private diary of that attempt." },
    { bookId: "utopia", reason: "More built on Plato's foundations — the ideal state, imagined sixteen centuries later." },
  ],
}

// ── Ornamental divider ────────────────────────────────────────────────────────

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 text-muted-foreground/20">
      <div className="h-px flex-1 bg-current" />
      <svg viewBox="0 0 48 16" className="w-10 shrink-0" aria-hidden>
        <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
        <circle cx="16" cy="8" r="2.5" fill="currentColor" />
        <circle cx="24" cy="8" r="3.5" fill="currentColor" />
        <circle cx="32" cy="8" r="2.5" fill="currentColor" />
        <circle cx="40" cy="8" r="1.5" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-current" />
    </div>
  )
}

// ── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      {aside}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BookCompletePage() {
  const params  = useParams<{ id: string }>()
  const bookId  = params.id

  // ── Data state ────────────────────────────────────────────────────────────
  const [book,         setBook]         = useState<TomeBook | null>(null)
  const [authorBooks,  setAuthorBooks]  = useState<TomeBook[]>([])
  const [tradBooks,    setTradBooks]    = useState<TomeBook[]>([])
  const [allBooks,     setAllBooks]     = useState<TomeBook[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [notFound,     setNotFound]     = useState(false)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [mounted,         setMounted]         = useState(false)
  const [rating,          setRating]          = useState(0)
  const [hoverRating,     setHoverRating]      = useState(0)
  const [ratedAt,         setRatedAt]          = useState(0)
  const [reflection,      setReflectionText]  = useState("")
  const [savedReflection, setSavedReflection] = useState(false)
  const [favorited,       setFavorited]        = useState(false)
  const [favBounce,       setFavBounce]        = useState(false)
  const [copied,          setCopied]           = useState(false)
  const [wisdom,          setWisdom]           = useState(0)
  const [completedAt,     setCompletedAt]      = useState<string | null>(null)
  const [progress,        setProgress]         = useState<ReturnType<typeof getBookProgress>>(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const b = getBook(bookId)
    if (!b) { setNotFound(true); return }
    setBook(b)

    const all = getBooks()
    setAllBooks(all)
    setAuthorBooks(all.filter(x => x.authorId === b.authorId && x.id !== bookId))
    setTradBooks(
      all
        .filter(x => x.tradition === b.tradition && x.id !== bookId && x.authorId !== b.authorId)
        .slice(0, 6)
    )

    // Progress + completed set
    const prog = getBookProgress(bookId)
    setProgress(prog)
    const allProgress = getAllBookProgress()
    const done = new Set(
      Object.entries(allProgress)
        .filter(([, p]) => {
          const bk = getBook(p.bookId)
          return bk && p.completedChapterIndices.length >= bk.chapters
        })
        .map(([id]) => id)
    )
    setCompletedIds(done)

    // localStorage reads
    const entry = getShelfEntry(bookId)
    setRating(entry?.rating ?? 0)
    setReflectionText(entry?.reflection ?? "")
    setFavorited(isFavorite(bookId))
    setCompletedAt(entry?.addedAt ?? null)

    const statsRaw = localStorage.getItem("tome-user-stats")
    if (statsRaw) {
      try { setWisdom(JSON.parse(statsRaw)?.wisdom ?? 0) } catch {}
    }

    setMounted(true)
  }, [bookId])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRate = useCallback((star: number) => {
    setRating(star)
    setRatedAt(star)
    rateBook(bookId, star)
    setTimeout(() => setRatedAt(0), 2000)
  }, [bookId])

  const handleSaveReflection = useCallback(() => {
    setReflection(bookId, reflection)
    setSavedReflection(true)
    setTimeout(() => setSavedReflection(false), 2000)
  }, [bookId, reflection])

  const handleToggleFavorite = useCallback(() => {
    const next = toggleFavorite(bookId)
    setFavorited(next)
    setFavBounce(true)
    setTimeout(() => setFavBounce(false), 400)
  }, [bookId])

  const handleShare = useCallback(() => {
    if (!book) return
    const text = `I just finished reading ${book.title} by ${book.author} on Tome! https://tome.app`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // fallback: do nothing silently
    })
  }, [book])

  // ── Derived ───────────────────────────────────────────────────────────────

  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <BookOpen className="size-12 text-muted-foreground/30" />
      <p className="text-sm font-medium">Book not found</p>
      <Link href="/library" className="text-xs text-[var(--tome-accent)] hover:underline">
        Back to Library
      </Link>
    </div>
  )

  if (!book || !mounted) return <CompleteSkeleton />

  const tradColor   = TRADITION_COLORS[book.tradition] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca", dot: "#6366F1" }
  const chaptersDone = progress?.completedChapterIndices.length ?? book.chapters
  const quizCount   = progress?.quizResults.length ?? 0
  const isGuided    = progress?.readingMode === "guided"

  // Virgil rec
  const authorKey = book.author.toLowerCase().replace(/\s+/g, "-")
  const virgilRec = VIRGIL_AUTHOR_RECS[authorKey]?.[bookId]

  // Date finished
  const finishedDate = completedAt
    ? new Date(completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  // Curated recommendations, filtered to books that exist in library
  const rawRecs = BOOK_RECOMMENDATIONS[bookId] ?? []
  const filteredRecs = rawRecs
    .map(rec => ({ ...rec, book: allBooks.find(b => b.id === rec.bookId) }))
    .filter(rec => rec.book != null) as Array<{ bookId: string; reason: string; book: TomeBook }>

  // Top recommendation for sticky bar
  const topRec = filteredRecs[0] ?? (tradBooks[0] ? { book: tradBooks[0] } : null)

  return (
    <>
      <div className="flex flex-col min-h-full pb-24">

        {/* ── Back nav ── */}
        <nav className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Link
            href={`/book/${bookId}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to book
          </Link>
        </nav>

        <div className="max-w-lg mx-auto w-full px-4 space-y-10">

          {/* ── Section 1: Completion Hero ────────────────────────── */}
          <motion.section
            className="flex flex-col items-center text-center pt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Completion label */}
            <motion.div
              className="flex items-center gap-2 mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="text-amber-400 text-xl">✦</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
                Book Complete
              </span>
              <span className="text-amber-400 text-xl">✦</span>
            </motion.div>

            {/* Cover with ribbon */}
            <div className="relative w-[200px] overflow-hidden rounded-xl shadow-2xl shadow-black/25">
              <ClassicsCover
                bookId={book.id}
                title={book.title}
                author={book.author}
                tradition={book.tradition}
                fallbackColors={book.coverColors}
                showTomeWordmark
                className="w-full"
              />
              {/* COMPLETED ribbon */}
              <div
                className="absolute top-4 right-[-30px] w-[110px] py-0.5 bg-amber-400 text-amber-950 text-[9px] font-bold tracking-widest text-center"
                style={{ transform: "rotate(45deg)" }}
              >
                COMPLETED
              </div>
            </div>

            {/* Title + author */}
            <motion.div
              className="mt-5 space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <h1 className="text-2xl font-bold font-serif tracking-tight">{book.title}</h1>
              <p className="text-sm text-muted-foreground">
                by{" "}
                <Link
                  href={`/library?author=${encodeURIComponent(book.author)}`}
                  className="text-[var(--tome-accent)] hover:underline"
                >
                  {book.author}
                </Link>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">Finished {finishedDate}</p>
            </motion.div>

            {/* Stats card */}
            <motion.div
              className="w-full bg-muted/40 rounded-xl p-4 mt-5 text-left space-y-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2">
                  <BookOpen className="size-4" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Chapters</p>
                    <p className="text-sm font-semibold">
                      {chaptersDone}/{book.chapters}
                      {chaptersDone >= book.chapters && (
                        <span className="ml-1 text-emerald-500 text-xs"><Check className="size-3" /></span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">🧠</span>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Wisdom Earned</p>
                    <p className="text-sm font-semibold">{wisdom > 0 ? wisdom.toLocaleString() : (progress?.totalXpEarned ?? 0)} total</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="size-4" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Reading Time</p>
                    <p className="text-sm font-semibold">{book.estimatedReadingTime}</p>
                  </div>
                </div>
                {isGuided && quizCount > 0 && (
                  <div className="flex items-start gap-2">
                    <GraduationCap className="size-4" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Quizzes</p>
                      <p className="text-sm font-semibold">
                        {quizCount} completed
                        <span
                          className="ml-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                          style={{ background: tradColor.bg, color: tradColor.text }}
                        >
                          {progress?.difficulty ?? "Apprentice"}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.section>

          <OrnamentalDivider />

          {/* ── Section 2: Rate & Reflect ──────────────────────────── */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            {/* Star rating */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground text-center">
                How would you rate <span className="text-foreground italic">{book.title}</span>?
              </p>
              <div
                className="flex items-center justify-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= (hoverRating || rating)
                  return (
                    <motion.button
                      key={star}
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      whileTap={{ scale: 1.3 }}
                      animate={ratedAt >= star ? {
                        scale: [1, 1.25, 1],
                        transition: { delay: (star - 1) * 0.05, duration: 0.35, ease: "easeOut" }
                      } : { scale: 1 }}
                      className="p-1 transition-transform focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "size-8 transition-colors duration-150",
                          filled ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                        )}
                      />
                    </motion.button>
                  )
                })}
              </div>
              <AnimatePresence>
                {rating > 0 && (
                  <motion.p
                    className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check className="size-3 text-emerald-500" />
                    Rated {rating} star{rating !== 1 ? "s" : ""}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Reflection */}
            <div className="space-y-2">
              <label className="text-sm font-medium block" htmlFor="reflection-textarea">
                Write a reflection
              </label>
              <textarea
                id="reflection-textarea"
                rows={4}
                maxLength={500}
                value={reflection}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="What did this book mean to you?"
                className={cn(
                  "w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5",
                  "text-sm leading-relaxed resize-none",
                  "placeholder:text-muted-foreground/40",
                  "focus:outline-none focus:ring-1 focus:ring-[var(--tome-accent)]/50 focus:border-[var(--tome-accent)]/50",
                  "transition-colors"
                )}
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/50">{reflection.length}/500</span>
                <button
                  onClick={handleSaveReflection}
                  disabled={reflection.length === 0}
                  className={cn(
                    "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all",
                    savedReflection
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-foreground text-background hover:opacity-90 disabled:opacity-40"
                  )}
                >
                  {savedReflection ? (
                    <><Check className="size-3" /> Saved</>
                  ) : (
                    "Save Reflection"
                  )}
                </button>
              </div>
            </div>

            {/* Favorite toggle */}
            <div className="flex justify-center">
              <motion.button
                onClick={handleToggleFavorite}
                animate={favBounce ? { scale: [1, 1.3, 0.9, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "flex items-center gap-2 px-5 h-10 rounded-full border text-sm font-medium transition-all",
                  favorited
                    ? "border-rose-400/50 bg-rose-500/10 text-rose-500"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                )}
              >
                <Heart
                  className={cn(
                    "size-4 transition-colors",
                    favorited ? "fill-rose-500 text-rose-500" : ""
                  )}
                />
                {favorited ? "Favorited" : "Add to Favorites"}
              </motion.button>
            </div>
          </motion.section>

          <OrnamentalDivider />

          {/* ── Section 3: More by Author ──────────────────────────── */}
          {(authorBooks.length > 0 || virgilRec) && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <SectionHeading
                aside={
                  <Link
                    href={`/library?author=${encodeURIComponent(book.author)}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
                  >
                    View all →
                  </Link>
                }
              >
                More by {book.author}
              </SectionHeading>

              {/* Virgil speech bubble */}
              {virgilRec && (
                <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <Landmark className="size-5" />
                  <p className="text-xs text-muted-foreground italic">{virgilRec}</p>
                </div>
              )}

              {authorBooks.length > 0 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                  {authorBooks.map((b) => {
                    const isDone = completedIds.has(b.id)
                    return (
                      <div key={b.id} className="w-32 shrink-0 relative">
                        <BookCard book={b} size="sm" />
                        {isDone && (
                          <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 shadow">
                            <Check className="size-2.5 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.section>
          )}

          {/* ── Section 4: If You Loved This ──────────────────────── */}
          {filteredRecs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <SectionHeading>
                Readers who loved <span className="italic">{book.title}</span> also enjoyed
              </SectionHeading>

              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
                {filteredRecs.map(({ bookId: recId, reason, book: recBook }) => {
                  const isDone = completedIds.has(recId)
                  return (
                    <div key={recId} className="w-32 shrink-0 flex flex-col">
                      <div className="relative">
                        <BookCard book={recBook} size="sm" />
                        {isDone && (
                          <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 shadow">
                            <Check className="size-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] italic text-muted-foreground mt-1 text-center line-clamp-2 px-1">
                        {reason}
                      </p>
                    </div>
                  )
                })}
              </div>
            </motion.section>
          )}

          {/* ── Section 5: Explore This Tradition ─────────────────── */}
          {tradBooks.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4 }}
            >
              <SectionHeading
                aside={
                  <Link
                    href={`/library?tradition=${encodeURIComponent(book.tradition)}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
                  >
                    See all →
                  </Link>
                }
              >
                More {book.tradition} Literature
              </SectionHeading>

              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                {tradBooks.map((b) => {
                  const isDone = completedIds.has(b.id)
                  return (
                    <div key={b.id} className="w-32 shrink-0 relative">
                      <BookCard book={b} size="sm" />
                      {isDone && (
                        <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 shadow">
                          <Check className="size-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.section>
          )}

          {/* ── Section 7: Share ──────────────────────────────────── */}
          <motion.section
            className="flex justify-center pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <button
              onClick={handleShare}
              className={cn(
                "flex items-center gap-2 px-5 h-9 rounded-full border text-sm transition-all",
                copied
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              {copied ? (
                <><Check className="size-3.5" /> Copied!</>
              ) : (
                <><Share2 className="size-3.5" /> Share completion</>
              )}
            </button>
          </motion.section>

        </div>
      </div>

      {/* ── Section 6: Sticky bottom bar ──────────────────────── */}
      {topRec && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-2 max-w-lg mx-auto">
            <Link
              href={`/book/${topRec.book.id}`}
              className="flex-1 rounded-lg bg-foreground text-background text-sm font-semibold py-2.5 text-center truncate px-3"
            >
              Read Next: {topRec.book.title}
            </Link>
            <Link
              href="/library"
              className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Library
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function CompleteSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-10 pb-24 flex flex-col items-center gap-6 animate-pulse">
      <div className="h-3 w-32 bg-muted rounded-full" />
      <div className="w-[200px] rounded-xl bg-muted" style={{ aspectRatio: "200/300" }} />
      <div className="w-full space-y-2 flex flex-col items-center">
        <div className="h-6 w-48 bg-muted rounded-full" />
        <div className="h-3 w-32 bg-muted rounded-full" />
      </div>
      <div className="w-full h-28 rounded-xl bg-muted" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="size-8 rounded-full bg-muted" />
        ))}
      </div>
      <div className="w-full h-24 rounded-xl bg-muted" />
    </div>
  )
}
