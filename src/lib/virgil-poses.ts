export type VirgilPose =
  | "idle"
  | "thinking"
  | "reading"
  | "waving"
  | "encouraging"
  | "presenting"
  | "sleeping"

const VIRGIL_IMAGE = "/virgil/virgil-idle.png"

// All poses use the same image for now — the single complete Virgil illustration.
// When individual pose images are added, update paths here.
const POSE_IMAGES: Record<VirgilPose, string> = {
  idle: VIRGIL_IMAGE,
  thinking: VIRGIL_IMAGE,
  reading: VIRGIL_IMAGE,
  waving: VIRGIL_IMAGE,
  encouraging: VIRGIL_IMAGE,
  presenting: VIRGIL_IMAGE,
  sleeping: VIRGIL_IMAGE,
}

export function getPoseImage(pose: VirgilPose): string {
  return POSE_IMAGES[pose] ?? VIRGIL_IMAGE
}
