"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAppUser } from "@/components/app/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { clearToken } from "@/lib/auth";

export function UserMenu({ avatarColor = "#0E9F6E" }: { avatarColor?: string }) {
  const user = useAppUser();
  const t = useTranslations("dashboard");
  const ts = useTranslations("pages.settings");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function logOut() {
    clearToken();
    router.replace("/");
  }

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={user.full_name}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full focus-visible:outline-none"
      >
        <Avatar name={user.full_name} color={avatarColor} size="sm" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-[12px] border border-border bg-surface shadow-[0_16px_40px_-16px_rgba(20,23,30,0.4)]"
        >
          <div className="border-b border-border px-4 py-3">
            <div className="truncate text-[14px] font-semibold text-ink">{user.full_name}</div>
            <div className="truncate text-[12px] text-muted">{user.email}</div>
          </div>
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[14px] text-ink hover:bg-canvas"
          >
            {ts("title")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={logOut}
            className="block w-full px-4 py-2.5 text-left text-[14px] font-semibold text-danger hover:bg-canvas"
          >
            {t("logOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
