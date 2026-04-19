import Link from "next/link";

import { officialBestsellers } from "@/frontend/content/advancia-official";
import { Reveal } from "@/frontend/components/shared/reveal";
import { translateCategoryName } from "@/frontend/i18n/helpers";
import { getCurrentLocale } from "@/frontend/i18n/server";
import type { Category, Training } from "@/frontend/types";

type LearningPathsSectionProps = {
  categories: Array<Category & { trainingCount: number }>;
  trainings: Training[];
};

export async function LearningPathsSection({
  categories,
  trainings,
}: LearningPathsSectionProps) {
  const locale = await getCurrentLocale();
  const topCategories = categories.slice(0, 6);
  const certificationTracks = officialBestsellers
    .map((item) =>
      trainings.find((training) =>
        `${training.title} ${training.code}`.toLowerCase().includes(item.toLowerCase().split(" ")[0]),
      ),
    )
    .filter((item): item is Training => Boolean(item))
    .slice(0, 4);

  return (
    <section className="section-wrap py-12">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Reveal className="rounded-[30px] border border-line bg-white p-6 shadow-[0_18px_40px_rgba(28,23,25,0.05)] sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
            {locale === "fr" ? "Parcours clés" : locale === "ar" ? "مسارات مميزة" : "Top tracks"}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {locale === "fr"
              ? "Développez des compétences solides."
              : locale === "ar"
                ? "طوّر مهارات لافتة."
                : "Build skills that stand out."}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/trainings?category=${category.slug}`}
                className="rounded-full border border-line bg-brand-50 px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand-200 hover:bg-brand-100"
              >
                {translateCategoryName(category, locale)}
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={0.06}
          className="rounded-[30px] border border-line bg-white p-6 shadow-[0_18px_40px_rgba(28,23,25,0.05)] sm:p-8"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
                {locale === "fr" ? "Prépa certifs" : locale === "ar" ? "تحضير الشهادات" : "Certification prep"}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                {locale === "fr"
                  ? "Best-sellers officiels."
                  : locale === "ar"
                    ? "الأكثر طلباً رسمياً"
                    : "Official best sellers."}
              </h2>
            </div>
            <Link href="/trainings" className="text-sm font-semibold text-brand-600">
              {locale === "fr" ? "Explorer" : locale === "ar" ? "استكشف" : "Explore"}
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {certificationTracks.map((training) => (
              <Link
                key={training.id}
                href={`/trainings/${training.slug}`}
                className="rounded-[24px] border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(28,23,25,0.06)]"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  {training.code}
                </div>
                <div className="mt-3 text-lg font-semibold text-foreground">
                  {training.title}
                </div>
                <div className="mt-3 text-sm text-ink-soft">
                  {training.durationDays} {locale === "fr" ? "jours" : locale === "ar" ? "أيام" : "days"}
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
