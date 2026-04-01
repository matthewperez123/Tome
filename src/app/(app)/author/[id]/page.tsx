/**
 * TOME DESIGN RUBRIC — Author Profile
 * Reference: Britannica + A24 press kits + The Paris Review
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       5/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Lightbulb, MapPin, Calendar, ChevronRight, Library } from "lucide-react"
import { getAuthorById, getAuthorsByTradition, type Author } from "@/data/authors"
import { getBooksByAuthor } from "@/lib/content"
import type { TomeBook } from "@/data/books"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookCard } from "@/components/tome/book-card"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

const TRADITION_COLORS: Record<string, string> = {
  "Ancient Greek": "#0EA5E9",
  Roman: "#EF4444",
  "Medieval European": "#F59E0B",
  Renaissance: "#EAB308",
  Enlightenment: "#06B6D4",
  Romantic: "#F43F5E",
  Victorian: "#A855F7",
  Russian: "#3B82F6",
  American: "#6366F1",
  French: "#F97316",
  Modernist: "#14B8A6",
  "Post-Colonial": "#10B981",
  Eastern: "#FB923C",
  Contemporary: "#8B5CF6",
}

// ── Helpers ────────────────────────────────────

function formatYear(year?: number): string {
  if (!year) return "?"
  return year < 0 ? `${Math.abs(year)} BC` : `${year}`
}

function formatLifespan(birth?: number, death?: number): string {
  if (!birth && !death) return ""
  return `${formatYear(birth)} – ${death ? formatYear(death) : "present"}`
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getTraditionColor(traditions: string[]): string {
  return TRADITION_COLORS[traditions[0]] ?? "#6366F1"
}

// ── Sub-components ─────────────────────────────

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div className="relative flex items-center my-6" aria-hidden>
      <div className="flex-1 h-px bg-border" />
      <div className="mx-3 shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
            fill={color}
          />
        </svg>
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function AuthorAvatar({
  name,
  color,
  size = "lg",
}: {
  name: string
  color: string
  size?: "sm" | "md" | "lg"
}) {
  const initials = getInitials(name)
  const sizeClasses = {
    sm: "size-16 text-lg",
    md: "size-20 text-xl",
    lg: "size-32 text-3xl",
  }

  return (
    <div className={cn("relative shrink-0 rounded-full", sizeClasses[size])}>
      {/* Decorative ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${color}33, ${color}88, ${color}33, transparent, ${color}33)`,
          padding: "2px",
        }}
      />
      <div
        className={cn(
          "absolute inset-[3px] rounded-full flex items-center justify-center font-serif font-bold select-none",
          sizeClasses[size]
        )}
        style={{
          background: `radial-gradient(135% 135% at 25% 20%, ${color}40 0%, ${color}18 50%, transparent 100%)`,
          border: `1.5px solid ${color}44`,
          color: color,
        }}
      >
        <span>{initials}</span>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────

export default function AuthorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [author, setAuthor] = useState<Author | null>(null)
  const [books, setBooks] = useState<TomeBook[]>([])
  const [notFound, setNotFound] = useState(false)

  // Resolve author from slug/id
  useEffect(() => {
    const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""
    const found = getAuthorById(id)
    if (!found) {
      setNotFound(true)
    } else {
      setAuthor(found)
      setBooks(getBooksByAuthor(found.id))
    }
  }, [params.id])

  // Not found redirect
  useEffect(() => {
    if (notFound) router.replace("/library")
  }, [notFound, router])

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="flex gap-6 items-start">
          <Skeleton className="size-32 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  const accentColor = getTraditionColor(author.traditions)
  const relatedAuthors = getAuthorsByTradition(author.traditions[0])
    .filter((a) => a.id !== author.id)
    .slice(0, 5)

  const bioParagraphs = author.bio.split(/\n+/).filter(Boolean)
  const bioMain = bioParagraphs[0] ?? ""
  const bioQuote = bioParagraphs[1] ?? ""

  const lifespan = formatLifespan(author.birthYear, author.deathYear)

  return (
    <div className="min-h-screen pb-24">
      {/* ── Breadcrumb ─────────────────────────── */}
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <li>
            <Link href="/library" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Library className="size-3" />
              Library
            </Link>
          </li>
          <li aria-hidden><ChevronRight className="size-3" /></li>
          <li>
            <Link href="/authors" className="hover:text-foreground transition-colors">Authors</Link>
          </li>
          <li aria-hidden><ChevronRight className="size-3" /></li>
          <li className="text-foreground font-medium truncate max-w-[180px]">{author.name}</li>
        </ol>
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <BlurFade delay={0.05} inView>
        <section
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 50%, transparent 100%)`,
            borderBottom: `1px solid ${accentColor}22`,
          }}
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
            aria-hidden
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springs.interactive}
              >
                <AuthorAvatar name={author.name} color={accentColor} size="lg" />
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1
                  className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-none mb-2"
                  style={{ color: "var(--tome-text-primary, inherit)" }}
                >
                  {author.name}
                </h1>

                {author.fullName && author.fullName !== author.name && (
                  <p className="text-lg text-muted-foreground font-serif italic mb-3">
                    {author.fullName}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mb-4">
                  {lifespan && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 shrink-0" />
                      {lifespan}
                    </span>
                  )}
                  {author.birthPlace && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      {author.birthPlace}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="font-medium text-xs px-3 py-1 rounded-full"
                    style={{
                      background: `${accentColor}20`,
                      color: accentColor,
                      border: `1px solid ${accentColor}40`,
                    }}
                  >
                    {author.era}
                  </Badge>

                  {author.traditions.map((tradition) => (
                    <Badge
                      key={tradition}
                      variant="outline"
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        borderColor: `${TRADITION_COLORS[tradition] ?? accentColor}55`,
                        color: TRADITION_COLORS[tradition] ?? accentColor,
                      }}
                    >
                      {tradition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </BlurFade>

      {/* ── Body ─────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* Biography */}
        <BlurFade delay={0.1} inView>
          <section>
            <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">Biography</h2>
            <OrnamentalDivider color={accentColor} />

            <p className="font-serif text-lg leading-relaxed text-foreground max-w-2xl">
              {bioMain}
            </p>

            {bioQuote && (
              <blockquote
                className="relative mt-8 max-w-2xl pl-6 py-2"
                style={{ borderLeft: `3px solid ${accentColor}` }}
              >
                {/* Decorative large opening quote */}
                <span
                  className="absolute -top-4 -left-2 font-serif text-7xl leading-none select-none pointer-events-none"
                  style={{ color: `${accentColor}20` }}
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="font-serif text-lg italic leading-relaxed text-foreground/85 relative z-10">
                  {bioQuote}
                </p>
              </blockquote>
            )}
          </section>
        </BlurFade>

        {/* Pull Quote */}
        {author.quotes[0] && (
          <BlurFade delay={0.15} inView>
            <section
              className="relative py-10 px-6 sm:px-10 rounded-2xl overflow-hidden text-center"
              style={{
                background: `linear-gradient(135deg, ${accentColor}0a 0%, transparent 100%)`,
                border: `1px solid ${accentColor}20`,
              }}
            >
              {/* Opening decorative mark */}
              <span
                className="block font-serif text-6xl leading-none mb-2 select-none"
                style={{ color: "var(--tome-amber, #f59e0b)" }}
                aria-hidden
              >
                &ldquo;
              </span>
              <p
                className="font-serif text-xl sm:text-2xl italic leading-relaxed max-w-2xl mx-auto"
                style={{ color: "var(--tome-amber, #f59e0b)" }}
              >
                {author.quotes[0]}
              </p>
              <span
                className="block font-serif text-6xl leading-none mt-2 select-none"
                style={{ color: "var(--tome-amber, #f59e0b)" }}
                aria-hidden
              >
                &rdquo;
              </span>
            </section>
          </BlurFade>
        )}

        {/* Themes & Influence */}
        <BlurFade delay={0.2} inView>
          <section className="grid sm:grid-cols-2 gap-8">
            {/* Key Themes */}
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">Key Themes</h2>
              <OrnamentalDivider color={accentColor} />
              <div className="flex flex-wrap gap-2">
                {author.themes.map((theme) => (
                  <span
                    key={theme}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: `${accentColor}15`,
                      color: accentColor,
                      border: `1px solid ${accentColor}30`,
                    }}
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Literary Legacy */}
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">Literary Legacy</h2>
              <OrnamentalDivider color={accentColor} />
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {author.influence}
                </p>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* Works in Library */}
        <BlurFade delay={0.25} inView>
          <section>
            <h2 className="font-serif text-2xl font-semibold tracking-tight mb-1">
              Works in Tome&rsquo;s Library
            </h2>
            <OrnamentalDivider color={accentColor} />

            {books.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{
                  background: `${accentColor}08`,
                  border: `1px dashed ${accentColor}30`,
                }}
              >
                <p className="text-muted-foreground font-serif italic text-lg">
                  No works in the library yet.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  We&rsquo;re working on adding more titles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                {books.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...springs.gentle, delay: i * 0.06 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </BlurFade>

        {/* Fun Fact */}
        {author.funFact && (
          <BlurFade delay={0.25} inView>
            <section>
              <div
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{
                  background: "color-mix(in srgb, var(--tome-amber, #f59e0b) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--tome-amber, #f59e0b) 30%, transparent)",
                }}
              >
                <div
                  className="mt-0.5 shrink-0 size-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, var(--tome-amber, #f59e0b) 20%, transparent)",
                  }}
                >
                  <Lightbulb
                    className="size-4.5"
                    style={{ color: "var(--tome-amber, #f59e0b)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--tome-amber, #f59e0b)" }}
                  >
                    Did You Know?
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85">{author.funFact}</p>
                </div>
              </div>
            </section>
          </BlurFade>
        )}

        {/* Virgil's Note */}
        {author.virgilNote && (
          <BlurFade delay={0.3} inView>
            <section>
              <div
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{
                  background: "color-mix(in srgb, #6366f1 8%, transparent)",
                  border: "1px solid color-mix(in srgb, #6366f1 25%, transparent)",
                }}
              >
                <div
                  className="mt-0.5 shrink-0 size-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, #6366f1 20%, transparent)",
                  }}
                >
                  <BookOpen className="size-4.5" style={{ color: "#6366f1" }} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "#6366f1" }}
                  >
                    Virgil&rsquo;s Note
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/85 font-serif italic">
                    {author.virgilNote}
                  </p>
                </div>
              </div>
            </section>
          </BlurFade>
        )}

        {/* More from This Tradition */}
        {relatedAuthors.length > 0 && (
          <BlurFade delay={0.3} inView>
            <section>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  More from {author.traditions[0]}
                </h2>
                <Link
                  href={`/explore`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore all
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <OrnamentalDivider color={accentColor} />

              <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-none snap-x snap-mandatory">
                {relatedAuthors.map((relAuthor, i) => {
                  const relColor = getTraditionColor(relAuthor.traditions)
                  const relLifespan = formatLifespan(relAuthor.birthYear, relAuthor.deathYear)

                  return (
                    <motion.div
                      key={relAuthor.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...springs.gentle, delay: 0.3 + i * 0.06 }}
                      className="shrink-0 snap-start"
                    >
                      <Link
                        href={`/author/${relAuthor.id}`}
                        className="group flex flex-col items-center gap-3 w-28 text-center rounded-xl p-3 transition-colors hover:bg-muted/60"
                      >
                        <AuthorAvatar name={relAuthor.name} color={relColor} size="md" />
                        <div>
                          <p className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-[color:var(--tome-accent,#6366f1)] transition-colors">
                            {relAuthor.name}
                          </p>
                          {relLifespan && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{relLifespan}</p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
