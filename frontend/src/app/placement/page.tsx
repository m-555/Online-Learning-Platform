"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
const TOTAL_QUESTIONS = 8;

interface Question {
  level: number; // index into LEVELS
  prompt: string;
  options: string[];
  correct: number;
}

// A small French grammar bank, two questions per CEFR level (A1 → C1).
const QUESTIONS: Question[] = [
  { level: 0, prompt: "Je ______ étudiant.", options: ["es", "est", "suis", "sommes"], correct: 2 },
  { level: 0, prompt: "Tu ______ français ?", options: ["est", "es", "suis", "sont"], correct: 1 },
  {
    level: 1,
    prompt: "Hier, nous ______ au marché.",
    options: ["allons", "sommes allés", "allions", "irons"],
    correct: 1,
  },
  {
    level: 1,
    prompt: "La semaine dernière, j'______ visité Paris.",
    options: ["suis", "ai", "vais", "étais"],
    correct: 1,
  },
  {
    level: 2,
    prompt: "Il faut que tu ______ à l'heure.",
    options: ["es", "sois", "seras", "être"],
    correct: 1,
  },
  {
    level: 2,
    prompt: "Si j'avais le temps, je ______ davantage.",
    options: ["lis", "lirais", "lirai", "lisais"],
    correct: 1,
  },
  {
    level: 3,
    prompt: "Bien qu'il ______ fatigué, il a continué.",
    options: ["est", "était", "soit", "sera"],
    correct: 2,
  },
  {
    level: 3,
    prompt: "Je ne pense pas qu'il ______ raison.",
    options: ["a", "ait", "avait", "aura"],
    correct: 1,
  },
  {
    level: 4,
    prompt: "Il parlait comme s'il ______ tout compris.",
    options: ["a", "ait", "avait", "aurait"],
    correct: 2,
  },
  {
    level: 4,
    prompt: "Quoi qu'il ______, nous resterons unis.",
    options: ["arrivera", "arrive", "arrivait", "arriverait"],
    correct: 1,
  },
];

function pickQuestion(level: number, used: Set<number>): { question: Question; index: number } {
  // Prefer an unused question at the target level, then search outward.
  for (let delta = 0; delta < LEVELS.length; delta++) {
    for (const candidate of [level - delta, level + delta]) {
      if (candidate < 0 || candidate >= LEVELS.length) continue;
      const idx = QUESTIONS.findIndex((q, i) => q.level === candidate && !used.has(i));
      if (idx !== -1) return { question: QUESTIONS[idx], index: idx };
    }
  }
  const idx = QUESTIONS.findIndex((_, i) => !used.has(i));
  return { question: QUESTIONS[idx], index: idx };
}

export default function PlacementPage() {
  const t = useTranslations("placement");

  const [level, setLevel] = useState(1); // start around A2
  const [count, setCount] = useState(0);
  const [used, setUsed] = useState<Set<number>>(() => new Set());
  const [current, setCurrent] = useState(() => pickQuestion(1, new Set()));
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const progress = useMemo(() => Math.round((count / TOTAL_QUESTIONS) * 100), [count]);

  function advance(wasCorrect: boolean) {
    const nextLevel = wasCorrect ? Math.min(level + 1, LEVELS.length - 1) : Math.max(level - 1, 0);
    const nextUsed = new Set(used).add(current.index);
    const nextCount = count + 1;

    if (nextCount >= TOTAL_QUESTIONS) {
      setResult(LEVELS[nextLevel]);
      return;
    }
    setLevel(nextLevel);
    setUsed(nextUsed);
    setCount(nextCount);
    setSelected(null);
    setCurrent(pickQuestion(nextLevel, nextUsed));
  }

  if (result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-md rounded-[18px] border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[16px] bg-success-soft text-success">
            <CheckIcon width={28} height={28} />
          </div>
          <p className="text-[13px] font-semibold text-muted">{t("resultTitle")}</p>
          <div className="my-2 font-display text-[44px] font-extrabold text-primary">{result}</div>
          <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-muted">
            {t("resultBody", { level: result })}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/teachers" className={buttonClasses("primary", "md")}>
              {t("resultCta")}
            </Link>
            <Link href="/" className={buttonClasses("secondary", "md")}>
              {t("restart")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const q = current.question;

  return (
    <main className="min-h-screen bg-canvas">
      {/* Progress header */}
      <header className="flex items-center gap-4 border-b border-border bg-surface px-6 py-4">
        <Logo />
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <span className="whitespace-nowrap text-[13px] font-semibold text-muted">
          {t("progress", { current: count + 1, total: TOTAL_QUESTIONS })}
        </span>
        <Link href="/" className="text-[13px] font-semibold text-muted hover:text-ink">
          {t("exit")}
        </Link>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="rounded-[7px] bg-canvas px-2.5 py-1 text-[12px] font-semibold text-ink">
            Français
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-[7px] bg-primary-50 px-2.5 py-1 text-[12px] font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("adapting", { level: LEVELS[level] })}
          </span>
        </div>

        <p className="mb-2.5 text-[13.5px] font-semibold text-muted">{t("choose")}</p>
        <h2 className="mb-7 font-display text-[26px] font-bold leading-snug text-ink">
          {q.prompt}
        </h2>

        <div className="mb-8 flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const active = selected === i;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelected(i)}
                className={cn(
                  "flex items-center gap-3.5 rounded-[12px] border p-4 text-left",
                  active
                    ? "border-primary bg-primary-50 shadow-[0_0_0_3px_var(--primary-50)]"
                    : "border-border bg-surface hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-bold",
                    active ? "bg-primary text-on-primary" : "border border-border text-muted",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className={cn("text-[15.5px]", active ? "font-semibold text-ink" : "text-ink")}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => advance(false)}
            className="text-[14px] font-semibold text-muted hover:text-ink"
          >
            {t("skip")}
          </button>
          <button
            type="button"
            disabled={selected === null}
            onClick={() => advance(selected === q.correct)}
            className={buttonClasses("primary", "lg", "disabled:opacity-50")}
          >
            {count + 1 >= TOTAL_QUESTIONS ? t("finish") : t("next")}
          </button>
        </div>
      </div>
    </main>
  );
}
