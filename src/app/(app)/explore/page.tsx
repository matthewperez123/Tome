"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Globe2, Map, BookOpen, ChevronRight, X } from "lucide-react"
import { getCountryData, getAuthorsByCountry } from "@/lib/author-geo"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { Globe } from "@/components/ui/globe"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

type ViewMode = "globe" | "map"

export default function ExplorePage() {
  const [view, setView] = useState<ViewMode>("map")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const countries = useMemo(() => getCountryData(), [])
  const selectedAuthors = useMemo(
    () => (selectedCountry ? getAuthorsByCountry(selectedCountry) : []),
    [selectedCountry]
  )

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100vh-3rem)] overflow-hidden">
      {/* Main view */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4">
          <BlurFade delay={0.05} inView>
            <div>
              <h1 className="text-lg font-semibold tracking-tight" style={{ letterSpacing: "-0.015em" }}>
                World Author Map
              </h1>
              <p className="text-[10px] text-muted-foreground">
                {countries.length} countries · 14 literary traditions
              </p>
            </div>
          </BlurFade>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setView("globe")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium transition-colors",
                view === "globe" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Globe2 className="size-3" />
              Globe
            </button>
            <button
              onClick={() => setView("map")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium transition-colors",
                view === "map" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Map className="size-3" />
              Map
            </button>
          </div>
        </div>

        {/* View content */}
        <AnimatePresence mode="wait">
          {view === "globe" ? (
            <motion.div
              key="globe"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="relative size-full flex items-center justify-center bg-[var(--tome-surface-elevated)]"
            >
              <Globe className="size-full max-w-[500px]" />
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="relative size-full bg-[var(--tome-surface-elevated)] overflow-hidden"
            >
              {/* SVG Dot Map */}
              <svg
                viewBox="-180 -90 360 180"
                className="size-full"
                style={{ transform: "scaleY(-1)" }}
              >
                {/* Background dots (simplified world outline) */}
                {Array.from({ length: 200 }).map((_, i) => {
                  const lng = ((i * 31) % 360) - 180
                  const lat = ((i * 47) % 180) - 90
                  return (
                    <circle
                      key={`bg-${i}`}
                      cx={lng}
                      cy={lat}
                      r={0.4}
                      fill="currentColor"
                      className="text-muted-foreground/10"
                    />
                  )
                })}

                {/* Country dots */}
                {countries.map((c) => {
                  const color = TRADITION_COLORS[c.tradition] ?? "#6366F1"
                  const isSelected = selectedCountry === c.country
                  return (
                    <g key={c.country}>
                      <circle
                        cx={c.lng}
                        cy={c.lat}
                        r={Math.max(2, Math.min(5, c.authorCount * 1.5))}
                        fill={color}
                        opacity={isSelected ? 0.9 : 0.5}
                        className="cursor-pointer transition-opacity hover:opacity-90"
                        onClick={() => setSelectedCountry(isSelected ? null : c.country)}
                      />
                      {isSelected && (
                        <circle
                          cx={c.lng}
                          cy={c.lat}
                          r={Math.max(2, Math.min(5, c.authorCount * 1.5)) + 2}
                          fill="none"
                          stroke={color}
                          strokeWidth={0.5}
                          opacity={0.6}
                        />
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 max-w-xs">
                {Object.entries(TRADITION_COLORS).slice(0, 8).map(([tradition, color]) => (
                  <span
                    key={tradition}
                    className="inline-flex items-center gap-1 rounded-full bg-card/80 backdrop-blur-sm border border-border px-2 py-0.5 text-[8px]"
                  >
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {tradition}
                  </span>
                ))}
              </div>

              {/* Country clickable labels */}
              <div className="absolute top-16 left-4 right-4 flex flex-wrap gap-1">
                {countries
                  .sort((a, b) => b.authorCount - a.authorCount)
                  .slice(0, 12)
                  .map((c) => (
                    <button
                      key={c.country}
                      onClick={() => setSelectedCountry(selectedCountry === c.country ? null : c.country)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors border",
                        selectedCountry === c.country
                          ? "bg-foreground text-background border-foreground"
                          : "bg-card/80 backdrop-blur-sm border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {c.country}
                      <span className="ml-1 text-[8px] opacity-60">{c.authorCount}</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar / Bottom Sheet */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={springs.interactive}
            className="absolute right-0 top-0 bottom-0 z-30 w-72 border-l border-border bg-background shadow-lg overflow-y-auto md:relative md:w-72 md:shadow-none motion-reduce:transition-none"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">{selectedCountry}</h2>
                <p className="text-[10px] text-muted-foreground">
                  {selectedAuthors.length} author{selectedAuthors.length !== 1 ? "s" : ""} in our catalog
                </p>
              </div>
              <button
                onClick={() => setSelectedCountry(null)}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {selectedAuthors.map((author) => (
                <div
                  key={author.name}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{
                      backgroundColor: TRADITION_COLORS[author.tradition] ?? "#6366F1",
                    }}
                  >
                    {author.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{author.name}</p>
                    <Badge
                      variant="outline"
                      className="mt-0.5 text-[8px] h-4"
                      style={{
                        borderColor: TRADITION_COLORS[author.tradition],
                        color: TRADITION_COLORS[author.tradition],
                      }}
                    >
                      {author.tradition}
                    </Badge>
                  </div>
                </div>
              ))}

              <Link href={`/library?country=${encodeURIComponent(selectedCountry)}`}>
                <Button variant="ghost" size="sm" className="w-full mt-3 text-[10px]">
                  <BookOpen className="size-3 mr-1.5" />
                  View in Library
                  <ChevronRight className="size-3 ml-auto" />
                </Button>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
