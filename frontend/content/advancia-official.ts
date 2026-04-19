import type { AppLocale } from "@/frontend/types";

type OfficialHeroCopy = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  chips: string[];
  trustedSignal: string;
  trustedValue: string;
  trustedBody: string;
  brandPresence: string;
  brandPresenceBody: string;
  officeLabel: string;
  publisherLabel: string;
};

type OfficialWhyCopy = {
  eyebrow: string;
  title: string;
  description: string;
  pillars: Array<{ title: string; description: string }>;
};

type OfficialReachCopy = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{ value: string; label: string; description: string }>;
  publishersLabel: string;
  certificationLabel: string;
  modalitiesLabel: string;
  modalities: string[];
};

type OfficialFooterCopy = {
  description: string;
  officialSite: string;
  officeDirectory: string;
};

export const officialBrandStats = [
  {
    value: "500+",
    labelEn: "Seminars and courses",
    labelFr: "Seminaires et formations",
  },
  {
    value: "3000+",
    labelEn: "Specialists trained yearly",
    labelFr: "Specialistes formes par an",
  },
  {
    value: "100000",
    labelEn: "Learners since launch",
    labelFr: "Stagiaires depuis la creation",
  },
  {
    value: "350",
    labelEn: "Official trainings",
    labelFr: "Formations officielles",
  },
  {
    value: "25",
    labelEn: "Soft skills programs",
    labelFr: "Formations soft skills",
  },
  {
    value: "5",
    labelEn: "Certification operators",
    labelFr: "Operateurs de certification",
  },
] as const;

export const officialBestsellers = [
  "CCNA 200-301",
  "FCP - FortiGate Administrator",
  "PMP Preparation",
  "Agile Scrum Master & Product Owner",
  "ITIL 4 Foundation",
  "Azure Administrator",
  "ISO 27001 Lead Implementer",
  "VMware vSphere ICM",
] as const;

export const officialPublishers = [
  "AWS",
  "Cisco",
  "CompTIA",
  "EC-Council",
  "EXIN",
  "F5",
  "Google Cloud",
  "Huawei",
  "ISC2",
  "ISACA",
  "ITIL",
  "Microsoft",
  "Fortinet",
  "VMware",
  "IBM",
  "ISTQB",
  "Kaspersky",
  "Kubernetes",
  "Linux Professional Institute",
  "Oracle",
  "Nutanix",
  "Palo Alto Networks",
  "PECB",
  "PeopleCert",
  "PMI",
  "PRINCE2",
  "Red Hat",
  "SAP",
  "Scrum.org",
  "Scrum Alliance",
  "ServiceNow",
  "TOGAF",
  "Veeam",
  "CertNexus",
] as const;

export const officialCertificationNetworks = [
  "Pearson VUE",
  "Prometric",
  "Certiport",
  "Castle",
  "PSI",
] as const;

export const officialOffices = [
  {
    country: "Tunisia",
    phones: ["(+216) 70 014 078", "(+216) 70 014 088"],
    email: "service-clients@advancia-training.com",
    address: "Immeuble GlobalNet, 53 Rue des Mineraux, Charguia 1, Tunis",
  },
  {
    country: "France",
    phones: ["(+33) 4 24191444"],
    email: "info.france@advancia-training.com",
    address: "190 rue Topaze, Eguilles, Aix-en-Provence 13510, France",
  },
  {
    country: "Morocco",
    phones: ["(+212) 0522 78 98 26", "(+212) 0622 97 92 83"],
    email: "info.maroc@advancia-training.com",
    address: "Bureau 402, Zenith Millenium Immeuble 1, Sidi Maarouf, Casablanca",
  },
  {
    country: "Cote d'Ivoire",
    phones: ["(+225) 20 30 92 41"],
    email: "info.ci@advancia-training.com",
    address: "Avenue Dr. Crozet, Immeuble XL, 7eme etage, Plateau, Abidjan",
  },
] as const;

const officialHeroCopy: Record<"en" | "fr", OfficialHeroCopy> = {
  en: {
    badge: "Official Advancia Training identity",
    title: "Official training paths and certifications",
    highlight: "backed by 30+ years of expertise.",
    description:
      "Advancia Training presents itself as a leader in certifying IT training in Tunisia for more than 30 years, specialized in advanced official courses on the latest technologies across Tunisia, Morocco, France, and Cote d'Ivoire.",
    chips: ["30+ years", "ISO 9001:2015", "MFPE approved"],
    trustedSignal: "Official accreditations",
    trustedValue: "ISO 9001:2015",
    trustedBody:
      "Microsoft Gold, Cisco CPLS, PeopleCert ATO, and a quality-led training process shaped for serious corporate delivery.",
    brandPresence: "Regional presence",
    brandPresenceBody:
      "Four offices and instructor-led delivery in person, remotely, or in intra-company format.",
    officeLabel: "Regional offices",
    publisherLabel: "Official publishers",
  },
  fr: {
    badge: "Identite officielle Advancia Training",
    title: "Des parcours officiels de formation et de certification",
    highlight: "portes par plus de 30 ans d'expertise.",
    description:
      "Advancia Training se presente comme un leader de la formation IT certifiante en Tunisie depuis plus de 30 ans, specialise dans les cursus officiels avances sur les technologies de derniere generation en Tunisie, au Maroc, en France et en Cote d'Ivoire.",
    chips: ["30+ ans", "ISO 9001:2015", "Agrement MFPE"],
    trustedSignal: "Accreditations officielles",
    trustedValue: "ISO 9001:2015",
    trustedBody:
      "Microsoft Gold, Cisco CPLS, PeopleCert ATO, avec un processus qualite pense pour des projets de formation exigeants.",
    brandPresence: "Presence regionale",
    brandPresenceBody:
      "Quatre implantations et des parcours animes par formateur en presentiel, a distance ou en intra-entreprise.",
    officeLabel: "Implantations",
    publisherLabel: "Editeurs officiels",
  },
};

const officialWhyCopy: Record<"en" | "fr", OfficialWhyCopy> = {
  en: {
    eyebrow: "Why Advancia",
    title: "Built around the real strengths Advancia highlights on its official site.",
    description:
      "The platform now reflects the official brand story more faithfully: advanced official learning tracks, formal accreditations, certification capability, and a regional delivery footprint.",
    pillars: [
      {
        title: "Complete IT and telecom catalogue",
        description:
          "Advancia says it offers one of the most complete training portfolios on the market across IT, telecom, cloud, cyber security, project delivery, SAP, infrastructure, and business productivity.",
      },
      {
        title: "Accreditations and quality assurance",
        description:
          "The official site highlights Microsoft Gold, Cisco CPLS, PeopleCert ATO, ISO 9001:2015, and MFPE approval as major trust signals for enterprise clients.",
      },
      {
        title: "Real certification-center capability",
        description:
          "Advancia positions itself as a certification center across Pearson VUE, Prometric, Certiport, Castle, and PSI to support both learning and exam readiness.",
      },
      {
        title: "Certified trainers and flexible delivery",
        description:
          "Official messaging emphasizes qualified instructors, in-person classes, instructor-led remote learning, and intra-company delivery adapted to client needs.",
      },
    ],
  },
  fr: {
    eyebrow: "Pourquoi Advancia",
    title: "Une plateforme alignee sur les vrais points forts presentes sur le site officiel.",
    description:
      "La plateforme reflete maintenant plus fidelement l'identite officielle d'Advancia: cursus avances officiels, accreditations, capacite de certification et presence regionale.",
    pillars: [
      {
        title: "Un catalogue IT et telecom complet",
        description:
          "Advancia indique proposer une offre de formation tres large sur l'informatique, les telecoms, le cloud, la cybersecurite, la gestion de projets, SAP, l'infrastructure et la productivite metier.",
      },
      {
        title: "Accreditations et gages de qualite",
        description:
          "Le site officiel met en avant Microsoft Gold, Cisco CPLS, PeopleCert ATO, ISO 9001:2015 et l'agrement MFPE comme signaux de confiance forts pour les entreprises.",
      },
      {
        title: "Une vraie capacite de centre de certification",
        description:
          "Advancia se positionne comme centre de certification avec Pearson VUE, Prometric, Certiport, Castle et PSI pour accompagner la formation jusqu'a l'examen.",
      },
      {
        title: "Formateurs certifies et modalites flexibles",
        description:
          "Le discours officiel insiste sur des formateurs qualifies, des classes en presentiel, a distance animees par instructeur, et des sessions intra-entreprise adaptees aux clients.",
      },
    ],
  },
};

const officialReachCopy: Record<"en" | "fr", OfficialReachCopy> = {
  en: {
    eyebrow: "Official footprint",
    title: "A broader Advancia picture than a simple course grid.",
    description:
      "These signals are derived from the official Advancia Training website and help the platform feel closer to the real brand, network, and delivery model.",
    stats: [
      {
        value: "30+",
        label: "Years in certified IT training",
        description: "Official positioning for the Tunisian market.",
      },
      {
        value: "50",
        label: "Official publishers",
        description: "Official site count for partner publishers and vendors.",
      },
      {
        value: "5",
        label: "Certification networks",
        description: "Pearson VUE, Prometric, Certiport, Castle, and PSI.",
      },
      {
        value: "4",
        label: "Regional offices",
        description: "Tunisia, Morocco, France, and Cote d'Ivoire.",
      },
    ],
    publishersLabel: "Publisher ecosystem",
    certificationLabel: "Certification ecosystem",
    modalitiesLabel: "Delivery modes",
    modalities: [
      "In-person classes",
      "Instructor-led remote classes",
      "Intra-company sessions",
    ],
  },
  fr: {
    eyebrow: "Empreinte officielle",
    title: "Une image Advancia plus large qu'un simple catalogue de cours.",
    description:
      "Ces signaux proviennent du site officiel Advancia Training et rapprochent la plateforme de la vraie marque, de son reseau et de son mode de delivery.",
    stats: [
      {
        value: "30+",
        label: "Ans de formation IT certifiante",
        description: "Positionnement officiel sur le marche tunisien.",
      },
      {
        value: "50",
        label: "Editeurs officiels",
        description: "Chiffre officiel du site pour les editeurs et partenaires.",
      },
      {
        value: "5",
        label: "Reseaux de certification",
        description: "Pearson VUE, Prometric, Certiport, Castle et PSI.",
      },
      {
        value: "4",
        label: "Implantations regionales",
        description: "Tunisie, Maroc, France et Cote d'Ivoire.",
      },
    ],
    publishersLabel: "Ecosysteme editeurs",
    certificationLabel: "Ecosysteme certification",
    modalitiesLabel: "Modalites",
    modalities: [
      "Classes en presentiel",
      "Classes a distance animees par instructeur",
      "Sessions intra-entreprise",
    ],
  },
};

const officialFooterCopy: Record<"en" | "fr", OfficialFooterCopy> = {
  en: {
    description:
      "Official-site alignment: Advancia Training positions itself as a long-standing certified IT training leader with advanced official curricula, certification services, and a four-country regional footprint.",
    officialSite: "Official website",
    officeDirectory: "Regional office directory",
  },
  fr: {
    description:
      "Alignement avec le site officiel: Advancia Training se positionne comme un acteur historique de la formation IT certifiante, avec des cursus officiels avances, des services de certification et une presence regionale sur quatre pays.",
    officialSite: "Site officiel",
    officeDirectory: "Annuaire regional",
  },
};

function resolveLocale(locale: AppLocale) {
  return locale === "fr" ? "fr" : "en";
}

export function getOfficialHeroCopy(locale: AppLocale) {
  return officialHeroCopy[resolveLocale(locale)];
}

export function getOfficialWhyCopy(locale: AppLocale) {
  return officialWhyCopy[resolveLocale(locale)];
}

export function getOfficialReachCopy(locale: AppLocale) {
  return officialReachCopy[resolveLocale(locale)];
}

export function getOfficialFooterCopy(locale: AppLocale) {
  return officialFooterCopy[resolveLocale(locale)];
}
