/**
 * Codex "C" logo as SVG component.
 *
 * Also used as the source for generating the PWA icons at
 * public/icon-192.png and public/icon-512.png.
 *
 * To generate the PNG icons, render this component at 192x192 and 512x512
 * and export via canvas, or use an SVG-to-PNG conversion tool. See
 * scripts/generate-icons.md for instructions.
 */
export default function AppIcon({ size = 512 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Codex app icon"
    >
      {/* Background */}
      <rect width="512" height="512" rx="112" fill="#3B82F6" />

      {/* Inner glow */}
      <rect
        x="24"
        y="24"
        width="464"
        height="464"
        rx="96"
        fill="#3B82F6"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="2"
      />

      {/* Book silhouette (subtle) */}
      <path
        d="M160 140 C160 126 172 114 186 114 L326 114 C340 114 352 126 352 140 L352 390 C352 404 340 416 326 416 L186 416 C172 416 160 404 160 390 Z"
        fill="white"
        fillOpacity="0.08"
      />
      <line
        x1="256"
        y1="130"
        x2="256"
        y2="400"
        stroke="white"
        strokeOpacity="0.06"
        strokeWidth="2"
      />

      {/* Letter C */}
      <text
        x="256"
        y="320"
        textAnchor="middle"
        fontFamily="'Source Serif 4', 'Georgia', serif"
        fontSize="260"
        fontWeight="700"
        fill="white"
      >
        C
      </text>
    </svg>
  );
}
