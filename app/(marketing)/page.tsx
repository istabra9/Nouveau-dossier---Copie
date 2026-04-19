import Link from "next/link";

import { AdvanciaInfoSection } from "@/frontend/components/marketing/advancia-info-section";
import { CategoriesShowcase } from "@/frontend/components/marketing/categories-showcase";
import { CtaBanner } from "@/frontend/components/marketing/cta-banner";
import { FeaturedTrainingsSection } from "@/frontend/components/marketing/featured-trainings-section";
import { HeroSection } from "@/frontend/components/marketing/hero-section";
import { LearningPathsSection } from "@/frontend/components/marketing/learning-paths-section";
import { MemoryGameSection } from "@/frontend/components/marketing/memory-game-section";
import { PlatformExperienceSection } from "@/frontend/components/marketing/platform-experience-section";
import { ProgressSection } from "@/frontend/components/marketing/progress-section";
import { TrustStrip } from "@/frontend/components/marketing/trust-strip";
import { TrainingCalendar } from "@/frontend/components/catalogue/training-calendar";
import { getLandingPageData } from "@/backend/services/platform";
import { getCurrentLocale } from "@/frontend/i18n/server";

export default async function HomePage() {
  const landing = await getLandingPageData();
  const locale = await getCurrentLocale();

  return (
    <>
      <HeroSection
        categories={landing.categories}
      />
      <MemoryGameSection />
      <TrustStrip />
      <LearningPathsSection
        categories={landing.categories}
        trainings={landing.featuredTrainings}
      />
      <FeaturedTrainingsSection trainings={landing.featuredTrainings} />
      <CategoriesShowcase categories={landing.categories} />
      <ProgressSection />
      <PlatformExperienceSection />
      <section className="section-wrap py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-semibold tracking-tight">Calendar</h2>
          <Link
            href="/trainings/calendar"
            className="text-lg font-medium text-brand-500 hover:text-brand-700"
          >
            View all
          </Link>
        </div>
        <TrainingCalendar
          schedules={landing.upcomingSchedules}
          categories={landing.categories}
          locale={locale}
          compact
        />
      </section>
      <AdvanciaInfoSection />
      <CtaBanner />
    </>
  );
}
