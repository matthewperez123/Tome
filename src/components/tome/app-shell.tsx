"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TomeEconomyProvider } from "@/components/tome/economy-provider"
import { BookProgressProvider } from "@/components/tome/book-progress-provider"
import { AppSidebar } from "@/components/tome/app-sidebar"
import { TopBar } from "@/components/tome/top-bar"
import { PageTransition } from "@/components/tome/page-transition"
import { ErrorBoundary } from "@/components/tome/error-boundary"
import { VirgilWrapper } from "@/components/tome/virgil/VirgilWrapper"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === "/"

  // Landing page has its own navbar — hide app chrome
  if (isLanding) {
    return (
      <ErrorBoundary>
      <TomeEconomyProvider>
      <BookProgressProvider>
      <TooltipProvider>
      <VirgilWrapper>
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </VirgilWrapper>
      </TooltipProvider>
      </BookProgressProvider>
      </TomeEconomyProvider>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
    <TomeEconomyProvider>
    <BookProgressProvider>
    <TooltipProvider>
    <VirgilWrapper>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </SidebarProvider>
    </VirgilWrapper>
    </TooltipProvider>
    </BookProgressProvider>
    </TomeEconomyProvider>
    </ErrorBoundary>
  )
}
