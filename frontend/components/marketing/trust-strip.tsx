import { officialBrandStats, officialPublishers } from "@/frontend/content/advancia-official";
import { Reveal } from "@/frontend/components/shared/reveal";
import { getCurrentLocale } from "@/frontend/i18n/server";

export async function TrustStrip() {
  const locale = await getCurrentLocale();

  return (
    <section className="section-wrap py-6 sm:py-8">
      <Reveal className="space-y-5 rounded-[28px] border border-line bg-white/84 p-5 shadow-[0_18px_40px_rgba(28,23,25,0.05)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-ink-soft">
            {locale === "fr"
              ? "Chiffres officiels"
              : locale === "ar"
                ? "أرقام رسمية"
                : "Official figures"}
          </div>
          <div className="flex flex-wrap gap-3">
            {officialBrandStats.slice(0, 4).map((stat) => (
              <div
                key={stat.value + stat.labelEn}
                className="rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-semibold text-foreground"
              >
                {stat.value} {locale === "fr" ? stat.labelFr : locale === "ar" ? stat.labelFr : stat.labelEn}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-ink-soft">
            {locale === "fr"
              ? "Écosystème officiel"
              : locale === "ar"
                ? "منظومة رسمية"
                : "Official ecosystem"}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-foreground/72">
            {officialPublishers.slice(0, 10).map((publisher) => (
              <span key={publisher}>{publisher}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
