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

const tabs = [
  { href: "/learn", label: "Learn", icon: GraduationCap, color: "#3B82F6" },
  { href: "/stories", label: "Stories", icon: BookOpen, color: "#8B5CF6" },
  { href: "/review", label: "Review", icon: RotateCcw, color: "#F59E0B" },
  { href: "/profile", label: "Profile", icon: User, color: "#10B981" },
  { href: "/shop", label: "Shop", icon: ShoppingBag, color: "#EC4899" },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-snow border-t border-stone/30 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                !isActive && "text-graphite hover:text-ink"
              )}
              style={isActive ? { color: tab.color } : undefined}
            >
              {/* Active indicator line */}
              {isActive && (
                <div
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
                  style={{ backgroundColor: tab.color }}
                />
              )}
              <Icon
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive && "stroke-[2.5] scale-105"
                )}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
