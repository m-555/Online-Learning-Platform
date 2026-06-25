import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { CheckIcon, XIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { api } from "@/lib/api";

async function verify(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const user = await api.verifyEmail(token);
    return user.is_email_verified;
  } catch {
    return false;
  }
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const t = await getTranslations("auth");
  const { token } = await searchParams;
  const ok = await verify(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-[18px] border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div
          className={`mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[16px] ${
            ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
          }`}
        >
          {ok ? <CheckIcon width={28} height={28} /> : <XIcon width={28} height={28} />}
        </div>
        <h1 className="font-display text-[20px] font-bold text-ink">
          {ok ? t("verifiedTitle") : t("invalidToken")}
        </h1>
        {ok ? <p className="mt-2 text-[14px] text-muted">{t("verifiedBody")}</p> : null}
        <Link
          href={ok ? "/dashboard" : "/"}
          className={buttonClasses("primary", "md", "mt-6 w-full")}
        >
          {ok ? t("goToDashboard") : "Aula"}
        </Link>
      </div>
    </main>
  );
}
