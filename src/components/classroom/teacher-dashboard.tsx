"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, ChevronDown, MonitorPlay } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoaBanner } from "@/components/dashboard/StoaBanner"
import { TeacherStatsCards } from "./teacher-stats-cards"
import { ClassroomTabBar } from "./classroom-tab-bar"
import { LiveReadingPanel } from "./live-reading-panel"
import { AssignmentsSummaryCard } from "./assignments-summary-card"
import { StudentsAtRiskCard } from "./students-at-risk-card"
import { TeacherActivityFeed } from "./teacher-activity-feed"
import { useAuth } from "@/hooks/use-auth"

export function TeacherDashboard() {
  const { profile } = useAuth()
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null)

  const [greeting, setGreeting] = useState("Welcome back")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const displayName = profile?.display_name ?? "Professor"

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 pb-12">
      {/* Stoa Banner — constrained to same max-width as student dashboard */}
      <div className="mx-auto max-w-3xl">
        <StoaBanner />
      </div>

      {/* Welcome + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold">
            {greeting}, {displayName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening in your classrooms
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/teacher/guided-learning/new">
            <Button
              size="sm"
              className="gap-1.5 text-white"
              style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
            >
              <MonitorPlay className="size-3.5" />
              Guided Session
            </Button>
          </Link>
          <Link href="/classroom/create">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              New Classroom
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="mt-6">
        <TeacherStatsCards classroomId={selectedClassroom ?? undefined} />
      </div>

      {/* Classroom Tab Bar (only if multiple classrooms) */}
      <div className="mt-6">
        <ClassroomTabBar
          selectedId={selectedClassroom}
          onSelect={setSelectedClassroom}
        />
      </div>

      {/* Main content grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <LiveReadingPanel classroomId={selectedClassroom ?? undefined} />
          <TeacherActivityFeed classroomId={selectedClassroom ?? undefined} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <AssignmentsSummaryCard classroomId={selectedClassroom ?? undefined} />
          <StudentsAtRiskCard classroomId={selectedClassroom ?? undefined} />
        </div>
      </div>
    </div>
  )
}
