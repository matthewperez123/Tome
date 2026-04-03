"use client"

import { VirgilProvider } from "@/lib/virgil-context"
import { VirgilCompanion } from "./VirgilCompanion"
import { VirgilChat } from "./VirgilChat"
import { VirgilPageContext } from "./VirgilPageContext"

export function VirgilWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VirgilProvider>
      <VirgilPageContext />
      {children}
      <VirgilCompanion />
      <VirgilChat />
    </VirgilProvider>
  )
}
