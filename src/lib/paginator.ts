/**
 * Paginator — DOM-measurement HTML pagination engine
 * Splits an HTML string into pages that fit a given pixel height/width.
 * Must be called client-side only.
 */

export interface PaginateOptions {
  html: string
  pageHeight: number  // usable content height in px (after subtracting padding)
  pageWidth: number   // usable content width in px (after subtracting padding)
  fontSize: number
  lineHeight?: number // default 1.8
}

// Module-level cache — max 20 entries
const paginationCache = new Map<string, string[]>()

/** Cheap string hash for cache keying */
function fastHash(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h >>>= 0
  }
  return h
}

export function getPaginationCacheKey(
  bookId: string,
  chapterIndex: number,
  fontSize: number,
  pageHeight: number,
  pageWidth: number
): string {
  return `${bookId}-${chapterIndex}-${fontSize}-${Math.round(pageHeight)}-${Math.round(pageWidth)}`
}

/** Normalize raw HTML childNodes into block-level Elements */
function normalizeToBlocks(nodes: NodeListOf<ChildNode>): Element[] {
  const BLOCK_TAGS = new Set(["P","H1","H2","H3","H4","H5","H6","BLOCKQUOTE","HR","UL","OL","PRE","DIV","SECTION","ARTICLE"])
  const result: Element[] = []
  for (const node of Array.from(nodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        const p = document.createElement("p")
        p.textContent = text
        result.push(p)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      if (BLOCK_TAGS.has(el.tagName)) {
        result.push(el)
      } else {
        // Inline wrapper — wrap in paragraph
        const p = document.createElement("p")
        p.innerHTML = el.outerHTML
        result.push(p)
      }
    }
  }
  return result
}

export async function paginateHTML(options: PaginateOptions): Promise<string[]> {
  const { html, pageHeight, pageWidth, fontSize, lineHeight = 1.8 } = options

  // Guard: SSR or invalid dimensions
  if (typeof window === "undefined") return [html]
  if (!html || pageHeight <= 0 || pageWidth <= 0) return [html || ""]

  // Wait for fonts to be ready (prevents fallback-font measurement errors)
  await document.fonts.ready

  // Check cache
  const htmlHash = fastHash(html)
  const cacheKey = `${fontSize}-${Math.round(pageHeight)}-${Math.round(pageWidth)}-${htmlHash}`
  if (paginationCache.has(cacheKey)) {
    return paginationCache.get(cacheKey)!
  }

  // Create hidden probe element with exact reader styles
  const probe = document.createElement("div")
  probe.setAttribute("aria-hidden", "true")
  probe.className = "font-serif prose-reader"
  Object.assign(probe.style, {
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    width: `${pageWidth}px`,
    height: "auto",
    fontSize: `${fontSize}px`,
    lineHeight: String(lineHeight),
    fontFamily: "var(--font-serif, Literata, Georgia, serif)",
    padding: "0",
    margin: "0",
    overflow: "visible",
    visibility: "hidden",
    pointerEvents: "none",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    boxSizing: "border-box",
  })
  document.body.appendChild(probe)

  // Parse HTML into block elements
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html
  const blockNodes = normalizeToBlocks(tempDiv.childNodes)

  // Edge case: no block nodes
  if (blockNodes.length === 0) {
    document.body.removeChild(probe)
    return [html]
  }

  // Page accumulation loop
  const pages: string[] = []
  let currentPageNodes: Element[] = []
  let accumulatedHeight = 0

  for (const block of blockNodes) {
    // Measure this block in isolation
    probe.innerHTML = ""
    probe.appendChild(block.cloneNode(true))
    const blockHeight = probe.getBoundingClientRect().height

    if (blockHeight > pageHeight) {
      // Block taller than a full page — flush current page, then emit block alone
      if (currentPageNodes.length > 0) {
        pages.push(currentPageNodes.map(n => n.outerHTML).join(""))
        currentPageNodes = []
        accumulatedHeight = 0
      }
      pages.push(block.outerHTML)
      continue
    }

    if (accumulatedHeight + blockHeight > pageHeight && currentPageNodes.length > 0) {
      // Current page is full — flush and start new page
      pages.push(currentPageNodes.map(n => n.outerHTML).join(""))
      currentPageNodes = [block.cloneNode(true) as Element]
      accumulatedHeight = blockHeight
    } else {
      currentPageNodes.push(block.cloneNode(true) as Element)
      accumulatedHeight += blockHeight
    }
  }

  // Flush final page
  if (currentPageNodes.length > 0) {
    pages.push(currentPageNodes.map(n => n.outerHTML).join(""))
  }

  // Cleanup
  document.body.removeChild(probe)

  // Cache with eviction
  if (paginationCache.size >= 20) {
    const firstKey = paginationCache.keys().next().value
    if (firstKey !== undefined) paginationCache.delete(firstKey)
  }
  paginationCache.set(cacheKey, pages)

  return pages.length > 0 ? pages : [html]
}
