"use client"

import Link from "next/link"
import { Globe2, ArrowRight, BookOpen } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Globe2 className="size-4 text-[#D4B37A]" />
          <h1 className="text-sm font-serif font-semibold leading-none tracking-tight">Explore</h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-md">
            <Globe2 className="size-12 text-[#D4B37A] mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-foreground mb-2">Coming Soon</h2>
            <p className="text-sm text-muted-foreground mb-6">
              An interactive world map of literary traditions is being crafted. In the meantime, browse the full catalog.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4B37A] text-[#111111] font-semibold text-sm hover:bg-[#E0C48A] transition-colors"
            >
              <BookOpen className="size-4" />
              Browse Library
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}
