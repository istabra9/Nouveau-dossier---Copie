import { ArrowUpRight, Sparkles } from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { cn } from "@/frontend/utils/cn";

type SpotlightStat = {
  label: string;
  value: string;
  emoji?: string;
};

type SpotlightProfile = {
  name: string;
  avatar?: string;
  emoji?: string;
};

type DashboardSpotlightProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: SpotlightStat[];
  chips: string[];
  tone?: "executive" | "operations" | "learner";
  profile?: SpotlightProfile;
  titleEmoji?: string;
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
  profile,
  titleEmoji,
}: DashboardSpotlightProps) {
  return (
    <Reveal className="cinematic-panel p-4 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div
          className={cn(
            "relative overflow-hidden rounded-[24px] bg-gradient-to-br p-5",
            toneClasses[tone],
          )}
        >
          <div className="absolute -right-8 top-4 h-24 w-24 rounded-full bg-white/12 blur-2xl" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/82">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            {profile ? (
              <div className="flex items-center gap-2 rounded-full bg-white/14 px-2 py-1 pr-3 text-xs font-medium text-white/90">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/18 text-sm font-semibold">
                  {profile.avatar ?? profile.name[0]?.toUpperCase() ?? "?"}
                </span>
                <span className="flex items-center gap-1">
                  <span aria-hidden>{profile.emoji ?? "👋"}</span>
                  <span className="hidden sm:inline">Hi,</span>
                  <span className="font-semibold">{profile.name.split(" ")[0]}</span>
                </span>
              </div>
            ) : null}
          </div>
          <div className="relative mt-4">
            <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {titleEmoji ? (
                <span className="mr-2" aria-hidden>
                  {titleEmoji}
                </span>
              ) : null}
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/82">
              {description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/86"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "surface-panel relative overflow-hidden p-4",
                index === 1 && "float-slow",
                index === 2 && "float-reverse",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  {stat.emoji ? <span aria-hidden>{stat.emoji}</span> : null}
                  {stat.label}
                </div>
                <div className="rounded-full bg-brand-50 p-1.5 text-brand-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
