// ── Virgil Chat Stub ──
// When real chat ships, this file becomes a wrapper around the Anthropic SDK
// or a mock streaming generator. The drawer UI consumes this function and
// does not need to change when the implementation is swapped in.

import type { ChatMessage } from "./types"

export const isVirgilChatAvailable = false

export async function sendVirgilMessage(
  _input: {
    bookId: string
    annotationId?: string
    conversationHistory: ChatMessage[]
    userMessage: string
  }
): Promise<never> {
  throw new Error(
    "Virgil chat is not yet available. This stub exists so the UI can be built against the future API."
  )
}
