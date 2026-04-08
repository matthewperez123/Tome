"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, Flame, Trophy, Shield, Send, UserPlus, Clock } from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import {
  getCurrentUser,
  getProfile,
  isFriend,
  getMutualFriends,
  sendFriendRequest,
  subscribe,
  type MockProfile,
} from "@/lib/mock/social"
import { cn } from "@/lib/utils"

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "just now"
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "yesterday"
  return `${days}d ago`
}

const ACTIVITY_ICONS = {
  completed_book: BookOpen,
  started_book: BookOpen,
  earned_seal: Shield,
  reached_milestone: Trophy,
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [profile, setProfile] = useState<MockProfile | null>(null)
  const [isOwn, setIsOwn] = useState(false)
  const [areFriends, setAreFriends] = useState(false)
  const [mutuals, setMutuals] = useState<MockProfile[]>([])
  const [addingFriend, setAddingFriend] = useState(false)

  useEffect(() => {
    const current = getCurrentUser()
    const p = getProfile(username)
    setProfile(p)
    setIsOwn(current.username === username)
    if (p) {
      setAreFriends(isFriend(p.id))
      setMutuals(getMutualFriends(p.id))
    }
    return subscribe(() => {
      const p2 = getProfile(username)
      setProfile(p2)
      if (p2) setAreFriends(isFriend(p2.id))
    })
  }, [username])

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    )
  }

  async function handleAddFriend() {
    if (!profile) return
    setAddingFriend(true)
    await sendFriendRequest(profile.id)
    setAddingFriend(false)
    toast.success(`You and ${profile.displayName} are now friends!`)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero */}
      <BlurFade delay={0.04} inView>
        <div className="flex items-start gap-5">
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="size-20 rounded-full border-2 border-[#D4A04C]/20 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              {profile.displayName}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <p className="font-serif text-sm text-foreground/80 mt-2 leading-relaxed italic">
              {profile.bio}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {isOwn ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => toast("Profile editing coming soon")}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  {!areFriends && (
                    <Button
                      size="sm"
                      className="text-xs gap-1.5"
                      disabled={addingFriend}
                      onClick={handleAddFriend}
                    >
                      <UserPlus className="size-3.5" />
                      {addingFriend ? "Adding..." : "Add friend"}
                    </Button>
                  )}
                  <Link href={`/book/${profile.currentlyReading.bookId}`}>
                    <Button size="sm" variant={areFriends ? "default" : "outline"} className="text-xs gap-1.5">
                      <Send className="size-3.5" />
                      Send a book
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => toast("Messaging coming soon")}
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Stats */}
      <BlurFade delay={0.08} inView>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Books", value: profile.stats.booksCompleted, icon: BookOpen, color: "#22C55E" },
            { label: "Wisdom", value: profile.stats.wisdom, icon: Trophy, color: "#6366F1" },
            { label: "Flames", value: profile.stats.flames, icon: Flame, color: "#E8734A" },
            { label: "Seals", value: profile.stats.seals, icon: Shield, color: "#D4A04C" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3"
            >
              <Icon className="size-4" style={{ color }} />
              <p className="text-lg font-bold tabular-nums">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </BlurFade>

      {/* Currently Reading */}
      <BlurFade delay={0.12} inView>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-4 text-[#22C55E]" />
            <h2 className="text-sm font-semibold">Currently Reading</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/book/${profile.currentlyReading.bookId}`}
                className="text-sm font-semibold hover:text-[var(--tome-accent)] transition-colors"
              >
                {profile.currentlyReading.bookTitle}
              </Link>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>Chapter {profile.currentlyReading.chapter} / {profile.currentlyReading.totalChapters}</span>
                <span>{Math.round((profile.currentlyReading.chapter / profile.currentlyReading.totalChapters) * 100)}%</span>
              </div>
              <div className="h-1 w-full max-w-[200px] bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-[#22C55E]"
                  style={{ width: `${(profile.currentlyReading.chapter / profile.currentlyReading.totalChapters) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Recent Activity */}
      <BlurFade delay={0.16} inView>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-4 text-[#0EA5E9]" />
            <h2 className="text-sm font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {profile.recentActivity.map((activity, i) => {
              const Icon = ACTIVITY_ICONS[activity.type]
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="size-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">{activity.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </BlurFade>

      {/* Mutuals (for friend profiles) */}
      {!isOwn && mutuals.length > 0 && (
        <BlurFade delay={0.2} inView>
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold mb-3">Mutual Friends</h2>
            <div className="flex gap-3">
              {mutuals.map((m) => (
                <Link key={m.id} href={`/profile/${m.username}`} className="flex items-center gap-2 group">
                  <img src={m.avatarUrl} alt="" className="size-8 rounded-full border border-[#D4A04C]/20" />
                  <span className="text-xs group-hover:text-[var(--tome-accent)] transition-colors">{m.displayName}</span>
                </Link>
              ))}
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  )
}
