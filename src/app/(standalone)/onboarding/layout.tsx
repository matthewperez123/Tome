import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Started | Tome",
  description: "Set up your Tome reading experience in 4 simple steps.",
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
