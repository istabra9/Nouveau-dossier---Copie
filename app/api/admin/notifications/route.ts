import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/backend/auth/api";
import {
  createActivityLogRecord,
  createNotificationRecord,
} from "@/backend/repositories/platform-repository";

const notificationSchema = z.object({
  title: z.string().min(2, "Title is required."),
  message: z.string().min(2, "Message is required."),
  audience: z.enum(["all", "user", "admin", "super_admin"]).default("all"),
  userId: z.string().optional(),
  type: z.enum(["system", "enrollment", "security", "training", "payment"]).default("system"),
  link: z.string().optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiRole(["admin", "super_admin"]);

  if (auth.response) {
    return auth.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const parsed = notificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid notification data." },
      { status: 400 },
    );
  }

  const notification = await createNotificationRecord({
    ...parsed.data,
    status: "unread",
    createdAt: new Date().toISOString(),
  });

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "notification-created",
    entityType: "notification",
    entityId: notification.id,
    message: `Sent notification ${notification.title}.`,
    severity: "info",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, notification });
}
