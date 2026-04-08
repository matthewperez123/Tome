"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Send } from "lucide-react"
import { streamVirgilResponse } from "@/lib/virgil/responses"
import type { ConversationMessage } from "@/lib/virgil/types"
import { VirgilMessage } from "./VirgilMessage"
import { cn } from "@/lib/utils"

interface VirgilPanelProps {
  bookId: string
  isOpen: boolean
  onClose: () => void
  /** Pre-loaded highlighted passage from the reader */
  highlightedPassage?: { text: string; reference: string } | null
}

let messageIdCounter = 0
function nextId() {
  return `msg-${++messageIdCounter}-${Date.now()}`
}

export function VirgilPanel({ bookId, isOpen, onClose, highlightedPassage }: VirgilPanelProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasGreetedRef = useRef(false)
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Send Virgil's first message when panel opens with a highlighted passage
  useEffect(() => {
    if (isOpen && highlightedPassage && !hasGreetedRef.current && messages.length === 0) {
      hasGreetedRef.current = true
      streamFirstMessage(highlightedPassage)
    }
  }, [isOpen, highlightedPassage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen && !isStreaming) {
      setTimeout(() => textareaRef.current?.focus(), 300)
    }
  }, [isOpen, isStreaming])

  async function streamFirstMessage(passage: { text: string; reference: string }) {
    const virgilId = nextId()
    setMessages([
      {
        id: nextId(),
        role: "user",
        content: "",
        timestamp: new Date(),
        highlightedPassage: passage,
      },
      {
        id: virgilId,
        role: "virgil",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      },
    ])

    setIsStreaming(true)
    let accumulated = ""

    const stream = streamVirgilResponse({
      bookId,
      conversationHistory: [],
      highlightedPassage: passage,
    })

    for await (const chunk of stream) {
      accumulated += chunk
      setMessages((prev) =>
        prev.map((m) =>
          m.id === virgilId ? { ...m, content: accumulated } : m
        )
      )
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === virgilId ? { ...m, isStreaming: false } : m
      )
    )
    setIsStreaming(false)
  }

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    setInput("")

    const userMsg: ConversationMessage = {
      id: nextId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    const virgilId = nextId()
    const virgilMsg: ConversationMessage = {
      id: virgilId,
      role: "virgil",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMsg, virgilMsg])
    setIsStreaming(true)

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    let accumulated = ""
    const stream = streamVirgilResponse({
      bookId,
      conversationHistory: history,
      highlightedPassage: highlightedPassage ?? undefined,
    })

    for await (const chunk of stream) {
      accumulated += chunk
      setMessages((prev) =>
        prev.map((m) =>
          m.id === virgilId ? { ...m, content: accumulated } : m
        )
      )
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === virgilId ? { ...m, isStreaming: false } : m
      )
    )
    setIsStreaming(false)
  }, [input, isStreaming, messages, bookId, highlightedPassage])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const panelVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { x: "100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "fixed right-0 top-0 bottom-0 z-40 flex flex-col",
            "w-full sm:w-[420px] border-l",
            "bg-background border-border"
          )}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "rgba(212,160,76,0.2)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="size-8 rounded-full flex items-center justify-center font-serif font-bold text-sm"
                style={{ background: "rgba(212,160,76,0.15)", color: "#D4A04C" }}
              >
                V
              </div>
              <div>
                <p className="text-sm font-semibold">Virgil</p>
                <p className="text-[10px] text-muted-foreground">Your reading companion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close Virgil panel"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-5"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div
                  className="size-16 rounded-full flex items-center justify-center font-serif font-bold text-2xl mb-4"
                  style={{ background: "rgba(212,160,76,0.1)", color: "#D4A04C" }}
                >
                  V
                </div>
                <p className="font-serif text-lg font-semibold mb-1">Ask Virgil</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Highlight a passage in the text, or ask a question about what you&apos;re reading.
                </p>
              </div>
            )}

            {messages.map((msg) => {
              // Render highlighted passage as a blockquote above the conversation
              if (msg.role === "user" && msg.highlightedPassage && !msg.content) {
                return (
                  <div key={msg.id} className="mb-2">
                    <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">
                      Selected passage
                    </p>
                    <blockquote
                      className="border-l-[3px] pl-3 py-1"
                      style={{ borderColor: "#D4A04C" }}
                    >
                      <p className="font-serif italic text-xs leading-relaxed text-foreground/70">
                        {msg.highlightedPassage.text.length > 200
                          ? msg.highlightedPassage.text.slice(0, 200) + "..."
                          : msg.highlightedPassage.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        — {msg.highlightedPassage.reference}
                      </p>
                    </blockquote>
                  </div>
                )
              }

              return <VirgilMessage key={msg.id} message={msg} />
            })}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this passage..."
                rows={1}
                className={cn(
                  "flex-1 resize-none rounded-xl border border-border bg-muted/50 px-3 py-2.5",
                  "text-sm placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-[#D4A04C]/40",
                  "max-h-[120px] overflow-y-auto"
                )}
                style={{ minHeight: "40px" }}
                disabled={isStreaming}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  "flex items-center justify-center size-10 rounded-xl",
                  "transition-all duration-150",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  input.trim() && !isStreaming
                    ? "bg-[#D4A04C] text-[#1a1a2e] hover:bg-[#C8A046]"
                    : "bg-muted text-muted-foreground"
                )}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
