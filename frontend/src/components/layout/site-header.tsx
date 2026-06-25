"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { AuthModal, type AuthMode } from "@/components/auth/auth-modal";
import { LangSwitcher } from "@/components/ui/lang-switcher";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buttonClasses } from "@/components/ui/button";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  function openAuth(nextMode: AuthMode) {
    setMode(nextMode);
    setAuthOpen(true);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-3.5">
        <Link href="/" aria-label="Aula home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#teachers" className="text-[14px] font-medium text-muted hover:text-ink">
            {t("findTeacher")}
          </Link>
          <Link href="#" className="text-[14px] font-medium text-muted hover:text-ink">
            {t("groupClasses")}
          </Link>
          <Link href="#" className="text-[14px] font-medium text-muted hover:text-ink">
            {t("community")}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="px-2 text-[14px] font-semibold text-primary"
          >
            {tCommon("logIn")}
          </button>
          <button
            type="button"
            onClick={() => openAuth("signup")}
            className={buttonClasses("primary", "sm")}
          >
            {tCommon("getStarted")}
          </button>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        mode={mode}
        onModeChange={setMode}
        onClose={() => setAuthOpen(false)}
      />
    </header>
  );
}
