"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Users, BookOpen, Copy, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEMO_CLASSROOMS, getClassStats, getCompletionColor } from "@/lib/classroom"
import { useState } from "react"

export default function ClassroomDashboard() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your classrooms</h1>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Create classroom
        </Button>
      </div>

      {/* Classroom cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DEMO_CLASSROOMS.map((cls, i) => {
          const stats = getClassStats(cls.id)
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Link
                href={`/classroom/${cls.id}`}
                className="block rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{cls.name}</h2>
                    <span className="mt-1 inline-block text-xs bg-[#D4A04C]/10 text-[#D4A04C] px-2 py-0.5 rounded-full">
                      {cls.subject}
                    </span>
                  </div>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">{cls.teacherName}</p>

                <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" />
                    {cls.studentCount}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-4" />
                    {stats.activeAssignments} active
                  </span>
                  <span className={`font-medium ${getCompletionColor(stats.avgCompletion)}`}>
                    {stats.avgCompletion}% avg
                  </span>
                </div>

                <JoinCodeBadge code={cls.joinCode} />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function JoinCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(code).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      <span className="text-xs font-mono text-muted-foreground">Code: {code}</span>
      {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3 text-muted-foreground cursor-pointer" />}
    </div>
  )
}
