import manifest from "../../public/paintings/manifest.json"

export interface Painting {
  id: string
  filename: string
  src: string
  title: string
  artist: string
  year: string
  focalPoint: "top" | "center" | "bottom"
  isDefault?: boolean
}

export const PAINTINGS: Painting[] = manifest as Painting[]

export const DEFAULT_PAINTING =
  PAINTINGS.find((p) => p.isDefault) ?? PAINTINGS[0]

export function getPaintingById(id: string): Painting | undefined {
  return PAINTINGS.find((p) => p.id === id)
}

const STORAGE_KEY = "tome:stoa_painting_id"

export function getStoredPaintingId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredPaintingId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id)
}
