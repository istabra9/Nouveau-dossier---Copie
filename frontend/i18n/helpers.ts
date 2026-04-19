import type { AppLocale, Category, TrainingFormat, TrainingLevel } from "@/frontend/types";

import { getMessages } from "@/frontend/i18n/messages";

const categoryLabels: Record<string, Record<AppLocale, string>> = {
  "ai-copilot": {
    en: "AI & Copilot",
    fr: "IA & Copilot",
    ar: "الذكاء الاصطناعي وCopilot",
  },
  "cyber-security": {
    en: "Cyber Security",
    fr: "Cybersecurite",
    ar: "الأمن السيبراني",
  },
  "enterprise-systems": {
    en: "Enterprise Systems",
    fr: "Systemes d'entreprise",
    ar: "أنظمة المؤسسات",
  },
  "project-governance": {
    en: "Project, ITSM & Governance",
    fr: "Projet, ITSM et gouvernance",
    ar: "إدارة المشاريع وITSM والحوكمة",
  },
  "cisco-networking": {
    en: "Cisco & Networking",
    fr: "Cisco & reseaux",
    ar: "Cisco والشبكات",
  },
  "microsoft-cloud-data": {
    en: "Microsoft Cloud & Data",
    fr: "Cloud & data Microsoft",
    ar: "سحابة Microsoft والبيانات",
  },
  "business-productivity": {
    en: "Business Productivity & Leadership",
    fr: "Productivite & leadership",
    ar: "الإنتاجية والقيادة",
  },
  "cloud-infrastructure": {
    en: "Cloud, Infrastructure & Virtualization",
    fr: "Cloud, infrastructure et virtualisation",
    ar: "السحابة والبنية التحتية والافتراضية",
  },
  "software-engineering": {
    en: "Software Engineering & DevOps",
    fr: "Ingenierie logicielle & DevOps",
    ar: "هندسة البرمجيات وDevOps",
  },
};

export function translateTrainingLevel(level: TrainingLevel, locale: AppLocale) {
  return getMessages(locale).labels.levels[level];
}

export function translateTrainingFormat(format: TrainingFormat, locale: AppLocale) {
  return getMessages(locale).labels.formats[format];
}

export function translateCategoryName(
  category: Pick<Category, "slug" | "name">,
  locale: AppLocale,
) {
  return categoryLabels[category.slug]?.[locale] ?? category.name;
}
