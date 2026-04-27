import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import {
  getPlatformDataset,
  markNotificationsReadForUser,
} from "@/backend/repositories/platform-repository";
import type { NotificationRecord } from "@/frontend/types";

function isAudienceMatch(notification: NotificationRecord, user: { id: string; role: string }) {
  return (
    notification.audience === "all" ||
    notification.audience === user.role ||
    notification.userId === user.id
  );
}

function isUnreadForUser(notification: NotificationRecord, userId: string) {
  if (notification.readBy?.includes(userId)) {
    return false;
  }

  return notification.status === "unread";
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Authentication required." },
      { status: 401 },
    );
  }

  const dataset = await getPlatformDataset();
  const notifications = dataset.notifications
    .filter((item) => isAudienceMatch(item, user))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 20)
    .map((item) => ({
      ...item,
      unread: isUnreadForUser(item, user.id),
    }));

  const unreadCount = notifications.filter((item) => item.unread).length;

  return NextResponse.json({ ok: true, notifications, unreadCount });
}

const markReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Authentication required." },
      { status: 401 },
    );
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

  const parsed = markReadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const dataset = await getPlatformDataset();
  const visible = dataset.notifications
    .filter((item) => isAudienceMatch(item, user))
    .map((item) => item.id);

  const targetIds = parsed.data.all
    ? visible
    : (parsed.data.ids ?? []).filter((id) => visible.includes(id));

  if (targetIds.length === 0) {
    return NextResponse.json({ ok: true, updated: 0 });
  }

  await markNotificationsReadForUser(user.id, targetIds);

  return NextResponse.json({ ok: true, updated: targetIds.length });
}
