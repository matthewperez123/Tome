import "server-only"

type IntegrationStatus = {
  configured: boolean
  publicConfigured?: boolean
  note: string
}

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim())
}

export function getIntegrationStatus() {
  return {
    stripe: {
      configured: hasEnv("STRIPE_SECRET_KEY") && hasEnv("STRIPE_WEBHOOK_SECRET"),
      publicConfigured: hasEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
      note: "Stripe checkout and webhooks require dashboard keys in Vercel.",
    },
    posthog: {
      configured: hasEnv("NEXT_PUBLIC_POSTHOG_KEY"),
      publicConfigured: hasEnv("NEXT_PUBLIC_POSTHOG_KEY"),
      note: "PostHog is client-only and silently disabled without a public key.",
    },
    liveblocks: {
      configured: hasEnv("LIVEBLOCKS_SECRET_KEY"),
      publicConfigured: hasEnv("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY"),
      note: "Liveblocks rooms are planned for live classroom collaboration.",
    },
    elevenlabs: {
      configured: hasEnv("ELEVENLABS_API_KEY"),
      note: "Audio synthesis stays server-side and is disabled without the API key.",
    },
    intercom: {
      configured: hasEnv("INTERCOM_SECRET_KEY"),
      publicConfigured: hasEnv("NEXT_PUBLIC_INTERCOM_APP_ID"),
      note: "Intercom widget loads only when the public app ID is configured.",
    },
    virgil: {
      configured:
        (hasEnv("VIRGIL_API_URL") && hasEnv("VIRGIL_API_KEY")) ||
        hasEnv("OPENAI_API_KEY"),
      note: "Virgil falls back to local guided responses unless a server AI endpoint is configured.",
    },
  } satisfies Record<string, IntegrationStatus>
}

export type TomeIntegrationStatus = ReturnType<typeof getIntegrationStatus>
