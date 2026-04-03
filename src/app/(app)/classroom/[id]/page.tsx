"use client"

import { use, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, BookOpen, TrendingUp, Activity, Copy, Check, Sparkles, ChevronLeft } from "lucide-react"
import {
  getClassroom,
  getAssignmentsForClass,
  getStudentsForAssignment,
  getStatusColor,
  getCompletionColor,
  type Assignment,
} from "@/lib/classroom"

export default function ClassroomDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const classroom = getClassroom(id)
  const assignments = getAssignmentsForClass(id)
  const [filter, setFilter] = useState<"active" | "upcoming" | "completed">("active")
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(
    assignments.find((a) => a.status === "active")?.id ?? null,
  )
  const [copied, setCopied] = useState(false)

  if (!classroom) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Classroom not found</p>
        <Link href="/classroom" className="mt-2 text-sm text-indigo-500 hover:underline">
          Back to classrooms
        </Link>
      </div>
    )
  }

  const stats = {
    students: classroom.studentCount,
    assignments: assignments.length,
    avgCompletion: assignments.filter((a) => a.status === "active").length > 0
      ? Math.round(
          assignments.filter((a) => a.status === "active").reduce((s, a) => s + a.completionRate, 0) /
            assignments.filter((a) => a.status === "active").length,
        )
      : 0,
    activeToday: 16,
  }

  const filtered = assignments.filter((a) => a.status === filter)
  const students = expandedAssignment ? getStudentsForAssignment(expandedAssignment) : []
  const sortedStudents = [...students].sort((a, b) => {
    const order = { behind: 0, "not-started": 1, "in-progress": 2, completed: 3 }
    return order[a.status] - order[b.status]
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/classroom" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ChevronLeft className="size-4" /> Classrooms
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{classroom.name}</h1>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{classroom.subject}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(classroom.joinCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-xs font-mono text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          Code: {classroom.joinCode}
          {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users, label: "Students", value: stats.students, color: "text-indigo-500" },
          { icon: BookOpen, label: "Assignments", value: stats.assignments, color: "text-teal-500" },
          { icon: TrendingUp, label: "Avg completion", value: `${stats.avgCompletion}%`, color: "text-amber-500" },
          { icon: Activity, label: "Active today", value: stats.activeToday, color: "text-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-muted/50 p-4">
            <stat.icon className={`size-4 ${stat.color}`} />
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Assignments */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Assignments</h2>
        <div className="mt-3 flex gap-2">
          {(["active", "upcoming", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No {filter} assignments</p>
          )}
          {filtered.map((assignment, i) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              index={i}
              isExpanded={expandedAssignment === assignment.id}
              onToggle={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}
              studentCount={classroom.studentCount}
            />
          ))}
        </div>
      </div>

      {/* Student progress */}
      {expandedAssignment && sortedStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h2 className="text-lg font-semibold">Student progress</h2>
          <div className="mt-3 space-y-2">
            {sortedStudents.map((student, i) => {
              const sc = getStatusColor(student.status)
              const pct = student.totalChapters > 0
                ? Math.round((student.chaptersCompleted / student.totalChapters) * 100)
                : 0
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-2.5 min-w-[140px]">
                    <div
                      className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: student.avatarColor }}
                    >
                      {student.studentName[0]}
                    </div>
                    <span className="text-sm font-medium">{student.studentName}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {student.chaptersCompleted}/{student.totalChapters}
                      </span>
                    </div>
                  </div>

                  {/* Quiz */}
                  <span className="text-sm tabular-nums w-10 text-center">
                    {student.quizScore !== null ? `${student.quizScore}%` : "—"}
                  </span>

                  {/* Wisdom */}
                  <span className="flex items-center gap-1 text-sm text-amber-600 tabular-nums w-14">
                    <Sparkles className="size-3" />
                    {student.wisdomEarned}
                  </span>

                  {/* Last active */}
                  <span className="text-xs text-muted-foreground w-20 hidden sm:block">
                    {student.lastActive}
                  </span>

                  {/* Status */}
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} capitalize whitespace-nowrap`}>
                    {student.status.replace("-", " ")}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function AssignmentCard({
  assignment,
  index,
  isExpanded,
  onToggle,
  studentCount,
}: {
  assignment: Assignment
  index: number
  isExpanded: boolean
  onToggle: () => void
  studentCount: number
}) {
  const finished = Math.round((assignment.completionRate / 100) * studentCount)
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onToggle}
      className={`w-full text-left rounded-xl border p-5 transition-all ${
        isExpanded ? "border-indigo-200 bg-indigo-50/30 shadow-sm" : "border-border bg-card hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Book color block */}
        <div className="size-12 shrink-0 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600" />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold truncate">{assignment.bookTitle}</p>
          <p className="text-sm text-muted-foreground">{assignment.bookAuthor}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {assignment.assignedChapters} · Due {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Completion */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={`text-2xl font-bold ${getCompletionColor(assignment.completionRate)}`}>
            {assignment.completionRate}%
          </div>
          <span className="text-[10px] text-muted-foreground">{finished}/{studentCount} done</span>
        </div>
      </div>
    </motion.button>
  )
}
