import type { AppLocale, TrainingFormat, TrainingLevel } from "@/frontend/types";

type Messages = {
  language: {
    label: string;
    select: string;
  };
  header: {
    catalogue: string;
    categories: string;
    why: string;
    allTrainings: string;
    openDashboard: string;
    login: string;
    getStarted: string;
  };
  footer: {
    description: string;
    explore: string;
    clientAccess: string;
    register: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    exploreCatalogue: string;
    createAccount: string;
    findProgram: string;
    searchPlaceholder: string;
    signatureSpotlight: string;
    liveCatalogue: string;
    upcomingCohorts: string;
    corporatePartners: string;
    trustedSignal: string;
    trustedBody: string;
    brandPresence: string;
    brandPresenceBody: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    description: string;
    price: string;
    duration: string;
    format: string;
    viewProgram: string;
  };
  categories: {
    eyebrow: string;
    title: string;
    description: string;
    programs: string;
  };
  why: {
    eyebrow: string;
    title: string;
    description: string;
    pillars: Array<{ title: string; description: string }>;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    demoAccess: string;
    reviewCatalogue: string;
  };
  catalogue: {
    eyebrow: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    allCategories: string;
    allLevels: string;
    allFormats: string;
    sortBy: string;
    best: string;
    relevance: string;
    nameAz: string;
    nameZa: string;
    priceAsc: string;
    priceDesc: string;
    results: string;
    noResultsTitle: string;
    noResultsDescription: string;
  };
  training: {
    viewDetails: string;
    outcomes: string;
    modules: string;
    audienceFit: string;
    category: string;
    upcomingSchedules: string;
    instructor: string;
    seatsAvailable: string;
    relatedPrograms: string;
    relatedTitle: string;
    enrollment: string;
    nextSession: string;
    secureCheckout: string;
    mockProvider: string;
    invoiceReady: string;
    processing: string;
    enrollAndPay: string;
    loginToEnroll: string;
    invoice: string;
  };
  chatbot: {
    title: string;
    subtitle: string;
    welcome: string;
    suggestions: string[];
    loading: string;
    inputPlaceholder: string;
    roleAssistant: string;
    roleUser: string;
    typing: string;
    send: string;
    canned: {
      login: string;
      payment: string;
      report: string;
      generic: string;
    };
    bots: {
      alexa: {
        name: string;
        role: string;
        bubble: string;
        suggestions: string[];
      };
      alex: {
        name: string;
        role: string;
        bubble: string;
        suggestions: string[];
        fallback: string;
      };
    };
  };
  auth: {
    backHome: string;
    layoutTitle: string;
    layoutBody: string;
    loginEyebrow: string;
    loginTitle: string;
    loginSubtitle: string;
    loginEmail: string;
    loginEmailPlaceholder: string;
    loginPassword: string;
    loginPasswordPlaceholder: string;
    loginButton: string;
    loginPending: string;
    loginNoAccount: string;
    loginCreateAccount: string;
    registerEyebrow: string;
    registerTitle: string;
    registerFullName: string;
    registerFullNamePlaceholder: string;
    registerEmail: string;
    registerEmailPlaceholder: string;
    registerPhone: string;
    registerPhonePlaceholder: string;
    registerCompany: string;
    registerCompanyPlaceholder: string;
    registerDepartment: string;
    registerDepartmentPlaceholder: string;
    registerPassword: string;
    registerPasswordPlaceholder: string;
    registerSubmit: string;
    registerPending: string;
    registerHasAccount: string;
    registerLogin: string;
    registerErrorGeneric: string;
    registerErrorNetwork: string;
    registerAge: string;
    registerAgePlaceholder: string;
    registerSex: string;
    registerSexFemale: string;
    registerSexMale: string;
    registerSexOther: string;
    registerAvatar: string;
    registerAvatarHint: string;
  };
  userDashboard: {
    workspace: string;
    welcomeBack: string;
    intro: string;
    accountStatus: string;
    currentTraining: string;
    profileComplete: string;
    notSet: string;
    profileOverview: string;
    email: string;
    funnyAvatar: string;
    startDate: string;
    endDate: string;
    completeness: string;
    openProfileSettings: string;
    myTrainings: string;
    myTrainingsHint: string;
    noEnrollments: string;
    nextSession: string;
    progress: string;
    activityHint: string;
    notificationsHint: string;
  };
  profilePage: {
    greeting: string;
    personalInfo: string;
    quickActions: string;
    settings: string;
    completeness: string;
    activity: string;
    notifications: string;
    currentTraining: string;
    startDate: string;
    endDate: string;
    browseTrainings: string;
    myTrainings: string;
    paymentHistory: string;
    noTrainings: string;
    noPayments: string;
    nextSession: string;
    paidOn: string;
    invoice: string;
    paymentMethod: string;
    logout: string;
    company: string;
    department: string;
    notSet: string;
    notificationsHint: string;
    activityHint: string;
  };
  quickActions: {
    title: string;
    hint: string;
    browseLabel: string;
    browseHint: string;
    enrollLabel: string;
    enrollHint: string;
    calendarLabel: string;
    calendarHint: string;
    editLabel: string;
    editHint: string;
  };
  sidebar: {
    superAdmin: {
      executive: string;
      users: string;
      management: string;
      trainings: string;
      importExport: string;
      insights: string;
      profile: string;
    };
    admin: {
      dashboard: string;
      users: string;
      importExport: string;
      stats: string;
      notifications: string;
      profile: string;
    };
    user: {
      dashboard: string;
      profile: string;
      browse: string;
      calendar: string;
    };
    brandNoteEyebrow: string;
    brandNoteBody: string;
  };
  dashboardHeader: {
    workspace: string;
    searchPlaceholder: string;
    logout: string;
  };
  notificationBell: {
    label: string;
    title: string;
    markAllRead: string;
    empty: string;
    allCaughtUp: string;
    unreadCount: string;
  };
  common: {
    send: string;
    cancel: string;
    save: string;
    close: string;
    loading: string;
  };
  enrollment: {
    requestButton: string;
    requestPending: string;
    requestSubmitted: string;
    requestSubmittedDescription: string;
    alreadyEnrolled: string;
    alreadyRequested: string;
    loginRequired: string;
    queueTitle: string;
    queueDescription: string;
    queueEmpty: string;
    statusPending: string;
    statusAccepted: string;
    statusRejected: string;
    accept: string;
    reject: string;
    delete: string;
    rejectReasonPlaceholder: string;
    requestedAt: string;
    decidedAt: string;
    learner: string;
    training: string;
  };
  emails: {
    enrollmentAccepted: {
      subject: string;
      greeting: string;
      intro: string;
      trainingLabel: string;
      startsLabel: string;
      dayLabel: string;
      placeLabel: string;
      trainerLabel: string;
      closing: string;
      signature: string;
    };
    enrollmentRejected: {
      subject: string;
      greeting: string;
      intro: string;
      reasonLabel: string;
      closing: string;
      signature: string;
    };
  };
  labels: {
    days: string;
    hours: string;
    programs: string;
    training: string;
    levels: Record<TrainingLevel, string>;
    formats: Record<TrainingFormat, string>;
    sortName: string;
  };
};

const enMessages: Messages = {
  language: { label: "Language", select: "Choose language" },
  header: {
    catalogue: "Catalogue",
    categories: "Categories",
    why: "Why Advancia",
    allTrainings: "All trainings",
    openDashboard: "Open dashboard",
    login: "Log in",
    getStarted: "Get started",
  },
  footer: {
    description:
      "Advancia Trainings helps organisations run premium learning programs with elegant discovery, secure enrollments, analytics, reporting, and future-ready tooling.",
    explore: "Explore catalogue",
    clientAccess: "Client access",
    register: "Register",
  },
  home: {
    heroBadge: "Cinematic training brand experience",
    heroTitle: "A premium training platform that feels",
    heroHighlight: "designed, staged, and alive.",
    heroDescription:
      "Advancia Trainings blends catalogue discovery, secure enrollments, polished reporting, role-aware workspaces, and tasteful 3D motion into one branded product surface.",
    exploreCatalogue: "Explore catalogue",
    createAccount: "Create account",
    findProgram: "Find your next program",
    searchPlaceholder: "AI, leadership, analytics, infrastructure...",
    signatureSpotlight: "Signature spotlight",
    liveCatalogue: "Live catalogue",
    upcomingCohorts: "Upcoming cohorts",
    corporatePartners: "Corporate partners",
    trustedSignal: "Trusted signal",
    trustedBody: "High-signal catalogue discovery tuned for serious buying decisions.",
    brandPresence: "Brand presence",
    brandPresenceBody:
      "Motion, depth, and clarity tuned to feel premium without becoming noisy.",
  },
  featured: {
    eyebrow: "Featured catalogue",
    title: "A premium training catalogue built for serious learning decisions.",
    description:
      "Distinctive programs, strong visual hierarchy, and clearer value signals make the catalogue feel editorial instead of generic.",
    price: "Price",
    duration: "Duration",
    format: "Format",
    viewProgram: "View program",
  },
  categories: {
    eyebrow: "Categories",
    title: "Different domains, one consistent premium standard.",
    description:
      "Each learning track carries its own tone and accent, giving the platform stronger rhythm and a more deliberate product feel.",
    programs: "programs",
  },
  why: {
    eyebrow: "Why Advancia",
    title: "Refined enough for the brand team, structured enough for operations.",
    description:
      "Every section is tuned for confidence: softer depth, richer composition, and real product architecture underneath the surface.",
    pillars: [
      {
        title: "Premium catalogue discovery",
        description:
          "The public experience feels crafted and high-trust, with clear decision signals instead of template clutter.",
      },
      {
        title: "Elegant operational visibility",
        description:
          "Dashboards, counters, and reporting tools are structured for clarity rather than noisy density.",
      },
      {
        title: "Future-ready intelligence",
        description:
          "Chatbot recommendations, payment abstraction, and data services are prepared for deeper AI integration later.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Training outcomes that feel tangible, not abstract.",
    description:
      "Placeholder proof for now, ready to be replaced by your real client feedback later without redesigning the page.",
  },
  cta: {
    eyebrow: "Ready to scale",
    title: "Bring your real training catalogue into a platform that already feels launch-ready.",
    description:
      "The structure is in place for catalogue content, enrollments, payments, reporting, and guided recommendations.",
    demoAccess: "Start with demo access",
    reviewCatalogue: "Review catalogue",
  },
  catalogue: {
    eyebrow: "Training catalogue",
    title: "Browse the real Advancia catalogue with richer filtering and stronger visual identity.",
    description:
      "The public catalogue now reflects the provided S1 2026 training calendar, with better sorting, search, and premium course presentation.",
    searchPlaceholder: "Search by title, code, topic, or outcome",
    allCategories: "All categories",
    allLevels: "All levels",
    allFormats: "All formats",
    sortBy: "Sort by",
    best: "Best trainings",
    relevance: "Relevance",
    nameAz: "Name A to Z",
    nameZa: "Name Z to A",
    priceAsc: "Price ascending",
    priceDesc: "Price descending",
    results: "results",
    noResultsTitle: "No trainings match the current filter set.",
    noResultsDescription:
      "Try widening the search or switching back to all categories and formats.",
  },
  training: {
    viewDetails: "View details",
    outcomes: "Outcomes",
    modules: "Modules",
    audienceFit: "Audience fit",
    category: "Category",
    upcomingSchedules: "Upcoming schedules",
    instructor: "Instructor",
    seatsAvailable: "Seats available",
    relatedPrograms: "Related programs",
    relatedTitle: "Related",
    enrollment: "Enrollment",
    nextSession: "Starts",
    secureCheckout: "Secure checkout",
    mockProvider: "Ready for payment",
    invoiceReady: "Invoice ready",
    processing: "Processing...",
    enrollAndPay: "Enroll",
    loginToEnroll: "Log in",
    invoice: "Invoice",
  },
  chatbot: {
    title: "Assistant",
    subtitle: "Ask Advancia Support.",
    welcome: "Ask Advancia Support.",
    suggestions: [
      "Recommend a short AI training",
      "I need a project management path",
      "Show me Microsoft data courses",
    ],
    loading: "Thinking...",
    inputPlaceholder: "Ask Advancia Support",
    roleAssistant: "assistant",
    roleUser: "you",
    typing: "is typing...",
    send: "Send",
    canned: {
      login:
        "Use the login page with one of the seeded demo accounts or a registered learner account. Admin roles are routed to their dashboards automatically.",
      payment:
        "Enrollments currently use a mock payment abstraction with payment status, invoice numbers, and receipt history already structured for future gateway integration.",
      report:
        "Admins and super admins can export Excel and PDF reports for users, trainings, enrollments, revenue, and duration analytics.",
      generic:
        "Based on your context, I would focus on the recommended trainings below. They align best with your interests, recent enrollments, or the topic you mentioned.",
    },
    bots: {
      alexa: {
        name: "Advancia Support",
        role: "Training guide",
        bubble:
          "Hi! I'm Advancia Support. Tell me your goal and I'll suggest the best training path for you.",
        suggestions: [
          "Recommend a cybersecurity training",
          "I need a cloud certification path",
          "Show beginner AI courses",
        ],
      },
      alex: {
        name: "Alex",
        role: "Analytics copilot",
        bubble:
          "Hey, I'm Alex. Ask me about inactive users, popular trainings, activity patterns, and platform signals.",
        suggestions: [
          "Show inactive users this month",
          "Which training is most popular",
          "Who are the most active users",
        ],
        fallback:
          "Alex can summarize platform data, inactive users, training popularity, and recent user activity.",
      },
    },
  },
  auth: {
    backHome: "Back home",
    layoutTitle: "Your cheerful gateway to premium training. ✨",
    layoutBody:
      "Friendly workspaces for super admins, admins, and learners — built to make every day a little brighter. 🌈",
    loginEyebrow: "Sign in",
    loginTitle: "Welcome back",
    loginSubtitle: "So happy to see you again — let's get you back in! 💖",
    loginEmail: "Email",
    loginEmailPlaceholder: "you@company.com",
    loginPassword: "Password",
    loginPasswordPlaceholder: "********",
    loginButton: "Log in",
    loginPending: "Signing in...",
    loginNoAccount: "New here?",
    loginCreateAccount: "Create an account",
    registerEyebrow: "Create account",
    registerTitle: "Join Advancia",
    registerFullName: "Full name",
    registerFullNamePlaceholder: "Your full name",
    registerEmail: "Email",
    registerEmailPlaceholder: "you@example.com",
    registerPhone: "Phone number",
    registerPhonePlaceholder: "Your phone number",
    registerCompany: "Company",
    registerCompanyPlaceholder: "Your company",
    registerDepartment: "Department",
    registerDepartmentPlaceholder: "Your department",
    registerPassword: "Password",
    registerPasswordPlaceholder: "Create a strong password",
    registerSubmit: "Create account",
    registerPending: "Creating account...",
    registerHasAccount: "Already registered?",
    registerLogin: "Log in",
    registerErrorGeneric: "Registration failed. Please try again.",
    registerErrorNetwork:
      "Registration failed. Please check your connection and try again.",
    registerAge: "Age",
    registerAgePlaceholder: "Your age",
    registerSex: "Sex",
    registerSexFemale: "Female",
    registerSexMale: "Male",
    registerSexOther: "Other",
    registerAvatar: "Pick your avatar",
    registerAvatarHint: "Choose the buddy that will follow you across the platform.",
  },
  userDashboard: {
    workspace: "Learner workspace",
    welcomeBack: "Welcome back",
    intro: "Track your profile, sessions, notifications, and next best trainings in one place.",
    accountStatus: "Account status",
    currentTraining: "Current training",
    profileComplete: "Profile complete",
    notSet: "Not set",
    profileOverview: "Profile overview",
    email: "Email",
    funnyAvatar: "Funny avatar",
    startDate: "Start date",
    endDate: "End date",
    completeness: "Completeness",
    openProfileSettings: "Open profile settings",
    myTrainings: "My trainings",
    myTrainingsHint: "Active and recent sessions linked to your account.",
    noEnrollments: "No enrollments yet.",
    nextSession: "Next session",
    progress: "progress",
    activityHint: "Recent logins, profile updates, and enrollments.",
    notificationsHint: "Enrollment updates and account alerts.",
  },
  profilePage: {
    greeting: "Hi",
    personalInfo: "Personal info",
    quickActions: "Quick actions",
    settings: "Settings",
    completeness: "Profile complete",
    activity: "Activity",
    notifications: "Notifications",
    currentTraining: "Current training",
    startDate: "Start",
    endDate: "End",
    browseTrainings: "Browse trainings",
    myTrainings: "My trainings",
    paymentHistory: "Payment history",
    noTrainings: "No trainings yet.",
    noPayments: "No payments yet.",
    nextSession: "Next session",
    paidOn: "Paid on",
    invoice: "Invoice",
    paymentMethod: "Method",
    logout: "Log out",
    company: "Company",
    department: "Department",
    notSet: "Not set",
    notificationsHint: "Account, enrollment, and training updates.",
    activityHint: "Your recent logins, updates, and enrollments.",
  },
  quickActions: {
    title: "Quick actions",
    hint: "Your shortcuts to the things you do most.",
    browseLabel: "Browse trainings",
    browseHint: "Explore the catalogue",
    enrollLabel: "Enroll in training",
    enrollHint: "Pick your next session",
    calendarLabel: "Open calendar",
    calendarHint: "See upcoming dates",
    editLabel: "Edit profile",
    editHint: "Update your settings",
  },
  sidebar: {
    superAdmin: {
      executive: "Executive overview",
      users: "Users management",
      management: "Accounts management",
      trainings: "Training control",
      importExport: "Import & export",
      insights: "Smart insights",
      profile: "My profile",
    },
    admin: {
      dashboard: "Dashboard",
      users: "Users management",
      importExport: "Import & export",
      stats: "Statistics",
      notifications: "Notifications",
      profile: "My profile",
    },
    user: {
      dashboard: "Dashboard",
      profile: "My profile",
      browse: "Browse trainings",
      calendar: "Calendar",
    },
    brandNoteEyebrow: "Brand note",
    brandNoteBody: "Clean. Branded. Clear.",
  },
  dashboardHeader: {
    workspace: "Advancia workspace",
    searchPlaceholder: "Search reports, users, trainings...",
    logout: "Log out",
  },
  notificationBell: {
    label: "Open notifications",
    title: "Notifications",
    markAllRead: "Mark all as read",
    empty: "No notifications yet.",
    allCaughtUp: "You're all caught up",
    unreadCount: "{count} unread",
  },
  common: {
    send: "Send",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    loading: "Loading...",
  },
  enrollment: {
    requestButton: "Request enrollment",
    requestPending: "Submitting...",
    requestSubmitted: "Request submitted",
    requestSubmittedDescription:
      "Your request was sent. A super admin will review it shortly.",
    alreadyEnrolled: "You are already enrolled.",
    alreadyRequested: "Your request is pending review.",
    loginRequired: "Log in to request this training.",
    queueTitle: "Enrollment requests",
    queueDescription: "Pending requests waiting for your decision.",
    queueEmpty: "No pending requests.",
    statusPending: "Pending",
    statusAccepted: "Accepted",
    statusRejected: "Rejected",
    accept: "Accept",
    reject: "Reject",
    delete: "Delete",
    rejectReasonPlaceholder: "Optional reason (visible to the learner)",
    requestedAt: "Requested",
    decidedAt: "Decided",
    learner: "Learner",
    training: "Training",
  },
  emails: {
    enrollmentAccepted: {
      subject: "Your Advancia enrollment is accepted",
      greeting: "Hi {name},",
      intro: "Your enrollment request has been accepted. Here are your training details:",
      trainingLabel: "Training",
      startsLabel: "Start date",
      dayLabel: "Day",
      placeLabel: "Location",
      trainerLabel: "Trainer",
      closing: "We look forward to seeing you. If you have any questions, just reply to this email.",
      signature: "The Advancia team",
    },
    enrollmentRejected: {
      subject: "Update on your Advancia enrollment request",
      greeting: "Hi {name},",
      intro: "After review, your enrollment request for {training} could not be approved at this time.",
      reasonLabel: "Reason",
      closing: "Feel free to browse other trainings or contact us for guidance.",
      signature: "The Advancia team",
    },
  },
  labels: {
    days: "days",
    hours: "hours",
    programs: "programs",
    training: "training",
    levels: {
      Foundation: "Foundation",
      Intermediate: "Intermediate",
      Advanced: "Advanced",
      Executive: "Executive",
    },
    formats: {
      Virtual: "Virtual",
      Hybrid: "Hybrid",
      "In person": "In person",
    },
    sortName: "Name",
  },
};

const frMessages: Messages = {
  ...enMessages,
  language: { label: "Langue", select: "Choisir la langue" },
  header: {
    catalogue: "Catalogue",
    categories: "Categories",
    why: "Pourquoi Advancia",
    allTrainings: "Toutes les formations",
    openDashboard: "Ouvrir le dashboard",
    login: "Connexion",
    getStarted: "Commencer",
  },
  footer: {
    description:
      "Advancia Trainings aide les organisations a piloter des parcours premium avec un catalogue elegant, des inscriptions securisees, des analytics et des exports.",
    explore: "Voir le catalogue",
    clientAccess: "Acces client",
    register: "Inscription",
  },
  home: {
    ...enMessages.home,
    heroBadge: "Experience premium et cinematographique",
    heroTitle: "Une plateforme de formation premium qui semble",
    heroHighlight: "dessinee, mise en scene et vivante.",
    heroDescription:
      "Advancia Trainings reunit decouverte du catalogue, inscriptions securisees, reporting soigne, espaces selon les roles et mouvement 3D subtil dans une seule experience de marque.",
    exploreCatalogue: "Explorer le catalogue",
    createAccount: "Creer un compte",
    findProgram: "Trouver votre prochaine formation",
    signatureSpotlight: "Programme en vedette",
    liveCatalogue: "Catalogue live",
    upcomingCohorts: "Cohortes a venir",
    corporatePartners: "Partenaires entreprise",
    trustedSignal: "Signal de confiance",
    trustedBody: "Une decouverte claire du catalogue pour des decisions serieuses.",
    brandPresence: "Presence de marque",
    brandPresenceBody:
      "Le mouvement, la profondeur et la clarte restent premium sans surcharger l'interface.",
  },
  featured: {
    eyebrow: "Catalogue en vedette",
    title: "Un catalogue premium pense pour de vraies decisions de formation.",
    description:
      "Des programmes distinctifs, une hierarchie visuelle forte et des signaux plus clairs rendent l'experience editoriale.",
    price: "Prix",
    duration: "Duree",
    format: "Format",
    viewProgram: "Voir le programme",
  },
  categories: {
    eyebrow: "Categories",
    title: "Des domaines differents, un meme niveau premium.",
    description:
      "Chaque filiere garde sa propre tonalite visuelle, ce qui donne au produit plus de rythme et plus de personnalite.",
    programs: "programmes",
  },
  why: {
    eyebrow: "Pourquoi Advancia",
    title: "Assez raffine pour l'image de marque, assez structure pour l'operationnel.",
    description:
      "Chaque section est pensee pour inspirer confiance avec plus de profondeur, de composition et une vraie architecture produit.",
    pillars: [
      {
        title: "Decouverte premium du catalogue",
        description:
          "L'experience publique parait soignee et fiable, avec des signaux de decision clairs au lieu d'un template generique.",
      },
      {
        title: "Visibilite operationnelle elegante",
        description:
          "Les dashboards, compteurs et exports sont organises pour la clarte plutot que pour la surcharge.",
      },
      {
        title: "Intelligence prete pour la suite",
        description:
          "Le chatbot, les paiements et les services de donnees sont deja prepares pour une IA plus riche plus tard.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Temoignages",
    title: "Des resultats de formation qui semblent concrets.",
    description:
      "Des retours provisoires pour l'instant, faciles a remplacer plus tard par vos vraies references clients.",
  },
  cta: {
    eyebrow: "Pret a monter en puissance",
    title: "Integrez votre vrai catalogue dans une plateforme deja prete au lancement.",
    description:
      "La structure est deja la pour le contenu, les inscriptions, les paiements, le reporting et les recommandations guidees.",
    demoAccess: "Demarrer avec les acces demo",
    reviewCatalogue: "Consulter le catalogue",
  },
  catalogue: {
    eyebrow: "Catalogue de formations",
    title: "Parcourez le vrai catalogue Advancia avec de meilleurs filtres et une identite visuelle plus forte.",
    description:
      "Le catalogue public reprend maintenant le calendrier S1 2026 fourni, avec recherche, tri et presentation premium des programmes.",
    searchPlaceholder: "Rechercher par nom, reference, sujet ou resultat",
    allCategories: "Toutes les categories",
    allLevels: "Tous les niveaux",
    allFormats: "Tous les formats",
    sortBy: "Trier par",
    best: "Meilleures formations",
    relevance: "Pertinence",
    nameAz: "Nom A a Z",
    nameZa: "Nom Z a A",
    priceAsc: "Prix croissant",
    priceDesc: "Prix decroissant",
    results: "resultats",
    noResultsTitle: "Aucune formation ne correspond aux filtres actuels.",
    noResultsDescription:
      "Elargissez la recherche ou revenez a toutes les categories et tous les formats.",
  },
  training: {
    viewDetails: "Voir les details",
    outcomes: "Resultats",
    modules: "Modules",
    audienceFit: "Public cible",
    category: "Categorie",
    upcomingSchedules: "Prochaines sessions",
    instructor: "Formateur",
    seatsAvailable: "Places disponibles",
    relatedPrograms: "Programmes associes",
    relatedTitle: "Liees",
    enrollment: "Inscription",
    nextSession: "Debut",
    secureCheckout: "Paiement securise",
    mockProvider: "Pret au paiement",
    invoiceReady: "Facture prete",
    processing: "Traitement...",
    enrollAndPay: "S'inscrire",
    loginToEnroll: "Connexion",
    invoice: "Facture",
  },
  chatbot: {
    title: "Assistant",
    subtitle: "Demandez a Advancia Support.",
    welcome: "Demandez a Advancia Support.",
    suggestions: [
      "Recommande une formation IA courte",
      "Je veux un parcours gestion de projet",
      "Montre-moi les formations Microsoft data",
    ],
    loading: "Recherche...",
    inputPlaceholder: "Demandez a Advancia Support",
    roleAssistant: "assistant",
    roleUser: "vous",
    typing: "ecrit...",
    send: "Envoyer",
    canned: {
      login:
        "Utilisez la page de connexion avec un compte demo ou un compte apprenant. Les roles admin sont rediriges automatiquement vers leurs dashboards.",
      payment:
        "Les inscriptions utilisent aujourd'hui un fournisseur de paiement mock avec statut, numero de facture et historique deja structures pour une vraie integration plus tard.",
      report:
        "Les admins et super admins peuvent exporter des rapports Excel et PDF pour les utilisateurs, les formations, les inscriptions, le chiffre d'affaires et les durees.",
      generic:
        "D'apres votre contexte, je vous conseille de regarder d'abord les formations recommandees ci-dessous. Elles correspondent le mieux a vos centres d'interet, a vos inscriptions recentes ou au sujet mentionne.",
    },
    bots: {
      alexa: {
        name: "Advancia Support",
        role: "Guide de formation",
        bubble:
          "Salut ! Je suis Advancia Support. Dis-moi ton objectif et je te conseille la meilleure formation.",
        suggestions: [
          "Recommande une formation cybersecurite",
          "Je veux un parcours certification cloud",
          "Montre-moi les formations IA debutant",
        ],
      },
      alex: {
        name: "Alex",
        role: "Copilote analytics",
        bubble:
          "Salut, je suis Alex. Pose-moi des questions sur les utilisateurs inactifs, les formations populaires, l'activite et les signaux de la plateforme.",
        suggestions: [
          "Utilisateurs inactifs ce mois-ci",
          "Quelle formation est la plus populaire",
          "Qui sont les utilisateurs les plus actifs",
        ],
        fallback:
          "Alex peut resumer les donnees plateforme, les utilisateurs inactifs, la popularite des formations et l'activite recente.",
      },
    },
  },
  auth: {
    backHome: "Accueil",
    layoutTitle: "Votre acces joyeux aux formations premium. ✨",
    layoutBody:
      "Des espaces de travail conviviaux pour super admins, admins et apprenants — pour rendre chaque journee un peu plus lumineuse. 🌈",
    loginEyebrow: "Connexion",
    loginTitle: "Bon retour",
    loginSubtitle: "Ravis de vous revoir — on vous reconnecte ! 💖",
    loginEmail: "Email",
    loginEmailPlaceholder: "vous@entreprise.com",
    loginPassword: "Mot de passe",
    loginPasswordPlaceholder: "********",
    loginButton: "Se connecter",
    loginPending: "Connexion...",
    loginNoAccount: "Nouveau ici ?",
    loginCreateAccount: "Creer un compte",
    registerEyebrow: "Inscription",
    registerTitle: "Rejoindre Advancia",
    registerFullName: "Nom complet",
    registerFullNamePlaceholder: "Votre nom complet",
    registerEmail: "Email",
    registerEmailPlaceholder: "vous@exemple.com",
    registerPhone: "Numero de telephone",
    registerPhonePlaceholder: "Votre numero de telephone",
    registerCompany: "Entreprise",
    registerCompanyPlaceholder: "Votre entreprise",
    registerDepartment: "Departement",
    registerDepartmentPlaceholder: "Votre departement",
    registerPassword: "Mot de passe",
    registerPasswordPlaceholder: "Choisissez un mot de passe solide",
    registerSubmit: "Creer le compte",
    registerPending: "Creation en cours...",
    registerHasAccount: "Deja inscrit ?",
    registerLogin: "Se connecter",
    registerErrorGeneric: "Inscription echouee. Veuillez reessayer.",
    registerErrorNetwork:
      "Inscription echouee. Verifiez votre connexion et reessayez.",
    registerAge: "Age",
    registerAgePlaceholder: "Votre age",
    registerSex: "Sexe",
    registerSexFemale: "Femme",
    registerSexMale: "Homme",
    registerSexOther: "Autre",
    registerAvatar: "Choisis ton avatar",
    registerAvatarHint: "Choisis le compagnon qui te suivra sur toute la plateforme.",
  },
  userDashboard: {
    workspace: "Espace apprenant",
    welcomeBack: "Bon retour",
    intro: "Suis ton profil, tes sessions, tes notifications et les prochaines formations recommandees.",
    accountStatus: "Statut du compte",
    currentTraining: "Formation actuelle",
    profileComplete: "Profil complet",
    notSet: "Non defini",
    profileOverview: "Apercu du profil",
    email: "Email",
    funnyAvatar: "Avatar fun",
    startDate: "Date de debut",
    endDate: "Date de fin",
    completeness: "Completude",
    openProfileSettings: "Ouvrir les reglages du profil",
    myTrainings: "Mes formations",
    myTrainingsHint: "Sessions actives et recentes liees a ton compte.",
    noEnrollments: "Aucune inscription pour le moment.",
    nextSession: "Prochaine session",
    progress: "progression",
    activityHint: "Tes connexions, mises a jour de profil et inscriptions recentes.",
    notificationsHint: "Mises a jour d'inscription et alertes du compte.",
  },
  profilePage: {
    greeting: "Salut",
    personalInfo: "Infos personnelles",
    quickActions: "Actions rapides",
    settings: "Reglages",
    completeness: "Profil complet",
    activity: "Activite",
    notifications: "Notifications",
    currentTraining: "Formation actuelle",
    startDate: "Debut",
    endDate: "Fin",
    browseTrainings: "Parcourir les formations",
    myTrainings: "Mes formations",
    paymentHistory: "Historique des paiements",
    noTrainings: "Aucune formation pour le moment.",
    noPayments: "Aucun paiement pour le moment.",
    nextSession: "Prochaine session",
    paidOn: "Paye le",
    invoice: "Facture",
    paymentMethod: "Mode",
    logout: "Se deconnecter",
    company: "Entreprise",
    department: "Departement",
    notSet: "Non defini",
    notificationsHint: "Mises a jour de compte, d'inscription et de formation.",
    activityHint: "Tes connexions, mises a jour et inscriptions recentes.",
  },
  quickActions: {
    title: "Actions rapides",
    hint: "Tes raccourcis vers ce que tu fais le plus.",
    browseLabel: "Parcourir les formations",
    browseHint: "Explore le catalogue",
    enrollLabel: "S'inscrire a une formation",
    enrollHint: "Choisis ta prochaine session",
    calendarLabel: "Ouvrir le calendrier",
    calendarHint: "Voir les prochaines dates",
    editLabel: "Modifier le profil",
    editHint: "Mets a jour tes reglages",
  },
  sidebar: {
    superAdmin: {
      executive: "Vue executive",
      users: "Gestion des utilisateurs",
      management: "Gestion des comptes",
      trainings: "Pilotage des formations",
      importExport: "Import & export",
      insights: "Insights intelligents",
      profile: "Mon profil",
    },
    admin: {
      dashboard: "Tableau de bord",
      users: "Gestion des utilisateurs",
      importExport: "Import & export",
      stats: "Statistiques",
      notifications: "Notifications",
      profile: "Mon profil",
    },
    user: {
      dashboard: "Tableau de bord",
      profile: "Mon profil",
      browse: "Parcourir les formations",
      calendar: "Calendrier",
    },
    brandNoteEyebrow: "Note de marque",
    brandNoteBody: "Propre. Aux couleurs. Clair.",
  },
  dashboardHeader: {
    workspace: "Espace Advancia",
    searchPlaceholder: "Rechercher rapports, utilisateurs, formations...",
    logout: "Se deconnecter",
  },
  notificationBell: {
    label: "Ouvrir les notifications",
    title: "Notifications",
    markAllRead: "Tout marquer comme lu",
    empty: "Aucune notification.",
    allCaughtUp: "Tout est a jour",
    unreadCount: "{count} non lues",
  },
  common: {
    send: "Envoyer",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    loading: "Chargement...",
  },
  enrollment: {
    requestButton: "Demander l'inscription",
    requestPending: "Envoi...",
    requestSubmitted: "Demande envoyee",
    requestSubmittedDescription:
      "Votre demande a ete envoyee. Un super admin la consultera bientot.",
    alreadyEnrolled: "Vous etes deja inscrit.",
    alreadyRequested: "Votre demande est en cours d'examen.",
    loginRequired: "Connectez-vous pour demander cette formation.",
    queueTitle: "Demandes d'inscription",
    queueDescription: "Demandes en attente de votre decision.",
    queueEmpty: "Aucune demande en attente.",
    statusPending: "En attente",
    statusAccepted: "Acceptee",
    statusRejected: "Refusee",
    accept: "Accepter",
    reject: "Refuser",
    delete: "Supprimer",
    rejectReasonPlaceholder: "Motif optionnel (visible par l'apprenant)",
    requestedAt: "Demandee le",
    decidedAt: "Decidee le",
    learner: "Apprenant",
    training: "Formation",
  },
  emails: {
    enrollmentAccepted: {
      subject: "Votre inscription Advancia est acceptee",
      greeting: "Bonjour {name},",
      intro: "Votre demande d'inscription a ete acceptee. Voici les details de votre formation :",
      trainingLabel: "Formation",
      startsLabel: "Date de debut",
      dayLabel: "Jour",
      placeLabel: "Lieu",
      trainerLabel: "Formateur",
      closing: "Au plaisir de vous accueillir. Pour toute question, repondez simplement a cet email.",
      signature: "L'equipe Advancia",
    },
    enrollmentRejected: {
      subject: "Mise a jour sur votre demande d'inscription Advancia",
      greeting: "Bonjour {name},",
      intro: "Apres examen, votre demande d'inscription pour {training} ne peut pas etre acceptee pour le moment.",
      reasonLabel: "Motif",
      closing: "Vous pouvez consulter d'autres formations ou nous contacter pour etre conseille.",
      signature: "L'equipe Advancia",
    },
  },
  labels: {
    days: "jours",
    hours: "heures",
    programs: "programmes",
    training: "formation",
    levels: {
      Foundation: "Fondamental",
      Intermediate: "Intermediaire",
      Advanced: "Avance",
      Executive: "Executif",
    },
    formats: {
      Virtual: "Distanciel",
      Hybrid: "Hybride",
      "In person": "Presentiel",
    },
    sortName: "Nom",
  },
};

const arMessages: Messages = {
  language: { label: "اللغة", select: "اختر اللغة" },
  header: {
    catalogue: "الكتالوج",
    categories: "الفئات",
    why: "لماذا Advancia",
    allTrainings: "كل الدورات",
    openDashboard: "فتح لوحة التحكم",
    login: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
  },
  footer: {
    description:
      "تساعد Advancia Trainings المؤسسات على تشغيل برامج تعلم احترافية من خلال كتالوج أنيق وتسجيلات آمنة وتحليلات وتقارير وتجهيزات مستقبلية.",
    explore: "استكشاف الكتالوج",
    clientAccess: "دخول العملاء",
    register: "إنشاء حساب",
  },
  home: {
    heroBadge: "تجربة علامة تدريبية سينمائية",
    heroTitle: "منصة تدريب فاخرة تبدو",
    heroHighlight: "مصممة بعناية وحية.",
    heroDescription:
      "تجمع Advancia Trainings بين اكتشاف الكتالوج والتسجيلات الآمنة والتقارير المصقولة ومساحات العمل حسب الدور وحركة ثلاثية الأبعاد خفيفة داخل تجربة علامة واحدة.",
    exploreCatalogue: "استكشف الكتالوج",
    createAccount: "إنشاء حساب",
    findProgram: "اعثر على برنامجك القادم",
    searchPlaceholder: "الذكاء الاصطناعي، القيادة، التحليلات، البنية التحتية...",
    signatureSpotlight: "برنامج مميز",
    liveCatalogue: "الكتالوج المباشر",
    upcomingCohorts: "الدفعات القادمة",
    corporatePartners: "الشركاء المؤسسيون",
    trustedSignal: "إشارة ثقة",
    trustedBody: "اكتشاف واضح وعالي القيمة للكتالوج لقرارات شراء وتعلم أكثر جدية.",
    brandPresence: "حضور العلامة",
    brandPresenceBody:
      "تم ضبط الحركة والعمق والوضوح لتبدو فاخرة من دون ضجيج بصري زائد.",
  },
  featured: {
    eyebrow: "كتالوج مميز",
    title: "كتالوج تدريبي فاخر يدعم قرارات تعلم جادة وواضحة.",
    description:
      "برامج مميزة وتسلسل بصري أقوى وإشارات قيمة أوضح تجعل التجربة أقرب إلى العرض التحريري منها إلى القوالب الجاهزة.",
    price: "السعر",
    duration: "المدة",
    format: "الصيغة",
    viewProgram: "عرض البرنامج",
  },
  categories: {
    eyebrow: "الفئات",
    title: "مجالات مختلفة بمعيار احترافي واحد ومتسق.",
    description:
      "لكل مسار تعليمي نبرة ولمسة خاصة، ما يمنح المنصة إيقاعا أقوى وشخصية أوضح.",
    programs: "برامج",
  },
  why: {
    eyebrow: "لماذا Advancia",
    title: "مصقولة بما يكفي لفريق العلامة، ومنظمة بما يكفي للتشغيل اليومي.",
    description:
      "كل قسم مضبوط ليبعث الثقة: عمق أنعم، وتكوين أغنى، وبنية منتج حقيقية خلف الواجهة.",
    pillars: [
      {
        title: "اكتشاف كتالوج فاخر",
        description:
          "التجربة العامة تبدو مصممة وموثوقة، مع إشارات قرار واضحة بدلا من ازدحام القوالب.",
      },
      {
        title: "رؤية تشغيلية أنيقة",
        description:
          "لوحات التحكم والعدادات وأدوات التقارير مرتبة من أجل الوضوح لا من أجل الكثافة المزعجة.",
      },
      {
        title: "ذكاء جاهز للمستقبل",
        description:
          "توصيات الشات بوت وتجريد الدفع وخدمات البيانات جاهزة لتكامل أعمق مع الذكاء الاصطناعي لاحقا.",
      },
    ],
  },
  testimonials: {
    eyebrow: "آراء العملاء",
    title: "نتائج تدريب تبدو ملموسة وليست مجرد وعود.",
    description:
      "هذه شهادات تجريبية مؤقتة الآن، ويمكن استبدالها لاحقا بسهولة بآراء عملائكم الحقيقية.",
  },
  cta: {
    eyebrow: "جاهز للتوسع",
    title: "أدخل كتالوجك الحقيقي إلى منصة تبدو جاهزة للإطلاق من اليوم.",
    description:
      "البنية جاهزة بالفعل للمحتوى والتسجيلات والمدفوعات والتقارير والتوصيات الموجهة.",
    demoAccess: "ابدأ بحسابات التجربة",
    reviewCatalogue: "مراجعة الكتالوج",
  },
  catalogue: {
    eyebrow: "كتالوج الدورات",
    title: "تصفح كتالوج Advancia الحقيقي مع فلاتر أذكى وهوية بصرية أقوى.",
    description:
      "يعكس الكتالوج العام الآن رزنامة التكوين S1 2026 التي قدمتها، مع بحث وفرز وعرض بصري أكثر تميزا.",
    searchPlaceholder: "ابحث بالعنوان أو الرمز أو الموضوع أو النتائج",
    allCategories: "كل الفئات",
    allLevels: "كل المستويات",
    allFormats: "كل الصيغ",
    sortBy: "الفرز حسب",
    best: "أفضل الدورات",
    relevance: "الأكثر صلة",
    nameAz: "الاسم من أ إلى ي",
    nameZa: "الاسم من ي إلى أ",
    priceAsc: "السعر تصاعديا",
    priceDesc: "السعر تنازليا",
    results: "نتيجة",
    noResultsTitle: "لا توجد دورات تطابق الفلاتر الحالية.",
    noResultsDescription:
      "جرّب توسيع البحث أو العودة إلى كل الفئات وكل الصيغ.",
  },
  training: {
    viewDetails: "عرض التفاصيل",
    outcomes: "النتائج",
    modules: "المحاور",
    audienceFit: "الفئة المناسبة",
    category: "الفئة",
    upcomingSchedules: "الجلسات القادمة",
    instructor: "المدرب",
    seatsAvailable: "المقاعد المتاحة",
    relatedPrograms: "برامج مرتبطة",
    relatedTitle: "اكتشف مسارات تعلم قريبة",
    enrollment: "التسجيل",
    nextSession: "تنطلق الجلسة القادمة في",
    secureCheckout: "دفع آمن قائم على الجلسات",
    mockProvider: "تجريد لمزود دفع تجريبي جاهز لربطه لاحقا بمزود فعلي",
    invoiceReady: "الفواتير وسجل المدفوعات جاهزان تلقائيا",
    processing: "جار المعالجة...",
    enrollAndPay: "سجل وادفع",
    loginToEnroll: "سجل الدخول للتسجيل",
    invoice: "فاتورة",
  },
  chatbot: {
    title: "المساعد",
    subtitle: "اسأل Advancia Support.",
    welcome: "اسأل Advancia Support.",
    suggestions: [
      "اقترح دورة قصيرة في الذكاء الاصطناعي",
      "أريد مسارا في إدارة المشاريع",
      "اعرض لي دورات Microsoft للبيانات",
    ],
    loading: "أفكر...",
    inputPlaceholder: "اسأل Advancia Support",
    roleAssistant: "المساعد",
    roleUser: "أنت",
    typing: "يكتب الآن...",
    send: "إرسال",
    canned: {
      login:
        "استخدم صفحة تسجيل الدخول بحساب تجريبي مزروع مسبقا أو بحساب متعلم مسجل. أدوار الإدارة يتم توجيهها تلقائيا إلى لوحاتها المناسبة.",
      payment:
        "تستخدم التسجيلات حاليا طبقة دفع تجريبية مع حالة الدفع ورقم الفاتورة وسجل الإيصالات، وهي جاهزة للربط لاحقا ببوابة دفع حقيقية.",
      report:
        "يمكن للمشرفين والمشرفين العامين تصدير تقارير Excel وPDF للمستخدمين والدورات والتسجيلات والإيرادات وتحليلات المدد.",
      generic:
        "بناء على سياقك، أنصحك بالتركيز أولا على الدورات المقترحة أدناه لأنها الأقرب لاهتماماتك وتسجيلاتك الأخيرة أو للموضوع الذي ذكرته.",
    },
    bots: {
      alexa: {
        name: "Advancia Support",
        role: "مرشدة الدورات",
        bubble:
          "مرحبا! أنا Advancia Support. أخبرني بهدفك وسأقترح لك أفضل مسار تدريبي.",
        suggestions: [
          "اقترح دورة في الأمن السيبراني",
          "أريد مسار شهادة سحابية",
          "اعرض دورات الذكاء الاصطناعي للمبتدئين",
        ],
      },
      alex: {
        name: "أليكس",
        role: "مساعد التحليلات",
        bubble:
          "مرحبا، أنا أليكس. اسألني عن المستخدمين غير النشطين والدورات الأكثر طلبا وأنماط النشاط على المنصة.",
        suggestions: [
          "المستخدمون غير النشطين هذا الشهر",
          "ما هي الدورة الأكثر طلبا",
          "من هم المستخدمون الأكثر نشاطا",
        ],
        fallback:
          "يستطيع أليكس تلخيص بيانات المنصة والمستخدمين غير النشطين وشعبية الدورات والنشاط الأخير.",
      },
    },
  },
  auth: {
    backHome: "الرئيسية",
    layoutTitle: "بوابتك المرحة إلى التدريب الفاخر ✨",
    layoutBody:
      "مساحات عمل ودودة للمشرفين العامين والمشرفين والمتعلمين — لجعل كل يوم أكثر إشراقاً 🌈",
    loginEyebrow: "تسجيل الدخول",
    loginTitle: "أهلا بعودتك",
    loginSubtitle: "سعداء بعودتك — لنعدك إلى الداخل ! 💖",
    loginEmail: "البريد الإلكتروني",
    loginEmailPlaceholder: "you@company.com",
    loginPassword: "كلمة المرور",
    loginPasswordPlaceholder: "********",
    loginButton: "تسجيل الدخول",
    loginPending: "جار تسجيل الدخول...",
    loginNoAccount: "جديد هنا ؟",
    loginCreateAccount: "إنشاء حساب",
    registerEyebrow: "إنشاء حساب",
    registerTitle: "انضم إلى Advancia",
    registerFullName: "الاسم الكامل",
    registerFullNamePlaceholder: "اسمك الكامل",
    registerEmail: "البريد الإلكتروني",
    registerEmailPlaceholder: "you@example.com",
    registerPhone: "رقم الهاتف",
    registerPhonePlaceholder: "رقم هاتفك",
    registerCompany: "الشركة",
    registerCompanyPlaceholder: "شركتك",
    registerDepartment: "القسم",
    registerDepartmentPlaceholder: "قسمك",
    registerPassword: "كلمة المرور",
    registerPasswordPlaceholder: "اختر كلمة مرور قوية",
    registerSubmit: "إنشاء الحساب",
    registerPending: "جار الإنشاء...",
    registerHasAccount: "مسجل بالفعل ؟",
    registerLogin: "تسجيل الدخول",
    registerErrorGeneric: "فشل التسجيل. يرجى المحاولة مجددا.",
    registerErrorNetwork:
      "فشل التسجيل. تحقق من اتصالك ثم أعد المحاولة.",
    registerAge: "العمر",
    registerAgePlaceholder: "عمرك",
    registerSex: "الجنس",
    registerSexFemale: "أنثى",
    registerSexMale: "ذكر",
    registerSexOther: "آخر",
    registerAvatar: "اختر صورتك الرمزية",
    registerAvatarHint: "اختر الرفيق الذي سيرافقك في كل أنحاء المنصة.",
  },
  userDashboard: {
    workspace: "مساحة المتعلم",
    welcomeBack: "أهلا بعودتك",
    intro: "تابع ملفك الشخصي وجلساتك وإشعاراتك وأفضل الدورات الموصى بها في مكان واحد.",
    accountStatus: "حالة الحساب",
    currentTraining: "الدورة الحالية",
    profileComplete: "اكتمال الملف",
    notSet: "غير محدد",
    profileOverview: "نظرة على الملف",
    email: "البريد الإلكتروني",
    funnyAvatar: "الصورة الرمزية المرحة",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    completeness: "نسبة الاكتمال",
    openProfileSettings: "فتح إعدادات الملف",
    myTrainings: "دوراتي",
    myTrainingsHint: "الجلسات النشطة والحديثة المرتبطة بحسابك.",
    noEnrollments: "لا توجد تسجيلات بعد.",
    nextSession: "الجلسة القادمة",
    progress: "التقدم",
    activityHint: "آخر تسجيلات الدخول وتحديثات الملف والاشتراكات.",
    notificationsHint: "تحديثات التسجيل وتنبيهات الحساب.",
  },
  profilePage: {
    greeting: "مرحبا",
    personalInfo: "المعلومات الشخصية",
    quickActions: "إجراءات سريعة",
    settings: "الإعدادات",
    completeness: "اكتمال الملف",
    activity: "النشاط",
    notifications: "الإشعارات",
    currentTraining: "الدورة الحالية",
    startDate: "البداية",
    endDate: "النهاية",
    browseTrainings: "تصفح الدورات",
    myTrainings: "دوراتي",
    paymentHistory: "سجل المدفوعات",
    noTrainings: "لا توجد دورات بعد.",
    noPayments: "لا توجد مدفوعات بعد.",
    nextSession: "الجلسة القادمة",
    paidOn: "تم الدفع في",
    invoice: "الفاتورة",
    paymentMethod: "طريقة الدفع",
    logout: "تسجيل الخروج",
    company: "الشركة",
    department: "القسم",
    notSet: "غير محدد",
    notificationsHint: "تحديثات الحساب والتسجيل والدورات.",
    activityHint: "آخر تسجيلات الدخول والتحديثات والاشتراكات.",
  },
  quickActions: {
    title: "إجراءات سريعة",
    hint: "اختصاراتك إلى ما تستخدمه أكثر.",
    browseLabel: "تصفح الدورات",
    browseHint: "استكشف الكتالوج",
    enrollLabel: "سجل في دورة",
    enrollHint: "اختر جلستك القادمة",
    calendarLabel: "افتح التقويم",
    calendarHint: "اعرض المواعيد القادمة",
    editLabel: "تعديل الملف",
    editHint: "حدّث إعداداتك",
  },
  sidebar: {
    superAdmin: {
      executive: "نظرة تنفيذية",
      users: "إدارة المستخدمين",
      management: "إدارة الحسابات",
      trainings: "إدارة الدورات",
      importExport: "استيراد وتصدير",
      insights: "تحليلات ذكية",
      profile: "ملفي الشخصي",
    },
    admin: {
      dashboard: "لوحة التحكم",
      users: "إدارة المستخدمين",
      importExport: "استيراد وتصدير",
      stats: "الإحصائيات",
      notifications: "الإشعارات",
      profile: "ملفي الشخصي",
    },
    user: {
      dashboard: "لوحة التحكم",
      profile: "ملفي الشخصي",
      browse: "تصفح الدورات",
      calendar: "التقويم",
    },
    brandNoteEyebrow: "ملاحظة العلامة",
    brandNoteBody: "نظيف. متناسق. واضح.",
  },
  dashboardHeader: {
    workspace: "مساحة Advancia",
    searchPlaceholder: "ابحث في التقارير والمستخدمين والدورات...",
    logout: "تسجيل الخروج",
  },
  notificationBell: {
    label: "فتح الإشعارات",
    title: "الإشعارات",
    markAllRead: "تحديد الكل كمقروء",
    empty: "لا توجد إشعارات.",
    allCaughtUp: "لا إشعارات جديدة",
    unreadCount: "{count} غير مقروءة",
  },
  common: {
    send: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    close: "إغلاق",
    loading: "جار التحميل...",
  },
  enrollment: {
    requestButton: "طلب التسجيل",
    requestPending: "جار الإرسال...",
    requestSubmitted: "تم إرسال الطلب",
    requestSubmittedDescription:
      "تم إرسال طلبك. سيتم مراجعته من طرف المشرف العام قريبا.",
    alreadyEnrolled: "أنت مسجل بالفعل.",
    alreadyRequested: "طلبك قيد المراجعة.",
    loginRequired: "سجل الدخول لطلب هذه الدورة.",
    queueTitle: "طلبات التسجيل",
    queueDescription: "الطلبات المعلقة في انتظار قرارك.",
    queueEmpty: "لا توجد طلبات معلقة.",
    statusPending: "قيد الانتظار",
    statusAccepted: "مقبولة",
    statusRejected: "مرفوضة",
    accept: "قبول",
    reject: "رفض",
    delete: "حذف",
    rejectReasonPlaceholder: "سبب اختياري (يظهر للمتعلم)",
    requestedAt: "تاريخ الطلب",
    decidedAt: "تاريخ القرار",
    learner: "المتعلم",
    training: "الدورة",
  },
  emails: {
    enrollmentAccepted: {
      subject: "تم قبول تسجيلك في Advancia",
      greeting: "مرحبا {name}،",
      intro: "تم قبول طلب تسجيلك. هذه تفاصيل دورتك :",
      trainingLabel: "الدورة",
      startsLabel: "تاريخ البداية",
      dayLabel: "اليوم",
      placeLabel: "المكان",
      trainerLabel: "المدرب",
      closing: "نتطلع إلى رؤيتك. لأي استفسار، فقط أجب على هذا البريد.",
      signature: "فريق Advancia",
    },
    enrollmentRejected: {
      subject: "تحديث بشأن طلب تسجيلك في Advancia",
      greeting: "مرحبا {name}،",
      intro: "بعد المراجعة، لم نتمكن من قبول طلب تسجيلك في {training} في الوقت الحالي.",
      reasonLabel: "السبب",
      closing: "يمكنك تصفح دورات أخرى أو التواصل معنا للحصول على إرشاد.",
      signature: "فريق Advancia",
    },
  },
  labels: {
    days: "أيام",
    hours: "ساعات",
    programs: "برامج",
    training: "دورة",
    levels: {
      Foundation: "أساسي",
      Intermediate: "متوسط",
      Advanced: "متقدم",
      Executive: "تنفيذي",
    },
    formats: {
      Virtual: "عن بعد",
      Hybrid: "هجين",
      "In person": "حضوري",
    },
    sortName: "الاسم",
  },
};

export const messages: Record<AppLocale, Messages> = {
  en: enMessages,
  fr: frMessages,
  ar: arMessages,
};

export function getMessages(locale: AppLocale) {
  return messages[locale];
}
