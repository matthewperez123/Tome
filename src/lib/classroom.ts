// ── Tome Classroom System ──
// Demo data for the teacher-student classroom feature.

export interface Classroom {
  id: string
  name: string
  teacherName: string
  joinCode: string
  subject: string
  studentCount: number
  createdAt: string
}

export interface Assignment {
  id: string
  classroomId: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  assignedChapters: string
  dueDate: string
  status: "active" | "upcoming" | "completed"
  completionRate: number
}

export interface StudentProgress {
  id: string
  studentName: string
  avatarColor: string
  classroomId: string
  assignmentId: string
  chaptersCompleted: number
  totalChapters: number
  quizScore: number | null
  wisdomEarned: number
  lastActive: string
  status: "completed" | "in-progress" | "not-started" | "behind"
}

// ── Demo Data ──

export const DEMO_CLASSROOMS: Classroom[] = [
  {
    id: "class-1",
    name: "AP Literature — Period 3",
    teacherName: "Ms. Johnson",
    joinCode: "TOME42",
    subject: "AP Literature",
    studentCount: 24,
    createdAt: "2026-01-15",
  },
  {
    id: "class-2",
    name: "World Literature — 10th Grade",
    teacherName: "Mr. Reeves",
    joinCode: "READ99",
    subject: "World Literature",
    studentCount: 18,
    createdAt: "2026-02-01",
  },
]

export const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: "assign-1",
    classroomId: "class-1",
    bookId: "the-odyssey",
    bookTitle: "The Odyssey",
    bookAuthor: "Homer",
    assignedChapters: "Books 1–6",
    dueDate: "2026-04-15",
    status: "active",
    completionRate: 67,
  },
  {
    id: "assign-2",
    classroomId: "class-1",
    bookId: "meditations",
    bookTitle: "Meditations",
    bookAuthor: "Marcus Aurelius",
    assignedChapters: "Full Book",
    dueDate: "2026-05-01",
    status: "upcoming",
    completionRate: 0,
  },
  {
    id: "assign-3",
    classroomId: "class-1",
    bookId: "pride-and-prejudice",
    bookTitle: "Pride and Prejudice",
    bookAuthor: "Jane Austen",
    assignedChapters: "Chapters 1–12",
    dueDate: "2026-03-20",
    status: "completed",
    completionRate: 92,
  },
  {
    id: "assign-4",
    classroomId: "class-2",
    bookId: "the-republic",
    bookTitle: "The Republic",
    bookAuthor: "Plato",
    assignedChapters: "Books I–IV",
    dueDate: "2026-04-20",
    status: "active",
    completionRate: 45,
  },
]

export const DEMO_STUDENTS: StudentProgress[] = [
  { id: "s1", studentName: "Emma Chen", avatarColor: "#4F46E5", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 6, totalChapters: 6, quizScore: 92, wisdomEarned: 340, lastActive: "2 hours ago", status: "completed" },
  { id: "s2", studentName: "Marcus Williams", avatarColor: "#0D9488", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 5, totalChapters: 6, quizScore: 85, wisdomEarned: 280, lastActive: "5 hours ago", status: "in-progress" },
  { id: "s3", studentName: "Sofia Rodriguez", avatarColor: "#D4A04C", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 6, totalChapters: 6, quizScore: 97, wisdomEarned: 410, lastActive: "1 hour ago", status: "completed" },
  { id: "s4", studentName: "James O'Brien", avatarColor: "#EA580C", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 3, totalChapters: 6, quizScore: null, wisdomEarned: 120, lastActive: "Yesterday", status: "in-progress" },
  { id: "s5", studentName: "Aisha Patel", avatarColor: "#7C3AED", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 4, totalChapters: 6, quizScore: 78, wisdomEarned: 200, lastActive: "3 hours ago", status: "in-progress" },
  { id: "s6", studentName: "Liam Foster", avatarColor: "#16A34A", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 6, totalChapters: 6, quizScore: 88, wisdomEarned: 350, lastActive: "30 min ago", status: "completed" },
  { id: "s7", studentName: "Olivia Kim", avatarColor: "#BE185D", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 1, totalChapters: 6, quizScore: null, wisdomEarned: 40, lastActive: "3 days ago", status: "behind" },
  { id: "s8", studentName: "Noah Davis", avatarColor: "#0284C7", classroomId: "class-1", assignmentId: "assign-1", chaptersCompleted: 0, totalChapters: 6, quizScore: null, wisdomEarned: 0, lastActive: "1 week ago", status: "not-started" },
]

// ── Helpers ──

export function getClassroom(id: string) {
  return DEMO_CLASSROOMS.find((c) => c.id === id)
}

export function getAssignmentsForClass(classId: string) {
  return DEMO_ASSIGNMENTS.filter((a) => a.classroomId === classId)
}

export function getStudentsForAssignment(assignmentId: string) {
  return DEMO_STUDENTS.filter((s) => s.assignmentId === assignmentId)
}

export function getClassStats(classId: string) {
  const assignments = getAssignmentsForClass(classId)
  const active = assignments.filter((a) => a.status === "active")
  const avgCompletion = active.length > 0
    ? Math.round(active.reduce((sum, a) => sum + a.completionRate, 0) / active.length)
    : 0
  return { totalAssignments: assignments.length, activeAssignments: active.length, avgCompletion }
}

export function getClassroomByCode(code: string) {
  return DEMO_CLASSROOMS.find((c) => c.joinCode === code.toUpperCase())
}

export function getStatusColor(status: StudentProgress["status"]) {
  switch (status) {
    case "completed": return { bg: "bg-green-50", text: "text-green-700" }
    case "in-progress": return { bg: "bg-blue-50", text: "text-blue-700" }
    case "behind": return { bg: "bg-amber-50", text: "text-amber-700" }
    case "not-started": return { bg: "bg-stone-100", text: "text-stone-500" }
  }
}

export function getCompletionColor(rate: number) {
  if (rate >= 70) return "text-green-500"
  if (rate >= 40) return "text-amber-500"
  return "text-red-500"
}
