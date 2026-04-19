import { format, parseISO } from "date-fns";

import { getPlatformDataset } from "@/backend/repositories/platform-repository";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/frontend/utils/format";
import type {
  ActivityItem,
  Category,
  DashboardMetric,
  DistributionPoint,
  PaymentRecord,
  PopularTrainingRow,
  Role,
  SessionUser,
} from "@/frontend/types";

const chartPalette = [
  "#df3648",
  "#f87171",
  "#fb7185",
  "#f6b17f",
  "#91182f",
  "#be223c",
];

function buildMonthlyTrend<T>(
  records: T[],
  getDate: (record: T) => string,
  getValue: (record: T) => number,
) {
  const ordered = [...records].sort((left, right) =>
    getDate(left).localeCompare(getDate(right)),
  );

  const monthMap = new Map<string, number>();

  for (const record of ordered) {
    const label = format(parseISO(getDate(record)), "MMM");
    monthMap.set(label, (monthMap.get(label) ?? 0) + getValue(record));
  }

  return Array.from(monthMap.entries())
    .map(([label, value]) => ({ label, value }))
    .slice(-6);
}

function buildRecentActivity(
  payments: PaymentRecord[],
  enrollments: Awaited<ReturnType<typeof getPlatformDataset>>["enrollments"],
  schedules: Awaited<ReturnType<typeof getPlatformDataset>>["schedules"],
  trainingsBySlug: Record<string, Awaited<ReturnType<typeof getPlatformDataset>>["trainings"][number]>,
) {
  const items: ActivityItem[] = [
    ...payments.map((payment) => ({
      id: payment.id,
      title: `${trainingsBySlug[payment.trainingSlug]?.title ?? "Training"} payment ${
        payment.status === "paid" ? "captured" : "logged"
      }`,
      description: `${formatCurrency(payment.amount)} via ${payment.method}`,
      at: payment.paidAt,
      tone:
        payment.status === "paid"
          ? ("success" as const)
          : ("brand" as const),
    })),
    ...enrollments.map((enrollment) => ({
      id: enrollment.id,
      title: `Enrollment updated for ${
        trainingsBySlug[enrollment.trainingSlug]?.title ?? "training"
      }`,
      description: `${formatPercent(enrollment.progress)} progress • ${enrollment.status.replace("_", " ")}`,
      at: enrollment.startedAt,
      tone:
        enrollment.progress >= 100
          ? ("success" as const)
          : ("neutral" as const),
    })),
    ...schedules.map((schedule) => ({
      id: schedule.id,
      title: `${trainingsBySlug[schedule.trainingSlug]?.title ?? "Training"} scheduled`,
      description: `${schedule.city} • ${format(parseISO(schedule.startDate), "MMM d")}`,
      at: schedule.startDate,
      tone: "brand" as const,
    })),
  ];

  return items
    .sort((left, right) => right.at.localeCompare(left.at))
    .slice(0, 7);
}

function withCategoryCounts(categories: Category[], trainings: Awaited<ReturnType<typeof getPlatformDataset>>["trainings"]) {
  return categories.map((category) => ({
    ...category,
    trainingCount: trainings.filter((training) => training.categorySlug === category.slug)
      .length,
  }));
}

function getCurrentTrainingSummary(
  sessionUserId: string,
  dataset: Awaited<ReturnType<typeof getPlatformDataset>>,
  trainingsBySlug: Record<string, Awaited<ReturnType<typeof getPlatformDataset>>["trainings"][number]>,
) {
  const activeEnrollment = dataset.enrollments
    .filter((enrollment) => enrollment.userId === sessionUserId)
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt))[0];

  if (!activeEnrollment) {
    return {
      currentTrainingName: undefined,
      trainingStartDate: undefined,
      trainingEndDate: undefined,
    };
  }

  const training = trainingsBySlug[activeEnrollment.trainingSlug];
  return {
    currentTrainingName: training?.title ?? activeEnrollment.trainingSlug,
    trainingStartDate: training?.startDate ?? activeEnrollment.startedAt,
    trainingEndDate: training?.endDate,
  };
}

function computeProfileCompleteness(user: Awaited<ReturnType<typeof getPlatformDataset>>["users"][number] | null) {
  if (!user) {
    return 0;
  }

  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.company,
    user.department,
    user.uniqueId,
    user.funnyAvatar,
    user.preferences?.language,
    user.preferences?.theme,
    user.onboarding?.domain,
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}

export async function getLandingPageData() {
  const dataset = await getPlatformDataset();
  const categories = withCategoryCounts(dataset.categories, dataset.trainings);
  const trainingsBySlug = Object.fromEntries(
    dataset.trainings.map((training) => [training.slug, training]),
  );

  return {
    categories,
    catalogueCount: dataset.trainings.length,
    featuredTrainings: dataset.trainings.filter((training) => training.featured).slice(0, 5),
    upcomingSchedules: dataset.schedules
      .map((schedule) => ({
        ...schedule,
        training: trainingsBySlug[schedule.trainingSlug] ?? null,
      }))
      .sort((left, right) => left.startDate.localeCompare(right.startDate))
      .slice(0, 6),
  };
}

export async function getCataloguePageData() {
  const dataset = await getPlatformDataset();
  const categories = withCategoryCounts(dataset.categories, dataset.trainings);

  return {
    categories,
    trainings: dataset.trainings,
  };
}

export async function getCalendarPageData() {
  const dataset = await getPlatformDataset();
  const trainingsBySlug = Object.fromEntries(
    dataset.trainings.map((training) => [training.slug, training]),
  );

  const schedules = dataset.schedules
    .map((schedule) => ({
      ...schedule,
      training: trainingsBySlug[schedule.trainingSlug] ?? null,
    }))
    .sort((left, right) => left.startDate.localeCompare(right.startDate));

  return {
    categories: dataset.categories,
    schedules,
  };
}

export async function getTrainingPageData(slug: string) {
  const dataset = await getPlatformDataset();
  const training = dataset.trainings.find((item) => item.slug === slug) ?? null;

  if (!training) {
    return null;
  }

  const category =
    dataset.categories.find((item) => item.slug === training.categorySlug) ?? null;
  const schedules = dataset.schedules.filter(
    (schedule) => schedule.trainingSlug === training.slug,
  );
  const related = dataset.trainings
    .filter(
      (item) =>
        item.slug !== training.slug && item.categorySlug === training.categorySlug,
    )
    .slice(0, 3);

  return {
    training,
    category,
    schedules,
    related,
  };
}

export async function buildTrainingRecommendations(
  user?: Pick<SessionUser, "focusTracks" | "id"> | null,
  query?: string,
) {
  const dataset = await getPlatformDataset();
  const profileUser = user?.id
    ? dataset.users.find((entry) => entry.id === user.id) ?? null
    : null;
  const normalizedQuery = query?.toLowerCase().trim() ?? "";
  const enrolledTrainingSlugs = new Set(
    dataset.enrollments
      .filter((enrollment) => enrollment.userId === user?.id)
      .map((enrollment) => enrollment.trainingSlug),
  );

  const scored = dataset.trainings
    .filter((training) => !enrolledTrainingSlugs.has(training.slug))
    .map((training) => {
      let score = training.rankingScore + (training.featured ? 6 : 0);

      if (user?.focusTracks.includes(training.categorySlug)) {
        score += 5;
      }

      if (profileUser?.onboarding?.managesPeople && training.categorySlug === "project-governance") {
        score += 4;
      }

      if (
        profileUser?.onboarding?.skills.some((item) =>
          `${training.code} ${training.title} ${training.tags.join(" ")}`.toLowerCase().includes(item.toLowerCase()),
        )
      ) {
        score += 6;
      }

      if (
        profileUser?.onboarding?.certifications.some((item) =>
          `${training.code} ${training.title} ${training.badge}`.toLowerCase().includes(item.toLowerCase()),
        )
      ) {
        score += 7;
      }

      if (
        normalizedQuery &&
        `${training.code} ${training.title} ${training.summary} ${training.tags.join(" ")} ${training.outcomes.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        score += 8;
      }

      if (
        normalizedQuery &&
        training.categorySlug.toLowerCase().includes(normalizedQuery)
      ) {
        score += 4;
      }

      if (
        normalizedQuery &&
        /short|quick|court|rapide|قصير/i.test(normalizedQuery) &&
        training.durationDays <= 2
      ) {
        score += 10;
      }

      if (
        normalizedQuery &&
        /ai|copilot|ia|ذكاء/i.test(normalizedQuery) &&
        training.categorySlug === "ai-copilot"
      ) {
        score += 12;
      }

      if (
        normalizedQuery &&
        /project|pmp|scrum|gestion|مشروع|إدارة/i.test(normalizedQuery) &&
        training.categorySlug === "project-governance"
      ) {
        score += 12;
      }

      if (
        normalizedQuery &&
        /microsoft|azure|power bi|fabric|بيانات/i.test(normalizedQuery) &&
        training.categorySlug === "microsoft-cloud-data"
      ) {
        score += 12;
      }

      return { training, score };
    })
    .sort((left, right) => right.score - left.score);

  return scored.slice(0, 3).map((item) => item.training);
}

function buildMetrics(
  role: Role,
  sessionUserId: string,
  dataset: Awaited<ReturnType<typeof getPlatformDataset>>,
): DashboardMetric[] {
  const totalRevenue = dataset.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const base: DashboardMetric[] = [
    {
      id: "users",
      label: "Total users",
      value: formatCompactNumber(dataset.users.filter((user) => user.role === "user").length),
      change: "+12% this quarter",
      description: "Active learners currently tracked in the platform.",
      tone: "neutral",
    },
    {
      id: "trainings",
      label: "Training catalogue",
      value: formatCompactNumber(dataset.trainings.length),
      change: "6 live categories",
      description: "Signature, operational, and executive programs.",
      tone: "brand",
    },
    {
      id: "enrollments",
      label: "Total enrollments",
      value: formatCompactNumber(dataset.enrollments.length),
      change: "+18% since January",
      description: "Confirmed, active, and completed cohort registrations.",
      tone: "success",
    },
    {
      id: "revenue",
      label: "Paid revenue",
      value: formatCurrency(totalRevenue),
      change: "88% collection rate",
      description: "Captured payments across the active portfolio.",
      tone: "brand",
    },
  ];

  if (role === "super_admin") {
    return [
      {
        id: "admins",
        label: "Admin seats",
        value: formatCompactNumber(
          dataset.users.filter((user) => user.role !== "user").length,
        ),
        change: "2 operational admins",
        description: "Users with elevated reporting or system access.",
        tone: "neutral" as const,
      },
      ...base,
    ];
  }

  if (role === "admin") {
    return base;
  }

  return [
    {
      id: "my-trainings",
      label: "My trainings",
      value: formatCompactNumber(
        dataset.enrollments.filter((enrollment) => enrollment.userId === sessionUserId)
          .length,
      ),
      change: "2 upcoming sessions",
      description: "Program history, active progress, and new recommendations.",
      tone: "brand",
    },
    {
      id: "completion",
      label: "Completion",
      value: formatPercent(87),
      change: "Ahead of cohort average",
      description: "Overall completion rate across your learning path.",
      tone: "success",
    },
    {
      id: "payments",
      label: "Payments tracked",
      value: formatCompactNumber(
        dataset.payments.filter((payment) => payment.userId === sessionUserId).length,
      ),
      change: "All receipts available",
      description: "Invoices, payment confirmations, and history.",
      tone: "neutral",
    },
  ];
}

export async function getDashboardData(sessionUser: SessionUser) {
  const dataset = await getPlatformDataset();
  const currentUser =
    dataset.users.find((entry) => entry.id === sessionUser.id) ?? null;
  const trainingsBySlug = Object.fromEntries(
    dataset.trainings.map((training) => [training.slug, training]),
  );
  const categoriesBySlug = Object.fromEntries(
    dataset.categories.map((category) => [category.slug, category]),
  );

  const revenueTrend = buildMonthlyTrend(
    dataset.payments.filter((payment) => payment.status === "paid"),
    (payment) => payment.paidAt,
    (payment) => payment.amount,
  );

  const enrollmentTrend = buildMonthlyTrend(
    dataset.enrollments,
    (enrollment) => enrollment.startedAt,
    () => 1,
  );

  const userGrowth = buildMonthlyTrend(
    dataset.users.filter((user) => user.role === "user"),
    (user) => user.joinedAt,
    () => 1,
  );

  const categoryDistribution: DistributionPoint[] = dataset.categories.map(
    (category, index) => ({
      name: category.name,
      value: dataset.enrollments.filter(
        (enrollment) =>
          trainingsBySlug[enrollment.trainingSlug]?.categorySlug === category.slug,
      ).length,
      fill: chartPalette[index % chartPalette.length],
    }),
  );

  const durationDistribution: DistributionPoint[] = [
    {
      name: "1-2 days",
      value: dataset.trainings.filter((training) => training.durationDays <= 2).length,
      fill: "#f6b17f",
    },
    {
      name: "3-4 days",
      value: dataset.trainings.filter(
        (training) => training.durationDays >= 3 && training.durationDays <= 4,
      ).length,
      fill: "#df3648",
    },
    {
      name: "5+ days",
      value: dataset.trainings.filter((training) => training.durationDays >= 5).length,
      fill: "#91182f",
    },
  ];

  const popularTrainings: PopularTrainingRow[] = dataset.trainings
    .map((training) => {
      const enrollments = dataset.enrollments.filter(
        (enrollment) => enrollment.trainingSlug === training.slug,
      );
      const revenue = dataset.payments
        .filter(
          (payment) =>
            payment.trainingSlug === training.slug && payment.status === "paid",
        )
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        name: training.title,
        category: categoriesBySlug[training.categorySlug]?.name ?? "Unknown",
        enrollments: enrollments.length,
        revenue,
        duration: training.totalHours,
      };
    })
    .sort((left, right) => right.enrollments - left.enrollments)
    .slice(0, 5);

  const myEnrollments = dataset.enrollments.filter(
    (enrollment) => enrollment.userId === sessionUser.id,
  );
  const myPayments = dataset.payments.filter((payment) => payment.userId === sessionUser.id);
  const myTrainingCards = myEnrollments.map((enrollment) => ({
    ...enrollment,
    training: trainingsBySlug[enrollment.trainingSlug],
  }));
  const recommendations = await buildTrainingRecommendations(sessionUser);
  const relevantNotifications = dataset.notifications
    .filter(
      (notification) =>
        notification.audience === "all" ||
        notification.audience === sessionUser.role ||
        notification.userId === sessionUser.id,
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 6);
  const relevantActivityLogs = dataset.activityLogs
    .filter((item) => item.userId === sessionUser.id || sessionUser.role !== "user")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 10);

  const upcomingSessions = dataset.schedules
    .map((schedule) => ({
      ...schedule,
      training: trainingsBySlug[schedule.trainingSlug],
    }))
    .sort((left, right) => left.startDate.localeCompare(right.startDate))
    .slice(0, 4);
  const topUsersByActivity = Object.entries(
    dataset.activityLogs.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.actorName] = (accumulator[item.actorName] ?? 0) + 1;
      return accumulator;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value, fill: chartPalette[0] }));
  const trainingStatusDistribution: DistributionPoint[] = [
    {
      name: "Upcoming",
      value: dataset.trainings.filter((item) => item.status === "upcoming").length,
      fill: "#f6b17f",
    },
    {
      name: "Ongoing",
      value: dataset.trainings.filter((item) => item.status === "ongoing").length,
      fill: "#3b82f6",
    },
    {
      name: "Completed",
      value: dataset.trainings.filter((item) => item.status === "completed").length,
      fill: "#10b981",
    },
    {
      name: "Delayed",
      value: dataset.trainings.filter((item) => item.status === "delayed").length,
      fill: "#ef4444",
    },
  ];

  return {
    metrics: buildMetrics(sessionUser.role, sessionUser.id, dataset),
    revenueTrend,
    enrollmentTrend,
    userGrowth,
    categoryDistribution,
    durationDistribution,
    popularTrainings,
    recentActivity: buildRecentActivity(
      dataset.payments,
      dataset.enrollments,
      dataset.schedules,
      trainingsBySlug,
    ),
    upcomingSessions,
    myPayments,
    myTrainingCards,
    recommendations,
    currentUser,
    profileCompleteness: computeProfileCompleteness(currentUser),
    ...getCurrentTrainingSummary(sessionUser.id, dataset, trainingsBySlug),
    categories: dataset.categories,
    teamMembers: dataset.users,
    trainings: dataset.trainings,
    notifications: relevantNotifications,
    activityLogs: relevantActivityLogs,
    inactiveUsers: dataset.users.filter((user) => user.role === "user" && user.status !== "active"),
    topUsersByActivity,
    trainingStatusDistribution,
    assistants: {
      user: "Alexa",
      superAdmin: "Alex",
    },
  };
}

export async function getProfilePageData(sessionUser: SessionUser) {
  const dataset = await getPlatformDataset();
  const trainingsBySlug = Object.fromEntries(
    dataset.trainings.map((training) => [training.slug, training]),
  );
  const user =
    dataset.users.find((item) => item.id === sessionUser.id) ?? null;
  const currentTrainingSummary = getCurrentTrainingSummary(
    sessionUser.id,
    dataset,
    trainingsBySlug,
  );

  const myEnrollments = dataset.enrollments
    .filter((enrollment) => enrollment.userId === sessionUser.id)
    .map((enrollment) => ({
      ...enrollment,
      training: trainingsBySlug[enrollment.trainingSlug],
    }))
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt));

  const myPayments = dataset.payments
    .filter((payment) => payment.userId === sessionUser.id)
    .map((payment) => ({
      ...payment,
      training: trainingsBySlug[payment.trainingSlug],
    }))
    .sort((left, right) => right.paidAt.localeCompare(left.paidAt));

  const notifications = dataset.notifications
    .filter(
      (notification) =>
        notification.audience === "all" ||
        notification.audience === "user" ||
        notification.userId === sessionUser.id,
    )
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  const activityLogs = dataset.activityLogs
    .filter((entry) => entry.userId === sessionUser.id || entry.actorName === sessionUser.name)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return {
    user,
    myEnrollments,
    myPayments,
    recommendations: await buildTrainingRecommendations(sessionUser),
    notifications,
    activityLogs,
    profileCompleteness: computeProfileCompleteness(user),
    ...currentTrainingSummary,
  };
}

export async function getReportRows() {
  const dataset = await getPlatformDataset();
  return {
    users: dataset.users,
    trainings: dataset.trainings,
    enrollments: dataset.enrollments,
    revenue: dataset.payments,
    durations: dataset.trainings.map((training) => ({
      training: training.title,
      durationDays: training.durationDays,
      totalHours: training.totalHours,
      format: training.format,
    })),
  };
}
