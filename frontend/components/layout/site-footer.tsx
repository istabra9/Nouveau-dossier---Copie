import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

import { getOfficialFooterCopy, officialOffices } from "@/frontend/content/advancia-official";
import { BrandMark } from "@/frontend/components/shared/brand-mark";
import { getCurrentLocale } from "@/frontend/i18n/server";

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/advancia-training-center/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://www.facebook.com/AdvanciaTrainingCenter",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://www.instagram.com/advancia_training_center/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.youtube.com/@advanciatrainingcenter",
    label: "YouTube",
    icon: Youtube,
  },
];

export async function SiteFooter() {
  const locale = await getCurrentLocale();
  const copy = getOfficialFooterCopy(locale);
  const mainOffice = officialOffices[0];

  const footerNav = {
    en: {
      platform: "Platform",
      trainings: "Trainings",
      calendar: "Calendar",
      contact: "Contact",
      official: "Official",
      followUs: "Follow us",
      rights: "All rights reserved.",
    },
    fr: {
      platform: "Plateforme",
      trainings: "Formations",
      calendar: "Calendrier",
      contact: "Contact",
      official: "Officiel",
      followUs: "Suivez-nous",
      rights: "Tous droits r\u00e9serv\u00e9s.",
    },
    ar: {
      platform: "\u0627\u0644\u0645\u0646\u0635\u0651\u0629",
      trainings: "\u0627\u0644\u062f\u0648\u0631\u0627\u062a",
      calendar: "\u0627\u0644\u062a\u0642\u0648\u064a\u0645",
      contact: "\u0627\u062a\u0651\u0635\u0644 \u0628\u0646\u0627",
      official: "\u0631\u0633\u0645\u064a",
      followUs: "\u062a\u0627\u0628\u0639\u0648\u0646\u0627",
      rights: "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.",
    },
  } as const;

  const t = footerNav[locale] ?? footerNav.en;

  return (
    <footer className="mt-20 bg-[#131a2a] text-white">
      <div className="section-wrap py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="inline-flex rounded-lg bg-white px-3 py-2">
              <BrandMark compact />
            </div>
            <p className="mt-6 max-w-sm text-base leading-8 text-white/70">{copy.description}</p>
            <div className="mt-5 space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-300" />
                {mainOffice.country}
              </div>
              <a
                href={`mailto:${mainOffice.email}`}
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4 text-brand-300" />
                {mainOffice.email}
              </a>
              <a
                href={`tel:${mainOffice.phones[0].replace(/\s+/g, "")}`}
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4 text-brand-300" />
                {mainOffice.phones[0]}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xl font-semibold">{t.platform}</div>
            <div className="space-y-3 text-base text-white/70">
              <Link href="/trainings" className="block hover:text-white">
                {t.trainings}
              </Link>
              <Link href="/trainings/calendar" className="block hover:text-white">
                {t.calendar}
              </Link>
              <a
                href="https://www.advancia-training.com/contacts/"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-white"
              >
                {t.contact}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xl font-semibold">{t.official}</div>
            <div className="space-y-3 text-base text-white/70">
              <a
                href="https://www.advancia-training.com/"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-white"
              >
                {copy.officialSite}
              </a>
              <a
                href="https://www.advancia-training.com/contacts/"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-white"
              >
                {copy.officeDirectory}
              </a>
            </div>

            <div className="pt-2">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
                {t.followUs}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-500 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-sm text-white/50">
          <div>
            {locale === "fr" ? "Fran\u00e7ais" : locale === "ar" ? "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" : "English"}
          </div>
          <div>
            (c) {new Date().getFullYear()} Advancia. {t.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
