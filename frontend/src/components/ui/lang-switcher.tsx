"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { locales, localeNames, type Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { cn } from "@/lib/cn";

import { ChevronDownIcon } from "./icons";

export function LangSwitcher() {
  const activeLocale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(locale: Locale) {
    setOpen(false);
    startTransition(async () => {
      await setUserLocale(locale);
      router.refresh();
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-2.5 py-1.5 text-[13px] font-semibold text-ink"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {activeLocale.toUpperCase()}
        <ChevronDownIcon width={12} height={12} className="text-muted" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-[12px] border border-border bg-surface shadow-[0_16px_40px_-16px_rgba(20,23,30,0.4)]"
        >
          {locales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === activeLocale}>
              <button
                type="button"
                onClick={() => choose(locale)}
                className={cn(
                  "flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[14px]",
                  locale === activeLocale ? "font-semibold text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    locale === activeLocale ? "bg-primary" : "bg-border",
                  )}
                />
                {localeNames[locale]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
