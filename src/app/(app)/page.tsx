"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BookOpen, ArrowRight, ChevronRight,
  Brain, Target, Flame, Trophy, Globe2, GraduationCap, Users, Bookmark,
  Palette, MessageCircle, Heart, Award, Sparkles, Shield, Coins,
  School, KeyRound, BarChart3, Bot, Compass, HelpCircle, FileText, GitBranch,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import { isOnboardingComplete } from "@/lib/onboarding"

// ── Painting Data ─────────────────────────────────

interface PaintingCard {
  slug: string
  title: string
  author: string
  painting: string
  artist: string
  cover: string | null
  gradient?: string
}

const ROW_1: PaintingCard[] = [
  { slug: "the-odyssey", title: "The Odyssey", author: "Homer", painting: "Ulysses and the Sirens", artist: "Waterhouse, 1891", cover: "/paintings/ulysses-and-the-sirens.jpg" },
  { slug: "the-divine-comedy", title: "The Divine Comedy", author: "Dante", painting: "The Barque of Dante", artist: "Delacroix, 1822", cover: "/paintings/barque-of-dante.jpg" },
  { slug: "the-republic", title: "The Republic", author: "Plato", painting: "The School of Athens", artist: "Raphael, 1511", cover: "/paintings/school-of-athens.jpg" },
  { slug: "moby-dick", title: "Moby-Dick", author: "Herman Melville", painting: "Snow Storm — Steam-Boat", artist: "Turner, 1842", cover: "/paintings/moby-dick-turner.jpg" },
  { slug: "hamlet", title: "Hamlet", author: "Shakespeare", painting: "Ophelia", artist: "Millais, 1852", cover: "/paintings/ophelia.jpg" },
  { slug: "les-miserables", title: "Les Misérables", author: "Victor Hugo", painting: "Liberty Leading the People", artist: "Delacroix, 1830", cover: "/paintings/liberty-leading-the-people.jpg" },
  { slug: "romeo-and-juliet", title: "Romeo and Juliet", author: "Shakespeare", painting: "Romeo and Juliet", artist: "Dicksee, 1884", cover: "/paintings/romeo-and-juliet-dicksee.jpg" },
  { slug: "beowulf", title: "Beowulf", author: "Anonymous", painting: "The Nightmare", artist: "Fuseli, 1781", cover: "/paintings/the-nightmare.jpg" },
  { slug: "the-iliad", title: "The Iliad", author: "Homer", painting: "A Reading from Homer", artist: "Alma-Tadema, 1885", cover: "/paintings/reading-from-homer.jpg" },
  { slug: "the-aeneid", title: "The Aeneid", author: "Virgil", painting: "Aeneas Presenting Cupid to Dido", artist: "Tiepolo, c.1757", cover: "/paintings/aeneid-tiepolo.jpg" },
  { slug: "the-gallic-wars", title: "Commentaries on the Gallic War", author: "Julius Caesar", painting: "Vercingetorix Before Caesar", artist: "Royer, 1899", cover: "/paintings/gallic-wars-vercingetorix.jpg" },
]

const ROW_2: PaintingCard[] = [
  { slug: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", painting: "Madame X", artist: "Sargent, 1884", cover: "/paintings/madame-x.jpg" },
  { slug: "frankenstein", title: "Frankenstein", author: "Mary Shelley", painting: "Wanderer Above the Sea of Fog", artist: "Friedrich, c.1818", cover: "/paintings/wanderer-above-sea-of-fog.jpg" },
  { slug: "meditations", title: "Meditations", author: "Marcus Aurelius", painting: "The Death of Socrates", artist: "David, 1787", cover: "/paintings/death-of-socrates.jpg" },
  { slug: "jane-eyre", title: "Jane Eyre", author: "Charlotte Brontë", painting: "The Oxbow", artist: "Cole, 1836", cover: "/paintings/the-oxbow.jpg" },
  { slug: "crime-and-punishment", title: "Crime and Punishment", author: "Dostoevsky", painting: "Ivan the Terrible and His Son", artist: "Repin, 1885", cover: "/paintings/crime-repin.jpg" },
  { slug: "walden", title: "Walden", author: "Thoreau", painting: "Heart of the Andes", artist: "Church, 1859", cover: "/paintings/heart-of-the-andes.jpg" },
  { slug: "don-quixote", title: "Don Quixote", author: "Cervantes", painting: "Don Quixote and Sancho Panza", artist: "Doré, 1863", cover: "/paintings/don-quixote-dore.jpg" },
  { slug: "war-and-peace", title: "War and Peace", author: "Leo Tolstoy", painting: "Napoleon near Borodino", artist: "Vereshchagin, 1897", cover: "/paintings/napoleons-retreat.jpg" },
  { slug: "the-great-gatsby", title: "The Great Gatsby", author: "F. Scott Fitzgerald", painting: "Nocturne in Blue and Gold", artist: "Whistler, c.1872", cover: "/paintings/nocturne-blue-gold.jpg" },
  { slug: "dracula", title: "Dracula", author: "Bram Stoker", painting: "The Sea of Ice", artist: "Friedrich, 1824", cover: "/paintings/sea-of-ice.jpg" },
  { slug: "the-art-of-war", title: "The Art of War", author: "Sun Tzu", painting: "The Great Wave off Kanagawa", artist: "Hokusai, c.1831", cover: "/paintings/great-wave.jpg" },
]

// ── Landing Page ──────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#F0ECE6]">
      <LandingNav />

      {/* ── Hero ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/paintings/creation-of-adam.jpg"
          alt="The Creation of Adam by Michelangelo, c.1512"
          fill
          priority
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111111 0%, #11111180 30%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:px-12 md:pb-20">
          <BlurFade delay={0.1} inView>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#F0ECE6] max-w-2xl leading-[1.1] tracking-tight">
              Read the books that shaped the world.
            </h1>
          </BlurFade>
          <BlurFade delay={0.3} inView>
            <div className="mt-6 flex items-center gap-4"><HeroCTA /></div>
          </BlurFade>
          <BlurFade delay={0.4} inView>
            <p className="mt-4 text-sm text-[#B0A898]">Free to browse. Guided by Virgil.</p>
          </BlurFade>
        </div>
      </section>

      {/* ── Dual-Row Painting Carousel ── */}
      <section className="py-16 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:60s] [--gap:1rem] mb-4">
          {ROW_1.map((p) => (<GalleryCard key={p.slug} card={p} />))}
        </Marquee>
        <Marquee pauseOnHover reverse className="[--duration:60s] [--gap:1rem]">
          {ROW_2.map((p) => (<GalleryCard key={p.slug} card={p} />))}
        </Marquee>
        <div className="text-center mt-10 px-6">
          <p className="text-sm text-[#787068]">793 books. 16 traditions. 3,000 years.</p>
          <Link href="/library" className="inline-flex items-center gap-1.5 mt-2 text-sm text-[#D4B37A] hover:text-[#E0C48A] transition-colors">
            Browse the full library <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Section 4: Feature Grid ── */}
      <section className="bg-[#1A1A1A] py-24 px-6 md:px-12">
        <BlurFade delay={0.1} inView>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center text-[#F0ECE6] mb-12">
            Everything you need to master the canon
          </h2>
        </BlurFade>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: "500+ Classic Texts", desc: "From Homer to Woolf. Every book parsed, annotated, and ready to read." },
            { icon: Brain, label: "AI Literary Companion", desc: "Virgil explains any passage — vocabulary, context, literary devices — on demand." },
            { icon: Target, label: "Adaptive Quizzes", desc: "Five questions per chapter across three difficulty tiers. Apprentice, Scholar, Master." },
            { icon: Flame, label: "Daily Streaks", desc: "Build a reading habit. Earn Flames for consecutive days. Freeze your streak in the Shop." },
            { icon: Trophy, label: "21 Achievements", desc: "Seals for milestones — from your first page to reading across all 12 traditions." },
            { icon: Globe2, label: "12 Literary Traditions", desc: "Ancient Greek to Eastern. Victorian to Modernist. Every major tradition represented." },
            { icon: GraduationCap, label: "Classroom Mode", desc: "Teachers assign books, track progress, and use Virgil as a teaching assistant." },
            { icon: Users, label: "Leaderboards & Leagues", desc: "Compete in weekly leagues. Rise from Novice to Luminary. Top readers advance." },
            { icon: Bookmark, label: "Annotations & Bookmarks", desc: "Highlight passages, save notes, export your marginalia. Your reading journal, built in." },
          ].map((feat, i) => (
            <BlurFade key={feat.label} delay={0.05 + i * 0.04} inView>
              <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-5">
                <feat.icon className="size-6 text-[#D4B37A] mb-3" />
                <h3 className="font-semibold text-[#F0ECE6] text-sm">{feat.label}</h3>
                <p className="text-xs text-[#B0A898] mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── Section 5: The Reader ── */}
      <section className="bg-[#111111] py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Mock Reader */}
          <BlurFade delay={0.1} inView>
            <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6">
              {/* Progress bar */}
              <div className="w-full h-1 bg-[#222222] rounded-full mb-5">
                <div className="h-1 bg-[#D4B37A] rounded-full" style={{ width: "30%" }} />
              </div>
              <h3 className="font-serif text-[#D4B37A] text-sm font-semibold mb-4">Book I — The Wrath of Achilles</h3>
              <p className="font-serif text-[#F0ECE6] text-sm leading-relaxed">
                Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans. Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures, for so were the counsels of Zeus fulfilled from the day on which the son of Atreus and great Achilles first fell out with one another. The sea grew dark as{" "}
                <span className="underline decoration-[#D4B37A] underline-offset-2">wine-dark</span>{" "}
                waves upon the shore.
              </p>
              <div className="flex justify-end mt-4">
                <div className="size-8 rounded-full bg-[#D4B37A20] border border-[#D4B37A40] flex items-center justify-center text-xs font-serif font-bold text-[#D4B37A]">V</div>
              </div>
            </div>
          </BlurFade>

          {/* Callouts */}
          <div className="space-y-5">
            {[
              { icon: BookOpen, label: "Distraction-free reading", desc: "Literata typography. Warm dark background. No ads, no sidebar, no clutter." },
              { icon: Palette, label: "Three reading themes", desc: "Default, Parchment, and Night Scholar. Each tuned for extended dark-mode reading." },
              { icon: MessageCircle, label: "Virgil in the margin", desc: "Select any passage. Virgil explains historical context, vocabulary, and literary significance." },
            ].map((item, i) => (
              <BlurFade key={item.label} delay={0.15 + i * 0.1} inView>
                <div className="flex gap-4 items-start">
                  <item.icon className="size-5 text-[#D4B37A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#F0ECE6] text-sm">{item.label}</h4>
                    <p className="text-xs text-[#B0A898] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: The Quiz ── */}
      <section className="bg-[#1A1A1A] py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Callouts */}
          <div className="space-y-5 order-2 md:order-1">
            {[
              { icon: Target, label: "Passage-specific questions", desc: "Every question tests real comprehension of what you just read. No generic trivia." },
              { icon: Heart, label: "Hearts keep you honest", desc: "Five hearts per session. Lose one for each wrong answer. Refill in the Shop or wait." },
              { icon: Award, label: "Three difficulty tiers", desc: "Apprentice tests recall. Scholar tests understanding. Master tests critical analysis." },
            ].map((item, i) => (
              <BlurFade key={item.label} delay={0.15 + i * 0.1} inView>
                <div className="flex gap-4 items-start">
                  <item.icon className="size-5 text-[#D4B37A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#F0ECE6] text-sm">{item.label}</h4>
                    <p className="text-xs text-[#B0A898] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* Mock Quiz */}
          <BlurFade delay={0.1} inView>
            <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6 order-1 md:order-2">
              <p className="font-serif text-[#F0ECE6] text-sm font-semibold mb-4">
                Why does Odysseus blind the Cyclops instead of killing him?
              </p>
              <div className="space-y-2.5">
                {[
                  { letter: "A", text: "To prove his strength", correct: false },
                  { letter: "B", text: "Out of mercy", correct: false },
                  { letter: "C", text: "Only the Cyclops could move the boulder", correct: true },
                  { letter: "D", text: "Athena commanded it", correct: false },
                ].map((opt) => (
                  <div
                    key={opt.letter}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm",
                      opt.correct
                        ? "border-[#5A9A5A] bg-[#1A2E1A] text-[#6EAA6E]"
                        : "border-[#333333] bg-[#222222] text-[#F0ECE6]"
                    )}
                  >
                    <span className="font-semibold text-xs">{opt.letter}</span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-[#D4B37A]">4/5 correct &middot; +20 Wisdom</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((h) => (
                    <Heart key={h} className="size-4 text-rose-500 fill-rose-500" />
                  ))}
                  <Heart className="size-4 text-[#333333]" />
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Section 7: The Journey ── */}
      <section className="bg-[#111111] py-24 px-6 md:px-12">
        <BlurFade delay={0.1} inView>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center text-[#F0ECE6] mb-12">
            Reading becomes a ritual
          </h2>
        </BlurFade>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Wisdom (XP) */}
          <BlurFade delay={0.1} inView>
            <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-5 text-center">
              <Sparkles className="size-6 text-[#D4B37A] mx-auto mb-3" />
              <h4 className="font-semibold text-[#F0ECE6] text-sm">Wisdom (XP)</h4>
              <p className="text-xs text-[#B0A898] mt-1 leading-relaxed">Earn XP for correct answers and completed chapters. Level up from Reader to Sage.</p>
              <div className="mt-3">
                <div className="w-full h-1.5 bg-[#222222] rounded-full">
                  <div className="h-1.5 bg-[#D4B37A] rounded-full" style={{ width: "65%" }} />
                </div>
                <p className="text-[10px] text-[#D4B37A] mt-1.5">Level 3 — 585 / 800 XP</p>
              </div>
            </div>
          </BlurFade>

          {/* Streaks */}
          <BlurFade delay={0.15} inView>
            <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-5 text-center">
              <Flame className="size-6 text-[#D4B37A] mx-auto mb-3" />
              <h4 className="font-semibold text-[#F0ECE6] text-sm">Streaks</h4>
              <p className="text-xs text-[#B0A898] mt-1 leading-relaxed">Read every day. Your streak grows. Miss a day — it resets.</p>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Flame className="size-4 text-[#D4B37A]" />
                <span className="text-lg font-bold text-[#D4B37A]">12 days</span>
              </div>
            </div>
          </BlurFade>

          {/* Seals */}
          <BlurFade delay={0.2} inView>
            <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-5 text-center">
              <Shield className="size-6 text-[#D4B37A] mx-auto mb-3" />
              <h4 className="font-semibold text-[#F0ECE6] text-sm">Seals</h4>
              <p className="text-xs text-[#B0A898] mt-1 leading-relaxed">21 achievement badges across 6 categories.</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="size-6 rounded-full bg-[#D4B37A] border border-[#D4B37A]" />
                <div className="size-6 rounded-full bg-[#D4B37A] border border-[#D4B37A]" />
                <div className="size-6 rounded-full bg-transparent border border-[#444444]" />
                <div className="size-6 rounded-full bg-transparent border border-[#444444]" />
              </div>
            </div>
          </BlurFade>

          {/* Coins & Shop */}
          <BlurFade delay={0.25} inView>
            <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-5 text-center">
              <Coins className="size-6 text-[#D4B37A] mx-auto mb-3" />
              <h4 className="font-semibold text-[#F0ECE6] text-sm">Coins &amp; Shop</h4>
              <p className="text-xs text-[#B0A898] mt-1 leading-relaxed">Earn coins by reading, quizzing, and streaking. Spend on power-ups.</p>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Coins className="size-4 text-[#D4B37A]" />
                <span className="text-lg font-bold text-[#D4B37A]">55 coins</span>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Section 9: The Classroom ── */}
      <section className="bg-[#111111] py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Callouts */}
          <div>
            <BlurFade delay={0.1} inView>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F0ECE6] mb-6">
                Built for classrooms
              </h2>
            </BlurFade>
            <div className="space-y-5">
              {[
                { icon: School, label: "Assign any book", desc: "Teachers pick the texts. Students read and quiz at their own pace." },
                { icon: KeyRound, label: "Simple join codes", desc: "Students enter a 6-character code. No email required for under-13 accounts." },
                { icon: BarChart3, label: "Progress dashboards", desc: "See who read, who quizzed, and who needs help — in real time." },
                { icon: Bot, label: "Virgil as TA", desc: "Students ask Virgil. Teachers review the conversation. Everyone learns." },
              ].map((item, i) => (
                <BlurFade key={item.label} delay={0.15 + i * 0.1} inView>
                  <div className="flex gap-4 items-start">
                    <item.icon className="size-5 text-[#D4B37A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#F0ECE6] text-sm">{item.label}</h4>
                      <p className="text-xs text-[#B0A898] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>

          {/* Mock Classroom Card */}
          <BlurFade delay={0.1} inView>
            <div className="bg-[#0D0D0D] rounded-xl border border-[#333333] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-[#F0ECE6] text-sm font-semibold">AP Literature — Period 3</h3>
                  <p className="text-xs text-[#787068] mt-0.5">Mrs. Holloway &middot; 28 students</p>
                </div>
                <div className="rounded-md bg-[#222222] border border-[#333333] px-3 py-1.5">
                  <p className="text-[10px] text-[#787068] uppercase tracking-wider">Join Code</p>
                  <p className="text-sm font-mono font-bold text-[#D4B37A]">TOME42</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { student: "Emily R.", progress: 85, book: "The Odyssey" },
                  { student: "James K.", progress: 62, book: "The Odyssey" },
                  { student: "Sofia M.", progress: 41, book: "The Odyssey" },
                ].map((s) => (
                  <div key={s.student} className="flex items-center gap-3">
                    <span className="text-xs text-[#B0A898] w-16 shrink-0">{s.student}</span>
                    <div className="flex-1 h-1.5 bg-[#222222] rounded-full">
                      <div className="h-1.5 bg-[#D4B37A] rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-[#787068] w-8 text-right">{s.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Section 10: Meet Virgil ── */}
      <section className="bg-[#1A1A1A] py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[160px_1fr] gap-10 items-start">
          {/* Large V */}
          <BlurFade delay={0.1} inView>
            <div className="flex justify-center md:justify-start">
              <div className="size-32 rounded-full bg-[#D4B37A20] border border-[#D4B37A40] flex items-center justify-center text-5xl font-serif font-bold text-[#D4B37A]" aria-label="Virgil">
                V
              </div>
            </div>
          </BlurFade>

          <div>
            <BlurFade delay={0.15} inView>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#F0ECE6] mb-6">
                Your guide through the canon
              </h2>
            </BlurFade>

            {/* Capability cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: BookOpen, label: "Annotations", desc: "Ask about any passage. Get vocabulary, historical context, and literary analysis." },
                { icon: Compass, label: "Recommendations", desc: "Virgil suggests your next book based on what you've read and enjoyed." },
                { icon: HelpCircle, label: "Socratic Mode", desc: "Virgil asks you questions to deepen understanding before a quiz." },
                { icon: FileText, label: "Summaries", desc: "Get a clear chapter overview before diving in, or a recap after." },
                { icon: GitBranch, label: "Connections", desc: "Virgil draws parallels between books across traditions and centuries." },
              ].map((cap, i) => (
                <BlurFade key={cap.label} delay={0.2 + i * 0.05} inView>
                  <div className="rounded-lg bg-[#1A1A1A] border border-[#333333] p-4 flex gap-3 items-start">
                    <cap.icon className="size-5 text-[#D4B37A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#F0ECE6] text-sm">{cap.label}</h4>
                      <p className="text-xs text-[#B0A898] mt-0.5 leading-relaxed">{cap.desc}</p>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>

            {/* Chat exchange */}
            <BlurFade delay={0.4} inView>
              <div className="space-y-3">
                <div className="rounded-lg bg-[#222222] border border-[#333333] px-4 py-2.5">
                  <p className="text-xs text-[#787068] mb-1">You</p>
                  <p className="text-sm text-[#F0ECE6]">Why does Odysseus blind the Cyclops instead of killing him?</p>
                </div>
                <div className="rounded-lg bg-[#222222] border border-[#D4B37A20] px-4 py-2.5">
                  <p className="text-xs text-[#D4B37A] mb-1">Virgil</p>
                  <p className="text-sm text-[#F0ECE6]">Because only the Cyclops could move the boulder blocking the cave. A dead Cyclops can&apos;t open the door. It&apos;s one of the great moments of Greek cunning over brute strength.</p>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ── Section 11: Stats Bar ── */}
      <section className="bg-[#111111] py-24 px-6">
        <BlurFade delay={0.1} inView>
          <div className="max-w-2xl mx-auto flex justify-center gap-16 md:gap-24">
            {[
              { value: "500+", label: "Classic texts" },
              { value: "12", label: "Literary traditions" },
              { value: "3,000", label: "Years of literature" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl md:text-5xl font-bold text-[#D4B37A]">{stat.value}</p>
                <p className="text-xs text-[#B0A898] mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ── Section 12: Final CTA ── */}
      <section className="bg-[#111111] py-24 px-6 text-center">
        <BlurFade delay={0.1} inView>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#F0ECE6] mb-6">
            Start reading tonight.
          </h2>
          <HeroCTA />
          <p className="mt-4 text-sm text-[#787068]">Free to browse. No credit card required.</p>
          <div className="mt-8 flex justify-center">
            <div className="size-16 rounded-full bg-[#D4B37A20] border border-[#D4B37A40] flex items-center justify-center text-xl font-serif font-bold text-[#D4B37A]" aria-label="Virgil">V</div>
          </div>
        </BlurFade>
      </section>

      {/* ── Section 13: Footer ── */}
      <footer className="border-t border-[#333333] py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-[#D4B37A]" />
            <span className="text-base font-semibold tracking-tight text-[#F0ECE6]">Tome</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#787068]">
            <Link href="/library" className="hover:text-[#B0A898] transition-colors">Library</Link>
            <span>About</span>
            <span>Contact</span>
          </div>
          <p className="text-xs text-[#444444]">Made with care in Delaware. &copy; 2026 Tome</p>
        </div>
      </footer>
    </div>
  )
}

// ── Gallery Card ──────────────────────────────────

function GalleryCard({ card }: { card: PaintingCard }) {
  return (
    <a
      href={`/book/${card.slug}`}
      className={cn(
        "group relative block w-60 shrink-0 rounded-lg overflow-hidden",
        "transition-transform duration-300 ease-out hover:scale-[1.03]"
      )}
      style={{ aspectRatio: "3/4" }}
    >
      {card.cover ? (
        <Image src={card.cover} alt={`${card.painting} by ${card.artist}`} fill className="object-cover" sizes="240px" unoptimized />
      ) : (
        <div className="absolute inset-0" style={{ background: card.gradient ?? "linear-gradient(135deg, #1F2937, #111827)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <p className="font-serif text-sm text-[#D4B37A] italic">{card.painting}</p>
            <p className="text-[10px] text-[#787068] mt-1">{card.artist}</p>
          </div>
        </div>
      )}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{ background: "linear-gradient(to top, #111111E0 0%, #11111180 30%, transparent 55%)" }}
      >
        <p className="font-serif text-sm font-semibold text-[#F0ECE6] leading-tight line-clamp-2">{card.title}</p>
        <p className="text-[10px] text-[#D4B37A] mt-0.5">{card.author}</p>
        <p className="text-[9px] text-[#787068] mt-0.5 italic">{card.artist}</p>
        <span className="inline-flex items-center gap-1 text-[10px] text-[#D4B37A] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Read <ChevronRight className="size-3" />
        </span>
      </div>
    </a>
  )
}

// ── Hero CTA ──────────────────────────────────────

function HeroCTA() {
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => { setDone(isOnboardingComplete()); setReady(true) }, [])
  if (!ready) return null
  return (
    <Link
      href={done ? "/library" : "/onboarding"}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4B37A] text-[#111111] font-semibold text-sm hover:bg-[#E0C48A] transition-colors"
    >
      Start reading <ArrowRight className="size-4" />
    </Link>
  )
}

// ── Landing Nav ───────────────────────────────────

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = useCallback(() => { setScrolled(window.scrollY > 60) }, [])
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300",
        scrolled ? "bg-[#111111]/95 backdrop-blur-md border-b border-[#333333]" : "bg-gradient-to-b from-black/60 to-transparent"
      )}
    >
      <Link href="/" className="flex items-center gap-2 drop-shadow-md">
        <BookOpen className="size-5 text-[#D4B37A]" />
        <span className="text-base font-bold tracking-tight text-[#F0ECE6] drop-shadow-md">Tome</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm font-medium text-[#F0ECE6] hover:text-white transition-colors drop-shadow-md px-3 py-1.5 rounded-full hover:bg-white/10">Log in</Link>
        <Link href="/onboarding" className="text-sm font-semibold text-[#111111] bg-[#D4B37A] rounded-full px-5 py-2 hover:bg-[#E0C48A] transition-colors shadow-md">Get started</Link>
      </div>
    </nav>
  )
}
