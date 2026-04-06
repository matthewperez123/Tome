"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react"
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
  { slug: "the-inferno", title: "Inferno", author: "Dante", painting: "The Barque of Dante", artist: "Delacroix, 1822", cover: "/paintings/barque-of-dante.jpg" },
  { slug: "the-republic", title: "The Republic", author: "Plato", painting: "The School of Athens", artist: "Raphael, 1511", cover: "/paintings/school-of-athens.jpg" },
  { slug: "moby-dick", title: "Moby-Dick", author: "Herman Melville", painting: "Snow Storm \u2014 Steam-Boat", artist: "Turner, 1842", cover: "/paintings/moby-dick-turner.jpg" },
  { slug: "hamlet", title: "Hamlet", author: "Shakespeare", painting: "Ophelia", artist: "Millais, 1852", cover: "/paintings/ophelia.jpg" },
  { slug: "les-miserables", title: "Les Mis\u00e9rables", author: "Victor Hugo", painting: "Liberty Leading the People", artist: "Delacroix, 1830", cover: "/paintings/liberty-leading-the-people.jpg" },
  { slug: "romeo-and-juliet", title: "Romeo and Juliet", author: "Shakespeare", painting: "Romeo and Juliet", artist: "Dicksee, 1884", cover: "/paintings/romeo-and-juliet-dicksee.jpg" },
  { slug: "beowulf", title: "Beowulf", author: "Anonymous", painting: "The Nightmare", artist: "Fuseli, 1781", cover: "/paintings/the-nightmare.jpg" },
  { slug: "the-iliad", title: "The Iliad", author: "Homer", painting: "A Reading from Homer", artist: "Alma-Tadema, 1885", cover: "/paintings/reading-from-homer.jpg" },
  { slug: "the-aeneid", title: "The Aeneid", author: "Virgil", painting: "Aeneas Presenting Cupid to Dido", artist: "Tiepolo, c.1757", cover: "/paintings/aeneid-tiepolo.jpg" },
  { slug: "the-gallic-wars", title: "Commentarii de Bello Gallico", author: "Julius Caesar", painting: "Vercingetorix Before Caesar", artist: "Royer, 1899", cover: "/paintings/gallic-wars-vercingetorix.jpg" },
]

const ROW_2: PaintingCard[] = [
  { slug: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", painting: "Madame X", artist: "Sargent, 1884", cover: "/paintings/madame-x.jpg" },
  { slug: "frankenstein", title: "Frankenstein", author: "Mary Shelley", painting: "Wanderer Above the Sea of Fog", artist: "Friedrich, c.1818", cover: "/paintings/wanderer-above-sea-of-fog.jpg" },
  { slug: "meditations", title: "Meditations", author: "Marcus Aurelius", painting: "The Death of Socrates", artist: "David, 1787", cover: "/paintings/death-of-socrates.jpg" },
  { slug: "jane-eyre", title: "Jane Eyre", author: "Charlotte Bront\u00eb", painting: "The Oxbow", artist: "Cole, 1836", cover: "/paintings/the-oxbow.jpg" },
  { slug: "crime-and-punishment", title: "Crime and Punishment", author: "Dostoevsky", painting: "Ivan the Terrible and His Son", artist: "Repin, 1885", cover: "/paintings/crime-repin.jpg" },
  { slug: "walden", title: "Walden", author: "Thoreau", painting: "Heart of the Andes", artist: "Church, 1859", cover: "/paintings/heart-of-the-andes.jpg" },
  { slug: "don-quixote", title: "Don Quixote", author: "Cervantes", painting: "Don Quixote and Sancho Panza", artist: "Dor\u00e9, 1863", cover: "/paintings/don-quixote-dore.jpg" },
  { slug: "war-and-peace", title: "War and Peace", author: "Leo Tolstoy", painting: "Napoleon near Borodino", artist: "Vereshchagin, 1897", cover: "/paintings/napoleons-retreat.jpg" },
  { slug: "the-great-gatsby", title: "The Great Gatsby", author: "F. Scott Fitzgerald", painting: "Nocturne in Blue and Gold", artist: "Whistler, c.1872", cover: "/paintings/nocturne-blue-gold.jpg" },
  { slug: "dracula", title: "Dracula", author: "Bram Stoker", painting: "The Sea of Ice", artist: "Friedrich, 1824", cover: "/paintings/sea-of-ice.jpg" },
  { slug: "the-art-of-war", title: "The Art of War", author: "Sun Tzu", painting: "The Great Wave off Kanagawa", artist: "Hokusai, c.1831", cover: "/paintings/great-wave.jpg" },
]

// ── Landing Page ──────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      {/* ── Hero ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/paintings/barque-of-dante.jpg"
          alt="The Barque of Dante by Eug\u00e8ne Delacroix"
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

      {/* ── Ortelius Map ── */}
      <section className="py-20 px-6 md:px-12">
        <BlurFade delay={0.1} inView>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center text-[#F0ECE6] mb-8">
            Explore literature across the world
          </h2>
        </BlurFade>
        <BlurFade delay={0.2} inView>
          <div className="mx-auto max-w-4xl rounded-lg border border-[#8B7A5440] overflow-hidden">
            <Image src="/paintings/ortelius-map.jpg" alt="Typus Orbis Terrarum \u2014 Abraham Ortelius, 1570" width={1600} height={1100} className="w-full h-auto" unoptimized />
          </div>
        </BlurFade>
        <div className="text-center mt-6">
          <p className="text-sm text-[#787068]">From Homeric Greece to Edo Japan.</p>
          <Link href="/explore" className="inline-flex items-center gap-1.5 mt-2 text-sm text-[#D4B37A] hover:text-[#E0C48A] transition-colors">
            Open the map <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* ── One-Sentence Pitch ── */}
      <section className="py-24 px-6">
        <BlurFade delay={0.1} inView>
          <p className="font-serif text-2xl md:text-3xl text-center text-[#F0ECE6] max-w-2xl mx-auto leading-relaxed">
            Pick a classic. Read a chapter. Take a quiz. Earn your way through the canon.
          </p>
        </BlurFade>
      </section>

      {/* ── Three Steps ── */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            { n: "1", label: "Read", desc: "A chapter takes 10 minutes." },
            { n: "2", label: "Quiz", desc: "Five questions. Earn Wisdom." },
            { n: "3", label: "Return", desc: "Build a streak. Unlock more." },
          ].map((step, i) => (
            <BlurFade key={step.n} delay={0.1 + i * 0.1} inView>
              <div className="text-center md:text-left">
                <span className="font-serif text-4xl font-bold text-[#D4B37A]">{step.n}</span>
                <h3 className="text-lg font-semibold text-[#F0ECE6] mt-2">{step.label}</h3>
                <p className="text-sm text-[#B0A898] mt-1">{step.desc}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── Virgil Section ── */}
      <section className="py-16 px-6 md:px-12">
        <BlurFade delay={0.1} inView>
          <div className="max-w-3xl mx-auto rounded-xl bg-card border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 self-center md:self-start">
              <Image src="/virgil/virgil-idle.png" alt="Virgil, your reading companion" width={80} height={80} className="rounded-full" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl font-bold text-[#F0ECE6]">Meet Virgil</h3>
              <p className="text-sm text-[#B0A898] mt-1">Your AI reading companion. Ask anything about the text.</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-[#222222] border border-[#333333] px-4 py-2.5">
                  <p className="text-xs text-[#787068] mb-1">You</p>
                  <p className="text-sm text-[#F0ECE6]">Why does Odysseus blind the Cyclops instead of killing him?</p>
                </div>
                <div className="rounded-lg bg-[#222222] border border-[#D4B37A20] px-4 py-2.5">
                  <p className="text-xs text-[#D4B37A] mb-1">Virgil</p>
                  <p className="text-sm text-[#F0ECE6]">Because only the Cyclops could move the boulder blocking the cave. A dead Cyclops can&apos;t open the door. It&apos;s one of the great moments of Greek cunning over brute strength.</p>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto flex justify-center gap-16 md:gap-24">
          {[
            { value: "793+", label: "Books" },
            { value: "16", label: "Traditions" },
            { value: "3,000", label: "Years" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4B37A]">{stat.value}</p>
              <p className="text-xs text-[#B0A898] mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-[#D4B37A]" />
            <span className="font-serif font-bold text-[#F0ECE6] tracking-wide">TOME</span>
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
        scrolled ? "bg-[#111111]/90 backdrop-blur-md border-b border-[#333333]" : "bg-transparent"
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <BookOpen className="size-5 text-[#D4B37A]" />
        <span className="font-serif font-bold text-[#F0ECE6] tracking-wide text-sm">TOME</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-xs text-[#B0A898] hover:text-[#F0ECE6] transition-colors">Log in</Link>
        <Link href="/onboarding" className="text-xs font-medium text-[#D4B37A] border border-[#D4B37A40] rounded-full px-4 py-1.5 hover:bg-[#D4B37A10] transition-colors">Get started</Link>
      </div>
    </nav>
  )
}
