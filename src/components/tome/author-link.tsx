"use client"

import Link from "next/link"
import { authorSlug } from "@/data/authors"
import { cn } from "@/lib/utils"

interface AuthorLinkProps {
  name: string
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function AuthorLink({ name, className, onClick }: AuthorLinkProps) {
  return (
    <Link
      href={`/author/${authorSlug(name)}`}
      className={cn(
        "text-[color:var(--tome-accent,#6366f1)] hover:underline underline-offset-2 transition-colors duration-[var(--tome-duration-fast)]",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
    >
      {name}
    </Link>
  )
}
