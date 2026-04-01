"use client"

import { Component, type ReactNode } from "react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <BlurFade delay={0.1} inView>
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[var(--tome-accent)]/10 mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight" style={{ letterSpacing: "-0.015em" }}>
                Virgil seems to have lost his way
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Something unexpected happened. Don&apos;t worry — even the best guides take a wrong turn sometimes.
              </p>
              <Button
                className="mt-6"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </Button>
            </div>
          </BlurFade>
        )
      )
    }

    return this.props.children
  }
}
