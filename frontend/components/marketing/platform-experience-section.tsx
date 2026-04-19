import Link from "next/link";
import { Bot, Code2, LayoutPanelTop, PlaySquare } from "lucide-react";

import { Reveal } from "@/frontend/components/shared/reveal";
import { Button } from "@/frontend/components/ui/button";
import { getCurrentLocale } from "@/frontend/i18n/server";

export async function PlatformExperienceSection() {
  const locale = await getCurrentLocale();
  const platformCards = [
    {
      title: locale === "fr" ? "Pas à pas" : locale === "ar" ? "خطوة بخطوة" : "Step by step",
      text: locale === "fr" ? "Parcours clair." : locale === "ar" ? "مسار واضح." : "Clear flow.",
      icon: LayoutPanelTop,
    },
    {
      title: locale === "fr" ? "Pratique live" : locale === "ar" ? "تطبيق مباشر" : "Live practice",
      text: locale === "fr" ? "Vraies sessions." : locale === "ar" ? "جلسات حقيقية." : "Real sessions.",
      icon: PlaySquare,
    },
    {
      title: locale === "fr" ? "Aide assistant" : locale === "ar" ? "مساعدة الروبوت" : "Assistant help",
      text: locale === "fr" ? "Demandez au bot." : locale === "ar" ? "اسأل البوت." : "Ask the bot.",
      icon: Bot,
    },
    {
      title: locale === "fr" ? "Outils d'apprentissage" : locale === "ar" ? "أدوات التعلم" : "Learning tools",
      text: locale === "fr" ? "Suivez la progression." : locale === "ar" ? "تابع التقدم." : "Track progress.",
      icon: Code2,
    },
  ];

  return (
    <section className="section-wrap py-12">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Reveal className="rounded-[34px] border border-line bg-[#16101a] p-7 text-white shadow-[0_26px_70px_rgba(21,10,15,0.26)] sm:p-9">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/58">
            {locale === "fr" ? "Apprendre en faisant" : locale === "ar" ? "تعلم بالتطبيق" : "Learn by doing"}
          </div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            {locale === "fr"
              ? "Une plateforme plus futée."
              : locale === "ar"
                ? "منصة تدريب أذكى."
                : "A smarter training platform."}
          </h2>
          <p className="mt-4 max-w-xl text-sm text-white/68">
            {locale === "fr"
              ? "Apprentissage guidé, sessions claires, inscription rapide, aide assistant."
              : locale === "ar"
                ? "تعلم موجه، جلسات واضحة، تسجيل سريع، دعم المساعد."
                : "Guided learning, clear sessions, fast enrollment, assistant support."}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {platformCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-lg font-semibold">{item.title}</div>
                  <div className="mt-1 text-sm text-white/62">{item.text}</div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal
          delay={0.06}
          className="rounded-[34px] border border-line bg-[linear-gradient(180deg,#fffdfc_0%,#fff4ef_100%)] p-7 shadow-[0_22px_55px_rgba(28,23,25,0.06)] sm:p-9"
        >
          <div className="rounded-[28px] border border-brand-100 bg-white p-5 shadow-[0_18px_40px_rgba(223,54,72,0.08)]">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                    {locale === "fr" ? "Assistant Advancia" : locale === "ar" ? "مساعد أدفانسيا" : "Advancia assistant"}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-foreground">
                    {locale === "fr"
                      ? "Choisissez votre prochaine formation."
                      : locale === "ar"
                        ? "اختر دورتك التالية."
                        : "Pick your next training."}
                  </div>
                </div>
                <div className="h-14 w-14 rounded-full bg-[linear-gradient(135deg,#df3648_0%,#ff7a45_100%)]" />
              </div>

            <div className="space-y-3 py-4">
              <div className="w-fit rounded-2xl bg-brand-50 px-4 py-3 text-sm text-foreground">
                {locale === "fr" ? "Que dois-je apprendre ?" : locale === "ar" ? "ماذا أتعلم؟" : "What should I learn next?"}
              </div>
              <div className="ml-auto w-fit rounded-2xl bg-[#1a1220] px-4 py-3 text-sm text-white">
                {locale === "fr" ? "Essaie IA, cloud, certifs." : locale === "ar" ? "جرّب الذكاء، السحابة، الشهادات." : "Try AI, cloud, or cert prep."}
              </div>
              <div className="w-fit rounded-2xl bg-brand-50 px-4 py-3 text-sm text-foreground">
                {locale === "fr" ? "Je veux une certification." : locale === "ar" ? "أريد مسار شهادة." : "I want a certification path."}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <Link href="/register">
                <Button>{locale === "fr" ? "Commencer" : locale === "ar" ? "ابدأ" : "Start free"}</Button>
              </Link>
              <Link href="/trainings">
                <Button variant="secondary">
                  {locale === "fr" ? "Voir les formations" : locale === "ar" ? "تصفح الدورات" : "Browse trainings"}
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
