import type { AppLocale, UserOnboarding } from "@/frontend/types";

type Localized = {
  en: string;
  fr: string;
};

type DomainOption = {
  id: string;
  label: Localized;
  focusTracks: string[];
};

type SkillOption = {
  id: string;
  label: Localized;
  focusTracks: string[];
};

type CertificationOption = {
  id: string;
  title: Localized;
  provider: Localized;
  badge: string;
  accent: string;
  focusTracks: string[];
};

type OnboardingCopy = {
  banner: string;
  progress: string[];
  domainTitle: string;
  domainHint: string;
  managesPeople: string;
  yes: string;
  no: string;
  skillsTitle: string;
  skillsHint: string;
  skillsSearch: string;
  skillsPopular: string;
  certificationsTitle: string;
  certificationsHint: string;
  certificationsSearch: string;
  certificationsPopular: string;
  back: string;
  next: string;
  finish: string;
  saving: string;
  skip: string;
};

const domains: DomainOption[] = [
  {
    id: "ai-copilot",
    label: {
      en: "Artificial intelligence and Copilot",
      fr: "Intelligence artificielle et Copilot",
    },
    focusTracks: ["ai-copilot"],
  },
  {
    id: "cyber-security",
    label: {
      en: "Cybersecurity",
      fr: "Cybersecurite",
    },
    focusTracks: ["cyber-security"],
  },
  {
    id: "data-analytics",
    label: {
      en: "Data and analytics",
      fr: "Donnees et analyses",
    },
    focusTracks: ["microsoft-cloud-data"],
  },
  {
    id: "cloud-infrastructure",
    label: {
      en: "Cloud and infrastructure",
      fr: "Cloud et infrastructure",
    },
    focusTracks: ["cloud-infrastructure"],
  },
  {
    id: "cisco-networking",
    label: {
      en: "Networking",
      fr: "Reseaux",
    },
    focusTracks: ["cisco-networking"],
  },
  {
    id: "enterprise-systems",
    label: {
      en: "SAP and enterprise systems",
      fr: "SAP et systemes d'entreprise",
    },
    focusTracks: ["enterprise-systems"],
  },
  {
    id: "project-governance",
    label: {
      en: "Project and product management",
      fr: "Gestion de projets et de produits",
    },
    focusTracks: ["project-governance"],
  },
  {
    id: "software-engineering",
    label: {
      en: "Software engineering",
      fr: "Developpement logiciel",
    },
    focusTracks: ["software-engineering"],
  },
  {
    id: "business-productivity",
    label: {
      en: "Business productivity",
      fr: "Productivite metier",
    },
    focusTracks: ["business-productivity"],
  },
];

const skills: SkillOption[] = [
  {
    id: "prompting",
    label: { en: "Prompt engineering", fr: "Prompt engineering" },
    focusTracks: ["ai-copilot"],
  },
  {
    id: "copilot-automation",
    label: { en: "Copilot automation", fr: "Automatisation Copilot" },
    focusTracks: ["ai-copilot", "business-productivity"],
  },
  {
    id: "power-bi",
    label: { en: "Power BI", fr: "Power BI" },
    focusTracks: ["microsoft-cloud-data"],
  },
  {
    id: "azure",
    label: { en: "Azure", fr: "Azure" },
    focusTracks: ["cloud-infrastructure", "microsoft-cloud-data"],
  },
  {
    id: "aws",
    label: { en: "AWS", fr: "AWS" },
    focusTracks: ["cloud-infrastructure"],
  },
  {
    id: "cyber-defense",
    label: { en: "Cyber defense", fr: "Cyber defense" },
    focusTracks: ["cyber-security"],
  },
  {
    id: "risk-compliance",
    label: { en: "Risk and compliance", fr: "Risque et conformite" },
    focusTracks: ["cyber-security", "project-governance"],
  },
  {
    id: "cisco",
    label: { en: "Cisco networking", fr: "Reseaux Cisco" },
    focusTracks: ["cisco-networking"],
  },
  {
    id: "project-management",
    label: { en: "Project management", fr: "Gestion de projets" },
    focusTracks: ["project-governance"],
  },
  {
    id: "product-management",
    label: { en: "Product management", fr: "Gestion de produits" },
    focusTracks: ["project-governance", "business-productivity"],
  },
  {
    id: "leadership",
    label: { en: "Leadership", fr: "Leadership" },
    focusTracks: ["project-governance", "business-productivity"],
  },
  {
    id: "sap-finance",
    label: { en: "SAP finance", fr: "SAP finance" },
    focusTracks: ["enterprise-systems"],
  },
  {
    id: "devops",
    label: { en: "DevOps", fr: "DevOps" },
    focusTracks: ["software-engineering", "cloud-infrastructure"],
  },
  {
    id: "software-development",
    label: { en: "Software development", fr: "Developpement logiciel" },
    focusTracks: ["software-engineering"],
  },
  {
    id: "data-analysis",
    label: { en: "Data analysis", fr: "Analyse de donnees" },
    focusTracks: ["microsoft-cloud-data"],
  },
  {
    id: "m365-productivity",
    label: { en: "Microsoft 365 productivity", fr: "Productivite Microsoft 365" },
    focusTracks: ["business-productivity", "ai-copilot"],
  },
];

const certifications: CertificationOption[] = [
  {
    id: "aws-saa",
    title: {
      en: "AWS Certified Solutions Architect - Associate",
      fr: "AWS Certified Solutions Architect - Associate",
    },
    provider: { en: "Amazon Web Services", fr: "Amazon Web Services" },
    badge: "AWS",
    accent: "from-[#1d4ed8] via-[#2563eb] to-[#60a5fa]",
    focusTracks: ["cloud-infrastructure"],
  },
  {
    id: "aws-clf",
    title: {
      en: "AWS Certified Cloud Practitioner",
      fr: "AWS Certified Cloud Practitioner",
    },
    provider: { en: "Amazon Web Services", fr: "Amazon Web Services" },
    badge: "AWS",
    accent: "from-slate-700 via-slate-600 to-slate-400",
    focusTracks: ["cloud-infrastructure"],
  },
  {
    id: "ccna",
    title: { en: "CCNA", fr: "CCNA" },
    provider: { en: "Cisco", fr: "Cisco" },
    badge: "CCNA",
    accent: "from-cyan-700 via-cyan-600 to-sky-400",
    focusTracks: ["cisco-networking"],
  },
  {
    id: "pmp",
    title: {
      en: "Project Management Professional (PMP)",
      fr: "Project Management Professional (PMP)",
    },
    provider: { en: "PMI", fr: "PMI" },
    badge: "PMP",
    accent: "from-violet-700 via-violet-600 to-fuchsia-400",
    focusTracks: ["project-governance"],
  },
  {
    id: "pl-300",
    title: { en: "PL-300 Power BI Data Analyst", fr: "PL-300 Power BI Data Analyst" },
    provider: { en: "Microsoft", fr: "Microsoft" },
    badge: "PL-300",
    accent: "from-amber-600 via-yellow-500 to-orange-300",
    focusTracks: ["microsoft-cloud-data"],
  },
  {
    id: "az-104",
    title: { en: "AZ-104 Azure Administrator", fr: "AZ-104 Azure Administrator" },
    provider: { en: "Microsoft", fr: "Microsoft" },
    badge: "AZ-104",
    accent: "from-blue-700 via-indigo-600 to-sky-400",
    focusTracks: ["cloud-infrastructure"],
  },
  {
    id: "ceh",
    title: { en: "Certified Ethical Hacker (CEH)", fr: "Certified Ethical Hacker (CEH)" },
    provider: { en: "EC-Council", fr: "EC-Council" },
    badge: "CEH",
    accent: "from-rose-700 via-red-600 to-orange-400",
    focusTracks: ["cyber-security"],
  },
  {
    id: "cissp",
    title: { en: "CISSP", fr: "CISSP" },
    provider: { en: "ISC2", fr: "ISC2" },
    badge: "CISSP",
    accent: "from-zinc-800 via-zinc-700 to-zinc-500",
    focusTracks: ["cyber-security"],
  },
];

const copy: Record<"en" | "fr", OnboardingCopy> = {
  en: {
    banner: "Answer a few quick questions to improve your recommendations.",
    progress: ["Domain", "Skills", "Certifications"],
    domainTitle: "Which domain do you want to strengthen?",
    domainHint: "Choose the area that fits your next learning goal best.",
    managesPeople: "Do you currently manage people?",
    yes: "Yes",
    no: "No",
    skillsTitle: "Which skills interest you most?",
    skillsHint: "Pick a few to start. You can change them later.",
    skillsSearch: "Search a skill",
    skillsPopular: "Popular starting points",
    certificationsTitle: "Do you want to prepare for certifications?",
    certificationsHint: "Select the certifications you may want to target.",
    certificationsSearch: "Search a certification",
    certificationsPopular: "Popular certifications",
    back: "Back",
    next: "Next",
    finish: "Finish",
    saving: "Saving...",
    skip: "Skip",
  },
  fr: {
    banner: "Repondez a quelques questions pour ameliorer vos recommandations.",
    progress: ["Domaine", "Competences", "Certifications"],
    domainTitle: "Pour quel domaine souhaitez-vous acquerir de nouvelles competences ?",
    domainHint: "Choisissez le domaine le plus proche de votre prochain objectif.",
    managesPeople: "Managez-vous actuellement des personnes ?",
    yes: "Oui",
    no: "Non",
    skillsTitle: "Quelles sont les competences qui vous interessent ?",
    skillsHint: "Choisissez-en quelques-unes pour commencer. Vous pourrez les modifier plus tard.",
    skillsSearch: "Rechercher une competence",
    skillsPopular: "Populaires aupres de participants comme vous",
    certificationsTitle: "Voulez-vous passer des certifications ?",
    certificationsHint: "Selectionnez les certifications qui vous interessent le plus.",
    certificationsSearch: "Chercher une certification",
    certificationsPopular: "Certifications populaires",
    back: "Retour",
    next: "Suivant",
    finish: "Terminer",
    saving: "Enregistrement...",
    skip: "Passer",
  },
};

function resolveLocale(locale: AppLocale) {
  return locale === "fr" ? "fr" : "en";
}

function translate(locale: AppLocale, label: Localized) {
  return label[resolveLocale(locale)];
}

export const onboardingDomains = domains;
export const onboardingSkills = skills;
export const onboardingCertifications = certifications;

export function getOnboardingCopy(locale: AppLocale) {
  return copy[resolveLocale(locale)];
}

export function getDomainLabel(id: string, locale: AppLocale) {
  const option = domains.find((item) => item.id === id);
  return option ? translate(locale, option.label) : id;
}

export function getSkillLabel(id: string, locale: AppLocale) {
  const option = skills.find((item) => item.id === id);
  return option ? translate(locale, option.label) : id;
}

export function getCertificationLabel(id: string, locale: AppLocale) {
  const option = certifications.find((item) => item.id === id);
  return option ? translate(locale, option.title) : id;
}

export function getCertificationProvider(id: string, locale: AppLocale) {
  const option = certifications.find((item) => item.id === id);
  return option ? translate(locale, option.provider) : "";
}

export function deriveFocusTracksFromOnboarding(input: UserOnboarding) {
  const mapped = new Set<string>();

  const domain = domains.find((item) => item.id === input.domain);
  domain?.focusTracks.forEach((track) => mapped.add(track));

  skills
    .filter((item) => input.skills.includes(item.id))
    .forEach((item) => item.focusTracks.forEach((track) => mapped.add(track)));

  certifications
    .filter((item) => input.certifications.includes(item.id))
    .forEach((item) => item.focusTracks.forEach((track) => mapped.add(track)));

  if (input.managesPeople) {
    mapped.add("project-governance");
    mapped.add("business-productivity");
  }

  if (!mapped.size) {
    mapped.add("business-productivity");
  }

  return Array.from(mapped);
}
