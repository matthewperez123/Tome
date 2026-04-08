export const VIRGIL_TIPS = [
  "The unread books on your shelf are not failures — they are invitations.",
  "Read slowly. The best books reward patience, not speed.",
  "A difficult passage is not an enemy. It is a door.",
  "Every great reader was once a confused beginner staring at the first page.",
  "The Iliad took a lifetime to compose. Treat it with the same patience.",
  "You are not behind. You are exactly where the book needs you to be.",
  "Margin notes are conversations with yourself across time.",
  "Dante wrote the Inferno in exile. Meaningful reading is a kind of homecoming.",
  "The best question to ask of any book is: why did the author choose this word?",
  "If a sentence stops you, that is the book doing its work.",
  "Read the first page three times. The second reading is when the book begins.",
  "A bookmark is a promise to return.",
  "Marcus Aurelius wrote the Meditations for himself. So can you.",
  "The wine-dark sea has been wine-dark for three thousand years. That is what literature does.",
  "You will forget most of what you read. What remains is who you become.",
]

export function getTipOfTheDay(): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return VIRGIL_TIPS[dayOfYear % VIRGIL_TIPS.length]
}
