"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { dockNav } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/design-tokens"

export function MobileDock() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex md:hidden">
      <div className="flex w-full items-end justify-around border-t border-border bg-background/80 px-2 pb-[env(safe-area-inset-bottom,0px)] pt-1 backdrop-blur-lg">
        {dockNav.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return (
            <DockItem
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isActive}
            >
              <item.icon className="size-5" />
            </DockItem>
          )
        })}
      </div>
    </nav>
  )
}

function DockItem({
  href,
  label,
  isActive,
  children,
}: {
  href: string
  label: string
  isActive: boolean
  children: React.ReactNode
}) {
  const [pressed, setPressed] = React.useState(false)

  return (
    <Link
      href={href}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={cn(
        "flex flex-col items-center gap-0.5 py-1.5 px-3 text-muted-foreground transition-colors duration-[var(--tome-duration-fast)]",
        isActive && "text-foreground"
      )}
    >
      <motion.div
        animate={{
          scale: pressed ? 1.3 : isActive ? 1.1 : 1,
        }}
        transition={springs.interactive}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
      <span className="text-[10px] font-medium leading-none">{label}</span>
      {isActive && (
        <motion.div
          layoutId="dock-indicator"
          className="absolute -bottom-0.5 h-0.5 w-4 rounded-full bg-foreground"
          transition={springs.interactive}
        />
      )}
    </Link>
  )
}
