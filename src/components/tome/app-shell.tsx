"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TomeEconomyProvider } from "@/components/tome/economy-provider"
import { AppSidebar } from "@/components/tome/app-sidebar"
import { TopBar } from "@/components/tome/top-bar"
import { MobileDock } from "@/components/tome/mobile-dock"
import { PageTransition } from "@/components/tome/page-transition"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TomeEconomyProvider>
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <MobileDock />
      </SidebarProvider>
    </TooltipProvider>
    </TomeEconomyProvider>
  )
}
