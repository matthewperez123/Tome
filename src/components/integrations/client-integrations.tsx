"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Intercom?: (...args: unknown[]) => void
    intercomSettings?: Record<string, unknown>
  }
}

export function ClientIntegrations() {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!posthogKey) return
    const key = posthogKey

    let mounted = true

    async function bootPostHog() {
      const { default: posthog } = await import("posthog-js")
      if (!mounted) return

      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        capture_pageview: "history_change",
        loaded: (instance) => {
          if (process.env.NODE_ENV !== "production") {
            instance.opt_out_capturing()
          }
        },
      })
    }

    bootPostHog().catch(() => {
      // Analytics must never block a reading session or preview deployment.
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID
    if (!appId || window.Intercom) return

    window.intercomSettings = { app_id: appId }

    const script = document.createElement("script")
    script.async = true
    script.src = `https://widget.intercom.io/widget/${appId}`
    script.onload = () => window.Intercom?.("boot", { app_id: appId })
    document.head.appendChild(script)

    return () => {
      window.Intercom?.("shutdown")
      script.remove()
    }
  }, [])

  return null
}
