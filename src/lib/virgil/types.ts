// ── Virgil Types ──
// Shared types for annotations, chat, and the unified drawer.

// ── Annotations ──

export type AnnotationTag = "linguistic" | "mythological" | "historical" | "literary-influence" | "philosophical"

export type CrossReferenceType = "echo" | "source" | "parody" | "allusion" | "compare"

export interface CrossReference {
  type: CrossReferenceType
  description: string
  workTitle: string
  workAuthor: string
  passageReference: string
  targetBookId: string | null
  targetChapterNumber: number | null
  targetAnchorText: string | null
}

export interface Annotation {
  id: string
  bookId: string
  chapterNumber: number
  anchorText: string
  anchorOccurrence: number
  title: string
  quotedPassage: string
  passageReference: string
  commentary: string
  crossReferences: CrossReference[]
  tags: AnnotationTag[]
}

// ── Chat (stub types, defined now for future UI) ──

export interface ChatMessage {
  id: string
  role: "user" | "virgil"
  content: string
  timestamp: Date
}

// ── Bookmarks ──

export interface AnnotationBookmark {
  id: string
  type: "annotation" | "cross-reference"
  annotationId: string
  crossReferenceIndex?: number
  bookmarkedAt: Date
}

// ── Anchor-based responses (Virgil curated passages) ──

export interface AnchorResponse {
  passageId: string
  passageText: string
  passageReference: string
  triggers: string[]
  firstMessage: string
  responses: Array<{ intent: QuestionIntent; text: string }>
}

// ── Legacy types kept for backwards compatibility ──

export type MessageRole = "user" | "virgil"
export type ConversationMessage = ChatMessage & { isStreaming?: boolean; highlightedPassage?: { text: string; reference: string } }
export type QuestionIntent = "why" | "meaning" | "context" | "opinion" | "compare"
export interface StreamInput { bookId: string; conversationHistory: Array<{ role: MessageRole; content: string }>; highlightedPassage?: { text: string; reference: string } }
