"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <button
      type="button"
      aria-label={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-border text-muted hover:text-ink"
    >
      {/* The correct icon is chosen by the .dark class (set before paint by next-themes),
          so there is no hydration mismatch and no client-only state. */}
      <SunIcon width={18} height={18} className="dark:hidden" />
      <MoonIcon width={18} height={18} className="hidden dark:block" />
    </button>
  );
}
