"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Banner } from "@/components/ui/banner";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { UserAccount } from "@/lib/types";

const AppUserContext = createContext<UserAccount | null>(null);

/** The signed-in account, available to any page rendered inside AppShell. */
export function useAppUser(): UserAccount | null {
  return useContext(AppUserContext);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/");
      return;
    }
    api
      .me(token)
      .then((me) => {
        setUser(me);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [router]);

  if (status !== "ready" || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Loading…</div>;
  }

  return (
    <AppUserContext.Provider value={user}>
      <div className="flex min-h-screen bg-canvas">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar studentName={user.full_name} avatarColor="#0E9F6E" />
          <main className="flex-1 p-6">
            {!user.is_email_verified ? (
              <Banner className="mb-6" action={{ label: t("resendLink"), onClick: () => {} }}>
                {t("verifyBanner")}
              </Banner>
            ) : null}
            {children}
          </main>
        </div>
      </div>
    </AppUserContext.Provider>
  );
}
