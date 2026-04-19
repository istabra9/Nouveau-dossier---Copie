"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { logoutAction } from "@/backend/auth/actions";
import { useLocale } from "@/frontend/components/providers/locale-provider";
import type { SessionUser } from "@/frontend/types";

export function DashboardHeader({ user }: { user: SessionUser }) {
  const { messages } = useLocale();
  const t = messages.dashboardHeader;

  return (
    <header className="surface-panel-strong rounded-[32px] border border-line px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-ink-soft">
            {t.workspace}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {user.name}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-14 min-w-[320px] items-center gap-3 rounded-full border border-line bg-background px-5 text-sm text-ink-soft">
            <Search className="h-4 w-4" />
            {t.searchPlaceholder}
          </div>
          <button className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-foreground hover:bg-brand-50">
            <Bell className="h-4 w-4" />
          </button>
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
