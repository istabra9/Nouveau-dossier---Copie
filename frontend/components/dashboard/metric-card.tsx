import { ArrowUpRight } from "lucide-react";

import { cn } from "@/frontend/utils/cn";
import type { DashboardMetric } from "@/frontend/types";

export function MetricCard({
  metric,
  index = 0,
  className,
}: {
  metric: DashboardMetric;
  index?: number;
  className?: string;
}) {
  const featured = index === 0;

  return (
    <div
      className={cn(
        "ambient-border hover-lift relative overflow-hidden rounded-[30px] border p-5",
        featured
          ? "bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white shadow-[0_28px_55px_rgba(122,22,42,0.24)]"
          : "surface-panel",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl",
          featured ? "bg-white/14" : "bg-brand-200/35",
        )}
      />
      <div className="flex items-start justify-between gap-4">
        <div className={cn("text-sm", featured ? "text-white/75" : "text-ink-soft")}>
          {metric.label}
        </div>
        <div
          className={cn(
            "rounded-full p-2",
            featured ? "bg-white/12 text-white" : "bg-white/80 text-brand-600",
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight">{metric.value}</div>
      <div
        className={cn(
          "mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium",
          featured
            ? "bg-white/14 text-white"
            : "bg-brand-50 text-brand-600",
        )}
      >
        {metric.change}
      </div>
      <p className={cn("mt-4 text-sm leading-6", featured ? "text-white/82" : "text-ink-soft")}>
        {metric.description}
      </p>
    </div>
  );
}
