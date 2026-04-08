"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface DeclensionData {
  title: string;
  exampleWord: string;
  meaning: string;
  gender?: string;
  headers: string[];
  rows: {
    label: string;
    cells: string[];
    examples?: string[];
  }[];
}

interface DeclensionTableProps {
  data: DeclensionData;
  accentColor?: string;
}

export default function DeclensionTable({
  data,
  accentColor = "ocean",
}: DeclensionTableProps) {
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const colorMap: Record<string, string> = {
    ocean: "bg-ocean/10 border-ocean/30",
    iris: "bg-iris/10 border-iris/30",
  };

  const activeExample =
    activeCell !== null
      ? data.rows[activeCell.row]?.examples?.[activeCell.col]
      : null;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <h4 className="text-sm font-semibold text-ink">{data.title}</h4>
        <span className="text-xs text-graphite">
          {data.exampleWord} &mdash; {data.meaning}
          {data.gender && ` (${data.gender})`}
        </span>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm border-collapse min-w-[400px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-graphite py-2 px-3 bg-linen rounded-tl-lg">
                Case
              </th>
              {data.headers.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "text-left text-xs font-semibold text-graphite py-2 px-3 bg-linen",
                    i === data.headers.length - 1 && "rounded-tr-lg"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr
                key={row.label}
                className={cn(
                  ri === data.rows.length - 1 && "border-b-0"
                )}
              >
                <td className="text-xs font-medium text-graphite py-2 px-3 border-b border-stone/10">
                  {row.label}
                </td>
                {row.cells.map((cell, ci) => {
                  const isActive =
                    activeCell?.row === ri && activeCell?.col === ci;
                  return (
                    <td
                      key={ci}
                      onClick={() =>
                        setActiveCell(
                          isActive ? null : { row: ri, col: ci }
                        )
                      }
                      className={cn(
                        "py-2 px-3 border-b border-stone/10 font-serif cursor-pointer transition-all",
                        isActive
                          ? colorMap[accentColor] || colorMap.ocean
                          : "hover:bg-linen/50"
                      )}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeExample && (
        <div className="mt-3 p-3 rounded-xl bg-linen/60 animate-in fade-in duration-200">
          <p className="text-xs text-graphite">
            <span className="font-semibold">Example:</span>{" "}
            <span className="font-serif italic">{activeExample}</span>
          </p>
        </div>
      )}
    </div>
  );
}
