"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen } from "lucide-react"
import { sidebarNav } from "@/lib/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar } from "@/lib/avatar-state"
import type { BookCharacter } from "@/data/character-avatars"
import { CHARACTER_MAP } from "@/data/character-avatars"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const [character, setCharacter] = React.useState<BookCharacter | null>(null)

  React.useEffect(() => {
    setCharacter(getCurrentAvatar())
  }, [])

  const displayCharacter = character ?? CHARACTER_MAP["virgil"]

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground transition-opacity duration-[var(--tome-duration-fast)] hover:opacity-70"
        >
          <BookOpen className="size-5 shrink-0" />
          {!collapsed && (
            <span className="text-base font-semibold tracking-tight">
              Tome
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNav pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {displayCharacter && (
        <SidebarFooter className="px-3 py-3 border-t border-border">
          <Link
            href="/profile/avatar"
            className="flex items-center gap-2 rounded-md p-1.5 hover:bg-accent/50 transition-colors"
          >
            <UserAvatar
              character={displayCharacter}
              size="sm"
              showRarityRing={true}
            />
            {!collapsed && (
              <span className="text-xs text-muted-foreground max-w-[80px] truncate leading-tight">
                {displayCharacter.name}
              </span>
            )}
          </Link>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarNav({ pathname }: { pathname: string }) {
  const listRef = React.useRef<HTMLUListElement>(null)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!listRef.current) return
      const items = Array.from(
        listRef.current.querySelectorAll<HTMLElement>("[data-slot='sidebar-menu-button']")
      )
      const current = items.findIndex((el) => el === document.activeElement)
      if (current === -1 && (e.key === "j" || e.key === "k")) {
        items[0]?.focus()
        e.preventDefault()
        return
      }
      if (e.key === "j" && current < items.length - 1) {
        items[current + 1]?.focus()
        e.preventDefault()
      } else if (e.key === "k" && current > 0) {
        items[current - 1]?.focus()
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Map sub-routes to their parent nav item
  const activeHref = (() => {
    if (pathname.startsWith("/book/"))    return "/library"
    if (pathname.startsWith("/author/") && !pathname.startsWith("/authors")) return "/authors"
    if (pathname.startsWith("/profile"))  return "/profile" // /profile/stats etc
    if (pathname.startsWith("/clubs/"))   return "/social"
    if (pathname.startsWith("/quiz/"))    return "/quizzes"
    if (pathname.startsWith("/read/"))    return "/reading"
    return pathname
  })()

  return (
    <SidebarMenu ref={listRef}>
      {sidebarNav.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : activeHref === item.href || pathname.startsWith(item.href)

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={item.label}
              render={<Link href={item.href} />}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
