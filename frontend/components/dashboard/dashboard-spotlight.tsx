import { ArrowUpRight, Sparkles } from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { cn } from "@/frontend/utils/cn";

type SpotlightStat = {
  label: string;
  value: string;
};

type DashboardSpotlightProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: SpotlightStat[];
  chips: string[];
  tone?: "executive" | "operations" | "learner";
};

const toneClasses = {
  executive: "from-brand-900 via-brand-700 to-brand-500 text-white",
  operations: "from-[#65111f] via-[#8f1830] to-[#f27f6e] text-white",
  learner: "from-[#4f1325] via-brand-600 to-[#f6b17f] text-white",
} as const;

export function DashboardSpotlight({
  eyebrow,
  title,
  description,
  stats,
  chips,
  tone = "executive",
}: DashboardSpotlightProps) {
  return (
    <Reveal className="cinematic-panel p-6 sm:p-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div
          className={cn(
            "relative overflow-hidden rounded-[30px] bg-gradient-to-br p-7",
            toneClasses[tone],
          )}
        >
          <div className="absolute -right-8 top-8 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
          <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/82">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <div className="relative pt-12">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
              {description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/86"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "surface-panel relative overflow-hidden p-5",
                index === 1 && "float-slow",
                index === 2 && "float-reverse",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-xs uppercase tracking-[0.22em] text-ink-soft">
                  {stat.label}
                </div>
                <div className="rounded-full bg-brand-50 p-2 text-brand-600">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-5 text-3xl font-semibold tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
