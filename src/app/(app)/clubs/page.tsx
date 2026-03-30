"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Plus, BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Club = {
  id: string
  name: string
  description: string | null
  member_count: number
  cover_color: string
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("book_clubs")
        .select("*")
        .order("member_count", { ascending: false })
      if (data) setClubs(data as Club[])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl" style={{ letterSpacing: "-0.02em" }}>
            Book Clubs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join a club and read together.
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Create Club
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club, i) => (
            <BlurFade key={club.id} delay={0.05 * i} inView>
              <Link href={`/clubs/${club.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={springs.interactive}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 cursor-pointer transition-shadow hover:shadow-sm motion-reduce:hover:scale-100"
                >
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: club.cover_color }}
                  >
                    <BookOpen className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{club.name}</h3>
                    {club.description && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                        {club.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                      <Users className="size-3" />
                      <span>{club.member_count} members</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  )
}
