"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useVirgil } from "@/lib/virgil-context"
import type { VirgilPose } from "@/lib/virgil-poses"

/**
 * Automatically sets Virgil's page context and suggestions
 * based on the current route. Renders nothing — pure side-effect.
 */
export function VirgilPageContext() {
  const pathname = usePathname()
  const { setPageContext, setSuggestions, setPose } = useVirgil()

  useEffect(() => {
    const path = pathname ?? ""

    if (path === "/" || path === "/dashboard") {
      setPageContext({ page: "dashboard" })
      setSuggestions(["What should I read today?", "How am I doing?", "Recommend a book"])
      setPose("idle")
    } else if (path === "/library") {
      setPageContext({ page: "library" })
      setSuggestions(["What should I read first?", "Recommend a Greek classic", "What's the easiest book?"])
      setPose("idle")
    } else if (path.startsWith("/book/") && !path.includes("/read")) {
      // Book detail — extract book ID from path
      const bookId = path.split("/book/")[1]?.split("/")[0]
      setPageContext({ page: "book-detail", bookTitle: bookId?.replace(/-/g, " ") })
      setSuggestions(["What's this book about?", "Is this good for beginners?", "Tell me about the author"])
      setPose("presenting")
    } else if (path.startsWith("/read/")) {
      const bookId = path.split("/read/")[1]?.split("/")[0]
      setPageContext({ page: "reader", bookTitle: bookId?.replace(/-/g, " ") })
      setSuggestions(["Explain this passage", "Who is this character?", "What's the historical context?", "Why is this important?"])
      setPose("reading")
    } else if (path.startsWith("/quiz")) {
      setPageContext({ page: "quiz" })
      setSuggestions(["Give me a hint", "Explain the answer"])
      setPose("encouraging")
    } else if (path === "/profile" || path.startsWith("/profile/")) {
      setPageContext({ page: "profile" })
      setSuggestions(["Recommend a book", "Tell me about yourself"])
      setPose("idle")
    } else if (path === "/shelves") {
      setPageContext({ page: "shelves" })
      setSuggestions(["What should I read next?", "Recommend something similar"])
      setPose("idle")
    } else {
      setPageContext({ page: "other" })
      setSuggestions(["Recommend a book", "Tell me about yourself", "What's the best classic to start with?"])
      setPose("idle")
    }
  }, [pathname, setPageContext, setSuggestions, setPose])

  return null
}
