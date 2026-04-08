"use client";

import { useState } from "react";
import { Shield, Lock, CheckCircle, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language, type Difficulty } from "@/types";

interface ProficiencyGateProps {
  language: Language;
  requiredLevel: Difficulty;
  currentLevel: Difficulty;
  onStartAssessment: () => void;
  onBypass?: () => void;
}

const DIFFICULTY_ORDER: Difficulty[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function getDifficultyIndex(d: Difficulty): number {
  return DIFFICULTY_ORDER.indexOf(d);
}

function getDifficultyDescription(level: Difficulty): string {
  const descriptions: Record<Difficulty, string> = {
    A1: "Can recognize basic words and simple phrases",
    A2: "Can understand frequently used expressions and basic grammar",
    B1: "Can understand main points of clear standard text on familiar matters",
    B2: "Can understand complex text and interact with fluency",
    C1: "Can understand demanding, longer texts with implicit meaning",
    C2: "Can understand virtually everything read with ease",
  };
  return descriptions[level];
}

// Skills required at each level
function getSkillsForLevel(level: Difficulty, language: Language): string[] {
  const langLabel = LANGUAGE_LABELS[language];
  const skills: Record<Difficulty, string[]> = {
    A1: [`Basic ${langLabel} alphabet/script recognition`, "Common greetings and phrases"],
    A2: ["Basic noun declensions", "Simple verb conjugations", "Common vocabulary (100+ words)"],
    B1: ["Complex grammar structures", "Intermediate vocabulary (500+ words)", "Reading comprehension"],
    B2: ["Advanced grammar", "Idiomatic expressions", "Literary vocabulary", "Complex sentence parsing"],
    C1: ["Nuanced grammar", "Rare vocabulary", "Stylistic analysis", "Historical context"],
    C2: ["Near-native comprehension", "Archaic forms", "Textual criticism", "Scholarly analysis"],
  };
  return skills[level];
}

export function ProficiencyGate({
  language,
  requiredLevel,
  currentLevel,
  onStartAssessment,
  onBypass,
}: ProficiencyGateProps) {
  const isUnlocked = getDifficultyIndex(currentLevel) >= getDifficultyIndex(requiredLevel);
  const langColor = LANGUAGE_HEX[language];
  const skills = getSkillsForLevel(requiredLevel, language);

  if (isUnlocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-clover/10 rounded-xl">
        <CheckCircle className="w-4 h-4 text-clover" />
        <span className="text-sm text-clover font-medium">
          {requiredLevel} proficiency verified
        </span>
      </div>
    );
  }

  return (
    <div className="bg-linen rounded-2xl p-5 border border-stone/30">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${langColor}15` }}
        >
          <Shield className="w-5 h-5" style={{ color: langColor }} />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-ink">
            {requiredLevel} Proficiency Required
          </h3>
          <p className="text-xs text-graphite">
            {getDifficultyDescription(requiredLevel)}
          </p>
        </div>
      </div>

      {/* Skills checklist */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-graphite uppercase tracking-wider">
          Skills needed
        </p>
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-stone" />
            <span className="text-sm text-ink">{skill}</span>
          </div>
        ))}
      </div>

      {/* Current level indicator */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-snow rounded-xl">
        <BookOpen className="w-4 h-4 text-graphite" />
        <span className="text-sm text-graphite">
          Your current {LANGUAGE_LABELS[language]} level:{" "}
          <span className="font-semibold text-ink">{currentLevel}</span>
        </span>
      </div>

      {/* Level progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          {DIFFICULTY_ORDER.map((level) => (
            <span
              key={level}
              className={cn(
                "text-[10px] font-medium",
                level === currentLevel
                  ? "text-ink font-bold"
                  : level === requiredLevel
                    ? "font-bold"
                    : "text-graphite"
              )}
              style={level === requiredLevel ? { color: langColor } : undefined}
            >
              {level}
            </span>
          ))}
        </div>
        <div className="h-2 bg-stone/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((getDifficultyIndex(currentLevel) + 1) / DIFFICULTY_ORDER.length) * 100}%`,
              backgroundColor: langColor,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={onStartAssessment}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: langColor }}
        >
          Take {requiredLevel} Assessment
          <ChevronRight className="w-4 h-4" />
        </button>

        {onBypass && (
          <button
            onClick={onBypass}
            className="w-full text-center text-xs text-graphite hover:text-ink transition-colors py-2"
          >
            I already know this level — skip assessment
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Difficulty badge that shows whether a text is accessible
 * based on the user's current proficiency
 */
export function DifficultyMarker({
  difficulty,
  language,
  userLevel,
  size = "md",
}: {
  difficulty: Difficulty;
  language: Language;
  userLevel: Difficulty;
  size?: "sm" | "md";
}) {
  const isAccessible = getDifficultyIndex(userLevel) >= getDifficultyIndex(difficulty);
  const langColor = LANGUAGE_HEX[language];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        isAccessible
          ? "border"
          : "bg-stone/20 text-graphite"
      )}
      style={
        isAccessible
          ? { borderColor: `${langColor}40`, color: langColor, backgroundColor: `${langColor}08` }
          : undefined
      }
    >
      {!isAccessible && <Lock className={cn(size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3")} />}
      {difficulty}
    </div>
  );
}
