import Link from "next/link";
import { CalendarDays, MapPin, PlayCircle, Search, Sparkles } from "lucide-react";

import { officialBrandStats, getOfficialHeroCopy } from "@/frontend/content/advancia-official";
import { HeroScene3DLazy } from "@/frontend/components/three/hero-scene-3d-lazy";
import { AnimatedCounter } from "@/frontend/components/shared/animated-counter";
import { Reveal } from "@/frontend/components/shared/reveal";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { translateCategoryName } from "@/frontend/i18n/helpers";
import { getMessages } from "@/frontend/i18n/messages";
import { getCurrentLocale } from "@/frontend/i18n/server";
import type { Category } from "@/frontend/types";

type HeroSectionProps = {
  categories: Array<Category & { trainingCount: number }>;
};

const heroCopy = {
  en: {
    eyebrow: "Advancia Trainings",
    title: "Train. Certify. Advance.",
    body: "Live sessions. Expert trainers. Premium learning.",
    search: "Search a training",
    find: "Find training",
    calendar: "View calendar",
    stats: ["Programs", "Tracks", "Formats"],
    cards: {
      oneTitle: "Live calendar",
      oneText: "Dates in view",
      twoTitle: "Hybrid flow",
      twoText: "Online or onsite",
      threeTitle: "Advancia",
      threeText: "Tunis and remote",
    },
  },
  fr: {
    eyebrow: "Advancia Trainings",
    title: "Formez-vous. Certifiez-vous. Avancez.",
    body: "Sessions live. Experts. Experience premium.",
    search: "Rechercher une formation",
    find: "Trouver",
    calendar: "Calendrier",
    stats: ["Formations", "Domaines", "Formats"],
    cards: {
      oneTitle: "Calendrier live",
      oneText: "Dates visibles",
      twoTitle: "Mode hybride",
      twoText: "En ligne ou sur site",
      threeTitle: "Advancia",
      threeText: "Tunis et remote",
    },
  },
  ar: {
    eyebrow: "Advancia Trainings",
    title: "Train. Certify. Advance.",
    body: "Live sessions. Expert trainers. Premium learning.",
    search: "Search a training",
    find: "Find training",
    calendar: "View calendar",
    stats: ["Programs", "Tracks", "Formats"],
    cards: {
      oneTitle: "Live calendar",
      oneText: "Dates in view",
      twoTitle: "Hybrid flow",
      twoText: "Online or onsite",
      threeTitle: "Advancia",
      threeText: "Tunis and remote",
    },
  },
} as const;

export async function HeroSection({
  categories,
}: HeroSectionProps) {
  const locale = await getCurrentLocale();
  const copy = getMessages(locale);
  const hero = heroCopy[locale] ?? heroCopy.en;
  const officialHero = getOfficialHeroCopy(locale);
  const topCategories = categories.slice(0, 4);

  return (
    <section className="section-wrap py-8 sm:py-10">
      <div className="hero-media-shell relative overflow-hidden rounded-[40px] border border-white/12 bg-[#12090d] text-white shadow-[0_34px_100px_rgba(34,12,16,0.36)]">
        <div className="marketing-video-shell absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="hero-media-video absolute inset-0 h-full w-full object-cover opacity-55"
          >
            <source
              src="https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,9,13,0.94)_0%,rgba(18,9,13,0.78)_36%,rgba(18,9,13,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,166,140,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(223,54,72,0.22),transparent_32%)]" />
        </div>

        <div className="relative p-6 sm:p-8 lg:min-h-[640px] lg:p-10 xl:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10">
            <Reveal className="flex flex-col justify-center lg:pr-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {officialHero.badge}
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl xl:text-7xl">
                {hero.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base text-white/76 sm:text-lg">
                {officialHero.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/trainings/calendar"
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/16"
                >
                  <CalendarDays className="h-4 w-4" />
                  {hero.calendar}
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm text-white/78 backdrop-blur">
                  <PlayCircle className="h-4 w-4" />
                  Video background
                </div>
              </div>
            </Reveal>

            <Reveal
              delay={0.08}
              className="relative hidden items-center justify-center lg:flex"
            >
              <div className="relative h-[500px] w-full max-w-[500px]">
                <div className="pointer-events-none absolute left-0 top-8 z-20 w-56 rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-md float-slow">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {hero.cards.oneTitle}
                  </div>
                  <div className="mt-3 text-xl font-semibold text-white">
                    {hero.cards.oneText}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/72">
                    <CalendarDays className="h-4 w-4" />
                    Jan to Jun
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-10 right-3 z-20 w-56 rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-md float-reverse">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/58">
                    {hero.cards.twoTitle}
                  </div>
                  <div className="mt-3 text-xl font-semibold text-white">
                    {hero.cards.twoText}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/72">
                    <MapPin className="h-4 w-4" />
                    {hero.cards.threeText}
                  </div>
                </div>

                <div className="absolute inset-6 rounded-[38px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] backdrop-blur-[2px]">
                  <HeroScene3DLazy />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="relative z-30 mx-auto mt-8 w-full max-w-[1020px]">
            <form
              action="/trainings"
              className="grid gap-3 rounded-[34px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] p-3 shadow-[0_26px_60px_rgba(16,10,11,0.3)] backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_240px_190px]"
            >
              <div className="flex items-center gap-3 rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#fff7f4_100%)] px-5 text-foreground shadow-[0_18px_40px_rgba(14,8,9,0.2)]">
                <Search className="h-4 w-4 text-brand-500" />
                <Input
                  name="q"
                  placeholder={hero.search}
                  className="h-auto border-0 bg-transparent px-0 py-5 text-base shadow-none ring-0 focus:ring-0"
                />
              </div>

              <select
                name="category"
                defaultValue="all"
                className="h-16 rounded-[24px] border border-white/20 bg-[linear-gradient(180deg,#fff9f7_0%,#fff2ec_100%)] px-5 text-sm font-medium text-foreground outline-none focus:border-brand-300"
              >
                <option value="all">{copy.catalogue.allCategories}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {translateCategoryName(category, locale)}
                  </option>
                ))}
              </select>

              <Button
                type="submit"
                className="h-16 rounded-[24px] border-0 bg-[linear-gradient(135deg,#df3648_0%,#ff7a45_100%)] shadow-[0_18px_40px_rgba(223,54,72,0.34)]"
              >
                {hero.find}
              </Button>
            </form>
          </Reveal>

          <div className="mt-8 grid gap-4 xl:grid-cols-[0.78fr_1.22fr] xl:items-center">
            <Reveal className="grid gap-3 sm:grid-cols-3">
              {[
                officialBrandStats[0],
                officialBrandStats[1],
                officialBrandStats[3],
              ].map((stat) => (
                <div
                  key={stat.value + stat.labelEn}
                  className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-md"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {locale === "fr" ? stat.labelFr : stat.labelEn}
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-white">
                    {stat.value.includes("+") ? (
                      stat.value
                    ) : (
                      <AnimatedCounter value={Number(stat.value)} />
                    )}
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal className="flex flex-wrap gap-3 xl:justify-end">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/trainings?category=${category.slug}`}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur hover:bg-white/14"
                >
                  {translateCategoryName(category, locale)}
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
