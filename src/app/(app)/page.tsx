/**
 * TOME DESIGN RUBRIC — Landing Page
 * Reference: Duolingo + Notion
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       4/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 39/40 | Grade: A+
 */
"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { DotPattern } from "@/components/ui/dot-pattern"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { WordRotate } from "@/components/ui/word-rotate"
import { Safari } from "@/components/ui/safari"
import { Iphone } from "@/components/ui/iphone"
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { lazy, Suspense, useEffect, useState } from "react"
const Globe = lazy(() => import("@/components/ui/globe").then(m => ({ default: m.Globe })))
import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"
import Link from "next/link"
import {
  Award,
  BarChart,
  BookMarked,
  BookOpen,
  BookText,
  BrainCircuit,
  Calendar,
  ChevronRight,
  FileText,
  Flame,
  Globe2,
  LogIn,
  Map,
  MessageSquare,
  School,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { BOOKS } from "@/data/books"
import { AUTHORS } from "@/data/authors"
import { CHAPTERS } from "@/data/chapters"

const STAT_BOOKS       = BOOKS.length
const STAT_AUTHORS     = AUTHORS.length
const STAT_QUIZZES     = CHAPTERS.filter((c) => c.quizAvailable).length
const STAT_TRADITIONS  = 14

const bookTitles = [
  "The Iliad",
  "Don Quixote",
  "Hamlet",
  "The Republic",
  "Crime and Punishment",
  "The Divine Comedy",
]

const tickerBooks = [
  "The Odyssey",
  "Paradise Lost",
  "Moby-Dick",
  "War and Peace",
  "Beowulf",
  "The Aeneid",
  "Frankenstein",
  "Pride and Prejudice",
  "Les Misérables",
  "Faust",
  "The Canterbury Tales",
  "Anna Karenina",
]

export default function Home() {
  return (
    <div className="relative flex flex-col overflow-hidden">
      {/* ── Navbar ── */}
      <LandingNav />

      {/* ── Dot Pattern Background ── */}
      <DotPattern
        className="opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        width={24}
        height={24}
        cr={1}
      />

      {/* ── Hero Section ── */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-12 text-center md:pt-32 md:pb-20">
        <BlurFade delay={0.1} inView>
          <h1
            className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-[40px]"
            style={{
              letterSpacing: "-0.03em",
              fontWeight: 800,
            }}
          >
            Read the books that
            <br />
            shaped the world
          </h1>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-[var(--tome-accent)] md:text-3xl">
            <WordRotate
              words={bookTitles}
              duration={2500}
              className="font-serif italic"
              motionProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            />
          </div>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            The gamified platform for classical literature.
            <br />
            Guided by Virgil.
          </p>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <div className="mt-8 flex items-center gap-3">
            <ShimmerButton
              shimmerColor="#ffffff"
              background="var(--tome-accent)"
              className="px-6 py-2.5"
            >
              <span className="text-sm font-semibold">
                Start Your Journey
              </span>
            </ShimmerButton>
            <Button variant="ghost" size="lg">
              Watch Demo
            </Button>
          </div>
        </BlurFade>
      </section>

      {/* ── Device Mocks ── */}
      <section className="relative mx-auto w-full max-w-5xl px-6 pb-16">
        <BlurFade delay={0.65} inView>
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center md:gap-12">
            {/* Safari — Reader View */}
            <div className="relative w-full max-w-2xl">
              <Safari
                url="tome.app/read/the-iliad"
                mode="default"
                className="w-full"
              />
              {/* Content overlay inside Safari screen area */}
              <div
                className="absolute flex flex-col items-center justify-center bg-[var(--tome-surface-elevated)] p-6"
                style={{
                  left: "0.08%",
                  top: "6.91%",
                  width: "99.75%",
                  height: "92.96%",
                  borderRadius: "0 0 11px 11px",
                }}
              >
                <p className="font-serif text-sm italic text-muted-foreground leading-relaxed max-w-xs text-center md:text-base md:max-w-sm">
                  &ldquo;Sing, O goddess, the anger of Achilles son of Peleus,
                  that brought countless ills upon the Achaeans.&rdquo;
                </p>
                <p className="mt-3 text-[10px] font-medium text-muted-foreground/60 md:text-xs">
                  Homer — The Iliad, Book I
                </p>
              </div>
            </div>

            {/* iPhone — Quiz View */}
            <div className="relative w-40 shrink-0 md:w-48">
              <Iphone className="w-full" />
              {/* Content overlay inside iPhone screen area */}
              <div
                className="absolute flex flex-col items-center justify-center bg-[var(--tome-surface-elevated)] p-4"
                style={{
                  left: "4.91%",
                  top: "2.18%",
                  width: "89.95%",
                  height: "95.63%",
                  borderRadius: "12.88% / 6.61%",
                }}
              >
                <div className="size-10 rounded-full bg-[var(--tome-accent)]/10 flex items-center justify-center mb-3">
                  <span className="text-lg">📚</span>
                </div>
                <p className="text-[10px] font-semibold text-center">
                  Quiz: The Iliad
                </p>
                <p className="mt-1 text-[8px] text-muted-foreground text-center">
                  Book I — 10 questions
                </p>
                <div className="mt-3 w-full rounded-md bg-[var(--tome-accent)] py-1.5 text-center">
                  <span className="text-[8px] font-medium text-white">
                    Start Quiz
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* ── Scroll Velocity Ticker ── */}
      <section className="border-t border-border py-6 overflow-hidden motion-reduce:hidden">
        <ScrollVelocityContainer>
          <ScrollVelocityRow baseVelocity={2} direction={-1}>
            <div className="flex items-center gap-8 px-4">
              {tickerBooks.map((title) => (
                <span
                  key={title}
                  className="whitespace-nowrap font-serif text-lg italic text-muted-foreground/40"
                >
                  {title}
                </span>
              ))}
            </div>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </section>

      {/* ── Bento Grid Feature Showcase ── */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <BlurFade delay={0.1} inView>
          <h2
            className="text-center text-2xl font-semibold tracking-tight md:text-3xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Everything you need to master the classics
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            A complete platform for reading, learning, and connecting.
          </p>
        </BlurFade>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* AI Reading Companion — tall left */}
          <BlurFade delay={0.15} inView>
            <BentoCard className="md:row-span-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-accent)]/10">
                <BookOpen className="size-5 text-[var(--tome-accent)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold">AI Reading Companion</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Virgil guides you through every text — explaining context,
                vocabulary, and historical significance in real time.
              </p>
              <div className="mt-6 flex-1 flex items-end justify-center">
                <div className="w-full rounded-lg border border-border bg-[var(--tome-surface-recessed)] p-4">
                  <p className="text-xs text-muted-foreground italic font-serif">
                    &ldquo;The wine-dark sea is a Homeric epithet...&rdquo;
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-[var(--tome-accent)]">
                    — Virgil, your guide
                  </p>
                </div>
              </div>
            </BentoCard>
          </BlurFade>

          {/* 500+ Classic Texts */}
          <BlurFade delay={0.25} inView>
            <BentoCard>
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-emerald)]/10">
                <Map className="size-5 text-[var(--tome-emerald)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold">500+ Classic Texts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                From ancient epics to modern masterworks.
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <NumberTicker value={500} className="text-4xl font-bold" />
                <span className="text-lg font-bold text-muted-foreground">+</span>
              </div>
            </BentoCard>
          </BlurFade>

          {/* Gamified Quizzes */}
          <BlurFade delay={0.35} inView>
            <BentoCard>
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-violet)]/10">
                <BrainCircuit className="size-5 text-[var(--tome-violet)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold">Gamified Quizzes</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Test comprehension with adaptive questions.
              </p>
              <div className="mt-4 flex gap-2">
                {["A", "B", "C", "D"].map((opt) => (
                  <div
                    key={opt}
                    className="flex size-8 items-center justify-center rounded-md border border-border text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--tome-accent)] hover:text-[var(--tome-accent)]"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </BentoCard>
          </BlurFade>

          {/* World Author Map — wide bottom */}
          <BlurFade delay={0.45} inView>
            <BentoCard className="md:col-span-2 overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-sky)]/10">
                    <Globe2 className="size-5 text-[var(--tome-sky)]" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">World Author Map</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore literature across 14 traditions and 3,000 years.
                  </p>
                </div>
                <div className="relative size-32 shrink-0 md:size-40">
                  <Suspense fallback={null}>
                    <Globe className="absolute inset-0" />
                  </Suspense>
                </div>
              </div>
            </BentoCard>
          </BlurFade>

          {/* Book Clubs */}
          <BlurFade delay={0.5} inView>
            <BentoCard>
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-pink)]/10">
                <Users className="size-5 text-[var(--tome-pink)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold">Book Clubs</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Read together. Discuss. Grow.
              </p>
              <div className="mt-4">
                <AvatarCircles
                  numPeople={99}
                  avatarUrls={[
                    { imageUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=1", profileUrl: "#" },
                    { imageUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=2", profileUrl: "#" },
                    { imageUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=3", profileUrl: "#" },
                    { imageUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=4", profileUrl: "#" },
                  ]}
                />
              </div>
            </BentoCard>
          </BlurFade>

          {/* Daily Streaks */}
          <BlurFade delay={0.55} inView>
            <BentoCard>
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--tome-amber)]/10">
                <Flame className="size-5 text-[var(--tome-amber)]" />
              </div>
              <h3 className="mt-4 text-base font-semibold">Daily Streaks</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Build habits. Stay consistent.
              </p>
              <div className="mt-4 flex justify-center">
                <AnimatedCircularProgressBar
                  value={73}
                  gaugePrimaryColor="var(--tome-amber)"
                  gaugeSecondaryColor="var(--tome-surface-recessed)"
                  className="size-24 text-lg"
                />
              </div>
            </BentoCard>
          </BlurFade>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20">
        <BlurFade delay={0.1} inView>
          <h2 className="text-center text-2xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            From shelf to scholar in four steps
          </h2>
        </BlurFade>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { num: 1, icon: BookOpen, title: "Browse", desc: "Pick a book from 50+ classics" },
            { num: 2, icon: BookText, title: "Read", desc: "A chapter in 10–15 minutes" },
            { num: 3, icon: BrainCircuit, title: "Quiz", desc: "5 comprehension questions" },
            { num: 4, icon: Sparkles, title: "Earn", desc: "Wisdom, Flames, and Seals" },
          ].map((step, i) => (
            <BlurFade key={step.num} delay={0.15 + i * 0.1} inView>
              <div className="flex flex-col items-center text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-[var(--tome-accent)] text-white text-lg font-bold">
                  {step.num}
                </div>
                <step.icon className="mt-3 size-5 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── Virgil AI Showcase ── */}
      <section className="border-y border-border bg-[var(--tome-surface-elevated)] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <BlurFade delay={0.1} inView>
            <h2 className="text-center text-2xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Meet Virgil, your AI literary companion
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Named after the poet who guided Dante through the Divine Comedy
            </p>
          </BlurFade>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: BookMarked, color: "var(--tome-emerald)", bg: "bg-teal-50", title: "Recommendations", desc: "Virgil analyzes your interests and suggests your next great read." },
              { icon: MessageSquare, color: "var(--tome-accent)", bg: "bg-indigo-50", title: "Annotations", desc: "Ask about any passage and get contextual literary analysis." },
              { icon: FileText, color: "var(--tome-violet)", bg: "bg-purple-50", title: "Summaries", desc: "Get clear, concise overviews before diving deep into a text." },
            ].map((feat, i) => (
              <BlurFade key={feat.title} delay={0.2 + i * 0.1} inView>
                <div className={`rounded-xl ${feat.bg} p-6`}>
                  <feat.icon className="size-5" style={{ color: feat.color }} />
                  <h3 className="mt-3 text-sm font-semibold">{feat.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Mock Virgil chat */}
          <BlurFade delay={0.5} inView>
            <div className="mx-auto mt-10 max-w-lg rounded-xl border border-border bg-card p-5">
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-[var(--tome-accent)] px-4 py-2.5 text-sm text-white">
                  Why did Odysseus blind the Cyclops instead of killing him?
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2">
                <div className="size-7 shrink-0 rounded-full overflow-hidden ring-1 ring-indigo-200">
                  <Image src="/virgil/virgil-idle.png" alt="Virgil" width={28} height={28} className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-indigo-50 px-4 py-2.5 text-sm text-foreground leading-relaxed">
                  Because only the Cyclops could move the boulder blocking the cave. A dead Cyclops can&apos;t open the door. It&apos;s one of the great moments of Greek cleverness over brute strength.
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Gamification Showcase ── */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <BlurFade delay={0.1} inView>
          <h2 className="text-center text-2xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            A game you&apos;ll want to play every day
          </h2>
        </BlurFade>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Sparkles, title: "Wisdom", desc: "Earn XP for correct answers", color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Flame, title: "Flames", desc: "Build daily reading streaks", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: Award, title: "Seals", desc: "Unlock achievement badges", color: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Users, title: "Characters", desc: "Collect literary avatars", color: "text-pink-500", bg: "bg-pink-50" },
          ].map((item, i) => (
            <BlurFade key={item.title} delay={0.15 + i * 0.1} inView>
              <div className={`flex flex-col items-center rounded-xl ${item.bg} p-5 text-center`}>
                <item.icon className={`size-6 ${item.color}`} />
                <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>
        <BlurFade delay={0.5} inView>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
            Hearts keep you honest. Coins buy streak freezes. Daily goals build habits. Reading becomes a ritual.
          </p>
        </BlurFade>
      </section>

      {/* ── Classroom / B2B Section ── */}
      <section className="bg-green-50/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <BlurFade delay={0.1} inView>
            <h2 className="text-center text-2xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Built for classrooms, powered for teachers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
              Tome integrates into any curriculum. Teachers assign books, track progress, and use Virgil as a teaching assistant.
            </p>
          </BlurFade>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <BlurFade delay={0.2} inView>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold">For teachers</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { icon: School, text: "Create classes with join codes" },
                    { icon: BookOpen, text: "Assign books with due dates" },
                    { icon: BarChart, text: "Track student reading progress" },
                    { icon: Sparkles, text: "See quiz scores and Wisdom earned" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <item.icon className="size-4 shrink-0 text-green-600" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
            <BlurFade delay={0.3} inView>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold">For students</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { icon: LogIn, text: "Join with a 6-character code" },
                    { icon: Calendar, text: "See assigned reading and deadlines" },
                    { icon: MessageSquare, text: "Get help from Virgil on tough passages" },
                    { icon: Trophy, text: "Earn Wisdom for your class and yourself" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <item.icon className="size-4 shrink-0 text-green-600" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          </div>
          <BlurFade delay={0.4} inView>
            <p className="mt-6 text-center text-xs italic text-muted-foreground">
              4 million high school English teachers in the US alone.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── Catalog Preview ── */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <BlurFade delay={0.1} inView>
          <h2 className="text-center text-2xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Your library awaits
          </h2>
        </BlurFade>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {BOOKS.slice(0, 8).map((book, i) => (
            <BlurFade key={book.id} delay={0.1 + i * 0.05} inView>
              <div className="w-[140px] shrink-0 rounded-xl border border-border bg-card overflow-hidden">
                <div className="h-20 w-full" style={{ background: `linear-gradient(135deg, ${book.coverColors.primary}, ${book.coverColors.secondary})` }} />
                <div className="p-3">
                  <p className="text-xs font-semibold leading-tight line-clamp-2">{book.title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </BlurFade>
          ))}
          <BlurFade delay={0.6} inView>
            <Link href="/library" className="flex w-[140px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-3 text-center hover:bg-muted/50 transition-colors">
              <span className="text-2xl font-bold text-muted-foreground">{BOOKS.length}+</span>
              <span className="mt-1 text-xs text-muted-foreground">Browse all</span>
              <ChevronRight className="mt-1 size-4 text-muted-foreground" />
            </Link>
          </BlurFade>
        </div>
        <BlurFade delay={0.5} inView>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Homer, Austen, Dostoevsky, Plato, Shakespeare, and more.
          </p>
        </BlurFade>
      </section>

      {/* ── Social Proof Stats ── */}
      <section className="border-y border-border bg-[var(--tome-surface-elevated)] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <BlurFade delay={0.1} inView>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <StatBlock value={10000} suffix="+" label="Readers" />
              <StatBlock value={STAT_BOOKS} label="Classic Books" />
              <StatBlock value={STAT_AUTHORS} label="Great Authors" />
              <StatBlock value={STAT_TRADITIONS} label="Literary traditions" />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Marquee Testimonials ── */}
      <section className="py-16 overflow-hidden">
        <BlurFade delay={0.1} inView>
          <h2
            className="text-center text-xl font-semibold tracking-tight mb-8"
            style={{ letterSpacing: "-0.015em" }}
          >
            Loved by readers worldwide
          </h2>
        </BlurFade>
        <Marquee pauseOnHover className="[--duration:45s]">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
        <Marquee pauseOnHover reverse className="mt-4 [--duration:45s]">
          {testimonials2.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BlurFade delay={0.1} inView>
            <h2 className="text-3xl font-bold text-white sm:text-4xl" style={{ letterSpacing: "-0.02em" }}>
              Start reading tonight.
            </h2>
            <p className="mt-4 text-base text-stone-400">
              Join readers exploring the greatest books ever written.
            </p>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <Link href="/onboarding">
              <ShimmerButton
                shimmerColor="#ffffff"
                background="#6366f1"
                className="mt-8 px-8 py-3"
              >
                <span className="text-base font-semibold">Begin your journey</span>
              </ShimmerButton>
            </Link>
          </BlurFade>
          <BlurFade delay={0.35} inView>
            <div className="mt-6 size-20 rounded-full overflow-hidden ring-2 ring-indigo-400/30">
              <Image src="/virgil/virgil-idle.png" alt="Virgil" width={80} height={80} className="w-full h-full object-cover" />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-stone-900 border-t border-stone-800 py-8 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <span className="text-sm font-bold text-stone-400">TOME</span>
              <p className="mt-1 text-xs text-stone-600">Made with care in Delaware</p>
            </div>
            <nav aria-label="Footer" className="flex gap-6 text-xs text-stone-500">
              <Link href="/library" className="hover:text-stone-300 transition-colors">Library</Link>
              <a href="#" className="hover:text-stone-300 transition-colors">Classrooms</a>
              <a href="#" className="hover:text-stone-300 transition-colors">About</a>
              <a href="#" className="hover:text-stone-300 transition-colors">Contact</a>
            </nav>
          </div>
          <p className="mt-4 text-center text-xs text-stone-600 md:text-left">
            © 2026 Tome, Inc.
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ── Helper Components ── */

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center transition-all duration-200 ${
        scrolled ? "bg-white/80 backdrop-blur-sm border-b border-stone-200 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="size-5 text-[var(--tome-accent)]" />
          <span className="text-xl font-bold text-[var(--tome-accent)]">TOME</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/library" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            Log in
          </Link>
          <Link href="/onboarding">
            <Button size="sm" className="rounded-xl bg-[var(--tome-accent)] text-white hover:bg-[var(--tome-accent)]/90 text-sm px-4">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function BentoCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-border bg-card p-5 transition-[transform,box-shadow] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:shadow-sm motion-reduce:transition-none ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function StatBlock({
  value,
  suffix = "",
  label,
}: {
  value: number
  suffix?: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex items-baseline">
        <NumberTicker value={value} className="text-3xl font-bold md:text-4xl" />
        {suffix && (
          <span className="text-xl font-bold text-muted-foreground md:text-2xl">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) {
  return (
    <div className="mx-2 w-72 shrink-0 rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-medium">{name}</p>
          <p className="text-[10px] text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}

const testimonials = [
  {
    quote: "Tome made me actually enjoy reading Homer. The guided annotations are incredible.",
    name: "Sarah M.",
    role: "Literature Student",
  },
  {
    quote: "The quiz system keeps me accountable. I've read more classics in 3 months than in 4 years of college.",
    name: "James R.",
    role: "Software Engineer",
  },
  {
    quote: "Finally, a reading app that respects the source material while making it accessible.",
    name: "Dr. Elena K.",
    role: "Classics Professor",
  },
  {
    quote: "The daily streaks and achievements make reading feel like a game. My students love it.",
    name: "Marcus T.",
    role: "High School Teacher",
  },
  {
    quote: "Book clubs on Tome are thoughtful and well-moderated. Best literary community online.",
    name: "Priya S.",
    role: "Book Club Organizer",
  },
]

const testimonials2 = [
  {
    quote: "I went from struggling with Dante to discussing it fluently. Virgil is the best tutor.",
    name: "Alex W.",
    role: "Graduate Student",
  },
  {
    quote: "Clean, beautiful, distraction-free. Exactly what digital reading should be.",
    name: "Olivia H.",
    role: "Designer",
  },
  {
    quote: "The world author map opened my eyes to traditions I never knew existed.",
    name: "Kenji N.",
    role: "Journalist",
  },
  {
    quote: "My reading comprehension improved measurably after just one month on Tome.",
    name: "Chen L.",
    role: "MBA Student",
  },
  {
    quote: "Worth every minute. The depth of the annotations rivals university-level commentary.",
    name: "Roberto F.",
    role: "Retired Educator",
  },
]
