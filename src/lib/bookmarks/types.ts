export type BookmarkColor = "gold" | "blue" | "green" | "purple" | "coral"

export interface Bookmark {
  id: string                    // nanoid-style: Date.now().toString(36) + random
  bookId: string
  bookTitle: string
  authorName: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  paragraphIndex: number
  selectedText?: string         // max 200 chars
  note?: string                 // max 500 chars
  color: BookmarkColor
  createdAt: string             // ISO string
  updatedAt: string             // ISO string
}

export const BOOKMARK_COLORS: Record<BookmarkColor, { hex: string; label: string; description: string }> = {
  gold:   { hex: "#EAB308", label: "Gold",   description: "Important passages" },
  blue:   { hex: "#3B82F6", label: "Blue",   description: "Questions / revisit later" },
  green:  { hex: "#22C55E", label: "Green",  description: "Favorite moments" },
  purple: { hex: "#8B5CF6", label: "Purple", description: "Connections to other works" },
  coral:  { hex: "#F97316", label: "Coral",  description: "Vocabulary / language notes" },
}

export const COLOR_ORDER: BookmarkColor[] = ["gold", "blue", "green", "purple", "coral"]
