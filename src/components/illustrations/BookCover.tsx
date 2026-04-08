"use client";

import { type CoverStyle } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BookCoverProps {
  coverStyle: CoverStyle;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ---------------------------------------------------------------------------
// Seeded PRNG
// ---------------------------------------------------------------------------

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// ---------------------------------------------------------------------------
// Dimension helpers
// ---------------------------------------------------------------------------

const SIZE_MAP = {
  sm: { width: 80, height: 80 },
  md: { width: 160, height: 200 },
  lg: { width: 320, height: 240 },
} as const;

// ---------------------------------------------------------------------------
// Shape renderers
//
// Every function receives the viewBox dimensions, palette, and the seeded
// random generator and returns an array of React SVG elements.
// ---------------------------------------------------------------------------

type ShapeFn = (
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
) => React.ReactNode;

function shapeCircle(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const r = vw * (0.3 + rand() * 0.25);
  const cx = vw * (0.15 + rand() * 0.7);
  const cy = vh * (0.15 + rand() * 0.7);
  const color = palette[Math.floor(rand() * palette.length)];

  return (
    <circle
      key={`circle-${idx}`}
      cx={cx}
      cy={cy}
      r={r}
      fill={color}
      opacity={0.15 + rand() * 0.2}
    />
  );
}

function shapeWave(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const y0 = vh * (0.6 + rand() * 0.15);
  const amp = vh * (0.06 + rand() * 0.08);
  const freq = 1.5 + rand() * 1.5;
  const color = palette[Math.floor(rand() * palette.length)];

  const points: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * vw;
    const y = y0 + Math.sin((i / steps) * Math.PI * freq * 2) * amp;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const d = `M${points[0]} ${points.slice(1).map((p) => `L${p}`).join(" ")} L${vw},${vh} L0,${vh} Z`;

  return (
    <path
      key={`wave-${idx}`}
      d={d}
      fill={color}
      opacity={0.12 + rand() * 0.15}
    />
  );
}

function shapeColumn(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const w = vw * (0.08 + rand() * 0.1);
  const h = vh * (0.5 + rand() * 0.35);
  const x = vw * (0.15 + rand() * 0.6);
  const y = vh - h - vh * rand() * 0.05;
  const rx = w * 0.15;
  const color = palette[Math.floor(rand() * palette.length)];

  return (
    <rect
      key={`column-${idx}`}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill={color}
      opacity={0.2 + rand() * 0.15}
    />
  );
}

function shapeArc(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const corner = Math.floor(rand() * 4);
  const r = Math.min(vw, vh) * (0.35 + rand() * 0.25);
  const color = palette[Math.floor(rand() * palette.length)];

  const corners = [
    { cx: 0, cy: 0, start: 0, end: 90 },
    { cx: vw, cy: 0, start: 90, end: 180 },
    { cx: vw, cy: vh, start: 180, end: 270 },
    { cx: 0, cy: vh, start: 270, end: 360 },
  ];
  const c = corners[corner];
  const startRad = (c.start * Math.PI) / 180;
  const endRad = (c.end * Math.PI) / 180;
  const x1 = c.cx + r * Math.cos(startRad);
  const y1 = c.cy + r * Math.sin(startRad);
  const x2 = c.cx + r * Math.cos(endRad);
  const y2 = c.cy + r * Math.sin(endRad);

  const d = `M${c.cx},${c.cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;

  return (
    <path
      key={`arc-${idx}`}
      d={d}
      fill={color}
      opacity={0.12 + rand() * 0.13}
    />
  );
}

function shapeDotGrid(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const cols = 5 + Math.floor(rand() * 4);
  const rows = 4 + Math.floor(rand() * 3);
  const dotR = Math.min(vw, vh) * 0.012;
  const color = palette[Math.floor(rand() * palette.length)];
  const offsetX = vw * rand() * 0.15;
  const offsetY = vh * rand() * 0.15;
  const spacingX = (vw * 0.7) / cols;
  const spacingY = (vh * 0.6) / rows;

  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`dot-${idx}-${r}-${c}`}
          cx={offsetX + vw * 0.15 + c * spacingX}
          cy={offsetY + vh * 0.2 + r * spacingY}
          r={dotR}
          fill={color}
          opacity={0.15 + rand() * 0.1}
        />,
      );
    }
  }

  return <g key={`dotgrid-${idx}`}>{dots}</g>;
}

function shapeRibbon(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const thickness = Math.min(vw, vh) * (0.1 + rand() * 0.08);
  const color = palette[Math.floor(rand() * palette.length)];
  const offset = rand() * 0.3;

  const x1 = -thickness * 0.5;
  const y1 = vh * (0.2 + offset);
  const x2 = vw + thickness * 0.5;
  const y2 = -vh * 0.1 + vh * offset;

  const dx = -(y2 - y1);
  const dy = x2 - x1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = (dx / len) * thickness;
  const ny = (dy / len) * thickness;

  const d = `M${x1},${y1} L${x2},${y2} L${(x2 + nx).toFixed(1)},${(y2 + ny).toFixed(1)} L${(x1 + nx).toFixed(1)},${(y1 + ny).toFixed(1)} Z`;

  return (
    <path
      key={`ribbon-${idx}`}
      d={d}
      fill={color}
      opacity={0.14 + rand() * 0.12}
    />
  );
}

function shapeLaurel(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const cx = vw * (0.35 + rand() * 0.3);
  const cy = vh * (0.35 + rand() * 0.3);
  const r = Math.min(vw, vh) * (0.22 + rand() * 0.12);
  const color = palette[Math.floor(rand() * palette.length)];
  const leaves: React.ReactNode[] = [];
  const leafCount = 8;

  for (let i = 0; i < leafCount; i++) {
    const angle = (Math.PI * 0.3) + (i / (leafCount - 1)) * Math.PI * 1.4;
    const lx = cx + Math.cos(angle) * r;
    const ly = cy + Math.sin(angle) * r;
    const leafAngle = (angle * 180) / Math.PI + 90;
    const leafW = r * 0.18;
    const leafH = r * 0.35;

    leaves.push(
      <ellipse
        key={`laurel-leaf-${idx}-${i}`}
        cx={lx}
        cy={ly}
        rx={leafW}
        ry={leafH}
        transform={`rotate(${leafAngle.toFixed(1)},${lx.toFixed(1)},${ly.toFixed(1)})`}
        fill={color}
        opacity={0.18 + rand() * 0.1}
      />,
    );
  }

  return <g key={`laurel-${idx}`}>{leaves}</g>;
}

function shapeScroll(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const color = palette[Math.floor(rand() * palette.length)];
  const cx = vw * (0.3 + rand() * 0.4);
  const cy = vh * (0.3 + rand() * 0.4);
  const w = vw * (0.3 + rand() * 0.15);
  const h = vh * (0.35 + rand() * 0.15);
  const curl = w * 0.18;

  const d = [
    `M${cx - w / 2},${cy - h / 2}`,
    `Q${cx - w / 2 - curl},${cy - h / 2 + h * 0.15} ${cx - w / 2},${cy - h / 2 + h * 0.3}`,
    `L${cx - w / 2},${cy + h / 2}`,
    `Q${cx - w / 2 - curl},${cy + h / 2 - h * 0.15} ${cx - w / 2 + curl},${cy + h / 2 + curl * 0.5}`,
    `L${cx + w / 2 - curl},${cy + h / 2 + curl * 0.5}`,
    `Q${cx + w / 2 + curl},${cy + h / 2 - h * 0.15} ${cx + w / 2},${cy + h / 2}`,
    `L${cx + w / 2},${cy - h / 2 + h * 0.3}`,
    `Q${cx + w / 2 + curl},${cy - h / 2 + h * 0.15} ${cx + w / 2},${cy - h / 2}`,
    "Z",
  ].join(" ");

  return (
    <path
      key={`scroll-${idx}`}
      d={d}
      fill={color}
      opacity={0.14 + rand() * 0.12}
    />
  );
}

function shapeTemple(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const color = palette[Math.floor(rand() * palette.length)];
  const baseW = vw * (0.5 + rand() * 0.2);
  const peakH = vh * (0.15 + rand() * 0.1);
  const cx = vw * (0.3 + rand() * 0.4);
  const baseY = vh * (0.35 + rand() * 0.2);

  const d = [
    `M${cx - baseW / 2},${baseY}`,
    `L${cx},${baseY - peakH}`,
    `L${cx + baseW / 2},${baseY}`,
    "Z",
  ].join(" ");

  return (
    <path
      key={`temple-${idx}`}
      d={d}
      fill={color}
      opacity={0.16 + rand() * 0.12}
    />
  );
}

function shapeCrescent(
  vw: number,
  vh: number,
  palette: string[],
  rand: () => number,
  idx: number,
): React.ReactNode {
  const color = palette[Math.floor(rand() * palette.length)];
  const r = Math.min(vw, vh) * (0.2 + rand() * 0.15);
  const cx = vw * (0.3 + rand() * 0.4);
  const cy = vh * (0.25 + rand() * 0.4);
  const innerOffset = r * (0.3 + rand() * 0.2);

  return (
    <g key={`crescent-${idx}`}>
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.2 + rand() * 0.12} />
      <circle
        cx={cx + innerOffset}
        cy={cy - innerOffset * 0.4}
        r={r * 0.82}
        fill="var(--color-snow, #FAFAF8)"
        opacity={1}
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Shape registry
// ---------------------------------------------------------------------------

const SHAPE_REGISTRY: Record<string, ShapeFn> = {
  circle: shapeCircle,
  wave: shapeWave,
  column: shapeColumn,
  arc: shapeArc,
  "dot-grid": shapeDotGrid,
  ribbon: shapeRibbon,
  laurel: shapeLaurel,
  scroll: shapeScroll,
  temple: shapeTemple,
  crescent: shapeCrescent,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BookCover({ coverStyle, size = "md", className }: BookCoverProps) {
  const { palette, seed, shapes } = coverStyle;
  const { width, height } = SIZE_MAP[size];
  const rand = seededRandom(seed);

  // Background gradient from first two palette colors
  const gradId = `bg-grad-${seed}`;
  const color1 = palette[0] ?? "#3B82F6";
  const color2 = palette[1] ?? palette[0] ?? "#8B5CF6";
  const gradAngle = rand() * 360;
  const gradRad = (gradAngle * Math.PI) / 180;
  const gx1 = 50 + Math.cos(gradRad) * 50;
  const gy1 = 50 + Math.sin(gradRad) * 50;
  const gx2 = 50 - Math.cos(gradRad) * 50;
  const gy2 = 50 - Math.sin(gradRad) * 50;

  // Pick 2-3 shapes to render
  const shapeCount = Math.min(shapes.length, 2 + (rand() > 0.5 ? 1 : 0));
  const selectedShapes = shapes.slice(0, shapeCount);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("rounded-lg overflow-hidden flex-shrink-0", className)}
      role="img"
      aria-label="Book cover illustration"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1={`${gx1.toFixed(1)}%`}
          y1={`${gy1.toFixed(1)}%`}
          x2={`${gx2.toFixed(1)}%`}
          y2={`${gy2.toFixed(1)}%`}
        >
          <stop offset="0%" stopColor={color1} stopOpacity={0.07} />
          <stop offset="100%" stopColor={color2} stopOpacity={0.04} />
        </linearGradient>
        <clipPath id={`clip-${seed}`}>
          <rect x={0} y={0} width={width} height={height} rx={8} />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${seed})`}>
        {/* Subtle gradient background */}
        <rect x={0} y={0} width={width} height={height} fill={`url(#${gradId})`} />

        {/* Geometric shapes */}
        {selectedShapes.map((shapeName, i) => {
          const fn = SHAPE_REGISTRY[shapeName];
          if (!fn) return null;
          return fn(width, height, palette, rand, i);
        })}

        {/* Accent line — one vivid color moment */}
        <line
          x1={width * rand() * 0.3}
          y1={height * (0.85 + rand() * 0.1)}
          x2={width * (0.5 + rand() * 0.5)}
          y2={height * (0.85 + rand() * 0.1)}
          stroke={palette[0]}
          strokeWidth={Math.max(1.5, height * 0.012)}
          opacity={0.6}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default BookCover;
