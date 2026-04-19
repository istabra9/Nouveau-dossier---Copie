type Insight = {
  title: string;
  description: string;
  tone?: "brand" | "warning" | "success";
};

const toneClasses = {
  brand: "bg-brand-50 text-brand-700",
  warning: "bg-amber-50 text-amber-700",
  success: "bg-emerald-50 text-emerald-700",
} as const;

export function InsightsPanel({
  title = "Intelligent insights",
  description = "Signals generated from live platform data.",
  insights,
}: {
  title?: string;
  description?: string;
  insights: Insight[];
}) {
  return (
    <div className="surface-panel p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>

      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="rounded-[22px] border border-line bg-white/75 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{insight.title}</div>
                <div className="mt-1 text-sm text-ink-soft">{insight.description}</div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  toneClasses[insight.tone ?? "brand"]
                }`}
              >
                {insight.tone ?? "brand"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
