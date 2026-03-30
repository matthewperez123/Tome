import {
  Home,
  Library,
  BookOpen,
  BrainCircuit,
  Trophy,
  Users,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const sidebarNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Library", href: "/library", icon: Library },
  { label: "Reading", href: "/reading", icon: BookOpen },
  { label: "Quizzes", href: "/quizzes", icon: BrainCircuit },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Book Clubs", href: "/clubs", icon: Users },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
]

export const dockNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Library", href: "/library", icon: Library },
  { label: "Read", href: "/reading", icon: BookOpen },
  { label: "Quiz", href: "/quizzes", icon: BrainCircuit },
  { label: "Profile", href: "/profile", icon: User },
]
