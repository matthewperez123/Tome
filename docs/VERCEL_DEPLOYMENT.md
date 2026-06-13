# Vercel Deployment

## Project Settings

- Framework preset: Next.js.
- Install command: npm ci.
- Build command: npm run build.
- Output directory: use the Vercel Next.js default.
- Node.js: 20.x or newer.

## Environment Variables

Development can use placeholders for local UI review. Preview and Production need real values for the services being tested.

Required for core authenticated product:

- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_AUTH_HOOK_SECRET
- RESEND_API_KEY
- RESEND_FROM_EMAIL

Optional but planned integrations:

- Stripe: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- PostHog: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
- Liveblocks: LIVEBLOCKS_SECRET_KEY, NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
- ElevenLabs: ELEVENLABS_API_KEY
- Intercom: NEXT_PUBLIC_INTERCOM_APP_ID, INTERCOM_SECRET_KEY
- Virgil/AI: ANTHROPIC_API_KEY, OPENAI_API_KEY, VIRGIL_API_URL, VIRGIL_API_KEY

## Preview Workflow

1. Open a PR from chore/tome-revision-vercel-deploy.
2. Let Vercel create a Preview Deployment from the PR branch.
3. Review /, /dashboard, /reading, /quizzes, /classroom, /achievements, /audio, and /virgil.
4. Confirm missing optional credentials show friendly disabled states instead of crashes.

## Service Notes

- Stripe webhook route: /api/stripe/webhook. Configure the webhook signing secret from the Stripe dashboard. The route returns 503 until required secrets exist.
- PostHog loads only when NEXT_PUBLIC_POSTHOG_KEY is present. Local development opts out of capture.
- Liveblocks auth route: /api/liveblocks/auth. It returns 503 until room auth and classroom membership are wired.
- ElevenLabs stays server-side through /api/audio. No API key is exposed to the client.
- Intercom loads only when NEXT_PUBLIC_INTERCOM_APP_ID exists.
- Virgil calls /api/virgil and falls back locally if no secure endpoint is configured.

## Production Checklist

- Add Production env vars in Vercel.
- Set NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_APP_URL to the production domain.
- Configure Stripe products, prices, customer portal, and webhook endpoint.
- Configure PostHog allowed domains and privacy settings.
- Configure Liveblocks rooms and membership authorization.
- Choose ElevenLabs voices, quota limits, and classroom-safe content policy.
- Add Intercom workspace/app ID.
- Verify Supabase auth redirect URLs for the production domain.

## Rollback

Use Vercel Deployments to promote the last healthy deployment. If a schema or third-party dashboard change caused the issue, disable the related env var first so guarded features fall back safely.
