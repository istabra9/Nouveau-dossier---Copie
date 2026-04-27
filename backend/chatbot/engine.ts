import { defaultLocale } from "@/frontend/i18n/config";
import { getMessages } from "@/frontend/i18n/messages";
import { getPlatformDataset } from "@/backend/repositories/platform-repository";
import { buildTrainingRecommendations } from "@/backend/services/platform";
import type {
  ActivityLogRecord,
  AppLocale,
  ChatbotReply,
  PlatformDataset,
  SessionUser,
  Training,
} from "@/frontend/types";

type AssistantId = "alexa" | "alex";
type ChatbotHistoryEntry = {
  role: "assistant" | "user";
  content: string;
};

type OpenAIResponsesPayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type OpenAIInputMessage = {
  type: "message";
  role: "assistant" | "user";
  content: string;
};

const platformResponses = [
  {
    test: /login|sign in|connexion|compte|حساب|دخول|تسجيل/i,
    key: "login" as const,
  },
  {
    test: /payment|invoice|receipt|paiement|facture|دفع|فاتورة/i,
    key: "payment" as const,
  },
  {
    test: /report|export|excel|pdf|rapport|تقرير|تصدير/i,
    key: "report" as const,
  },
];

const localeLabels: Record<AppLocale, string> = {
  en: "English",
  fr: "French",
  ar: "Arabic",
};

const greetingPattern =
  /^(hi|hello|hey|good (morning|afternoon|evening)|salut|bonjour|marhba|salam)\b/i;
const gratitudePattern = /\b(thanks|thank you|merci|shukran)\b/i;
const identityPattern = /\b(who are you|what can you do|help me|help)\b/i;

function buildFallbackAnswer(
  message: string,
  dataset: PlatformDataset,
  assistant: AssistantId,
  recommendations: Training[],
  copy: ReturnType<typeof getMessages>,
) {
  const matchedPlatformAnswer = platformResponses.find((item) =>
    item.test.test(message),
  );
  const normalizedMessage = message.trim().toLowerCase();
  const featuredTrainings = (
    recommendations.length
      ? recommendations
      : [...dataset.trainings]
          .sort((left, right) => right.enrolledUsersCount - left.enrolledUsersCount)
          .slice(0, 3)
  )
    .map((training) => training.title)
    .join(", ");
  let answer =
    matchedPlatformAnswer
      ? copy.chatbot.canned[matchedPlatformAnswer.key]
      : copy.chatbot.canned.generic;

  if (greetingPattern.test(normalizedMessage)) {
    return assistant === "alex"
      ? `${copy.chatbot.bots.alex.name} here. I can help with platform analytics, active users, training popularity, and recent activity.`
      : `${copy.chatbot.bots.alexa.name} here. Tell me what you want to learn, and I can help you find the right Advancia training.`;
  }

  if (gratitudePattern.test(normalizedMessage)) {
    return assistant === "alex"
      ? "Happy to help. If you want, I can also break the analytics down by users, revenue, or trainings."
      : "Happy to help. If you want, I can narrow the recommendation by level, format, certification, or duration.";
  }

  if (identityPattern.test(normalizedMessage)) {
    return assistant === "alex"
      ? "I am Alex, the analytics copilot for Advancia. Ask me about learner activity, revenue, popular trainings, and platform signals."
      : "I am Advancia Support, the training guide for Advancia Trainings. I can chat normally, recommend trainings, and help you explore the catalogue.";
  }

  if (assistant === "alex") {
    const inactiveUsers = dataset.users.filter(
      (entry) => entry.role === "user" && entry.status !== "active",
    );
    const topTraining = [...dataset.trainings].sort(
      (left, right) => right.enrolledUsersCount - left.enrolledUsersCount,
    )[0];
    const activeUsers = dataset.activityLogs
      .filter((entry) => entry.actorRole === "user")
      .slice(0, 3)
      .map((entry) => entry.actorName);
    const paidRevenue = dataset.payments
      .filter((payment) => payment.status === "paid")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const learnerCount = dataset.users.filter((entry) => entry.role === "user").length;

    if (/inactive|inactive users|inactif/i.test(normalizedMessage)) {
      answer = inactiveUsers.length
        ? `Inactive learners this month: ${inactiveUsers.map((entry) => entry.name).join(", ")}.`
        : "No inactive learners detected this month.";
    } else if (/popular|most popular|formation populaire/i.test(normalizedMessage)) {
      answer = topTraining
        ? `Most popular training right now: ${topTraining.title} with ${topTraining.enrolledUsersCount} enrolled learners.`
        : "No training popularity data is available yet.";
    } else if (/active users|most active|utilisateurs actifs/i.test(normalizedMessage)) {
      answer = activeUsers.length
        ? `Most active users in recent logs: ${activeUsers.join(", ")}.`
        : "There are not enough recent activity logs yet.";
    } else if (/revenue|sales|income|earnings|ca\b|chiffre/i.test(normalizedMessage)) {
      answer = `Paid revenue currently tracked in the platform is ${paidRevenue.toLocaleString("en-US")} TND.`;
    } else if (/\bhow many\b|\bcount\b|learners|users|trainees/i.test(normalizedMessage)) {
      answer = `The platform currently tracks ${learnerCount} learners across ${dataset.trainings.length} trainings.`;
    } else {
      answer = `${copy.chatbot.bots.alex.fallback} Right now I can also summarize ${dataset.trainings.length} trainings and ${dataset.activityLogs.length} recent activity records.`;
    }
  }

  if (
    assistant === "alexa" &&
    /training|trainings|course|courses|formation|formations|learn|learning|certificate|certification|program/i.test(
      normalizedMessage,
    )
  ) {
    answer = featuredTrainings
      ? `A strong place to start would be ${featuredTrainings}. I can narrow that down by category, certification, schedule, or level if you want.`
      : copy.chatbot.canned.generic;
  } else if (
    assistant === "alexa" &&
    /category|categories|domain|domains|topic|topics/i.test(normalizedMessage)
  ) {
    answer = `Advancia currently covers ${dataset.categories.map((category) => category.name).slice(0, 6).join(", ")}. Tell me which area you want to grow in and I will point you to the best fit.`;
  } else if (assistant === "alexa" && !matchedPlatformAnswer && featuredTrainings) {
    answer = `I can chat normally and help you explore the platform. Based on what is available right now, I would start with ${featuredTrainings}.`;
  }

  return answer;
}

function extractResponseText(payload: OpenAIResponsesPayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks: string[] = [];

  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string" && content.text.trim()) {
        chunks.push(content.text.trim());
      }
    }
  }

  return chunks.join("\n\n").trim();
}

function buildActivitySummary(dataset: PlatformDataset) {
  const activityByUser = new Map<string, number>();

  for (const entry of dataset.activityLogs) {
    if (entry.actorRole !== "user") {
      continue;
    }

    activityByUser.set(entry.actorName, (activityByUser.get(entry.actorName) ?? 0) + 1);
  }

  return [...activityByUser.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

function sortRecentLogs(activityLogs: ActivityLogRecord[]) {
  return [...activityLogs]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 6)
    .map((entry) => ({
      actorName: entry.actorName,
      actorRole: entry.actorRole,
      action: entry.action,
      message: entry.message,
      createdAt: entry.createdAt,
    }));
}

function summariseTraining(training: Training) {
  return {
    slug: training.slug,
    title: training.title,
    badge: training.badge,
    category: training.categorySlug,
    level: training.level,
    format: training.format,
    durationDays: training.durationDays,
    nextSession: training.nextSession,
    enrolledUsersCount: training.enrolledUsersCount,
    summary: training.summary,
  };
}

function buildAlexaContext(
  dataset: PlatformDataset,
  user: SessionUser | null | undefined,
  recommendations: Training[],
) {
  const catalogueCategories = dataset.categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    trainingCount: dataset.trainings.filter((training) => training.categorySlug === category.slug)
      .length,
  }));
  const spotlightTrainings = (
    recommendations.length
      ? recommendations
      : [...dataset.trainings]
          .sort((left, right) => right.enrolledUsersCount - left.enrolledUsersCount)
          .slice(0, 5)
  ).map(summariseTraining);

  return JSON.stringify(
    {
      viewer: user
        ? {
            id: user.id,
            name: user.name,
            role: user.role,
            company: user.company,
            department: user.department,
            focusTracks: user.focusTracks,
          }
        : {
            role: "guest",
          },
      catalogueCategories,
      spotlightTrainings,
    },
    null,
    2,
  );
}

function buildAlexContext(dataset: PlatformDataset, user: SessionUser | null | undefined) {
  const inactiveLearners = dataset.users
    .filter((entry) => entry.role === "user" && entry.status !== "active")
    .map((entry) => ({
      name: entry.name,
      company: entry.company,
      department: entry.department,
    }));
  const topTrainings = [...dataset.trainings]
    .sort((left, right) => right.enrolledUsersCount - left.enrolledUsersCount)
    .slice(0, 6)
    .map(summariseTraining);
  const paidRevenue = dataset.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return JSON.stringify(
    {
      viewer: user
        ? {
            id: user.id,
            name: user.name,
            role: user.role,
          }
        : {
            role: "unknown",
          },
      stats: {
        learners: dataset.users.filter((entry) => entry.role === "user").length,
        admins: dataset.users.filter((entry) => entry.role !== "user").length,
        trainings: dataset.trainings.length,
        enrollments: dataset.enrollments.length,
        paidRevenue,
      },
      inactiveLearners,
      topTrainings,
      topUsersByActivity: buildActivitySummary(dataset),
      recentActivity: sortRecentLogs(dataset.activityLogs),
    },
    null,
    2,
  );
}

function buildOpenAIInstructions(
  assistant: AssistantId,
  locale: AppLocale,
  dataset: PlatformDataset,
  user: SessionUser | null | undefined,
  recommendations: Training[],
  copy: ReturnType<typeof getMessages>,
) {
  const commonFacts = JSON.stringify(
    {
      loginHelp: copy.chatbot.canned.login,
      paymentHelp: copy.chatbot.canned.payment,
      reportHelp: copy.chatbot.canned.report,
    },
    null,
    2,
  );

  const assistantBrief =
    assistant === "alex"
      ? [
          "You are Alex, the analytics copilot for Advancia Trainings.",
          "Answer with specific facts from the provided analytics context.",
          "Do not invent counts, names, or business performance details.",
          "If the requested metric is not present in the supplied context, say that clearly and offer the closest available signal.",
          "Be conversational and realistic, but stay grounded in the platform data.",
          `Analytics context:\n${buildAlexContext(dataset, user)}`,
        ].join("\n")
      : [
          "You are Advancia Support, the training guide for Advancia Trainings.",
          "Your job is to understand the learner goal and answer naturally, like a helpful real assistant.",
          "Use the supplied catalogue context and recommendations to suggest concrete trainings when relevant.",
          "Mention exact training titles from the supplied data whenever you recommend something.",
          "If the user asks something outside the available catalogue context, be honest and redirect to the closest available trainings.",
          `Training context:\n${buildAlexaContext(dataset, user, recommendations)}`,
        ].join("\n");

  return [
    `Reply in ${localeLabels[locale]}.`,
    "Hold a normal conversation: respond naturally to greetings, follow-up questions, clarifications, and thanks.",
    "Keep answers concise, natural, and human.",
    "When the user asks a follow-up, respect the existing conversation history.",
    "Do not mention that you are using hidden context or internal JSON.",
    "Never invent platform-specific facts, counts, names, schedules, or payments.",
    "If the user asks something unrelated to the available platform context, answer helpfully at a general level and be clear about limits.",
    `Platform facts:\n${commonFacts}`,
    assistantBrief,
  ].join("\n\n");
}

async function createOpenAIAnswer(
  assistant: AssistantId,
  message: string,
  history: ChatbotHistoryEntry[],
  locale: AppLocale,
  dataset: PlatformDataset,
  user: SessionUser | null | undefined,
  recommendations: Training[],
  copy: ReturnType<typeof getMessages>,
) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const input: OpenAIInputMessage[] = [
    ...history.slice(-8).map((entry) => ({
      type: "message" as const,
      role: entry.role,
      content: entry.content,
    })),
    {
      type: "message" as const,
      role: "user",
      content: message,
    },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model: process.env.OPENAI_CHATBOT_MODEL ?? "gpt-5.4-mini",
        store: false,
        input,
        instructions: buildOpenAIInstructions(
          assistant,
          locale,
          dataset,
          user,
          recommendations,
          copy,
        ),
        reasoning: {
          effort: "low",
        },
        max_output_tokens: 420,
        text: {
          verbosity: assistant === "alex" ? "medium" : "low",
        },
      }),
    });

    if (!response.ok) {
      console.error("[chatbot] OpenAI request failed:", await response.text());
      return null;
    }

    const payload = (await response.json()) as OpenAIResponsesPayload;
    return extractResponseText(payload) || null;
  } catch (error) {
    console.error("[chatbot] OpenAI request error:", error);
    return null;
  }
}

export async function createChatbotReply(
  message: string,
  user?: SessionUser | null,
  locale: AppLocale = defaultLocale,
  assistant: AssistantId = "alexa",
  history: ChatbotHistoryEntry[] = [],
) {
  const dataset = await getPlatformDataset();
  const copy = getMessages(locale);
  const recommendations = await buildTrainingRecommendations(
    user ?? undefined,
    message,
  );
  const assistantSuggestions =
    assistant === "alex"
      ? copy.chatbot.bots.alex.suggestions
      : copy.chatbot.bots.alexa.suggestions;
  const answer =
    (await createOpenAIAnswer(
      assistant,
      message,
      history,
      locale,
      dataset,
      user,
      recommendations,
      copy,
    )) ?? buildFallbackAnswer(message, dataset, assistant, recommendations, copy);

  const reply: ChatbotReply = {
    answer,
    suggestions: assistantSuggestions,
    recommendedTrainingSlugs: recommendations.map((training) => training.slug),
  };

  return {
    ...reply,
    trainings: dataset.trainings.filter((training) =>
      reply.recommendedTrainingSlugs.includes(training.slug),
    ),
  };
}
