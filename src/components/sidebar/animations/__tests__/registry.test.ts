/**
 * Sidebar animation registry tests.
 *
 * Vitest is not yet configured in this project. Once it is added
 * (npm i -D vitest), these tests can be run with `npx vitest run`.
 */
import { describe, it, expect } from "vitest"
import { studentIconRegistry } from "../student/registry"
import { teacherIconRegistry, teacherConceptIcons } from "../teacher/registry"
import { sharedIconRegistry } from "../shared/registry"

// ---------------------------------------------------------------------------
// Expected labels — derived from navigation.ts
// ---------------------------------------------------------------------------

const SHARED_CORE_LABELS = [
  "Home",
  "Dashboard",
  "Library",
  "Bookmarks",
  "My Shelves",
  "Authors",
  "Reader",
  "Quizzes",
  "Achievements",
  "Audio",
  "Virgil Guide",
  "Book Clubs",
] as const

const STUDENT_ONLY_LABELS = [
  "My Classes",
  "Study Groups",
] as const

const SHARED_SOCIAL_LABELS = [
  "Explore",
  "Timelines",
  "Achievements",
  "Friends",
  "Community",
  "Shop",
  "Profile",
] as const

const TEACHER_NAV_LABELS = [
  "My Classrooms",
  "Parents",
  "Quiz Builder",
  "Grading",
  "Guided Sessions",
] as const

const TEACHER_CONCEPT_LABELS = [
  "Classroom",
  "Assignments",
  "Curriculum",
  "Roster",
  "Grading Ink",
  "Analytics",
  "Discussions",
  "Curation",
  "Settings",
] as const

// ---------------------------------------------------------------------------
// 1. Student registry completeness
// ---------------------------------------------------------------------------

describe("studentIconRegistry", () => {
  describe("core shared labels", () => {
    it.each(SHARED_CORE_LABELS)("has entry for %s", (label) => {
      expect(studentIconRegistry[label]).toBeDefined()
    })
  })

  describe("student-only labels", () => {
    it.each(STUDENT_ONLY_LABELS)("has entry for %s", (label) => {
      expect(studentIconRegistry[label]).toBeDefined()
    })
  })

  describe("social shared labels", () => {
    it.each(SHARED_SOCIAL_LABELS)("has entry for %s", (label) => {
      expect(studentIconRegistry[label]).toBeDefined()
    })
  })
})

// ---------------------------------------------------------------------------
// 2. Teacher registry completeness
// ---------------------------------------------------------------------------

describe("teacherIconRegistry", () => {
  describe("core shared labels", () => {
    it.each(SHARED_CORE_LABELS)("has entry for %s", (label) => {
      expect(teacherIconRegistry[label]).toBeDefined()
    })
  })

  describe("teacher nav labels", () => {
    it.each(TEACHER_NAV_LABELS)("has entry for %s", (label) => {
      expect(teacherIconRegistry[label]).toBeDefined()
    })
  })

  describe("conceptual labels", () => {
    it.each(TEACHER_CONCEPT_LABELS)("has entry for %s", (label) => {
      expect(teacherIconRegistry[label]).toBeDefined()
    })
  })

  describe("social shared labels", () => {
    it.each(SHARED_SOCIAL_LABELS)("has entry for %s", (label) => {
      expect(teacherIconRegistry[label]).toBeDefined()
    })
  })
})

describe("teacherConceptIcons", () => {
  it.each(TEACHER_CONCEPT_LABELS)("has entry for %s", (label) => {
    expect(teacherConceptIcons[label]).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// 3. Fallback behavior — non-existent labels return undefined (not throw)
// ---------------------------------------------------------------------------

describe("fallback behavior", () => {
  it("studentIconRegistry returns undefined for unknown label", () => {
    expect(studentIconRegistry["NonExistentLabel"]).toBeUndefined()
  })

  it("teacherIconRegistry returns undefined for unknown label", () => {
    expect(teacherIconRegistry["NonExistentLabel"]).toBeUndefined()
  })

  it("sharedIconRegistry returns undefined for unknown label", () => {
    expect(sharedIconRegistry["NonExistentLabel"]).toBeUndefined()
  })

  it("teacherConceptIcons returns undefined for unknown label", () => {
    expect(teacherConceptIcons["NonExistentLabel"]).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// 4. Each registered component is a function
// ---------------------------------------------------------------------------

describe("all registry values are functions", () => {
  it("every sharedIconRegistry value is a function", () => {
    for (const [label, component] of Object.entries(sharedIconRegistry)) {
      expect(typeof component, `shared "${label}" should be a function`).toBe(
        "function",
      )
    }
  })

  it("every studentIconRegistry value is a function", () => {
    for (const [label, component] of Object.entries(studentIconRegistry)) {
      expect(
        typeof component,
        `student "${label}" should be a function`,
      ).toBe("function")
    }
  })

  it("every teacherIconRegistry value is a function", () => {
    for (const [label, component] of Object.entries(teacherIconRegistry)) {
      expect(
        typeof component,
        `teacher "${label}" should be a function`,
      ).toBe("function")
    }
  })

  it("every teacherConceptIcons value is a function", () => {
    for (const [label, component] of Object.entries(teacherConceptIcons)) {
      expect(
        typeof component,
        `concept "${label}" should be a function`,
      ).toBe("function")
    }
  })
})

// ---------------------------------------------------------------------------
// 5. No unexpected key collisions between shared and role-specific
// ---------------------------------------------------------------------------

describe("key collision checks", () => {
  // Shared keys that are intentionally overridden by role-specific registries.
  // For example, "Library" appears in shared AND student because the student
  // registry provides a themed variant.
const INTENTIONAL_STUDENT_OVERRIDES = new Set([
  "Library",
  "Reader",
  "Achievements",
  "Quizzes",
  "Profile",
  ])

  it("student-only overrides of shared keys are intentional", () => {
    const sharedKeys = new Set(Object.keys(sharedIconRegistry))
    const studentOnlyKeys = [...STUDENT_ONLY_LABELS]

    const overlapping = studentOnlyKeys.filter(
      (k) => sharedKeys.has(k) && !INTENTIONAL_STUDENT_OVERRIDES.has(k),
    )

    // Every overlapping key should come from the shared set itself (i.e.
    // the student registry inherited it via spread, not re-declared it).
    // If a key overlaps AND is not in the intentional set, it means the
    // student registry has its own version — flag it so we can decide if
    // it should be added to INTENTIONAL_STUDENT_OVERRIDES.
    expect(
      overlapping,
      `Unexpected student overrides of shared keys: ${overlapping.join(", ")}`,
    ).toEqual([])
  })

  it("teacher nav keys do not collide with shared keys", () => {
    const sharedKeys = new Set(Object.keys(sharedIconRegistry))
    const teacherNavOnly = [
      "My Classrooms",
      "Parents",
      "Quiz Builder",
      "Grading",
      "Guided Sessions",
    ]

    const collisions = teacherNavOnly.filter((k) => sharedKeys.has(k))
    expect(
      collisions,
      `Teacher nav keys unexpectedly overlap with shared: ${collisions.join(", ")}`,
    ).toEqual([])
  })

  it("teacher concept keys do not collide with shared keys", () => {
    const sharedKeys = new Set(Object.keys(sharedIconRegistry))
    const conceptKeys = Object.keys(teacherConceptIcons)

    const collisions = conceptKeys.filter((k) => sharedKeys.has(k))
    expect(
      collisions,
      `Teacher concept keys unexpectedly overlap with shared: ${collisions.join(", ")}`,
    ).toEqual([])
  })
})
