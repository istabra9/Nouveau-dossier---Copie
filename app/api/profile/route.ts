import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import {
  createActivityLogRecord,
  updateUserProfile,
} from "@/backend/repositories/platform-repository";

const profileSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  department: z.string().trim().min(2),
  company: z.string().trim().min(2),
  age: z.number().int().min(16).max(90).optional(),
  sex: z.enum(["female", "male", "other", "prefer_not_to_say"]).optional(),
  funnyAvatar: z.string().trim().min(2).optional(),
  profilePicture: z.string().trim().optional(),
  preferences: z
    .object({
      language: z.enum(["en", "fr", "ar"]),
      theme: z.enum(["light", "dark"]),
    })
    .optional(),
});

export async function PATCH(request: Request) {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Please log in first." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid profile payload." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid profile data." },
      { status: 400 },
    );
  }

  const updated = await updateUserProfile(sessionUser.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ message: "Profile not found." }, { status: 404 });
  }

  await createActivityLogRecord({
    userId: updated.id,
    actorName: updated.name,
    actorRole: updated.role,
    action: "profile_update",
    entityType: "user",
    entityId: updated.id,
    message: "Updated profile information and preferences.",
    severity: "info",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, user: updated });
}
