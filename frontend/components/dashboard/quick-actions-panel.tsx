"use client";

import Link from "next/link";

import { useLocale } from "@/frontend/components/providers/locale-provider";

type QuickAction = {
  label: string;
  href: string;
  hint: string;
};

export function QuickActionsPanel({
  title,
  hint,
  items,
}: {
  title?: string;
  hint?: string;
  items: QuickAction[];
}) {
  const { messages } = useLocale();
  const t = messages.quickActions;

  return (
    <div className="surface-panel p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title ?? t.title}</h3>
        <p className="text-sm text-ink-soft">{hint ?? t.hint}</p>
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-[22px] border border-line bg-white/75 p-4 transition hover:-translate-y-0.5 hover:bg-white"
          >
            <div className="font-medium">{item.label}</div>
            <div className="mt-1 text-sm text-ink-soft">{item.hint}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
