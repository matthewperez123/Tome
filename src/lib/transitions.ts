import type { Variants, Transition } from "framer-motion"
import { springs } from "@/lib/design-tokens"

const gentleTransition: Transition = {
  ...springs.gentle,
}

export const crossfade: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const crossfadeTransition: Transition = {
  ...gentleTransition,
  duration: 0.5,
}

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 80 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 },
}

export const slideRight: Variants = {
  initial: { opacity: 0, x: -80 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 80 },
}

export const slideTransition: Transition = {
  ...springs.interactive,
}
