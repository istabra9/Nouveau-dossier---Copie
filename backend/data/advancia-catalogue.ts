import type {
  ActivityLogRecord,
  Category,
  EnrollmentRecord,
  NotificationRecord,
  PaymentRecord,
  PlatformDataset,
  ScheduleRecord,
  Testimonial,
  Training,
  TrainingFormat,
  TrainingLevel,
  TrainingStatus,
  UserRecord,
} from "@/frontend/types";

type CategorySlug =
  | "ai-copilot"
  | "cyber-security"
  | "enterprise-systems"
  | "project-governance"
  | "cisco-networking"
  | "microsoft-cloud-data"
  | "business-productivity"
  | "cloud-infrastructure"
  | "software-engineering";

type CategoryConfig = Category & {
  palette: [string, string, string];
  formatModes: TrainingFormat[];
  defaultAudience: string[];
  summaryFocus: string;
  descriptionFocus: string;
  venues: string[];
  cities: string[];
  visualFamily: string;
};

type TrainingSeed = {
  title: string;
  code: string;
  categorySlug: CategorySlug;
  durationDays: number;
  level?: TrainingLevel;
  format?: TrainingFormat;
  featured?: boolean;
  price?: number;
  rankingScore?: number;
};

const imageByCategory: Record<CategorySlug, string> = {
  "ai-copilot":
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
  "cyber-security":
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
  "enterprise-systems":
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "project-governance":
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "cisco-networking":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "microsoft-cloud-data":
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1200&q=80",
  "business-productivity":
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "cloud-infrastructure":
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  "software-engineering":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
};

const categoryConfigs: readonly CategoryConfig[] = [
  {
    id: "cat-ai-copilot",
    name: "AI & Copilot",
    slug: "ai-copilot",
    description:
      "Applied AI, Copilot, and agent-building programs for teams that want business-ready automation.",
    headline: "Practical AI momentum for modern teams.",
    accent: "from-[#4b0913] via-[#b31d37] to-[#ff9c7f]",
    icon: "BrainCircuit",
    palette: ["#4b0913", "#b31d37", "#ff9c7f"],
    formatModes: ["Virtual", "Hybrid"],
    defaultAudience: ["Business leads", "Transformation teams", "Knowledge workers"],
    summaryFocus: "turning AI capabilities into daily, governed operational gains",
    descriptionFocus: "practical AI adoption, prompt quality, and agent-enabled workflows",
    venues: ["Advancia AI Studio", "Live virtual collaboration room"],
    cities: ["Tunis", "Remote"],
    visualFamily: "ai",
  },
  {
    id: "cat-cyber-security",
    name: "Cyber Security",
    slug: "cyber-security",
    description:
      "Certification-led security, resilience, compliance, and defense programs for modern organisations.",
    headline: "Security posture built for real operations.",
    accent: "from-[#20080e] via-[#7c1326] to-[#ff6c6b]",
    icon: "ShieldCheck",
    palette: ["#20080e", "#7c1326", "#ff6c6b"],
    formatModes: ["In person", "Hybrid"],
    defaultAudience: ["Security analysts", "Infrastructure teams", "Risk managers"],
    summaryFocus: "stronger detection, audit readiness, and incident-response maturity",
    descriptionFocus: "defensive operations, governance controls, and hands-on security execution",
    venues: ["Advancia Security Lab", "Executive resilience workshop room"],
    cities: ["Tunis", "Sfax"],
    visualFamily: "shield",
  },
  {
    id: "cat-enterprise-systems",
    name: "Enterprise Systems",
    slug: "enterprise-systems",
    description:
      "SAP-oriented functional and technical tracks that connect operations, finance, quality, and people systems.",
    headline: "Core business systems with clearer execution.",
    accent: "from-[#421214] via-[#98402f] to-[#f3b37d]",
    icon: "Blocks",
    palette: ["#421214", "#98402f", "#f3b37d"],
    formatModes: ["Hybrid", "In person"],
    defaultAudience: ["Process owners", "Business analysts", "ERP specialists"],
    summaryFocus: "aligning enterprise workflows across finance, quality, supply, and HR operations",
    descriptionFocus: "cross-functional process design and ERP execution discipline",
    venues: ["Advancia ERP Room", "Client enterprise delivery suite"],
    cities: ["Tunis", "Sousse"],
    visualFamily: "process",
  },
  {
    id: "cat-project-governance",
    name: "Project, ITSM & Governance",
    slug: "project-governance",
    description:
      "Frameworks, certifications, and operating models for project delivery, architecture, and IT governance.",
    headline: "Sharper governance for delivery and transformation.",
    accent: "from-[#350d13] via-[#8e1d32] to-[#ff907d]",
    icon: "BriefcaseBusiness",
    palette: ["#350d13", "#8e1d32", "#ff907d"],
    formatModes: ["Hybrid", "In person", "Virtual"],
    defaultAudience: ["Project managers", "PMO teams", "Transformation leads"],
    summaryFocus: "creating better delivery rhythm, structure, and governance quality",
    descriptionFocus: "project control, service management, architecture, and portfolio delivery",
    venues: ["Advancia Project Forum", "Leadership classroom", "Remote facilitation studio"],
    cities: ["Tunis", "Remote", "Sfax"],
    visualFamily: "leadership",
  },
  {
    id: "cat-cisco-networking",
    name: "Cisco & Networking",
    slug: "cisco-networking",
    description:
      "Cisco-focused network, automation, wireless, security, data center, and collaboration tracks.",
    headline: "Network intelligence with hands-on depth.",
    accent: "from-[#1d1022] via-[#7d203f] to-[#ff8d75]",
    icon: "Network",
    palette: ["#1d1022", "#7d203f", "#ff8d75"],
    formatModes: ["In person", "Hybrid"],
    defaultAudience: ["Network engineers", "Platform operators", "Security architects"],
    summaryFocus: "resilient, automated network and collaboration services at enterprise scale",
    descriptionFocus: "routing, wireless, security, collaboration, and programmable infrastructure",
    venues: ["Advancia Network Lab", "Cisco practice room"],
    cities: ["Tunis", "Remote"],
    visualFamily: "network",
  },
  {
    id: "cat-microsoft-cloud-data",
    name: "Microsoft Cloud & Data",
    slug: "microsoft-cloud-data",
    description:
      "Microsoft 365, Azure, Fabric, Power Platform, and modern data tracks for administrators and builders.",
    headline: "Cloud productivity and data fluency under one roof.",
    accent: "from-[#251325] via-[#7d2349] to-[#f68b82]",
    icon: "CloudCog",
    palette: ["#251325", "#7d2349", "#f68b82"],
    formatModes: ["Virtual", "Hybrid"],
    defaultAudience: ["Cloud administrators", "Data teams", "Microsoft platform owners"],
    summaryFocus: "administering the Microsoft stack with clearer data and cloud confidence",
    descriptionFocus: "cloud administration, analytics delivery, compliance, and platform automation",
    venues: ["Advancia Cloud Loft", "Remote analytics studio"],
    cities: ["Remote", "Tunis"],
    visualFamily: "cloud",
  },
  {
    id: "cat-business-productivity",
    name: "Business Productivity & Leadership",
    slug: "business-productivity",
    description:
      "Office skills, reporting fluency, communication, and leadership programs for business teams.",
    headline: "Sharper communication, stronger execution.",
    accent: "from-[#4e1e12] via-[#b34c2d] to-[#ffd0a5]",
    icon: "Presentation",
    palette: ["#4e1e12", "#b34c2d", "#ffd0a5"],
    formatModes: ["In person", "Hybrid", "Virtual"],
    defaultAudience: ["Team leads", "Operational staff", "Business support teams"],
    summaryFocus: "elevating day-to-day productivity, reporting clarity, and team influence",
    descriptionFocus: "applied office tools, communication quality, and people leadership habits",
    venues: ["Advancia Skills Studio", "Executive communication room", "Remote office lab"],
    cities: ["Tunis", "Remote", "Sousse"],
    visualFamily: "presentation",
  },
  {
    id: "cat-cloud-infrastructure",
    name: "Cloud, Infrastructure & Virtualization",
    slug: "cloud-infrastructure",
    description:
      "AWS, VMware, Nutanix, Kubernetes, and infrastructure operations programs for technical teams.",
    headline: "Infrastructure capability with modern platform depth.",
    accent: "from-[#16202d] via-[#204a66] to-[#9bd1ff]",
    icon: "ServerCog",
    palette: ["#16202d", "#204a66", "#9bd1ff"],
    formatModes: ["In person", "Hybrid"],
    defaultAudience: ["Infrastructure engineers", "Cloud teams", "Platform administrators"],
    summaryFocus: "operating resilient cloud and on-prem platforms with more confidence",
    descriptionFocus: "cloud architecture, virtualization, storage, backup, and container operations",
    venues: ["Advancia Infrastructure Lab", "Platform engineering classroom"],
    cities: ["Tunis", "Sfax"],
    visualFamily: "server",
  },
  {
    id: "cat-software-engineering",
    name: "Software Engineering & DevOps",
    slug: "software-engineering",
    description:
      "Application, integration, quality, Linux, Java, SQL, and DevOps tracks for engineering teams.",
    headline: "Engineering craftsmanship with delivery discipline.",
    accent: "from-[#151726] via-[#453061] to-[#c39cff]",
    icon: "Code2",
    palette: ["#151726", "#453061", "#c39cff"],
    formatModes: ["Hybrid", "Virtual", "In person"],
    defaultAudience: ["Developers", "QA engineers", "DevOps teams"],
    summaryFocus: "building cleaner, more maintainable, and better-automated engineering systems",
    descriptionFocus: "application development, technical quality, integration, and delivery automation",
    venues: ["Advancia Engineering Loft", "Remote developer lab", "Integration workshop room"],
    cities: ["Tunis", "Remote", "Sousse"],
    visualFamily: "code",
  },
] as const;

const categoryConfigBySlug = Object.fromEntries(
  categoryConfigs.map((category) => [category.slug, category]),
) as Record<CategorySlug, CategoryConfig>;

function slugifyTrainingTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashString(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function roundToNearest50(value: number) {
  return Math.round(value / 50) * 50;
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildSessionDate(index: number) {
  const base = new Date(Date.UTC(2026, 3, 6));
  base.setUTCDate(base.getUTCDate() + index * 3);
  return base;
}

function includesAny(title: string, terms: string[]) {
  const normalized = title.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function inferLevel(seed: TrainingSeed): TrainingLevel {
  if (seed.level) {
    return seed.level;
  }

  if (
    includesAny(seed.title, [
      "executive",
      "architect",
      "cybersecurity architect",
      "lead auditor",
      "lead implementer",
    ])
  ) {
    return "Executive";
  }

  if (
    includesAny(seed.title, [
      "advanced",
      "professional",
      "practitioner",
      "implementing",
      "operate",
      "security",
      "pmp",
      "cissp",
      "kubernetes",
      "vmware",
      "certified",
    ])
  ) {
    return "Advanced";
  }

  if (
    includesAny(seed.title, [
      "foundation",
      "fundamentals",
      "essentials",
      "initiation",
      "prise en main",
      "basics",
      "cloud practitioner",
    ])
  ) {
    return "Foundation";
  }

  return "Intermediate";
}

function inferFormat(seed: TrainingSeed, category: CategoryConfig, key: string) {
  if (seed.format) {
    return seed.format;
  }

  const modes = category.formatModes;
  return modes[hashString(key) % modes.length];
}

function inferVisualFamily(seed: TrainingSeed, category: CategoryConfig) {
  if (includesAny(seed.title, ["copilot", "ai", "prompt", "agent"])) {
    return "ai";
  }

  if (
    includesAny(seed.title, [
      "security",
      "threat",
      "defender",
      "auditor",
      "forti",
      "firewall",
      "incident",
      "soc",
      "cissp",
    ])
  ) {
    return "shield";
  }

  if (
    includesAny(seed.title, [
      "cisco",
      "wireless",
      "network",
      "sd-wan",
      "routing",
      "collaboration",
      "meraki",
      "data center",
    ])
  ) {
    return "network";
  }

  if (
    includesAny(seed.title, [
      "azure",
      "microsoft 365",
      "sharepoint",
      "power bi",
      "fabric",
      "power platform",
      "windows",
      "teams",
    ])
  ) {
    return "cloud";
  }

  if (
    includesAny(seed.title, [
      "excel",
      "powerpoint",
      "word",
      "outlook",
      "communication",
      "leadership",
      "management",
      "public speaking",
    ])
  ) {
    return "presentation";
  }

  if (
    includesAny(seed.title, [
      "aws",
      "vmware",
      "veeam",
      "nutanix",
      "kubernetes",
      "infrastructure",
      "big-ip",
      "virtualization",
    ])
  ) {
    return "server";
  }

  if (
    includesAny(seed.title, [
      "sql",
      "data",
      "talend",
      "oracle",
      "analytics",
      "database",
    ])
  ) {
    return "data";
  }

  if (
    includesAny(seed.title, [
      "angular",
      "python",
      "spring",
      "nestjs",
      "symfony",
      "java",
      "devops",
      "html5",
    ])
  ) {
    return "code";
  }

  return category.visualFamily;
}

function inferBadge(seed: TrainingSeed, category: CategoryConfig) {
  if (includesAny(seed.title, ["copilot", "ai", "fabric"])) {
    return "AI Momentum";
  }

  if (includesAny(seed.title, ["foundation", "fundamentals", "essentials", "initiation"])) {
    return "Foundation Track";
  }

  if (
    includesAny(seed.title, [
      "certified",
      "certification",
      "prince2",
      "pmp",
      "togaf",
      "itil",
      "cissp",
      "kubernetes",
    ])
  ) {
    return "Certification Track";
  }

  if (category.slug === "cisco-networking" || category.slug === "cloud-infrastructure") {
    return "Hands-on Lab";
  }

  if (category.slug === "business-productivity") {
    return "Applied Skills";
  }

  return "Operational Track";
}

function inferHeroKicker(seed: TrainingSeed, category: CategoryConfig, visualFamily: string) {
  if (visualFamily === "ai") {
    return "Governed AI adoption with immediate business lift";
  }

  if (visualFamily === "shield") {
    return "Security control, response, and resilience readiness";
  }

  if (visualFamily === "network") {
    return "Enterprise network capability with deeper automation";
  }

  if (visualFamily === "cloud") {
    return "Cloud, productivity, and analytics delivery at scale";
  }

  if (visualFamily === "presentation") {
    return "Sharper communication, reporting, and team influence";
  }

  if (visualFamily === "server") {
    return "Platform operations designed for reliability and growth";
  }

  if (visualFamily === "data") {
    return "Data architecture and reporting with stronger confidence";
  }

  if (visualFamily === "code") {
    return "Modern engineering craft with delivery discipline";
  }

  return category.headline;
}

function inferPrice(
  seed: TrainingSeed,
  category: CategoryConfig,
  level: TrainingLevel,
  visualFamily: string,
) {
  if (seed.price) {
    return seed.price;
  }

  const baseByCategory: Record<CategorySlug, number> = {
    "ai-copilot": 1450,
    "cyber-security": 1900,
    "enterprise-systems": 1650,
    "project-governance": 1500,
    "cisco-networking": 1850,
    "microsoft-cloud-data": 1600,
    "business-productivity": 850,
    "cloud-infrastructure": 2000,
    "software-engineering": 1300,
  };

  const levelPremium: Record<TrainingLevel, number> = {
    Foundation: 0,
    Intermediate: 250,
    Advanced: 550,
    Executive: 850,
  };

  const visualPremium: Record<string, number> = {
    ai: 350,
    shield: 420,
    network: 360,
    cloud: 320,
    presentation: 0,
    server: 450,
    data: 260,
    code: 180,
    leadership: 220,
    process: 240,
  };

  const keywordPremium = includesAny(seed.title, ["architect", "cissp", "pmp", "togaf"])
    ? 450
    : includesAny(seed.title, ["certified", "certification", "administrator"])
      ? 220
      : 0;

  return roundToNearest50(
    baseByCategory[seed.categorySlug] +
      seed.durationDays * 220 +
      levelPremium[level] +
      (visualPremium[visualFamily] ?? 0) +
      keywordPremium,
  );
}

function inferRating(key: string) {
  return Number((4.6 + (hashString(key) % 4) * 0.1).toFixed(1));
}

function inferRankingScore(seed: TrainingSeed, level: TrainingLevel, key: string) {
  if (seed.rankingScore) {
    return seed.rankingScore;
  }

  const featuredBoost = seed.featured ? 10 : 0;
  const levelBoost: Record<TrainingLevel, number> = {
    Foundation: 0,
    Intermediate: 4,
    Advanced: 8,
    Executive: 10,
  };

  return 72 + levelBoost[level] + featuredBoost + (hashString(key) % 10);
}

const trainerPool = [
  {
    name: "Dr. Salma Rekik",
    email: "salma.rekik@advancia.tn",
    expertise: "AI, automation, and enterprise adoption",
  },
  {
    name: "Anis Ghribi",
    email: "anis.ghribi@advancia.tn",
    expertise: "Cybersecurity operations and audit readiness",
  },
  {
    name: "Lina Dabbebi",
    email: "lina.dabbebi@advancia.tn",
    expertise: "Cloud architecture and Microsoft platforms",
  },
  {
    name: "Hichem Ferjani",
    email: "hichem.ferjani@advancia.tn",
    expertise: "Networking, Cisco delivery, and labs",
  },
  {
    name: "Nadia Guellouz",
    email: "nadia.guellouz@advancia.tn",
    expertise: "Project governance and leadership tracks",
  },
  {
    name: "Moez Chatti",
    email: "moez.chatti@advancia.tn",
    expertise: "Software engineering and DevOps practice",
  },
];

function inferTrainer(index: number) {
  return trainerPool[index % trainerPool.length];
}

function inferTrainingStatus(index: number): TrainingStatus {
  if (index % 11 === 0) {
    return "delayed";
  }

  if (index % 5 === 0) {
    return "completed";
  }

  if (index % 3 === 0) {
    return "ongoing";
  }

  return "upcoming";
}

function inferTags(seed: TrainingSeed, category: CategoryConfig) {
  const tags = new Set<string>([category.name, seed.code]);
  const keywordMap: Array<[string[], string]> = [
    [["copilot", "prompt", "agent"], "Copilot"],
    [["ai", "generative"], "Artificial Intelligence"],
    [["security", "soc", "threat", "firewall"], "Security Operations"],
    [["network", "wireless", "sd-wan", "cisco"], "Networking"],
    [["azure", "microsoft", "sharepoint", "teams"], "Microsoft"],
    [["excel", "power bi", "reporting", "dashboard"], "Reporting"],
    [["vmware", "cloud", "kubernetes", "aws"], "Infrastructure"],
    [["java", "python", "angular", "nestjs", "symfony"], "Software Engineering"],
    [["project", "scrum", "pmp", "prince2", "itil"], "Governance"],
    [["sap"], "Enterprise Systems"],
  ];

  for (const [terms, tag] of keywordMap) {
    if (includesAny(seed.title, terms)) {
      tags.add(tag);
    }
  }

  return Array.from(tags).slice(0, 5);
}

function inferAudience(seed: TrainingSeed, category: CategoryConfig, visualFamily: string) {
  if (visualFamily === "ai") {
    return ["Business leads", "Digital transformation teams", "Innovation managers"];
  }

  if (visualFamily === "shield") {
    return ["Security analysts", "Infrastructure teams", "Governance leaders"];
  }

  if (visualFamily === "network") {
    return ["Network engineers", "Platform operators", "Enterprise architects"];
  }

  if (visualFamily === "cloud") {
    return ["Cloud administrators", "Data teams", "Platform owners"];
  }

  if (visualFamily === "presentation") {
    return ["Business teams", "Office power users", "Team leads"];
  }

  if (visualFamily === "server") {
    return ["Infrastructure engineers", "Cloud teams", "Platform administrators"];
  }

  if (visualFamily === "data") {
    return ["Data analysts", "Database teams", "Reporting leads"];
  }

  if (visualFamily === "code") {
    return ["Developers", "QA engineers", "Technical leads"];
  }

  return category.defaultAudience;
}

function inferOutcomes(seed: TrainingSeed, visualFamily: string) {
  const focusTitle = seed.title.replace(/\s+/g, " ").trim();

  if (visualFamily === "ai") {
    return [
      "Identify the best AI and Copilot use cases for your role or team",
      "Apply prompts, agents, or governance patterns with more confidence",
      `Leave with an operational plan for ${focusTitle}`,
    ];
  }

  if (visualFamily === "shield") {
    return [
      "Strengthen detection, control, and resilience practices",
      "Interpret findings and security workflows more effectively",
      `Build clearer readiness for ${focusTitle}`,
    ];
  }

  if (visualFamily === "network") {
    return [
      "Configure enterprise connectivity patterns with stronger discipline",
      "Troubleshoot critical network behaviors faster",
      `Prepare for hands-on scenarios linked to ${focusTitle}`,
    ];
  }

  if (visualFamily === "cloud") {
    return [
      "Administer cloud and data capabilities with more clarity",
      "Translate platform features into useful operational workflows",
      `Move from theory to applied execution in ${focusTitle}`,
    ];
  }

  if (visualFamily === "presentation") {
    return [
      "Produce cleaner reporting, communication, or presentation output",
      "Use structured methods that save time and improve clarity",
      `Gain more confidence applying ${focusTitle} in daily work`,
    ];
  }

  if (visualFamily === "server") {
    return [
      "Operate infrastructure platforms with better reliability habits",
      "Understand implementation choices, security, and performance tradeoffs",
      `Strengthen practical readiness around ${focusTitle}`,
    ];
  }

  if (visualFamily === "data") {
    return [
      "Improve data preparation, modelling, or reporting quality",
      "Create more reliable decision-support workflows",
      `Apply ${focusTitle} with a clearer operational lens`,
    ];
  }

  if (visualFamily === "code") {
    return [
      "Write, test, or maintain technical solutions more confidently",
      "Apply cleaner engineering and automation habits",
      `Use ${focusTitle} in more production-ready ways`,
    ];
  }

  return [
    "Strengthen delivery structure and execution quality",
    "Make framework decisions with more confidence",
    `Build a more practical operating path for ${focusTitle}`,
  ];
}

function inferModules(seed: TrainingSeed) {
  const titleFocus = seed.title.split(":")[0].replace(/\([^)]*\)/g, "").trim();

  const modulesByCategory: Record<CategorySlug, string[]> = {
    "ai-copilot": [
      "Use-case prioritisation and value mapping",
      "Prompt, Copilot, and agent workflow design",
      "Governance, adoption, and quality controls",
      "Hands-on implementation studio",
    ],
    "cyber-security": [
      "Threat models and defensive foundations",
      "Control design and operational workflows",
      "Incident response, resilience, or audit drills",
      "Certification or readiness review",
    ],
    "enterprise-systems": [
      "Process mapping and business flow alignment",
      "System configuration essentials",
      "Cross-functional operational scenarios",
      "Performance and governance checkpoints",
    ],
    "project-governance": [
      "Framework foundations and terminology",
      "Governance, planning, and stakeholder rhythm",
      "Applied scenarios, case work, or simulation",
      "Exam readiness or operational toolkit",
    ],
    "cisco-networking": [
      "Core architecture and platform fundamentals",
      "Configuration labs and applied troubleshooting",
      "Automation, security, or service integration",
      "Certification-style practical review",
    ],
    "microsoft-cloud-data": [
      "Microsoft platform foundations",
      "Administration, analytics, or build workflows",
      "Security, governance, or data controls",
      "Applied labs and operational rollout",
    ],
    "business-productivity": [
      "Core toolset and workflow foundations",
      "Productivity shortcuts and structured methods",
      "Applied business scenarios and reporting practice",
      "Habits for cleaner day-to-day execution",
    ],
    "cloud-infrastructure": [
      "Architecture and environment setup",
      "Operational administration and scaling",
      "Resilience, backup, or security controls",
      "Hands-on infrastructure lab",
    ],
    "software-engineering": [
      "Foundations and technical architecture",
      "Implementation patterns and coding practice",
      "Testing, integration, or data flow quality",
      "Automation and production-readiness review",
    ],
  };

  return [titleFocus, ...modulesByCategory[seed.categorySlug]].slice(0, 4);
}

function buildSummary(seed: TrainingSeed, category: CategoryConfig, format: TrainingFormat) {
  const audience = category.defaultAudience.map((item) => item.toLowerCase());
  return `${seed.title} is a ${seed.durationDays}-day ${format.toLowerCase()} program for ${audience[0]} and ${audience[1]} who need ${category.summaryFocus}.`;
}

function buildDescription(seed: TrainingSeed, category: CategoryConfig, visualFamily: string) {
  const focusByVisual: Record<string, string> = {
    ai: "business-ready AI workflows, prompt quality, and agent orchestration",
    shield: "security operations, resilience, and audit-oriented control design",
    network: "network architecture, automation, and enterprise service reliability",
    cloud: "cloud administration, analytics delivery, and governed platform enablement",
    presentation: "office productivity, executive communication, and practical team enablement",
    server: "virtualization, cloud infrastructure, backup, and platform operations",
    data: "data modelling, reporting clarity, and durable decision-support practices",
    code: "application delivery, software quality, and sustainable engineering execution",
    leadership: category.descriptionFocus,
    process: category.descriptionFocus,
  };

  return `Built from the Advancia Trainings S1 2026 catalogue, ${seed.title} blends guided instruction, applied scenarios, and structured practice around ${focusByVisual[visualFamily] ?? category.descriptionFocus}. The result is a serious program that feels certification-aware, operationally useful, and immediately usable back at work.`;
}

function buildTraining(seed: TrainingSeed, index: number): Training {
  const category = categoryConfigBySlug[seed.categorySlug];
  const key = `${seed.code}-${seed.title}-${index}`;
  const level = inferLevel(seed);
  const format = inferFormat(seed, category, key);
  const visualFamily = inferVisualFamily(seed, category);
  const sessionDate = buildSessionDate(index);
  const sessionEndDate = new Date(sessionDate);
  sessionEndDate.setUTCDate(sessionEndDate.getUTCDate() + seed.durationDays - 1);
  const price = inferPrice(seed, category, level, visualFamily);
  const trainer = inferTrainer(index);
  const status = inferTrainingStatus(index);

  return {
    id: `tr-${String(index + 1).padStart(3, "0")}`,
    slug: slugifyTrainingTitle(seed.title),
    code: seed.code,
    title: seed.title,
    summary: buildSummary(seed, category, format),
    description: buildDescription(seed, category, visualFamily),
    badge: inferBadge(seed, category),
    categorySlug: category.slug,
    level,
    format,
    price,
    durationDays: seed.durationDays,
    totalHours: seed.durationDays * 6,
    seats: Math.max(format === "Virtual" ? 18 : 12, 26 - (hashString(key) % 9)),
    rating: inferRating(key),
    rankingScore: inferRankingScore(seed, level, key),
    featured: Boolean(seed.featured),
    accent: category.accent,
    coverPalette: category.palette,
    visualFamily,
    heroKicker: inferHeroKicker(seed, category, visualFamily),
    nextSession: formatIsoDate(sessionDate),
    imageUrl: imageByCategory[seed.categorySlug],
    trainerName: trainer.name,
    trainerEmail: trainer.email,
    trainerExpertise: trainer.expertise,
    startDate: formatIsoDate(sessionDate),
    endDate: formatIsoDate(sessionEndDate),
    status,
    enrolledUsersCount: 6 + (hashString(key) % 20),
    completionRate: status === "completed" ? 100 : status === "ongoing" ? 42 + (index % 40) : 0,
    engagementLevel:
      index % 3 === 0 ? "high" : index % 2 === 0 ? "medium" : "low",
    tags: inferTags(seed, category),
    audience: inferAudience(seed, category, visualFamily),
    outcomes: inferOutcomes(seed, visualFamily),
    modules: inferModules(seed),
  };
}

const aiSeeds = [
  { title: "Certified Artificial Intelligence Practitioner", code: "AIP", categorySlug: "ai-copilot", durationDays: 5, featured: true, rankingScore: 96 },
  { title: "Create agents in Microsoft Copilot Studio", code: "PL-7008", categorySlug: "ai-copilot", durationDays: 2, featured: true },
  { title: "Prepare Security and Compliance to support Microsoft 365 Copilot", code: "MS-4004", categorySlug: "ai-copilot", durationDays: 2 },
  { title: "Empower your Workforce with Microsoft 365 Copilot Use Cases", code: "MS-4012", categorySlug: "ai-copilot", durationDays: 2, featured: true, rankingScore: 94 },
  { title: "Microsoft Copilot Web Based Interactive Experience for Executives", code: "MS-4018", categorySlug: "ai-copilot", durationDays: 3, level: "Executive" },
  { title: "Draft, analyze, and present with Microsoft 365 Copilot", code: "MS-4023", categorySlug: "ai-copilot", durationDays: 2 },
  { title: "Explore Microsoft 365 Copilot Chat", code: "AIZ", categorySlug: "ai-copilot", durationDays: 1, level: "Foundation" },
  { title: "Craft effective prompts for Microsoft Copilot for Microsoft 365", code: "MS-4002", categorySlug: "ai-copilot", durationDays: 2 },
  { title: "Certified Artificial Intelligence Fundamentals", code: "MS-4005", categorySlug: "ai-copilot", durationDays: 3, level: "Foundation" },
  { title: "Build a Foundation to Build AI Agents and Extend Microsoft 365 Copilot", code: "MS-4014", categorySlug: "ai-copilot", durationDays: 3, featured: true },
  { title: "Extend Microsoft 365 Copilot in Copilot Studio", code: "MS-4022", categorySlug: "ai-copilot", durationDays: 2 },
  { title: "Transform your everyday business processes with agents", code: "MS-4019", categorySlug: "ai-copilot", durationDays: 2 },
  { title: "Develop Generative AI Apps in Azure", code: "AI-3016", categorySlug: "ai-copilot", durationDays: 2, featured: true },
] as const satisfies readonly TrainingSeed[];

const cyberSeeds = [
  { title: "Preparation a la certification CEH (Certified Ethical Hacker) V13", code: "CEH", categorySlug: "cyber-security", durationDays: 5, featured: true, rankingScore: 95 },
  { title: "EC-Council Incident Handling", code: "ECIH", categorySlug: "cyber-security", durationDays: 5 },
  { title: "Certified SOC Analyst", code: "CSA", categorySlug: "cyber-security", durationDays: 3, featured: true },
  { title: "Preparation a la certification CND (Certified Network Defender) V3", code: "CND", categorySlug: "cyber-security", durationDays: 5 },
  { title: "Certified Threat Intelligence Analyst", code: "CTIA", categorySlug: "cyber-security", durationDays: 5 },
  { title: "Certified Information Systems Security Professional", code: "CISSP", categorySlug: "cyber-security", durationDays: 5, featured: true, rankingScore: 97 },
  { title: "ISO/IEC 27001 - Lead Auditor", code: "ISO27LA", categorySlug: "cyber-security", durationDays: 4 },
  { title: "ISO 22301 - Lead Implementer", code: "ISO22LI", categorySlug: "cyber-security", durationDays: 4 },
  { title: "ISO/IEC 27005 - Risk Manager", code: "ISO27RM", categorySlug: "cyber-security", durationDays: 3 },
  { title: "ISO/IEC 27001 - Lead Implementer", code: "ISO27LI", categorySlug: "cyber-security", durationDays: 4 },
  { title: "Palo Alto Networks Panorama: NGFW Management", code: "PAN-NGFW", categorySlug: "cyber-security", durationDays: 2 },
  { title: "FortiGate Administrator", code: "FCP-FGT", categorySlug: "cyber-security", durationDays: 4 },
] as const satisfies readonly TrainingSeed[];

const enterpriseSeeds = [
  { title: "Material Management", code: "SAP-MM", categorySlug: "enterprise-systems", durationDays: 5 },
  { title: "Quality Management", code: "SAP-QM", categorySlug: "enterprise-systems", durationDays: 5 },
  { title: "Financial Management", code: "SAP-FICO", categorySlug: "enterprise-systems", durationDays: 10, featured: true },
  { title: "Plant Maintenance", code: "SAP-PM", categorySlug: "enterprise-systems", durationDays: 5 },
  { title: "SAP BASIS", code: "SAP-BASIS", categorySlug: "enterprise-systems", durationDays: 5 },
  { title: "Human Capital Management", code: "SAP-HCM", categorySlug: "enterprise-systems", durationDays: 5 },
] as const satisfies readonly TrainingSeed[];

const projectSeeds = [
  { title: "ITIL 4 Foundation", code: "ITIL4F", categorySlug: "project-governance", durationDays: 3, featured: true },
  { title: "ITIL 4 Managing Professional", code: "ITIL4MP", categorySlug: "project-governance", durationDays: 5 },
  { title: "ITIL 4 Specialist Create, Deliver and Support", code: "ITIL4CDS", categorySlug: "project-governance", durationDays: 3 },
  { title: "ITIL 4 Specialist High Velocity IT", code: "ITIL4HVI", categorySlug: "project-governance", durationDays: 3 },
  { title: "PRINCE2 Foundation V7", code: "PRINCE2-F", categorySlug: "project-governance", durationDays: 3, featured: true },
  { title: "PRINCE2 Practitioner V7", code: "PRINCE2-P", categorySlug: "project-governance", durationDays: 2 },
  { title: "TOGAF Foundation & Certified", code: "TOGAF10", categorySlug: "project-governance", durationDays: 5, featured: true },
  { title: "Archimate Foundation 3.2", code: "ARCF", categorySlug: "project-governance", durationDays: 5 },
  { title: "Archimate Practitioner 3.2", code: "ARCP", categorySlug: "project-governance", durationDays: 5 },
  { title: "PMP - Preparation a la certification PMP du PMI", code: "PMP", categorySlug: "project-governance", durationDays: 5, featured: true, rankingScore: 96 },
  { title: "Agile Project Management ACP du PMI", code: "ACP", categorySlug: "project-governance", durationDays: 4, featured: true },
  { title: "Scrum Master et Product Owner", code: "PSM-PSPO", categorySlug: "project-governance", durationDays: 3 },
  { title: "Management de projet par la pratique avec MS Project", code: "ATMPP", categorySlug: "project-governance", durationDays: 5 },
  { title: "Preparation a la certification Business Analysis ECBA", code: "ATECBA", categorySlug: "project-governance", durationDays: 3 },
  { title: "COBIT 2019 Foundation", code: "COBIT", categorySlug: "project-governance", durationDays: 3 },
] as const satisfies readonly TrainingSeed[];

const ciscoSeeds = [
  { title: "Implementing and Administering Cisco Solutions v2.2", code: "CCNA", categorySlug: "cisco-networking", durationDays: 5, featured: true, rankingScore: 95 },
  { title: "Designing Cisco Enterprise Networks", code: "ENSLD", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Implementing Cisco Catalyst 9000 Series Switches", code: "ENC9K", categorySlug: "cisco-networking", durationDays: 3 },
  { title: "Leveraging Cisco Intent-Based Networking DNA Assurance", code: "DNAAS", categorySlug: "cisco-networking", durationDays: 3 },
  { title: "Implementing and Operating Cisco Enterprise Network Core Technologies", code: "ENCOR", categorySlug: "cisco-networking", durationDays: 5, featured: true },
  { title: "Implementing Cisco SD-WAN Solutions", code: "ENSDWI", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Implementing Cisco Enterprise: Advanced Routing and Services", code: "ENARSI", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Developing Applications Using Cisco Core Platforms and APIs", code: "DEVCOR", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Developing Applications and Automating Workflows using Cisco Platforms", code: "DEVASC", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Implementing Automation for Cisco Security Solutions", code: "SAUTO", categorySlug: "cisco-networking", durationDays: 3 },
  { title: "Implementing and Operating Cisco Security Core Technologies", code: "SCOR", categorySlug: "cisco-networking", durationDays: 5, featured: true },
  { title: "Implementing and Configuring Cisco Identity Services Engine", code: "SISE", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Engineering Cisco Meraki Solutions", code: "ECMS1", categorySlug: "cisco-networking", durationDays: 4 },
  { title: "Implementing Cisco Enterprise Wireless Networks", code: "ENWLSI", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Implementing and Operating Cisco Data Center Core Technologies", code: "DCCOR", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Implementing and Operating Cisco Collaboration Core Technologies", code: "CLCOR", categorySlug: "cisco-networking", durationDays: 5 },
  { title: "Understanding Cisco Cybersecurity Operations Fundamentals", code: "CBROPS", categorySlug: "cisco-networking", durationDays: 5 },
] as const satisfies readonly TrainingSeed[];

const microsoftSeeds = [
  { title: "Microsoft 365 Fundamentals", code: "MS-900", categorySlug: "microsoft-cloud-data", durationDays: 2, level: "Foundation" },
  { title: "Gerer et deployer Microsoft Teams", code: "MS-700", categorySlug: "microsoft-cloud-data", durationDays: 4 },
  { title: "SharePoint Online Management and Administration", code: "55370", categorySlug: "microsoft-cloud-data", durationDays: 5 },
  { title: "Microsoft 365 Administrator", code: "MS-102", categorySlug: "microsoft-cloud-data", durationDays: 5, featured: true },
  { title: "Manage SharePoint and OneDrive in Microsoft 365", code: "MS-040", categorySlug: "microsoft-cloud-data", durationDays: 4 },
  { title: "Design and implement a Data Science solution in Azure", code: "DP-100", categorySlug: "microsoft-cloud-data", durationDays: 3 },
  { title: "Microsoft Azure Fundamentals", code: "AZ-900", categorySlug: "microsoft-cloud-data", durationDays: 2, level: "Foundation" },
  { title: "Microsoft Fabric Analytics Engineer", code: "DP-600", categorySlug: "microsoft-cloud-data", durationDays: 4, featured: true, rankingScore: 94 },
  { title: "Administering relational databases on Microsoft Azure", code: "DP-300", categorySlug: "microsoft-cloud-data", durationDays: 4 },
  { title: "Implementing data engineering solutions with Microsoft Fabric", code: "DP-700", categorySlug: "microsoft-cloud-data", durationDays: 4, featured: true },
  { title: "Azure Administrator", code: "AZ-104", categorySlug: "microsoft-cloud-data", durationDays: 5, featured: true, rankingScore: 95 },
  { title: "Develop solutions for Microsoft Azure", code: "AZ-204", categorySlug: "microsoft-cloud-data", durationDays: 5 },
  { title: "Design Microsoft Azure infrastructure solutions", code: "AZ-305", categorySlug: "microsoft-cloud-data", durationDays: 5 },
  { title: "Automating Administration with PowerShell", code: "AZ-040", categorySlug: "microsoft-cloud-data", durationDays: 5 },
  { title: "Analyze data with Microsoft Power BI", code: "PL-300", categorySlug: "microsoft-cloud-data", durationDays: 4, featured: true },
  { title: "Microsoft Power Platform Fundamentals", code: "PL-900", categorySlug: "microsoft-cloud-data", durationDays: 2, level: "Foundation" },
  { title: "Microsoft Power Platform Functional Consultant", code: "PL-200", categorySlug: "microsoft-cloud-data", durationDays: 5 },
  { title: "Microsoft Cybersecurity Architect", code: "SC-100", categorySlug: "microsoft-cloud-data", durationDays: 4, featured: true },
] as const satisfies readonly TrainingSeed[];

const businessSeeds = [
  { title: "Word - Initiation", code: "ATBT1", categorySlug: "business-productivity", durationDays: 3, level: "Foundation" },
  { title: "Word - Maitrise", code: "ATBT2", categorySlug: "business-productivity", durationDays: 3 },
  { title: "Excel - Initiation", code: "ATBT4", categorySlug: "business-productivity", durationDays: 3, level: "Foundation" },
  { title: "Excel - Maitrise", code: "ATBT3", categorySlug: "business-productivity", durationDays: 3, featured: true },
  { title: "Excel Power Pivot & Query", code: "ATBT5", categorySlug: "business-productivity", durationDays: 3, featured: true },
  { title: "Excel Macros et VBA", code: "ATBT6", categorySlug: "business-productivity", durationDays: 4 },
  { title: "PowerPoint", code: "ATBT12", categorySlug: "business-productivity", durationDays: 4 },
  { title: "Excel Maitrise et Dashboards", code: "ATBT7", categorySlug: "business-productivity", durationDays: 3, featured: true },
  { title: "Outlook", code: "ATBT9", categorySlug: "business-productivity", durationDays: 2, level: "Foundation" },
  { title: "Excel Financier", code: "ATBT11", categorySlug: "business-productivity", durationDays: 3 },
  { title: "Prise de parole en public", code: "ATSS1", categorySlug: "business-productivity", durationDays: 2 },
  { title: "Communication efficace", code: "ATSS3", categorySlug: "business-productivity", durationDays: 2 },
  { title: "Management d'equipe: motiver et mobiliser son equipe", code: "ATSS5", categorySlug: "business-productivity", durationDays: 2, featured: true },
  { title: "Leadership situationnel", code: "ATSS4", categorySlug: "business-productivity", durationDays: 2 },
  { title: "Boite a Outils Manageriale", code: "ATSS6", categorySlug: "business-productivity", durationDays: 2 },
] as const satisfies readonly TrainingSeed[];

const cloudSeeds = [
  { title: "Architecting on AWS", code: "AWSA", categorySlug: "cloud-infrastructure", durationDays: 4, featured: true },
  { title: "AWS Cloud Practitioner Essentials", code: "AWSE", categorySlug: "cloud-infrastructure", durationDays: 2, level: "Foundation" },
  { title: "Configuring F5 Advanced WAF", code: "BIG-WAF", categorySlug: "cloud-infrastructure", durationDays: 4 },
  { title: "Configuring BIG-IP LTM: Local Traffic Manager", code: "BIG-LTM", categorySlug: "cloud-infrastructure", durationDays: 5 },
  { title: "Configuring BIG-IP APM: Access Policy Manager", code: "BIG-APM", categorySlug: "cloud-infrastructure", durationDays: 5 },
  { title: "VMCE Veeam Backup & Replication v12.3: Configure, Manage and Recover", code: "VMCE", categorySlug: "cloud-infrastructure", durationDays: 4 },
  { title: "Nutanix Enterprise Cloud Administration", code: "ECA", categorySlug: "cloud-infrastructure", durationDays: 4 },
  { title: "Nutanix Advanced Administration & Performance Management", code: "AAPM", categorySlug: "cloud-infrastructure", durationDays: 4 },
  { title: "Certified Kubernetes Administrator", code: "CKA", categorySlug: "cloud-infrastructure", durationDays: 4, featured: true },
  { title: "Certified Kubernetes Security Specialist", code: "CKS", categorySlug: "cloud-infrastructure", durationDays: 4, featured: true },
  { title: "VMware NSX-T Data Center: Install, Configure & Manage [v4]", code: "NSX-ICM", categorySlug: "cloud-infrastructure", durationDays: 5, featured: true },
  { title: "vSphere: Install, Configure & Manage [v8]", code: "VS-ICM", categorySlug: "cloud-infrastructure", durationDays: 5, featured: true },
  { title: "VMware vSphere: Operate, Scale and Secure [v8]", code: "VS-TS", categorySlug: "cloud-infrastructure", durationDays: 5 },
  { title: "vSAN: Deploy & Manage [v7]", code: "VSN-DM", categorySlug: "cloud-infrastructure", durationDays: 5 },
] as const satisfies readonly TrainingSeed[];

const softwareSeeds = [
  { title: "Talend Data Integration", code: "ATTDI", categorySlug: "software-engineering", durationDays: 3 },
  { title: "Angular 16", code: "ATJS1", categorySlug: "software-engineering", durationDays: 4 },
  { title: "Angular 16 Advanced", code: "ATJS2", categorySlug: "software-engineering", durationDays: 4 },
  { title: "Python", code: "ATPY", categorySlug: "software-engineering", durationDays: 4, featured: true },
  { title: "Developper des applications avec Spring Boot", code: "SPRINGBOOT", categorySlug: "software-engineering", durationDays: 5, featured: true },
  { title: "NestJs, le Framework Node.js", code: "NESTJS", categorySlug: "software-engineering", durationDays: 4, featured: true },
  { title: "Symfony", code: "ATSY", categorySlug: "software-engineering", durationDays: 4 },
  { title: "ISTQB Foundation", code: "ISTQBF", categorySlug: "software-engineering", durationDays: 4 },
  { title: "Formation de preparation a la certification LPIC-1 (101)", code: "ATLPIC1-101", categorySlug: "software-engineering", durationDays: 5 },
  { title: "Java 21, les nouveautes de Java", code: "ATJC1", categorySlug: "software-engineering", durationDays: 5 },
  { title: "Java, programmation avancee", code: "ATJC2", categorySlug: "software-engineering", durationDays: 5 },
  { title: "SQL Fundamentals I", code: "ODSQL", categorySlug: "software-engineering", durationDays: 3 },
  { title: "Devops Outils", code: "ATDVO", categorySlug: "software-engineering", durationDays: 5, featured: true },
] as const satisfies readonly TrainingSeed[];

const trainingSeeds: TrainingSeed[] = [
  ...aiSeeds,
  ...cyberSeeds,
  ...enterpriseSeeds,
  ...projectSeeds,
  ...ciscoSeeds,
  ...microsoftSeeds,
  ...businessSeeds,
  ...cloudSeeds,
  ...softwareSeeds,
];

export const advanciaCategories: Category[] = categoryConfigs.map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  headline: category.headline,
  accent: category.accent,
  icon: category.icon,
}));

export const advanciaTrainings: Training[] = trainingSeeds.map(buildTraining);

function buildSchedule(training: Training, index: number): ScheduleRecord {
  const category = categoryConfigBySlug[training.categorySlug as CategorySlug];
  const startDate = buildSessionDate(index);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + training.durationDays - 1);

  return {
    id: `sch-${String(index + 1).padStart(3, "0")}`,
    trainingSlug: training.slug,
    city: category.cities[index % category.cities.length],
    venue: category.venues[index % category.venues.length],
    instructor: [
      "Dr. Salma Rekik",
      "Anis Ghribi",
      "Lina Dabbebi",
      "Hichem Ferjani",
      "Nadia Guellouz",
      "Moez Chatti",
      "Rania Hadded",
      "Aymen Triki",
      "Amel Souissi",
      "Sarra Ben Jemaa",
    ][index % 10],
    startDate: formatIsoDate(startDate),
    endDate: formatIsoDate(endDate),
    seatsAvailable: Math.max(4, training.seats - ((index % 6) + 3)),
    format: training.format,
  };
}

export const advanciaSchedules: ScheduleRecord[] = advanciaTrainings.map(buildSchedule);

const trainingByTitle = new Map(advanciaTrainings.map((training) => [training.title, training]));

function getTrainingByTitle(title: string) {
  const training = trainingByTitle.get(title);

  if (!training) {
    throw new Error(`Missing training for title: ${title}`);
  }

  return training;
}

function buildEnrollment(
  id: string,
  userId: string,
  title: string,
  status: EnrollmentRecord["status"],
  progress: number,
  startedAt: string,
  nextSession?: string,
  completedAt?: string,
): EnrollmentRecord {
  const training = getTrainingByTitle(title);

  return {
    id,
    userId,
    trainingSlug: training.slug,
    status,
    progress,
    startedAt,
    nextSession: nextSession ?? training.nextSession,
    completedAt,
    amount: training.price,
  };
}

function buildPayment(
  id: string,
  userId: string,
  title: string,
  status: PaymentRecord["status"],
  paidAt: string,
  method: string,
  invoiceNumber: string,
): PaymentRecord {
  const training = getTrainingByTitle(title);

  return {
    id,
    userId,
    trainingSlug: training.slug,
    amount: training.price,
    currency: "TND",
    status,
    provider: "mock",
    method,
    paidAt,
    invoiceNumber,
  };
}

const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Mixal Ripolin",
    role: "Learner testimonial",
    company: "Advancia Training client",
    quote:
      "The official Advancia site highlights a learner who thanked the team and trainer after successfully passing the NSE4 7.0 exam thanks to the training experience.",
    result: "Certification success supported by guided instruction.",
  },
  {
    id: "test-2",
    name: "DevXperts",
    role: "Corporate client",
    company: "DevXperts",
    quote:
      "A client testimonial on the official site describes strong satisfaction with the quality of a time and stress management training delivered by Advancia.",
    result: "Positive feedback on training quality and facilitation.",
  },
  {
    id: "test-3",
    name: "Wifek Trabelsi",
    role: "Responsable recrutement & marque employeur",
    company: "Official site testimonial",
    quote:
      "Another official testimonial praises Advancia's professionalism and the quality of the delivered training for meeting expectations and business needs.",
    result: "Strong perceived professionalism and fit-to-need delivery.",
  },
];

const users: UserRecord[] = [
  {
    id: "usr-super",
    name: "Ramzy Sassi",
    firstName: "Ramzy",
    lastName: "Sassi",
    email: "superadmin@advancia.local",
    age: 41,
    sex: "male",
    uniqueId: "ADV-SUP-0001",
    role: "super_admin",
    department: "Executive Office",
    company: "Advancia Trainings",
    status: "active",
    joinedAt: "2025-09-05",
    avatar: "MR",
    funnyAvatar: "Wise Falcon",
    focusTracks: ["project-governance", "microsoft-cloud-data"],
    enrolledTrainingSlugs: [],
    passwordHash:
      "$2b$10$QRg5TqbjK5l6q9JOFfwuB.vYSufEwbbMpLfaPkmAPCeqOsMBqsxo2",
    preferences: { language: "fr", theme: "light" },
  },
  {
    id: "usr-admin",
    name: "Karim Ben Salem",
    firstName: "Karim",
    lastName: "Ben Salem",
    email: "admin@advancia.local",
    age: 35,
    sex: "male",
    uniqueId: "ADV-ADM-0001",
    role: "admin",
    department: "Operations",
    company: "Advancia Trainings",
    status: "active",
    joinedAt: "2025-10-11",
    avatar: "KB",
    funnyAvatar: "Calm Fox",
    focusTracks: ["cisco-networking", "business-productivity"],
    enrolledTrainingSlugs: [],
    passwordHash:
      "$2b$10$dKSnk1DW8BHADGtu7kP/tuc3UsSDy//ZuxJOM8B8HZYVzsg1p75bi",
    preferences: { language: "en", theme: "light" },
  },
  {
    id: "usr-user",
    name: "Maya Jaziri",
    firstName: "Maya",
    lastName: "Jaziri",
    email: "user@advancia.local",
    age: 27,
    sex: "female",
    uniqueId: "ADV-USR-0001",
    role: "user",
    department: "Business Excellence",
    company: "Atlas Logistics",
    status: "active",
    joinedAt: "2026-01-09",
    avatar: "MJ",
    funnyAvatar: "Sunny Bunny",
    focusTracks: ["ai-copilot", "microsoft-cloud-data"],
    enrolledTrainingSlugs: [
      getTrainingByTitle("Empower your Workforce with Microsoft 365 Copilot Use Cases").slug,
      getTrainingByTitle("Analyze data with Microsoft Power BI").slug,
    ],
    passwordHash:
      "$2b$10$oFHSoMf6Mb/jfIXH.OMBPuh5yYzZzkn.nxJm8LVSRK6dJssGbGX4m",
    preferences: { language: "en", theme: "dark" },
  },
  {
    id: "usr-ops",
    name: "Ahmed Khelifi",
    firstName: "Ahmed",
    lastName: "Khelifi",
    email: "ahmed.khelifi@client.local",
    age: 31,
    sex: "male",
    uniqueId: "ADV-USR-0002",
    role: "user",
    department: "Operations",
    company: "North Axis Group",
    status: "active",
    joinedAt: "2025-12-04",
    avatar: "AK",
    funnyAvatar: "Racing Cat",
    focusTracks: ["project-governance", "business-productivity"],
    enrolledTrainingSlugs: [getTrainingByTitle("Agile Project Management ACP du PMI").slug],
    passwordHash:
      "$2b$10$oFHSoMf6Mb/jfIXH.OMBPuh5yYzZzkn.nxJm8LVSRK6dJssGbGX4m",
    preferences: { language: "fr", theme: "light" },
  },
  {
    id: "usr-data",
    name: "Leila Hamza",
    firstName: "Leila",
    lastName: "Hamza",
    email: "leila.hamza@client.local",
    age: 29,
    sex: "female",
    uniqueId: "ADV-USR-0003",
    role: "user",
    department: "Performance",
    company: "Aurex Partners",
    status: "active",
    joinedAt: "2025-11-18",
    avatar: "LH",
    funnyAvatar: "Rocket Owl",
    focusTracks: ["microsoft-cloud-data", "software-engineering"],
    enrolledTrainingSlugs: [getTrainingByTitle("Microsoft Fabric Analytics Engineer").slug],
    passwordHash:
      "$2b$10$oFHSoMf6Mb/jfIXH.OMBPuh5yYzZzkn.nxJm8LVSRK6dJssGbGX4m",
    preferences: { language: "en", theme: "light" },
  },
  {
    id: "usr-lead",
    name: "Walid Sassi",
    firstName: "Walid",
    lastName: "Sassi",
    email: "walid.sassi@client.local",
    age: 34,
    sex: "male",
    uniqueId: "ADV-USR-0004",
    role: "user",
    department: "People",
    company: "Telmaris",
    status: "active",
    joinedAt: "2026-02-03",
    avatar: "WS",
    funnyAvatar: "Bold Panda",
    focusTracks: ["business-productivity", "project-governance"],
    enrolledTrainingSlugs: [getTrainingByTitle("Leadership situationnel").slug],
    passwordHash:
      "$2b$10$oFHSoMf6Mb/jfIXH.OMBPuh5yYzZzkn.nxJm8LVSRK6dJssGbGX4m",
    preferences: { language: "fr", theme: "dark" },
  },
  {
    id: "usr-finance",
    name: "Hela Mzoughi",
    firstName: "Hela",
    lastName: "Mzoughi",
    email: "hela.mzoughi@client.local",
    age: 32,
    sex: "female",
    uniqueId: "ADV-USR-0005",
    role: "user",
    department: "Finance",
    company: "Carthage Retail",
    status: "active",
    joinedAt: "2026-02-14",
    avatar: "HM",
    funnyAvatar: "Lucky Koala",
    focusTracks: ["enterprise-systems", "business-productivity"],
    enrolledTrainingSlugs: [getTrainingByTitle("Financial Management").slug],
    passwordHash:
      "$2b$10$oFHSoMf6Mb/jfIXH.OMBPuh5yYzZzkn.nxJm8LVSRK6dJssGbGX4m",
    preferences: { language: "ar", theme: "light" },
  },
  {
    id: "usr-admin-2",
    name: "Nour Fellah",
    firstName: "Nour",
    lastName: "Fellah",
    email: "nour.fellah@advancia.local",
    age: 30,
    sex: "female",
    uniqueId: "ADV-ADM-0002",
    role: "admin",
    department: "Reporting",
    company: "Advancia Trainings",
    status: "active",
    joinedAt: "2025-11-27",
    avatar: "NF",
    funnyAvatar: "Smart Lynx",
    focusTracks: ["microsoft-cloud-data"],
    enrolledTrainingSlugs: [],
    passwordHash:
      "$2b$10$dKSnk1DW8BHADGtu7kP/tuc3UsSDy//ZuxJOM8B8HZYVzsg1p75bi",
    preferences: { language: "fr", theme: "light" },
  },
];

const enrollments: EnrollmentRecord[] = [
  buildEnrollment(
    "enr-001",
    "usr-user",
    "Empower your Workforce with Microsoft 365 Copilot Use Cases",
    "in_progress",
    64,
    "2026-03-02",
  ),
  buildEnrollment(
    "enr-002",
    "usr-user",
    "Analyze data with Microsoft Power BI",
    "confirmed",
    12,
    "2026-03-11",
  ),
  buildEnrollment(
    "enr-003",
    "usr-ops",
    "Agile Project Management ACP du PMI",
    "confirmed",
    0,
    "2026-03-05",
  ),
  buildEnrollment(
    "enr-004",
    "usr-data",
    "Microsoft Fabric Analytics Engineer",
    "completed",
    100,
    "2026-01-14",
    undefined,
    "2026-02-06",
  ),
  buildEnrollment(
    "enr-005",
    "usr-lead",
    "Leadership situationnel",
    "upcoming",
    0,
    "2026-03-12",
  ),
  buildEnrollment(
    "enr-006",
    "usr-finance",
    "Financial Management",
    "completed",
    100,
    "2026-01-21",
    undefined,
    "2026-02-01",
  ),
  buildEnrollment(
    "enr-007",
    "usr-ops",
    "Implementing and Operating Cisco Enterprise Network Core Technologies",
    "confirmed",
    0,
    "2026-03-18",
  ),
  buildEnrollment(
    "enr-008",
    "usr-data",
    "Certified Artificial Intelligence Practitioner",
    "completed",
    100,
    "2025-12-10",
    undefined,
    "2025-12-28",
  ),
  buildEnrollment(
    "enr-009",
    "usr-lead",
    "PMP - Preparation a la certification PMP du PMI",
    "confirmed",
    0,
    "2026-03-17",
  ),
  buildEnrollment(
    "enr-010",
    "usr-finance",
    "Excel Financier",
    "confirmed",
    0,
    "2026-03-10",
  ),
  buildEnrollment(
    "enr-011",
    "usr-user",
    "Microsoft Power Platform Fundamentals",
    "completed",
    100,
    "2025-12-02",
    undefined,
    "2025-12-16",
  ),
  buildEnrollment(
    "enr-012",
    "usr-user",
    "Communication efficace",
    "completed",
    100,
    "2025-11-10",
    undefined,
    "2025-11-26",
  ),
];

const payments: PaymentRecord[] = [
  buildPayment(
    "pay-001",
    "usr-user",
    "Empower your Workforce with Microsoft 365 Copilot Use Cases",
    "paid",
    "2026-03-03",
    "Corporate card",
    "ADV-2026-001",
  ),
  buildPayment(
    "pay-002",
    "usr-user",
    "Analyze data with Microsoft Power BI",
    "paid",
    "2026-03-11",
    "Corporate card",
    "ADV-2026-002",
  ),
  buildPayment(
    "pay-003",
    "usr-ops",
    "Agile Project Management ACP du PMI",
    "paid",
    "2026-03-06",
    "Bank transfer",
    "ADV-2026-003",
  ),
  buildPayment(
    "pay-004",
    "usr-data",
    "Microsoft Fabric Analytics Engineer",
    "paid",
    "2026-01-15",
    "Corporate card",
    "ADV-2026-004",
  ),
  buildPayment(
    "pay-005",
    "usr-lead",
    "Leadership situationnel",
    "pending",
    "2026-03-12",
    "Pending authorization",
    "ADV-2026-005",
  ),
  buildPayment(
    "pay-006",
    "usr-finance",
    "Financial Management",
    "paid",
    "2026-01-22",
    "Bank transfer",
    "ADV-2026-006",
  ),
  buildPayment(
    "pay-007",
    "usr-ops",
    "Implementing and Operating Cisco Enterprise Network Core Technologies",
    "paid",
    "2026-03-18",
    "Corporate card",
    "ADV-2026-007",
  ),
  buildPayment(
    "pay-008",
    "usr-lead",
    "PMP - Preparation a la certification PMP du PMI",
    "pending",
    "2026-03-17",
    "Invoice request",
    "ADV-2026-008",
  ),
  buildPayment(
    "pay-009",
    "usr-finance",
    "Excel Financier",
    "paid",
    "2026-03-10",
    "Bank transfer",
    "ADV-2026-009",
  ),
];

const notifications: NotificationRecord[] = [
  {
    id: "not-001",
    title: "Enrollment confirmed",
    message: "Your Power BI training enrollment is confirmed.",
    audience: "user",
    userId: "usr-user",
    type: "enrollment",
    status: "unread",
    createdAt: "2026-03-11T09:30:00.000Z",
    link: "/profile",
  },
  {
    id: "not-002",
    title: "Security watch",
    message: "Two failed login attempts were detected this week.",
    audience: "admin",
    type: "security",
    status: "unread",
    createdAt: "2026-03-18T08:00:00.000Z",
    link: "/dashboard/admin",
  },
  {
    id: "not-003",
    title: "Training overlap",
    message: "Two upcoming sessions overlap in the cloud calendar.",
    audience: "super_admin",
    type: "training",
    status: "unread",
    createdAt: "2026-03-19T10:15:00.000Z",
    link: "/trainings/calendar",
  },
  {
    id: "not-004",
    title: "Platform update",
    message: "New analytics widgets are available for admins.",
    audience: "all",
    type: "system",
    status: "read",
    createdAt: "2026-03-09T11:00:00.000Z",
    link: "/dashboard/admin",
  },
];

const activityLogs: ActivityLogRecord[] = [
  {
    id: "act-001",
    userId: "usr-user",
    actorName: "Maya Jaziri",
    actorRole: "user",
    action: "login",
    entityType: "auth",
    entityId: "usr-user",
    message: "Signed in from Tunisia office network.",
    severity: "info",
    createdAt: "2026-03-18T07:42:00.000Z",
  },
  {
    id: "act-002",
    userId: "usr-user",
    actorName: "Maya Jaziri",
    actorRole: "user",
    action: "enrollment",
    entityType: "training",
    entityId: getTrainingByTitle("Analyze data with Microsoft Power BI").slug,
    message: "Enrolled in Analyze data with Microsoft Power BI.",
    severity: "success",
    createdAt: "2026-03-11T09:25:00.000Z",
  },
  {
    id: "act-003",
    actorName: "Karim Ben Salem",
    actorRole: "admin",
    action: "export_users",
    entityType: "user",
    message: "Exported the user register to Excel.",
    severity: "info",
    createdAt: "2026-03-17T14:10:00.000Z",
  },
  {
    id: "act-004",
    actorName: "Ramzy Sassi",
    actorRole: "super_admin",
    action: "training_review",
    entityType: "training",
    entityId: getTrainingByTitle("Architecting on AWS").slug,
    message: "Reviewed AWS schedule overlap warning.",
    severity: "warning",
    createdAt: "2026-03-19T10:16:00.000Z",
  },
  {
    id: "act-005",
    userId: "usr-finance",
    actorName: "Hela Mzoughi",
    actorRole: "user",
    action: "profile_update",
    entityType: "user",
    entityId: "usr-finance",
    message: "Updated profile preferences and theme.",
    severity: "info",
    createdAt: "2026-03-10T13:05:00.000Z",
  },
];

export const advanciaDataset: PlatformDataset = {
  categories: advanciaCategories,
  trainings: advanciaTrainings,
  testimonials,
  users,
  enrollments,
  payments,
  schedules: advanciaSchedules,
  notifications,
  activityLogs,
};
