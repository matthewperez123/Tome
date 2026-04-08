"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import {
  getReceivedRecommendations,
  getUnreadRecommendationCount,
  markRecommendationAsRead,
  markAllRecommendationsAsRead,
  getProfile,
  subscribe,
  type BookRecommendation,
} from "@/lib/mock/social"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [recs, setRecs] = useState<BookRecommendation[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRecs(getReceivedRecommendations())
    setUnread(getUnreadRecommendationCount())
    return subscribe(() => {
      setRecs(getReceivedRecommendations())
      setUnread(getUnreadRecommendationCount())
    })
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  function handleClickRec(rec: BookRecommendation) {
    markRecommendationAsRead(rec.id)
    setOpen(false)
  }

  function timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-[#D4A04C] text-[8px] font-bold text-[#1a1a2e] flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">Notifications</p>
              {unread > 0 && (
                <button
                  onClick={() => markAllRecommendationsAsRead()}
                  className="text-[10px] text-[#D4A04C] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {recs.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                recs.map((rec) => {
                  const sender = getProfile(rec.fromUserId)
                  return (
                    <Link
                      key={rec.id}
                      href={`/book/${rec.bookId}`}
                      onClick={() => handleClickRec(rec)}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0",
                        !rec.read && "bg-[#D4A04C]/5"
                      )}
                    >
                      {sender && (
                        <img
                          src={sender.avatarUrl}
                          alt=""
                          className="size-9 rounded-full border border-[#D4A04C]/20 shrink-0 mt-0.5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed">
                          <span className="font-semibold">{sender?.displayName}</span>{" "}
                          recommended <span className="font-serif italic">{rec.bookTitle}</span>
                        </p>
                        {rec.message && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 italic">
                            &ldquo;{rec.message}&rdquo;
                          </p>
                        )}
                        <p className="text-[9px] text-muted-foreground mt-1">{timeAgo(rec.sentAt)}</p>
                      </div>
                      {!rec.read && (
                        <div className="size-2 rounded-full bg-[#D4A04C] shrink-0 mt-2" />
                      )}
                    </Link>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
