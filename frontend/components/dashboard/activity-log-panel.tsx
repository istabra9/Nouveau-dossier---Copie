import { formatDateLabel } from "@/frontend/utils/format";
import type { ActivityLogRecord } from "@/frontend/types";

const severityClasses = {
  info: "bg-sky-50 text-sky-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  critical: "bg-red-50 text-red-700",
} as const;

export function ActivityLogPanel({
  items,
  title = "Activity history",
  description = "Recent actions across the platform.",
}: {
  items: ActivityLogRecord[];
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
                <div className="space-y-1">
                  <div className="font-medium">{item.message}</div>
                  <div className="text-sm text-ink-soft">
                    {item.actorName} • {item.entityType}
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${severityClasses[item.severity]}`}
                >
                  {item.severity}
                </span>
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-soft/80">
                {formatDateLabel(item.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-line bg-white/60 p-6 text-sm text-ink-soft">
            No activity yet.
          </div>
        )}
      </div>
    </div>
  );
}
