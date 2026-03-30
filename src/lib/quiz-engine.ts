// ─────────────────────────────────────────────
// Tome Quiz Engine — State Manager
// ─────────────────────────────────────────────

import { XP_REWARDS, COIN_REWARDS } from "@/lib/economy"

// ── Types ──────────────────────────────────────

export type QuestionType = "multiple_choice" | "true_false" | "fill_blank" | "short_answer" | "matching"

export type Question = {
  id: string
  quiz_id: string
  type: QuestionType
  prompt: string
  options: string[]
  correct_answer: string
  explanation: string | null
  order: number
}

export type Quiz = {
  id: string
  book_id: string
  title: string
  difficulty: string | null
}

export type QuizState = {
  quiz: Quiz
  questions: Question[]
  currentIndex: number
  score: number
  hearts: number
  xpEarned: number
  coinsEarned: number
  answers: (string | null)[]
  results: ("correct" | "wrong" | null)[]
  status: "idle" | "active" | "review" | "complete"
  timerSeconds: number | null // null = no timer
  timeRemaining: number
}

export type QuizAction =
  | { type: "START"; timerSeconds?: number }
  | { type: "ANSWER"; answer: string }
  | { type: "NEXT" }
  | { type: "TICK" }
  | { type: "FINISH" }

// ── Initial State ──────────────────────────────

export function createQuizState(quiz: Quiz, questions: Question[], hearts: number): QuizState {
  return {
    quiz,
    questions: questions.sort((a, b) => a.order - b.order),
    currentIndex: 0,
    score: 0,
    hearts,
    xpEarned: 0,
    coinsEarned: 0,
    answers: new Array(questions.length).fill(null),
    results: new Array(questions.length).fill(null),
    status: "idle",
    timerSeconds: null,
    timeRemaining: 0,
  }
}

// ── Answer Checking ────────────────────────────

function checkAnswer(question: Question, answer: string): boolean {
  const correct = question.correct_answer.toLowerCase().trim()
  const given = answer.toLowerCase().trim()

  switch (question.type) {
    case "multiple_choice":
    case "true_false":
      return given === correct

    case "fill_blank":
      // Exact match or close match
      return given === correct || correct.includes(given)

    case "short_answer": {
      // Check if answer contains key words from the correct answer
      const keywords = correct.split(/[,;|]/).map((k) => k.trim().toLowerCase())
      return keywords.some((kw) => given.includes(kw))
    }

    case "matching": {
      // Correct answer is a JSON string of pairs, given answer is too
      try {
        const correctPairs = JSON.parse(question.correct_answer) as Record<string, string>
        const givenPairs = JSON.parse(answer) as Record<string, string>
        return Object.entries(correctPairs).every(
          ([key, val]) => givenPairs[key]?.toLowerCase() === val.toLowerCase()
        )
      } catch {
        return false
      }
    }

    default:
      return given === correct
  }
}

// ── Reducer ────────────────────────────────────

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        status: "active",
        timerSeconds: action.timerSeconds ?? null,
        timeRemaining: action.timerSeconds ?? 0,
      }
    }

    case "ANSWER": {
      if (state.status !== "active") return state
      const question = state.questions[state.currentIndex]
      if (!question) return state

      const isCorrect = checkAnswer(question, action.answer)
      const answers = [...state.answers]
      const results = [...state.results]
      answers[state.currentIndex] = action.answer
      results[state.currentIndex] = isCorrect ? "correct" : "wrong"

      let { score, hearts, xpEarned, coinsEarned } = state

      if (isCorrect) {
        score++
        xpEarned += XP_REWARDS.quiz_correct
        coinsEarned += COIN_REWARDS.quiz_correct
      } else {
        hearts = Math.max(0, hearts - 1)
      }

      // Auto-advance to review state
      const isLast = state.currentIndex === state.questions.length - 1
      const outOfHearts = hearts === 0

      return {
        ...state,
        answers,
        results,
        score,
        hearts,
        xpEarned,
        coinsEarned,
        status: isLast || outOfHearts ? "review" : "active",
      }
    }

    case "NEXT": {
      if (state.currentIndex >= state.questions.length - 1) {
        return { ...state, status: "complete" }
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        status: "active",
      }
    }

    case "TICK": {
      if (!state.timerSeconds || state.status !== "active") return state
      const timeRemaining = Math.max(0, state.timeRemaining - 1)
      if (timeRemaining === 0) {
        return { ...state, timeRemaining: 0, status: "review" }
      }
      return { ...state, timeRemaining }
    }

    case "FINISH": {
      return { ...state, status: "complete" }
    }

    default:
      return state
  }
}

// ── Summary Helpers ────────────────────────────

export function getQuizSummary(state: QuizState) {
  const total = state.questions.length
  const answered = state.answers.filter((a) => a !== null).length
  const correct = state.results.filter((r) => r === "correct").length
  const wrong = state.results.filter((r) => r === "wrong").length
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

  return {
    total,
    answered,
    correct,
    wrong,
    percentage,
    xpEarned: state.xpEarned,
    coinsEarned: state.coinsEarned,
    heartsLost: state.answers.filter((_, i) => state.results[i] === "wrong").length,
    passed: percentage >= 70,
  }
}
