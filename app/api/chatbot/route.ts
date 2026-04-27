import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import { createChatbotReply } from "@/backend/chatbot/engine";
import { buildTrainingRecommendations } from "@/backend/services/platform";
import { locales } from "@/frontend/i18n/config";
import type { AppLocale } from "@/frontend/types";

const schema = z.object({
  message: z.string().trim().min(2).max(4000),
  locale: z.enum(locales as [string, ...string[]]).optional(),
  assistant: z.enum(["alexa", "alex"]).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["assistant", "user"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .max(12)
    .optional(),
});

export async function GET(request: Request) {
  const assistant = new URL(request.url).searchParams.get("assistant");

  if (assistant && assistant !== "alexa" && assistant !== "alex") {
    return NextResponse.json(
      { message: "Unsupported assistant." },
      { status: 400 },
    );
  }

  if (assistant === "alex") {
    return NextResponse.json({ trainings: [] });
  }

  const user = await getCurrentUser();
  const trainings = await buildTrainingRecommendations(user ?? undefined);

  return NextResponse.json({ trainings });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please ask a more specific question." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();
  const reply = await createChatbotReply(
    parsed.data.message,
    user,
    parsed.data.locale as AppLocale | undefined,
    parsed.data.assistant,
    parsed.data.history ?? [],
  );
  return NextResponse.json(reply);
}
