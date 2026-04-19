import { defaultLocale } from "@/frontend/i18n/config";
import { getMessages } from "@/frontend/i18n/messages";
import { getPlatformDataset } from "@/backend/repositories/platform-repository";
import { buildTrainingRecommendations } from "@/backend/services/platform";
import type { AppLocale, ChatbotReply, SessionUser } from "@/frontend/types";

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

export async function createChatbotReply(
  message: string,
  user?: SessionUser | null,
  locale: AppLocale = defaultLocale,
  assistant: "alexa" | "alex" = "alexa",
) {
  const dataset = await getPlatformDataset();
  const copy = getMessages(locale);
  const matchedPlatformAnswer = platformResponses.find((item) =>
    item.test.test(message),
  );

  const recommendations = await buildTrainingRecommendations(
    user ?? undefined,
    message,
  );

  const normalizedMessage = message.toLowerCase();
  const assistantSuggestions =
    assistant === "alex"
      ? copy.chatbot.bots.alex.suggestions
      : copy.chatbot.bots.alexa.suggestions;
  let answer =
    matchedPlatformAnswer
      ? copy.chatbot.canned[matchedPlatformAnswer.key]
      : copy.chatbot.canned.generic;

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
    } else {
      answer = copy.chatbot.bots.alex.fallback;
    }
  }

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
