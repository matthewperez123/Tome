"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { VirgilPose } from "./virgil-poses"

export interface VirgilMessage {
  id: string
  role: "user" | "virgil"
  content: string
  timestamp: Date
}

export interface PageContext {
  page: "library" | "book-detail" | "reader" | "quiz" | "dashboard" | "profile" | "shelves" | "other"
  bookTitle?: string
  bookAuthor?: string
  chapterTitle?: string
  chapterContent?: string
}

interface VirgilContextType {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  messages: VirgilMessage[]
  addMessage: (role: "user" | "virgil", content: string) => void
  clearMessages: () => void
  isThinking: boolean
  setIsThinking: (v: boolean) => void
  currentPose: VirgilPose
  setPose: (pose: VirgilPose) => void
  pageContext: PageContext
  setPageContext: (ctx: PageContext) => void
  hasNotification: boolean
  setHasNotification: (v: boolean) => void
  suggestions: string[]
  setSuggestions: (s: string[]) => void
}

const VirgilContext = createContext<VirgilContextType | null>(null)

export function VirgilProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<VirgilMessage[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [currentPose, setPose] = useState<VirgilPose>("idle")
  const [pageContext, setPageContext] = useState<PageContext>({ page: "other" })
  const [hasNotification, setHasNotification] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const openChat = useCallback(() => {
    setIsOpen(true)
    setHasNotification(false)
  }, [])
  const closeChat = useCallback(() => setIsOpen(false), [])
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setHasNotification(false)
      return !prev
    })
  }, [])

  const addMessage = useCallback((role: "user" | "virgil", content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, content, timestamp: new Date() },
    ])
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  return (
    <VirgilContext.Provider
      value={{
        isOpen, openChat, closeChat, toggleChat,
        messages, addMessage, clearMessages,
        isThinking, setIsThinking,
        currentPose, setPose,
        pageContext, setPageContext,
        hasNotification, setHasNotification,
        suggestions, setSuggestions,
      }}
    >
      {children}
    </VirgilContext.Provider>
  )
}

export function useVirgil() {
  const ctx = useContext(VirgilContext)
  if (!ctx) throw new Error("useVirgil must be used within VirgilProvider")
  return ctx
}
