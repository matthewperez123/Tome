"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Search, UserPlus, Check, X, BookOpen, Flame } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getSuggestedProfiles,
  sendFriendRequest,
  searchProfiles,
  getProfile,
  subscribe,
  type MockProfile,
  type FriendRequest,
} from "@/lib/mock/social"
import { cn } from "@/lib/utils"

export default function FriendsPage() {
  const [tab, setTab] = useState<"friends" | "requests">("friends")
  const [friends, setFriends] = useState<MockProfile[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MockProfile[] | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggested, setSuggested] = useState<MockProfile[]>([])
  const [pendingAdd, setPendingAdd] = useState<Set<string>>(new Set())

  const refresh = useCallback(() => {
    setFriends(getFriends())
    setRequests(getFriendRequests())
    setSuggested(getSuggestedProfiles())
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timeout = setTimeout(() => {
        setSearchResults(searchProfiles(query))
      }, 200)
      return () => clearTimeout(timeout)
    } else {
      setSearchResults(null)
    }
  }, [query])

  async function handleAddFriend(userId: string) {
    setPendingAdd((s) => new Set(s).add(userId))
    await sendFriendRequest(userId)
    setPendingAdd((s) => { const n = new Set(s); n.delete(userId); return n })
    toast.success("Friend request accepted!")
  }

  function handleAccept(reqId: string) {
    acceptFriendRequest(reqId)
    toast.success("Friend request accepted!")
  }

  function handleDecline(reqId: string) {
    declineFriendRequest(reqId)
  }

  const displayList = searchResults ?? friends

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <BlurFade delay={0.04} inView>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-tight md:text-2xl" style={{ letterSpacing: "-0.02em" }}>
              Friends
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{friends.length} friends</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search friends..."
                className="h-8 pl-8 text-sm bg-muted/50 border-transparent focus-visible:border-[var(--tome-accent)]"
              />
            </div>
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <UserPlus className="size-3.5" />
                Find friends
              </Button>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-xl z-50"
                  >
                    <p className="text-[11px] text-muted-foreground mb-2 font-medium">Suggested readers</p>
                    <div className="space-y-2">
                      {suggested.map((p) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <img src={p.avatarUrl} alt="" className="size-9 rounded-full border border-[#D4A04C]/20" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{p.displayName}</p>
                            <p className="text-[10px] text-muted-foreground">@{p.username}</p>
                          </div>
                          <Button
                            size="sm"
                            className="h-7 text-[10px] gap-1"
                            disabled={pendingAdd.has(p.id)}
                            onClick={() => handleAddFriend(p.id)}
                          >
                            {pendingAdd.has(p.id) ? "Adding..." : <><UserPlus className="size-3" /> Add</>}
                          </Button>
                        </div>
                      ))}
                      {suggested.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-3">No more suggestions</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6">
        <button
          onClick={() => setTab("friends")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
            tab === "friends" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          All Friends
        </button>
        <button
          onClick={() => setTab("requests")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors relative",
            tab === "requests" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Requests
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#D4A04C] text-[9px] font-bold text-[#1a1a2e] flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {tab === "friends" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayList.map((friend, i) => (
            <BlurFade key={friend.id} delay={0.03 * i} inView>
              <Link
                href={`/profile/${friend.username}`}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-[var(--tome-accent)]/30 hover:shadow-sm"
              >
                <img
                  src={friend.avatarUrl}
                  alt={friend.displayName}
                  className="size-12 rounded-full border border-[#D4A04C]/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold group-hover:text-[var(--tome-accent)] transition-colors truncate">
                    {friend.displayName}
                  </p>
                  <p className="text-[10px] text-muted-foreground">@{friend.username}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <BookOpen className="size-3 shrink-0" />
                    <span className="truncate">{friend.currentlyReading.bookTitle}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[9px] text-muted-foreground/70">
                    <span>{friend.stats.booksCompleted} books</span>
                    <span className="flex items-center gap-0.5"><Flame className="size-2.5" />{friend.stats.flames}</span>
                  </div>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-12 rounded-full flex items-center justify-center text-lg font-serif font-bold mb-3" style={{ background: "rgba(212,160,76,0.1)", color: "#D4A04C" }}>
                V
              </div>
              <p className="text-sm text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            requests.map((req) => {
              const sender = getProfile(req.fromUserId)
              if (!sender) return null
              return (
                <BlurFade key={req.id} delay={0.05} inView>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <img src={sender.avatarUrl} alt="" className="size-11 rounded-full border border-[#D4A04C]/20" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{sender.displayName}</p>
                      <p className="text-[10px] text-muted-foreground">@{sender.username} · {sender.bio}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => handleAccept(req.id)}>
                        <Check className="size-3" /> Accept
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => handleDecline(req.id)}>
                        <X className="size-3" />
                      </Button>
                    </div>
                  </div>
                </BlurFade>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
