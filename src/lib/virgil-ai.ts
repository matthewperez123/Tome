import type { VirgilMessage, PageContext } from "./virgil-context"

interface VirgilRequest {
  userMessage: string
  conversationHistory: VirgilMessage[]
  pageContext: PageContext
}

/**
 * Mock Virgil AI — swap this single function for real Claude API later.
 * Simulates streaming by emitting one word at a time.
 */
export async function askVirgil(
  request: VirgilRequest,
  onToken: (token: string) => void,
  onComplete: () => void,
): Promise<void> {
  const response = getMockResponse(request)
  const words = response.split(" ")
  for (let i = 0; i < words.length; i++) {
    await new Promise((r) => setTimeout(r, 35 + Math.random() * 30))
    onToken(words[i] + (i < words.length - 1 ? " " : ""))
  }
  onComplete()
}

function getMockResponse({ userMessage, pageContext }: VirgilRequest): string {
  const q = userMessage.toLowerCase()

  // Reader context
  if (pageContext.page === "reader" && pageContext.bookTitle) {
    if (q.includes("explain") || q.includes("what does") || q.includes("meaning"))
      return `Great question. This passage from ${pageContext.bookTitle} is one of those moments where ${pageContext.bookAuthor || "the author"} reveals something fundamental about human nature. The key insight here is that the surface-level action is a metaphor for a deeper philosophical point. Would you like me to dig into the historical context?`
    if (q.includes("who") || q.includes("character"))
      return `You're asking about one of the most fascinating characters in ${pageContext.bookTitle}. What makes them compelling is the contradiction at their core — they want two things that can't coexist. ${pageContext.bookAuthor || "The author"} based this character partly on real historical figures. Want me to tell you about the inspiration?`
    if (q.includes("why"))
      return `Now that's the question scholars have debated for centuries. The short answer is survival — but the deeper answer is about identity. In ${pageContext.bookTitle}, every major decision comes back to: "Who am I, and who do I want to become?" The Greeks had a word for this kind of inner conflict: agon.`
    return `That's a wonderful question about ${pageContext.bookTitle}. What you're reading isn't just a story — it's a conversation with every text that came before it. The word choices here aren't accidental — they echo a much older tradition. Would you like me to trace that connection?`
  }

  if (pageContext.page === "library" || q.includes("recommend") || q.includes("read") || q.includes("suggest"))
    return "If you're just beginning, I'd suggest The Odyssey. It's the original adventure story — a man trying to get home against impossible odds. Monsters, magic, romance, and one of the cleverest heroes ever written. Two thousand eight hundred years old and it still works. After that, try Meditations by Marcus Aurelius — the private journal of a Roman emperor."

  if (pageContext.page === "book-detail" && pageContext.bookTitle)
    return `${pageContext.bookTitle} is one of those books that changed what literature could be. ${pageContext.bookAuthor || "The author"} wrote it during a time when the world was shifting, and you can feel that instability in every chapter. What makes it endure isn't the plot — it's how it makes you see your own life differently. Ready to dive in?`

  if (pageContext.page === "dashboard" || q.includes("progress") || q.includes("streak"))
    return "You're building a real reading practice here. Consistency is what separates people who 'want to read more' from people who actually do it. Every chapter rewires your brain a little — you're literally becoming a different thinker. Keep the Flames alive. Even five minutes counts."

  if (pageContext.page === "quiz")
    return "Take your time. The best readers aren't the fastest — they're the ones who notice what everyone else misses. If you're unsure, think about what the author was trying to make you feel, not just what happened. Literature is about the why, not the what."

  if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
    return "Hello! I'm Virgil — named after the Roman poet who guided Dante through the underworld. I've been guiding readers through great literature for about two thousand years now, give or take. What are you reading, or would you like a recommendation?"

  if (q.includes("who are you") || q.includes("what are you"))
    return "I'm Virgil, your literary companion. Named after Publius Vergilius Maro — the poet who wrote the Aeneid and who Dante chose as his guide. I'm here to help you read, understand, and fall in love with the greatest books ever written. What would you like to explore?"

  return "That's a thoughtful question. Literature has a way of asking the questions that matter most — about identity, mortality, love, justice, and what it means to live well. These books have been asking those questions for millennia. What specifically are you curious about? I can point you to a passage, an author, or a whole tradition."
}
