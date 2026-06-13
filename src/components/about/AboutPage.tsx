"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  GraduationCap,
  Headphones,
  Sparkles,
  UsersRound,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { LandingNav } from "@/components/landing/LandingNav"
import { LandingFooter } from "@/components/landing/LandingFooter"

const heroGlassButton =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20 hover:scale-[1.03]"

const learningSurfaces = [
  {
    title: "Student dashboard",
    body: "Clear streaks, reading goals, quizzes, achievements, and a gentle path back into the next chapter.",
    icon: BookOpen,
  },
  {
    title: "Teacher classroom",
    body: "Classrooms, guided sessions, quiz builder, grading, parent updates, and low-noise progress signals.",
    icon: UsersRound,
  },
  {
    title: "Virgil mentor",
    body: "An AI literary guide for context, symbolism, recommendations, and safe help when a passage gets hard.",
    icon: Sparkles,
  },
  {
    title: "Audio learning",
    body: "Audiobook affordances for close reading, pronunciation, replay, and teacher-controlled listening.",
    icon: Headphones,
  },
]

export function AboutPage() {
  const prefersReduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/paintings/barque-of-dante.jpg"
          alt="The Barque of Dante by Eugène Delacroix, 1822"
          fill
          priority
          className="object-cover object-center"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 30%, transparent 60%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-12 md:pb-20 flex flex-col items-center text-center">
          <BlurFade delay={0.1} inView>
            <h1 className="font-[var(--font-display)] text-[32px] md:text-[56px] font-bold text-white max-w-3xl leading-[1.08] tracking-tight">
              We are in a reading crisis.
            </h1>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
              Tome helps schools turn classical literature into a motivating
              daily practice with guided reading, quizzes, classroom tools, and
              Virgil, an AI mentor for the books that shaped the world.
            </p>
          </BlurFade>
          <BlurFade delay={0.3} inView>
            <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3">
              <Link href="/signup" className={heroGlassButton}>
                <BookOpen className="size-4" />
                Start learning
              </Link>
              <Link href="/educators" className={heroGlassButton}>
                <GraduationCap className="size-4" />
                Explore classroom tools
              </Link>
              <Link
                href="mailto:schools@usetome.app?subject=Tome%20school%20demo"
                className={heroGlassButton}
              >
                <ArrowRight className="size-4" />
                Book a school demo
              </Link>
            </div>
          </BlurFade>
        </div>

        <p className="absolute bottom-4 right-6 text-[11px] text-white/40">
          Eugène Delacroix · The Barque of Dante · 1822
        </p>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
          animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6" />
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-[#F8FBFF] px-6 py-20 text-[#0B1220] dark:bg-background dark:text-foreground">
        <div className="mx-auto max-w-6xl">
          <BlurFade delay={0.05} inView>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#2563EB] dark:text-[#93C5FD]">
                <Brain className="size-3.5" />
                Tome Revision for schools
              </span>
              <h2 className="mt-5 font-[var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
                A calm, serious learning app that still feels alive.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-muted-foreground md:text-base">
                Tome blends a modern learning loop with literary depth: students
                know what to do next, teachers see what needs attention, and the
                interface keeps the classics readable instead of intimidating.
              </p>
            </div>
          </BlurFade>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {learningSurfaces.map((surface, index) => (
              <BlurFade key={surface.title} delay={0.08 + index * 0.04} inView>
                <article className="h-full rounded-3xl border border-blue-100 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 dark:border-border dark:bg-card">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#93C5FD]">
                    <surface.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold">{surface.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">
                    {surface.body}
                  </p>
                </article>
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={0.18} inView>
            <div className="mt-10 grid gap-4 rounded-[2rem] border border-[#D4A04C]/30 bg-[#FFF8EA] p-5 dark:bg-[#D4A04C]/10 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="text-base font-semibold">
                  Built for student and teacher paths from day one.
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-muted-foreground">
                  Students get reading momentum. Teachers get classrooms,
                  assignments, and guided learning without burying the class in
                  dashboards.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/readers"
                  className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  Student path
                </Link>
                <Link
                  href="/educators"
                  className="inline-flex items-center justify-center rounded-full border border-[#D4A04C]/40 bg-white px-4 py-2 text-sm font-semibold text-[#7A4F12] transition-colors hover:bg-[#FFF3D2] dark:bg-transparent dark:text-[#F5C46B]"
                >
                  Teacher path
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
