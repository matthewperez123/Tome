import {
  Home,
  LayoutDashboard,
  Library,
  BookOpen,
  BrainCircuit,
  Trophy,
  Users,
  Globe2,
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
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Library", href: "/library", icon: Library },
  { label: "Reading", href: "/reading", icon: BookOpen },
  { label: "Quizzes", href: "/quizzes", icon: BrainCircuit },
  { label: "Explore", href: "/explore", icon: Globe2 },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Community", href: "/social", icon: Users },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
]

export const dockNav: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Library", href: "/library", icon: Library },
  { label: "Read", href: "/reading", icon: BookOpen },
  { label: "Quiz", href: "/quizzes", icon: BrainCircuit },
  { label: "Profile", href: "/profile", icon: User },
]
