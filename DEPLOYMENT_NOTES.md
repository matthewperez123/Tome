# Tome Revision Deployment Notes

## Current State

- Framework: Next.js 16.2.0 with React 19.2.4 and TypeScript.
- Routing: App Router under src/app, with route groups for app surfaces and standalone onboarding/auth/demo surfaces.
- Styling: Tailwind CSS 4, custom Tome tokens in src/styles, shadcn-style components in src/components/ui.
- Package manager for this branch: npm 11.9.0 via package-lock.json. The repo also contains pnpm-lock.yaml and pnpm-workspace.yaml; that should be cleaned up in a future dependency-policy pass.
- Database/auth: Supabase browser/server/admin clients with build-safe placeholder env fallbacks.
- Email: Resend helpers for auth/welcome flows.
- AI: Anthropic-powered quiz generation when ANTHROPIC_API_KEY exists; Virgil guide falls back locally and can call a configured server endpoint.
- Deployment: Vercel-linked Next.js project with framework defaults; vercel.json only declares framework: nextjs.

## Product Surfaces Found

- Marketing homepage: src/components/about/AboutPage.tsx.
- Student dashboard: src/app/(app)/dashboard/page.tsx.
- Teacher dashboard: src/components/classroom/teacher-dashboard.tsx.
- E-reader: src/app/(app)/read/[bookId].
- Quizzes: src/app/(app)/quizzes, src/app/(app)/quiz/[quizId], src/app/api/quiz-generate.
- Classroom: src/app/(app)/classroom, src/app/(app)/teacher/guided-learning, guided-session API routes.

## Baseline Issues Found

- pnpm is not available in the local deployment environment, while npm ci succeeds.
- Standalone tsc requires next typegen first because API routes use Next-generated RouteContext types.
- The existing Vitest test file had no Vitest dependency before this branch.
- ESLint exceeded the default Node heap while traversing very large generated data files.
- Third-party integrations for Stripe, PostHog, Liveblocks, ElevenLabs, Intercom, and Virgil needed explicit missing-credential guards.

## Commands

- Install: npm ci
- Develop: npm run dev
- Lint: npm run lint
- Typecheck: npm run typecheck
- Test: npm run test
- Build: npm run build
- Vercel build: npx vercel build

## Notes

No production secrets should be committed. Configure real Preview/Production values in Vercel only.
