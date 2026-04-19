import { Award, BriefcaseBusiness, Sparkles, Users } from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { getCurrentLocale } from "@/frontend/i18n/server";

export async function ProgressSection() {
  const locale = await getCurrentLocale();

  const localItems = [
    {
      title: locale === "fr" ? "Parcours guidés" : locale === "ar" ? "مسارات موجهة" : "Guided paths",
      text: locale === "fr" ? "Étapes claires." : locale === "ar" ? "خطوات واضحة." : "Clear next steps.",
      icon: Sparkles,
    },
    {
      title: locale === "fr" ? "Sessions pratiques" : locale === "ar" ? "جلسات تطبيقية" : "Hands-on sessions",
      text: locale === "fr" ? "Pratique directe." : locale === "ar" ? "تعلم بالممارسة." : "Learn by practice.",
      icon: BriefcaseBusiness,
    },
    {
      title: locale === "fr" ? "Prépa certif" : locale === "ar" ? "تحضير الشهادات" : "Cert prep",
      text: locale === "fr" ? "Visez l'examen." : locale === "ar" ? "جاهز للاختبار." : "Train for exams.",
      icon: Award,
    },
    {
      title: locale === "fr" ? "Suivi équipe" : locale === "ar" ? "متابعة الفرق" : "Team delivery",
      text: locale === "fr" ? "Suivez l'avancement." : locale === "ar" ? "تابع التقدم." : "Track group progress.",
      icon: Users,
    },
  ];

  return (
    <section className="section-wrap py-12">
      <Reveal>
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
            {locale === "fr" ? "Pensé pour progresser" : locale === "ar" ? "مصمم للتقدم" : "Designed for progress"}
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
            {locale === "fr" ? "On avance." : locale === "ar" ? "استمر." : "Keep moving."}
          </h2>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {localItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal
              key={item.title}
              delay={0.04 * index}
              className="rounded-[28px] border border-line bg-white p-6 shadow-[0_16px_36px_rgba(28,23,25,0.05)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-brand-50 text-brand-600">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-5 text-2xl font-semibold text-foreground">{item.title}</div>
              <div className="mt-2 text-sm text-ink-soft">{item.text}</div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
