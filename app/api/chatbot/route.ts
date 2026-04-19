import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import { createChatbotReply } from "@/backend/chatbot/engine";
import { locales } from "@/frontend/i18n/config";
import type { AppLocale } from "@/frontend/types";

const schema = z.object({
  message: z.string().min(2),
  locale: z.enum(locales as [string, ...string[]]).optional(),
  assistant: z.enum(["alexa", "alex"]).optional(),
});

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
  );
  return NextResponse.json(reply);
}
