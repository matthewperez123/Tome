"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  {
    id: "latin",
    name: "Latin",
    color: "bg-ocean",
    border: "border-ocean",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="8" x2="16" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="24" x2="22" y2="24" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "greek",
    name: "Ancient Greek",
    color: "bg-iris",
    border: "border-iris",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 26V10a6 6 0 0 1 12 0v6a6 6 0 0 0 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="26" x2="14" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "aramaic",
    name: "Aramaic",
    color: "bg-peony",
    border: "border-peony",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="14" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M12 22v4M20 22v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "arabic",
    name: "Arabic",
    color: "bg-cyan",
    border: "border-cyan",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 20c0-6 4-12 10-12s6 6 6 10c0 2-1 4-3 4s-3-2-3-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="24" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", sublabel: "A1 - A2", description: "Starting from scratch or know a few words" },
  { id: "intermediate", label: "Intermediate", sublabel: "B1 - B2", description: "Can read simple texts with help" },
  { id: "advanced", label: "Advanced", sublabel: "C1 - C2", description: "Comfortable reading original texts" },
];

const GOALS = [
  { id: "casual", label: "Casual", count: 1, description: "1 lesson per day" },
  { id: "regular", label: "Regular", count: 3, description: "3 lessons per day" },
  { id: "serious", label: "Serious", count: 5, description: "5 lessons per day" },
];

function RingIcon({ count, max }: { count: number; max: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const filled = (count / max) * circumference;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="var(--color-stone)"
        strokeWidth="4"
      />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="var(--color-ocean)"
        strokeWidth="4"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
      />
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold fill-ink"
      >
        {count}
      </text>
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  function goNext() {
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 200);
  }

  function goBack() {
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setTransitioning(false);
    }, 200);
  }

  function handleFinish() {
    router.push("/learn");
  }

  return (
    <div className="flex flex-col items-center">
      {/* Wordmark */}
      <h1 className="font-serif text-3xl font-bold text-ink mb-2">Codex</h1>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? "w-8 bg-ocean"
                : i < step
                ? "w-2 bg-ocean/50"
                : "w-2 bg-stone"
            }`}
          />
        ))}
      </div>

      {/* Step content with transition */}
      <div
        className={`w-full transition-all duration-200 ${
          transitioning
            ? "opacity-0 translate-y-2"
            : "opacity-100 translate-y-0"
        }`}
      >
        {/* Step 1: Language */}
        {step === 0 && (
          <div className="w-full">
            <h2 className="font-serif text-xl font-semibold text-ink text-center mb-6">
              What language do you want to learn?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.id);
                    goNext();
                  }}
                  className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-150 cursor-pointer hover:shadow-md ${
                    language === lang.id
                      ? `${lang.border} bg-snow shadow-sm`
                      : "border-stone bg-linen hover:border-graphite/40"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${lang.color} text-white flex items-center justify-center`}
                  >
                    {lang.icon}
                  </div>
                  <span className="font-medium text-ink text-sm">
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Level */}
        {step === 1 && (
          <div className="w-full">
            <h2 className="font-serif text-xl font-semibold text-ink text-center mb-6">
              What&apos;s your level?
            </h2>
            <div className="flex flex-col gap-3">
              {LEVELS.map((lv) => (
                <button
                  key={lv.id}
                  type="button"
                  onClick={() => {
                    setLevel(lv.id);
                    goNext();
                  }}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-150 cursor-pointer hover:shadow-md ${
                    level === lv.id
                      ? "border-ocean bg-snow shadow-sm"
                      : "border-stone bg-linen hover:border-graphite/40"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-ink">
                        {lv.label}
                      </span>
                      <span className="text-xs text-graphite font-medium">
                        {lv.sublabel}
                      </span>
                    </div>
                    <p className="text-sm text-graphite mt-0.5">
                      {lv.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 w-full text-center text-sm text-graphite hover:text-ink transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 3: Daily goal */}
        {step === 2 && (
          <div className="w-full">
            <h2 className="font-serif text-xl font-semibold text-ink text-center mb-6">
              Set your daily goal
            </h2>
            <div className="flex flex-col gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGoal(g.id);
                    goNext();
                  }}
                  className={`flex items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-150 cursor-pointer hover:shadow-md ${
                    goal === g.id
                      ? "border-ocean bg-snow shadow-sm"
                      : "border-stone bg-linen hover:border-graphite/40"
                  }`}
                >
                  <RingIcon count={g.count} max={5} />
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-ink">{g.label}</span>
                    <p className="text-sm text-graphite mt-0.5">
                      {g.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 w-full text-center text-sm text-graphite hover:text-ink transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 4: Celebration */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-clover/15 flex items-center justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 20l7 7 13-14"
                  stroke="var(--color-clover)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink mb-2">
              Your Codex is ready
            </h2>
            <p className="text-graphite mb-8 max-w-xs">
              You&apos;re all set to start learning{" "}
              {LANGUAGES.find((l) => l.id === language)?.name ?? "your language"}
              . Let&apos;s begin with your first reading.
            </p>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full rounded-xl bg-ocean text-white font-medium py-3 hover:bg-ocean/90 focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:ring-offset-2 transition-colors cursor-pointer text-lg"
            >
              Start reading
            </button>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 w-full text-center text-sm text-graphite hover:text-ink transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
