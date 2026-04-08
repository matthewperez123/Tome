// ── Mock Social Layer ──
// All social data lives here. When real Supabase auth + tables ship,
// swap these functions for real queries. Components never change.

// ── Types ──

export type MockProfile = {
  id: string
  displayName: string
  username: string
  avatarUrl: string
  bio: string
  joinedAt: Date
  favoriteBook: string
  currentlyReading: {
    bookId: string
    bookTitle: string
    chapter: number
    totalChapters: number
  }
  stats: {
    booksCompleted: number
    wisdom: number
    flames: number
    seals: number
  }
  recentActivity: Array<{
    type: "completed_book" | "started_book" | "earned_seal" | "reached_milestone"
    title: string
    timestamp: Date
  }>
}

export type FriendRequest = {
  id: string
  fromUserId: string
  toUserId: string
  status: "pending" | "accepted" | "declined"
  sentAt: Date
}

export type BookRecommendation = {
  id: string
  fromUserId: string
  toUserId: string
  bookId: string
  bookTitle: string
  message: string
  sentAt: Date
  read: boolean
}

// ── Deterministic avatar generator ──

function avatarUrl(seed: string): string {
  // Simple initials-based placeholder — no external API dependency
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1a1a2e&textColor=d4a04c&fontSize=40`
}

// ── Helper: relative dates ──

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function hoursAgo(n: number): Date {
  const d = new Date()
  d.setHours(d.getHours() - n)
  return d
}

// ── Seeded Profiles: The 8 Personas ──

const SEEDED_FRIENDS: MockProfile[] = [
  {
    id: "beatrice",
    displayName: "Beatrice Hollow",
    username: "beatrice",
    avatarUrl: avatarUrl("beatrice-hollow"),
    bio: "Reading the Western canon in chronological order. Currently somewhere in the 14th century.",
    joinedAt: daysAgo(220),
    favoriteBook: "The Aeneid",
    currentlyReading: {
      bookId: "the-inferno",
      bookTitle: "Inferno",
      chapter: 12,
      totalChapters: 34,
    },
    stats: { booksCompleted: 31, wisdom: 4820, flames: 45, seals: 12 },
    recentActivity: [
      { type: "completed_book", title: "Completed Purgatorio", timestamp: daysAgo(1) },
      { type: "earned_seal", title: "Earned the Dante Scholar seal", timestamp: daysAgo(3) },
      { type: "started_book", title: "Started Inferno (re-read)", timestamp: daysAgo(4) },
      { type: "reached_milestone", title: "30 books completed", timestamp: daysAgo(8) },
      { type: "completed_book", title: "Completed The Aeneid", timestamp: daysAgo(12) },
    ],
  },
  {
    id: "aurelius",
    displayName: "Aurelius Penn",
    username: "aurelius_p",
    avatarUrl: avatarUrl("aurelius-penn"),
    bio: "Stoic by morning, novelist by night.",
    joinedAt: daysAgo(180),
    favoriteBook: "Meditations",
    currentlyReading: {
      bookId: "meditations",
      bookTitle: "Meditations",
      chapter: 6,
      totalChapters: 12,
    },
    stats: { booksCompleted: 14, wisdom: 2150, flames: 67, seals: 5 },
    recentActivity: [
      { type: "reached_milestone", title: "60-day reading streak", timestamp: daysAgo(0) },
      { type: "completed_book", title: "Completed Letters from a Stoic", timestamp: daysAgo(5) },
      { type: "earned_seal", title: "Earned the Stoic Seal", timestamp: daysAgo(5) },
      { type: "started_book", title: "Started Meditations (3rd read)", timestamp: daysAgo(7) },
    ],
  },
  {
    id: "cordelia",
    displayName: "Cordelia Vance",
    username: "cordelia",
    avatarUrl: avatarUrl("cordelia-vance"),
    bio: "If it isn't pre-1900, I probably haven't read it.",
    joinedAt: daysAgo(150),
    favoriteBook: "Middlemarch",
    currentlyReading: {
      bookId: "pride-and-prejudice",
      bookTitle: "Pride and Prejudice",
      chapter: 23,
      totalChapters: 61,
    },
    stats: { booksCompleted: 22, wisdom: 3400, flames: 28, seals: 8 },
    recentActivity: [
      { type: "completed_book", title: "Completed Sense and Sensibility", timestamp: daysAgo(2) },
      { type: "earned_seal", title: "Earned the Austen Devotee seal", timestamp: daysAgo(2) },
      { type: "reached_milestone", title: "20 books completed", timestamp: daysAgo(6) },
      { type: "started_book", title: "Started Pride and Prejudice", timestamp: daysAgo(9) },
      { type: "completed_book", title: "Completed Emma", timestamp: daysAgo(13) },
    ],
  },
  {
    id: "ezra",
    displayName: "Ezra Mendel",
    username: "ezra_reads",
    avatarUrl: avatarUrl("ezra-mendel"),
    bio: "Hebrew Bible, Greek tragedy, German philosophy. In that order.",
    joinedAt: daysAgo(300),
    favoriteBook: "The Brothers Karamazov",
    currentlyReading: {
      bookId: "the-odyssey",
      bookTitle: "The Odyssey",
      chapter: 9,
      totalChapters: 24,
    },
    stats: { booksCompleted: 38, wisdom: 6200, flames: 12, seals: 15 },
    recentActivity: [
      { type: "completed_book", title: "Completed The Iliad", timestamp: daysAgo(3) },
      { type: "started_book", title: "Started The Odyssey", timestamp: daysAgo(3) },
      { type: "earned_seal", title: "Earned the Homeric Scholar seal", timestamp: daysAgo(3) },
      { type: "completed_book", title: "Completed Oedipus Rex", timestamp: daysAgo(10) },
      { type: "reached_milestone", title: "6,000 Wisdom earned", timestamp: daysAgo(10) },
    ],
  },
  {
    id: "junia",
    displayName: "Junia Marlowe",
    username: "junia",
    avatarUrl: avatarUrl("junia-marlowe"),
    bio: "Romantics and Victorians, with occasional detours into the Russians.",
    joinedAt: daysAgo(120),
    favoriteBook: "Wuthering Heights",
    currentlyReading: {
      bookId: "frankenstein",
      bookTitle: "Frankenstein",
      chapter: 5,
      totalChapters: 23,
    },
    stats: { booksCompleted: 11, wisdom: 1750, flames: 19, seals: 4 },
    recentActivity: [
      { type: "started_book", title: "Started Frankenstein", timestamp: daysAgo(1) },
      { type: "completed_book", title: "Completed Wuthering Heights", timestamp: daysAgo(4) },
      { type: "earned_seal", title: "Earned the Gothic Reader seal", timestamp: daysAgo(4) },
      { type: "reached_milestone", title: "10 books completed", timestamp: daysAgo(7) },
    ],
  },
  {
    id: "tobias",
    displayName: "Tobias Wren",
    username: "tobias",
    avatarUrl: avatarUrl("tobias-wren"),
    bio: "Classicist in training. Latin every morning.",
    joinedAt: daysAgo(200),
    favoriteBook: "The Iliad",
    currentlyReading: {
      bookId: "the-aeneid",
      bookTitle: "The Aeneid",
      chapter: 4,
      totalChapters: 12,
    },
    stats: { booksCompleted: 19, wisdom: 3100, flames: 52, seals: 7 },
    recentActivity: [
      { type: "completed_book", title: "Completed The Iliad", timestamp: hoursAgo(8) },
      { type: "started_book", title: "Started The Aeneid", timestamp: hoursAgo(6) },
      { type: "reached_milestone", title: "50-day reading streak", timestamp: daysAgo(2) },
      { type: "earned_seal", title: "Earned the Epic Poetry seal", timestamp: daysAgo(5) },
      { type: "completed_book", title: "Completed The Odyssey", timestamp: daysAgo(11) },
    ],
  },
  {
    id: "saskia",
    displayName: "Saskia Dell",
    username: "saskia",
    avatarUrl: avatarUrl("saskia-dell"),
    bio: "Reading slowly is a virtue.",
    joinedAt: daysAgo(90),
    favoriteBook: "Don Quixote",
    currentlyReading: {
      bookId: "don-quixote",
      bookTitle: "Don Quixote",
      chapter: 8,
      totalChapters: 52,
    },
    stats: { booksCompleted: 5, wisdom: 890, flames: 34, seals: 2 },
    recentActivity: [
      { type: "reached_milestone", title: "30-day reading streak", timestamp: daysAgo(4) },
      { type: "started_book", title: "Started Don Quixote", timestamp: daysAgo(14) },
      { type: "completed_book", title: "Completed The Little Prince", timestamp: daysAgo(15) },
    ],
  },
  {
    id: "linnaeus",
    displayName: "Linnaeus Boyd",
    username: "linnaeus",
    avatarUrl: avatarUrl("linnaeus-boyd"),
    bio: "Natural history, philosophy, and the occasional novel.",
    joinedAt: daysAgo(260),
    favoriteBook: "On the Origin of Species",
    currentlyReading: {
      bookId: "walden",
      bookTitle: "Walden",
      chapter: 4,
      totalChapters: 18,
    },
    stats: { booksCompleted: 24, wisdom: 3800, flames: 89, seals: 9 },
    recentActivity: [
      { type: "reached_milestone", title: "89-day reading streak", timestamp: daysAgo(0) },
      { type: "completed_book", title: "Completed The Voyage of the Beagle", timestamp: daysAgo(2) },
      { type: "started_book", title: "Started Walden", timestamp: daysAgo(2) },
      { type: "earned_seal", title: "Earned the Naturalist seal", timestamp: daysAgo(6) },
      { type: "completed_book", title: "Completed On the Origin of Species", timestamp: daysAgo(9) },
    ],
  },
]

// ── Suggested profiles (for "Find friends" popover) ──

const SUGGESTED_PROFILES: MockProfile[] = [
  {
    id: "phoebe",
    displayName: "Phoebe Ashworth",
    username: "phoebe_reads",
    avatarUrl: avatarUrl("phoebe-ashworth"),
    bio: "Poetry first, always.",
    joinedAt: daysAgo(60),
    favoriteBook: "Leaves of Grass",
    currentlyReading: { bookId: "paradise-lost", bookTitle: "Paradise Lost", chapter: 3, totalChapters: 12 },
    stats: { booksCompleted: 8, wisdom: 1200, flames: 15, seals: 3 },
    recentActivity: [
      { type: "started_book", title: "Started Paradise Lost", timestamp: daysAgo(2) },
      { type: "completed_book", title: "Completed Leaves of Grass", timestamp: daysAgo(7) },
    ],
  },
  {
    id: "milo",
    displayName: "Milo Severan",
    username: "milo_s",
    avatarUrl: avatarUrl("milo-severan"),
    bio: "Late antiquity and early medieval. Niche, I know.",
    joinedAt: daysAgo(140),
    favoriteBook: "Confessions",
    currentlyReading: { bookId: "the-republic", bookTitle: "The Republic", chapter: 5, totalChapters: 10 },
    stats: { booksCompleted: 16, wisdom: 2600, flames: 41, seals: 6 },
    recentActivity: [
      { type: "completed_book", title: "Completed Confessions", timestamp: daysAgo(4) },
      { type: "started_book", title: "Started The Republic", timestamp: daysAgo(3) },
    ],
  },
  {
    id: "wren",
    displayName: "Wren Alcott",
    username: "wren_a",
    avatarUrl: avatarUrl("wren-alcott"),
    bio: "American Transcendentalists and anyone they'd argue with.",
    joinedAt: daysAgo(100),
    favoriteBook: "Walden",
    currentlyReading: { bookId: "moby-dick", bookTitle: "Moby-Dick", chapter: 42, totalChapters: 135 },
    stats: { booksCompleted: 12, wisdom: 1900, flames: 22, seals: 4 },
    recentActivity: [
      { type: "reached_milestone", title: "Chapter 42: The Whiteness of the Whale", timestamp: daysAgo(1) },
      { type: "started_book", title: "Started Moby-Dick", timestamp: daysAgo(10) },
    ],
  },
]

// ── Current user ──

let currentUser: MockProfile = {
  id: "matthew",
  displayName: "Matthew",
  username: "matthew",
  avatarUrl: avatarUrl("matthew-perez"),
  bio: "Building something for readers.",
  joinedAt: daysAgo(30),
  favoriteBook: "The Odyssey",
  currentlyReading: {
    bookId: "the-odyssey",
    bookTitle: "The Odyssey",
    chapter: 9,
    totalChapters: 24,
  },
  stats: { booksCompleted: 3, wisdom: 450, flames: 14, seals: 1 },
  recentActivity: [
    { type: "started_book", title: "Started The Odyssey", timestamp: daysAgo(3) },
    { type: "completed_book", title: "Completed Meditations", timestamp: daysAgo(7) },
    { type: "earned_seal", title: "Earned the First Steps seal", timestamp: daysAgo(7) },
    { type: "reached_milestone", title: "14-day reading streak", timestamp: daysAgo(0) },
  ],
}

// ── Mutable state ──

let friends = [...SEEDED_FRIENDS]

let friendRequests: FriendRequest[] = [
  {
    id: "req-1",
    fromUserId: "phoebe",
    toUserId: "matthew",
    status: "pending",
    sentAt: daysAgo(1),
  },
  {
    id: "req-2",
    fromUserId: "milo",
    toUserId: "matthew",
    status: "pending",
    sentAt: daysAgo(3),
  },
]

let recommendations: BookRecommendation[] = [
  {
    id: "rec-1",
    fromUserId: "beatrice",
    toUserId: "matthew",
    bookId: "the-aeneid",
    bookTitle: "The Aeneid",
    message: "You'll love Book VI. The underworld scene echoes the Odyssey in ways that will surprise you.",
    sentAt: hoursAgo(4),
    read: false,
  },
  {
    id: "rec-2",
    fromUserId: "ezra",
    toUserId: "matthew",
    bookId: "the-republic",
    bookTitle: "The Republic",
    message: "After the Odyssey, this is the next essential. Plato's cave allegory will change how you read everything.",
    sentAt: daysAgo(1),
    read: false,
  },
  {
    id: "rec-3",
    fromUserId: "cordelia",
    toUserId: "matthew",
    bookId: "pride-and-prejudice",
    bookTitle: "Pride and Prejudice",
    message: "Something lighter after all that Homer. Trust me.",
    sentAt: daysAgo(3),
    read: false,
  },
]

// ── Pub/sub for reactivity ──

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
}

export function subscribe(callback: Listener): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

// ── Exported functions ──

export function getCurrentUser(): MockProfile {
  return currentUser
}

export function updateCurrentUser(updates: Partial<MockProfile>): void {
  currentUser = { ...currentUser, ...updates }
  notify()
}

export function getProfile(userId: string): MockProfile | null {
  if (userId === currentUser.id || userId === currentUser.username) return currentUser
  return (
    friends.find((f) => f.id === userId || f.username === userId) ??
    SUGGESTED_PROFILES.find((p) => p.id === userId || p.username === userId) ??
    null
  )
}

export function getFriends(): MockProfile[] {
  return friends
}

export function getFriendRequests(): FriendRequest[] {
  return friendRequests.filter((r) => r.status === "pending")
}

export async function sendFriendRequest(toUserId: string): Promise<void> {
  const req: FriendRequest = {
    id: `req-${Date.now()}`,
    fromUserId: currentUser.id,
    toUserId,
    status: "pending",
    sentAt: new Date(),
  }
  friendRequests.push(req)
  notify()

  // Auto-accept after 2 seconds for demo
  await new Promise((r) => setTimeout(r, 2000))
  req.status = "accepted"

  // Add to friends list
  const profile =
    SUGGESTED_PROFILES.find((p) => p.id === toUserId) ??
    SEEDED_FRIENDS.find((f) => f.id === toUserId)
  if (profile && !friends.find((f) => f.id === toUserId)) {
    friends = [...friends, profile]
  }
  notify()
}

export function acceptFriendRequest(requestId: string): void {
  const req = friendRequests.find((r) => r.id === requestId)
  if (!req) return
  req.status = "accepted"

  const profile =
    SUGGESTED_PROFILES.find((p) => p.id === req.fromUserId) ??
    SEEDED_FRIENDS.find((f) => f.id === req.fromUserId)
  if (profile && !friends.find((f) => f.id === req.fromUserId)) {
    friends = [...friends, profile]
  }
  notify()
}

export function declineFriendRequest(requestId: string): void {
  const req = friendRequests.find((r) => r.id === requestId)
  if (req) req.status = "declined"
  notify()
}

export async function sendBookRecommendation(
  toUserId: string,
  bookId: string,
  bookTitle: string,
  message: string
): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
  recommendations.push({
    id: `rec-${Date.now()}`,
    fromUserId: currentUser.id,
    toUserId,
    bookId,
    bookTitle,
    message,
    sentAt: new Date(),
    read: false,
  })
  notify()
}

export function getReceivedRecommendations(): BookRecommendation[] {
  return recommendations.filter((r) => r.toUserId === currentUser.id)
}

export function getUnreadRecommendationCount(): number {
  return recommendations.filter((r) => r.toUserId === currentUser.id && !r.read).length
}

export function markRecommendationAsRead(id: string): void {
  const rec = recommendations.find((r) => r.id === id)
  if (rec) rec.read = true
  notify()
}

export function markAllRecommendationsAsRead(): void {
  recommendations.forEach((r) => {
    if (r.toUserId === currentUser.id) r.read = true
  })
  notify()
}

export function searchProfiles(query: string): MockProfile[] {
  const q = query.toLowerCase()
  return [...friends, ...SUGGESTED_PROFILES].filter(
    (p) =>
      p.displayName.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q)
  )
}

export function getSuggestedProfiles(): MockProfile[] {
  return SUGGESTED_PROFILES.filter((p) => !friends.find((f) => f.id === p.id))
}

export function isFriend(userId: string): boolean {
  return friends.some((f) => f.id === userId)
}

export function getMutualFriends(userId: string): MockProfile[] {
  // Mock: return 1-2 random friends as "mutual"
  const seed = userId.charCodeAt(0) % friends.length
  return friends.slice(seed, seed + 2).filter((f) => f.id !== userId)
}
