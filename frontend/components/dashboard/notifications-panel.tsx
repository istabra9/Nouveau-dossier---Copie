import Link from "next/link";

import { formatDateLabel } from "@/frontend/utils/format";
import {
  notificationEmoji,
  notificationLabel,
  notificationTone,
} from "@/frontend/utils/notification-visuals";
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
        <h3 className="text-lg font-semibold">
          <span className="mr-2" aria-hidden>
            🔔
          </span>
          {title}
        </h3>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => {
            const emoji = notificationEmoji[item.type] ?? "✨";
            const tone = notificationTone[item.type] ?? notificationTone.system;
            const label = notificationLabel[item.type] ?? item.type;
            const isUnread = item.status === "unread";

            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-[22px] border border-line bg-white/75 p-4 transition hover:bg-white"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ring-1 ${tone}`}
                  aria-hidden
                >
                  {emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold">{item.title}</div>
                    {isUnread ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                        ✨ New
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">{item.message}</div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${tone}`}
                    >
                      <span aria-hidden>{emoji}</span>
                      {label}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-soft/80">
                      <span>🕒 {formatDateLabel(item.createdAt)}</span>
                      {item.link ? (
                        <Link
                          href={item.link}
                          className="font-semibold text-brand-600"
                        >
                          Open →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[22px] border border-dashed border-line bg-white/60 p-6 text-center text-sm text-ink-soft">
            <div className="text-2xl" aria-hidden>
              🌿
            </div>
            <div className="mt-2">All caught up — no notifications yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
