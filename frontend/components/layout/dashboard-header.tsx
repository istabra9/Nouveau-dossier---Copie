"use client";

import Link from "next/link";

import { logoutAction } from "@/backend/auth/actions";
import { LanguageSwitcher } from "@/frontend/components/layout/language-switcher";
import { NotificationBell } from "@/frontend/components/layout/notification-bell";
import { ThemeSwitcher } from "@/frontend/components/layout/theme-switcher";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import type { SessionUser } from "@/frontend/types";

export function DashboardHeader({ user }: { user: SessionUser }) {
  const { messages } = useLocale();
  const t = messages.dashboardHeader;

  return (
    <header className="surface-panel-strong rounded-[32px] border border-line px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-ink-soft">
            {t.workspace}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">{user.name}</h2>
            <span className="rounded-full border border-line bg-background px-3 py-1 text-xs font-semibold capitalize tracking-[0.18em] text-ink-soft">
              {user.role.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeSwitcher className="shrink-0" />
          <LanguageSwitcher className="shrink-0" />
          <NotificationBell />
          <Link
            href="/profile"
            className="flex h-14 items-center gap-3 rounded-full border border-line bg-surface px-5 text-sm font-medium hover:bg-brand-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              {user.avatar}
            </span>
            <span>{user.name.split(" ")[0]}</span>
          </Link>
          <form action={logoutAction}>
            <button className="h-14 rounded-full border border-line px-6 text-sm font-semibold text-foreground hover:bg-brand-50">
              {t.logout}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
