"use client"

import type { ConversationMessage } from "@/lib/virgil/types"
import { cn } from "@/lib/utils"

interface VirgilMessageProps {
  message: ConversationMessage
}

export function VirgilMessage({ message }: VirgilMessageProps) {
  const isVirgil = message.role === "virgil"

  if (!isVirgil) {
    // User message — right-aligned, stone background
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 bg-muted text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    )
  }

  // Virgil message — left-aligned, Literata serif, with blockquote rendering
  return (
    <div className="flex justify-start">
      <div className="max-w-[95%]">
        {/* Virgil avatar */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="size-6 rounded-full flex items-center justify-center text-xs font-serif font-bold shrink-0"
            style={{ background: "rgba(212,160,76,0.15)", color: "#D4A04C" }}
          >
            V
          </div>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide">Virgil</span>
        </div>

        {/* Message body */}
        <div className="pl-8">
          <VirgilMarkdown
            content={message.content}
            isStreaming={message.isStreaming}
          />
        </div>
      </div>
    </div>
  )
}

// ── Markdown renderer with blockquote styling ──

function VirgilMarkdown({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  // Split content into paragraphs and blockquotes
  const lines = content.split("\n")
  const blocks: Array<{ type: "text" | "blockquote" | "citation"; content: string }> = []

  let currentText = ""

  for (const line of lines) {
    if (line.startsWith("> ")) {
      // Flush any accumulated text
      if (currentText.trim()) {
        blocks.push({ type: "text", content: currentText.trim() })
        currentText = ""
      }
      blocks.push({ type: "blockquote", content: line.slice(2) })
    } else if (line.startsWith("— ") || line.startsWith("- ")) {
      blocks.push({ type: "citation", content: line })
    } else {
      if (currentText && line.trim()) currentText += " "
      currentText += line
    }
  }

  if (currentText.trim()) {
    blocks.push({ type: "text", content: currentText.trim() })
  }

  // Merge consecutive blockquotes
  const merged: typeof blocks = []
  for (const block of blocks) {
    const prev = merged[merged.length - 1]
    if (block.type === "blockquote" && prev?.type === "blockquote") {
      prev.content += "\n" + block.content
    } else {
      merged.push({ ...block })
    }
  }

  return (
    <div className="space-y-3">
      {merged.map((block, i) => {
        if (block.type === "blockquote") {
          return (
            <blockquote
              key={i}
              className="border-l-[3px] pl-4 py-1 my-3"
              style={{ borderColor: "#D4A04C" }}
            >
              <p className="font-serif italic text-[0.9em] leading-relaxed text-foreground/80">
                {block.content}
              </p>
            </blockquote>
          )
        }

        if (block.type === "citation") {
          return (
            <p
              key={i}
              className="text-[11px] pl-4 -mt-2 mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {block.content}
            </p>
          )
        }

        // Regular text — render with inline formatting
        return (
          <p
            key={i}
            className="font-serif text-sm leading-[1.8] text-foreground/90"
          >
            {renderInlineFormatting(block.content)}
          </p>
        )
      })}

      {/* Streaming cursor */}
      {isStreaming && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
          style={{ backgroundColor: "#D4A04C" }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Simple inline italic and bold rendering
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold italic: ***text***
    const boldItalicMatch = remaining.match(/\*\*\*(.*?)\*\*\*/)
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/)
    // Italic: *text*
    const italicMatch = remaining.match(/\*(.*?)\*/)
    // Greek/special: handle as-is

    const match = boldItalicMatch || boldMatch || italicMatch

    if (match && match.index !== undefined) {
      // Add text before match
      if (match.index > 0) {
        parts.push(remaining.slice(0, match.index))
      }

      if (boldItalicMatch && match === boldItalicMatch) {
        parts.push(<em key={key++}><strong>{match[1]}</strong></em>)
      } else if (boldMatch && match === boldMatch) {
        parts.push(<strong key={key++}>{match[1]}</strong>)
      } else {
        parts.push(<em key={key++}>{match[1]}</em>)
      }

      remaining = remaining.slice(match.index + match[0].length)
    } else {
      parts.push(remaining)
      break
    }
  }

  return parts
}
