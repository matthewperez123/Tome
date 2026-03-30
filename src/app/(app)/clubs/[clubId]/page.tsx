"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Users, MessageSquare, BookOpen, Send, SmilePlus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Club = {
  id: string
  name: string
  description: string | null
  member_count: number
  cover_color: string
}

type Member = {
  id: string
  username: string
  role: string
}

type Discussion = {
  id: string
  chapter_title: string | null
  username: string
  avatar_seed: number
  content: string
  created_at: string
}

type Reaction = {
  id: string
  discussion_id: string
  username: string
  emoji: string
}

const QUICK_EMOJIS = ["👏", "💡", "❤️", "🔥", "📚"]

export default function ClubDetailPage() {
  const params = useParams()
  const clubId = params.clubId as string

  const [club, setClub] = useState<Club | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [activeChapter, setActiveChapter] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAll() {
      const [clubRes, membersRes, discRes, reactRes] = await Promise.all([
        supabase.from("book_clubs").select("*").eq("id", clubId).single(),
        supabase.from("club_members").select("*").eq("club_id", clubId).order("joined_at"),
        supabase.from("club_discussions").select("*").eq("club_id", clubId).order("created_at", { ascending: true }),
        supabase.from("club_reactions").select("*"),
      ])
      if (clubRes.data) setClub(clubRes.data as Club)
      if (membersRes.data) setMembers(membersRes.data as Member[])
      if (discRes.data) {
        const discs = discRes.data as Discussion[]
        setDiscussions(discs)
        // Get unique chapters
        const chapters = [...new Set(discs.map(d => d.chapter_title).filter(Boolean))]
        if (chapters.length > 0) setActiveChapter(chapters[0] as string)
      }
      if (reactRes.data) setReactions(reactRes.data as Reaction[])
      setLoading(false)
    }
    fetchAll()

    // Real-time discussions
    const channel = supabase
      .channel(`club-${clubId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "club_discussions", filter: `club_id=eq.${clubId}` }, (payload) => {
        setDiscussions(prev => [...prev, payload.new as Discussion])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [clubId])

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !club) return
    // Insert locally (would go to Supabase with auth)
    const newDisc: Discussion = {
      id: crypto.randomUUID(),
      chapter_title: activeChapter,
      username: "you",
      avatar_seed: 99,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    }
    setDiscussions(prev => [...prev, newDisc])
    setNewMessage("")
  }, [newMessage, club, activeChapter])

  const handleReact = useCallback((discussionId: string, emoji: string) => {
    const newReaction: Reaction = {
      id: crypto.randomUUID(),
      discussion_id: discussionId,
      username: "you",
      emoji,
    }
    setReactions(prev => [...prev, newReaction])
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Club not found.</p>
      </div>
    )
  }

  const chapters = [...new Set(discussions.map(d => d.chapter_title).filter(Boolean))] as string[]
  const filteredDiscussions = activeChapter
    ? discussions.filter(d => d.chapter_title === activeChapter)
    : discussions

  const memberAvatars = members.slice(0, 5).map((m, i) => ({
    imageUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${m.username}`,
    profileUrl: "#",
  }))

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4 md:p-6">
        <BlurFade delay={0.05} inView>
          <div className="flex items-start gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: club.cover_color }}
            >
              <BookOpen className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold tracking-tight" style={{ letterSpacing: "-0.015em" }}>
                {club.name}
              </h1>
              {club.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{club.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                <AvatarCircles
                  avatarUrls={memberAvatars}
                  numPeople={Math.max(0, club.member_count - 5)}
                />
                <span className="text-[10px] text-muted-foreground">
                  {club.member_count} members
                </span>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Chapter tabs */}
        {chapters.length > 0 && (
          <div className="flex gap-1.5 mt-4 overflow-x-auto">
            {chapters.map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChapter(ch)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors",
                  activeChapter === ch
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {ch}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Discussion Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filteredDiscussions.map((disc, i) => {
            const discReactions = reactions.filter(r => r.discussion_id === disc.id)
            const isYou = disc.username === "you"

            return (
              <motion.div
                key={disc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: i * 0.03 }}
                className="flex gap-3"
              >
                {/* Avatar */}
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white mt-0.5"
                  style={{
                    backgroundColor: isYou
                      ? "var(--tome-accent)"
                      : `hsl(${disc.avatar_seed * 67 % 360}, 55%, 55%)`,
                  }}
                >
                  {disc.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold">{disc.username}</span>
                    <span className="text-[9px] text-muted-foreground">
                      {formatTime(disc.created_at)}
                    </span>
                    {disc.chapter_title && (
                      <span className="text-[9px] text-muted-foreground/50">
                        {disc.chapter_title}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">
                    {disc.content}
                  </p>

                  {/* Reactions */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {/* Grouped reactions */}
                    {Object.entries(
                      discReactions.reduce<Record<string, number>>((acc, r) => {
                        acc[r.emoji] = (acc[r.emoji] ?? 0) + 1
                        return acc
                      }, {})
                    ).map(([emoji, count]) => (
                      <span
                        key={emoji}
                        className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px]"
                      >
                        {emoji} <span className="text-muted-foreground tabular-nums">{count}</span>
                      </span>
                    ))}

                    {/* Quick react */}
                    <div className="group relative">
                      <button className="flex size-5 items-center justify-center rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                        <SmilePlus className="size-3" />
                      </button>
                      <div className="absolute left-0 bottom-full mb-1 hidden group-hover:flex gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg z-10">
                        {QUICK_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReact(disc.id, emoji)}
                            className="flex size-6 items-center justify-center rounded hover:bg-muted text-sm transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredDiscussions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="size-8 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">No discussions yet for this chapter.</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts…"
            className="flex-1 h-9 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newMessage.trim()) handleSend()
            }}
          />
          <Button
            size="icon-sm"
            disabled={!newMessage.trim()}
            onClick={handleSend}
          >
            <Send className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
