import { formatDateLabel } from "@/frontend/utils/format";
import type { ActivityItem } from "@/frontend/types";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="surface-panel p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Recent activity</h3>
        <p className="text-sm text-ink-soft">
          The latest enrollment and schedule events across the platform.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-[24px] border border-line bg-surface p-4"
          >
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                item.tone === "success"
                  ? "bg-success"
                  : item.tone === "brand"
                    ? "bg-brand-500"
                    : "bg-accent-gold"
              }`}
            />
            <div className="space-y-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-ink-soft">{item.description}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-ink-soft/70">
                {formatDateLabel(item.at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
