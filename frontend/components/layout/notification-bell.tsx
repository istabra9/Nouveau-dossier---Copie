"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { cn } from "@/frontend/utils/cn";
import { formatDateLabel } from "@/frontend/utils/format";
import {
  notificationEmoji,
  notificationTone,
} from "@/frontend/utils/notification-visuals";
import type { NotificationRecord } from "@/frontend/types";

type BellNotification = NotificationRecord & { unread: boolean };

const POLL_INTERVAL_MS = 30_000;

export function NotificationBell() {
  const { messages } = useLocale();
  const t = messages.notificationBell;

  const [items, setItems] = useState<BellNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        ok: boolean;
        notifications: BellNotification[];
        unreadCount: number;
      };

      if (data.ok) {
        setItems(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // network hiccup — next poll will retry
    }
  }, []);

  useEffect(() => {
    const initialId = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);
    const id = window.setInterval(() => {
      void fetchNotifications();
    }, POLL_INTERVAL_MS);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(id);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function markRead(ids?: string[]) {
    const payload = ids ? { ids } : { all: true };

    setItems((prev) =>
      prev.map((item) =>
        !ids || ids.includes(item.id) ? { ...item, unread: false } : item,
      ),
    );
    setUnreadCount((prev) => (ids ? Math.max(0, prev - ids.length) : 0));

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      fetchNotifications();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t.label}
        aria-expanded={open}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-foreground hover:bg-brand-50"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-semibold text-white shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-[360px] max-w-[90vw] overflow-hidden rounded-[24px] border border-line bg-surface shadow-[0_30px_80px_rgba(16,16,32,0.18)]">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="text-xs text-ink-soft">
                {unreadCount > 0 ? t.unreadCount.replace("{count}", String(unreadCount)) : t.allCaughtUp}
              </div>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => markRead()}
                className="flex items-center gap-1 rounded-full border border-line bg-background px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                {t.markAllRead}
              </button>
            ) : null}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-ink-soft">
                <div className="text-2xl" aria-hidden>
                  🌿
                </div>
                <div className="mt-2">{t.empty}</div>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {items.map((item) => {
                  const emoji = notificationEmoji[item.type] ?? "✨";
                  const tone = notificationTone[item.type] ?? notificationTone.system;
                  const content = (
                    <div
                      className={cn(
                        "flex gap-3 px-5 py-4 transition",
                        item.unread ? "bg-brand-50/60" : "hover:bg-background",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-lg ring-1",
                          tone,
                        )}
                        aria-hidden
                      >
                        {emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="truncate text-sm font-medium text-foreground">
                              {item.title}
                            </div>
                            {item.unread ? (
                              <span
                                className="h-2 w-2 shrink-0 rounded-full bg-brand-500"
                                aria-hidden
                              />
                            ) : null}
                          </div>
                          <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-ink-soft/80">
                            {formatDateLabel(item.createdAt)}
                          </span>
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm text-ink-soft">
                          {item.message}
                        </div>
                      </div>
                    </div>
                  );

                  const handleClick = () => {
                    if (item.unread) {
                      markRead([item.id]);
                    }
                    setOpen(false);
                  };

                  return (
                    <li key={item.id}>
                      {item.link ? (
                        <Link href={item.link} onClick={handleClick} className="block">
                          {content}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={handleClick}
                          className="block w-full text-left"
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
