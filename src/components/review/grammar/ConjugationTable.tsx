"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ConjugationData {
  title: string;
  exampleVerb: string;
  meaning: string;
  tenses: {
    name: string;
    headers: string[];
    rows: {
      label: string;
      cells: string[];
      examples?: string[];
    }[];
  }[];
}

interface ConjugationTableProps {
  data: ConjugationData;
  accentColor?: string;
}

export default function ConjugationTable({
  data,
  accentColor = "ocean",
}: ConjugationTableProps) {
  const [activeTense, setActiveTense] = useState(0);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const colorMap: Record<string, string> = {
    ocean: "bg-ocean/10 border-ocean/30",
    iris: "bg-iris/10 border-iris/30",
  };

  const tense = data.tenses[activeTense];

  const activeExample =
    activeCell !== null
      ? tense.rows[activeCell.row]?.examples?.[activeCell.col]
      : null;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <h4 className="text-sm font-semibold text-ink">{data.title}</h4>
        <span className="text-xs text-graphite">
          {data.exampleVerb} &mdash; {data.meaning}
        </span>
      </div>

      {/* Tense selector */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {data.tenses.map((t, i) => (
          <button
            key={t.name}
            onClick={() => {
              setActiveTense(i);
              setActiveCell(null);
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
              activeTense === i
                ? "bg-ocean text-white"
                : "bg-linen text-graphite hover:text-ink"
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm border-collapse min-w-[350px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-graphite py-2 px-3 bg-linen rounded-tl-lg">
                Person
              </th>
              {tense.headers.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "text-left text-xs font-semibold text-graphite py-2 px-3 bg-linen",
                    i === tense.headers.length - 1 && "rounded-tr-lg"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tense.rows.map((row, ri) => (
              <tr key={row.label}>
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
