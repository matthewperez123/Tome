"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVirgil } from "@/lib/virgil-context"
import { getPoseImage } from "@/lib/virgil-poses"
import { askVirgil } from "@/lib/virgil-ai"

// ── Thinking dots ────────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          className="size-1.5 rounded-full bg-indigo-400"
        />
      ))}
    </div>
  )
}

// ── Suggestions ──────────────────────────────────────────────────────────────

function SuggestionPills({ onSelect }: { onSelect: (text: string) => void }) {
  const { suggestions } = useVirgil()
  if (suggestions.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="text-xs bg-muted hover:bg-indigo-50 text-muted-foreground hover:text-indigo-600 px-3 py-1.5 rounded-full transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

// ── Welcome messages ─────────────────────────────────────────────────────────

function getWelcome(page: string, bookTitle?: string): string {
  switch (page) {
    case "library":
      return "Looking for your next great read? I know every book in this library. Ask me anything."
    case "reader":
      return bookTitle
        ? `I see you're reading ${bookTitle}. Ask me anything about the text — I love this one.`
        : "I see you're reading. Ask me anything about the text."
    case "dashboard":
      return "Welcome back! Your reading practice is building something real. What would you like to explore today?"
    case "quiz":
      return "Good luck with the quiz! I can give hints if you get stuck."
    default:
      return "Hello! I'm Virgil. I've been guiding readers through great literature for about two thousand years. What are you curious about?"
  }
}

// ── Main component ───────────────────────────────────────────────────────────

export function VirgilChat() {
  const {
    isOpen, closeChat, messages, addMessage,
    isThinking, setIsThinking, currentPose, setPose,
    pageContext, suggestions,
  } = useVirgil()

  const [input, setInput] = useState("")
  const [streamingContent, setStreamingContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const welcomeSentRef = useRef(false)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent, isThinking])

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0 && !welcomeSentRef.current) {
      welcomeSentRef.current = true
      addMessage("virgil", getWelcome(pageContext.page, pageContext.bookTitle))
    }
    if (isOpen) inputRef.current?.focus()
  }, [isOpen, messages.length, addMessage, pageContext])

  // Reset welcome ref when messages are cleared
  useEffect(() => {
    if (messages.length === 0) welcomeSentRef.current = false
  }, [messages.length])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isThinking) return

    addMessage("user", trimmed)
    setInput("")
    setIsThinking(true)
    setPose("thinking")
    setStreamingContent("")

    let accumulated = ""
    await askVirgil(
      { userMessage: trimmed, conversationHistory: messages, pageContext },
      (token) => {
        accumulated += token
        setStreamingContent(accumulated)
      },
      () => {
        addMessage("virgil", accumulated)
        setStreamingContent("")
        setIsThinking(false)
        setPose("idle")
      },
    )
  }, [isThinking, addMessage, setIsThinking, setPose, messages, pageContext])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — mobile only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 flex flex-col bg-popover border border-border shadow-2xl overflow-hidden",
              // Mobile: bottom sheet
              "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:h-[70vh] max-md:rounded-t-3xl",
              // Desktop: floating panel
              "md:bottom-6 md:right-6 md:w-[380px] md:h-[540px] md:rounded-2xl",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
              <div className="size-9 rounded-full ring-1 ring-[#D4B37A40] bg-[#D4B37A20] shrink-0 flex items-center justify-center">
                <span className="text-sm font-serif font-bold text-[#D4B37A]">V</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Virgil</p>
                <p className="text-xs text-muted-foreground truncate">
                  {pageContext.bookTitle ? `Reading ${pageContext.bookTitle}` : "Your literary guide"}
                </p>
              </div>
              <button
                onClick={closeChat}
                className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("flex gap-2", msg.role === "user" && "justify-end")}
                >
                  {msg.role === "virgil" && (
                    <div className="size-6 rounded-full overflow-hidden ring-1 ring-indigo-200 shrink-0 mt-1">
                      <span className="text-[10px] font-serif font-bold text-[#D4B37A]">V</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "virgil"
                        ? "bg-indigo-50 text-foreground rounded-2xl rounded-bl-md"
                        : "bg-indigo-600 text-white rounded-2xl rounded-br-md ml-auto",
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Streaming response */}
              {streamingContent && (
                <div className="flex gap-2">
                  <div className="size-6 rounded-full overflow-hidden ring-1 ring-indigo-200 shrink-0 mt-1">
                    <span className="text-[10px] font-serif font-bold text-[#D4B37A]">V</span>
                  </div>
                  <div className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed bg-indigo-50 text-foreground rounded-2xl rounded-bl-md">
                    {streamingContent}
                  </div>
                </div>
              )}

              {/* Thinking indicator */}
              {isThinking && !streamingContent && (
                <div className="flex gap-2">
                  <div className="size-6 rounded-full overflow-hidden ring-1 ring-indigo-200 shrink-0 mt-1">
                    <span className="text-[10px] font-serif font-bold text-[#D4B37A]">V</span>
                  </div>
                  <div className="bg-indigo-50 rounded-2xl rounded-bl-md">
                    <ThinkingDots />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {!isThinking && messages.length <= 1 && (
              <SuggestionPills onSelect={sendMessage} />
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Virgil anything..."
                  disabled={isThinking}
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
                />
                {input.trim() && (
                  <motion.button
                    type="submit"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="size-9 flex items-center justify-center rounded-full bg-indigo-600 text-white shrink-0 hover:bg-indigo-700 transition-colors"
                    disabled={isThinking}
                  >
                    <SendHorizontal className="size-4" />
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
