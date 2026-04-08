"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  RotateCcw,
  User,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { getLevel, getLevelTitle } from "@/types";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/learn", label: "Learn", icon: GraduationCap, color: "#3B82F6" },
  { href: "/stories", label: "Stories", icon: BookOpen, color: "#8B5CF6" },
  { href: "/review", label: "Review", icon: RotateCcw, color: "#F59E0B" },
  { href: "/profile", label: "Profile", icon: User, color: "#10B981" },
  { href: "/shop", label: "Shop", icon: ShoppingBag, color: "#EC4899" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { totalXp } = useAppStore();
  const level = getLevel(totalXp);

  return (
    <aside className="hidden md:flex md:flex-col md:w-[220px] md:fixed md:inset-y-0 bg-linen border-r border-stone/30">
      {/* Logo */}
      <div className="px-6 py-5">
        <h1 className="font-serif text-2xl font-bold text-ink tracking-tight">
          Codex
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                !isActive && "text-graphite hover:bg-stone/30 hover:text-ink"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      borderLeft: `3px solid ${item.color}`,
                    }
                  : undefined
              }
            >
              {/* Colored dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isActive ? item.color : `${item.color}40`,
                }}
              />
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 pb-2">
        <ThemeToggle />
      </div>

      {/* User info at bottom */}
      <div className="px-4 py-4 border-t border-stone/30">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
          >
            <span className="text-white text-sm font-semibold">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">
              Level {level}
            </p>
            <p className="text-xs text-graphite">{getLevelTitle(level)}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
