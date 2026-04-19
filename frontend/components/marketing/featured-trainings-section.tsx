import Link from "next/link";

import { TrainingCard } from "@/frontend/components/catalogue/training-card";
import { Reveal } from "@/frontend/components/shared/reveal";
import { getCurrentLocale } from "@/frontend/i18n/server";
import type { Training } from "@/frontend/types";

type FeaturedTrainingsSectionProps = {
  trainings: Training[];
};

export async function FeaturedTrainingsSection({
  trainings,
}: FeaturedTrainingsSectionProps) {
  const locale = await getCurrentLocale();
  const title = locale === "fr" ? "Featured" : locale === "ar" ? "Featured" : "Featured";

  return (
    <section id="catalogue" className="section-wrap py-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight">{title}</h2>
          </div>
          <Link href="/trainings" className="text-lg font-medium text-brand-500 hover:text-brand-700">
            View all
          </Link>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {trainings.slice(0, 4).map((training) => (
          <TrainingCard key={training.id} training={training} locale={locale} />
        ))}
      </div>
    </section>
  );
}
