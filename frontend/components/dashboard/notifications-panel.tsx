import Link from "next/link";

import { formatDateLabel } from "@/frontend/utils/format";
import type { NotificationRecord } from "@/frontend/types";

export function NotificationsPanel({
  items,
  title = "Notifications",
  description = "Recent alerts, updates, and reminders.",
}: {
  items: NotificationRecord[];
  title?: string;
  description?: string;
}) {
  return (
    <div className="surface-panel p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-line bg-white/75 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-sm text-ink-soft">{item.message}</div>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {item.type}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-ink-soft/80">
                <span>{formatDateLabel(item.createdAt)}</span>
                {item.link ? (
                  <Link href={item.link} className="font-semibold text-brand-600">
                    Open
                  </Link>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-line bg-white/60 p-6 text-sm text-ink-soft">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}
