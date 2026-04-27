import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import {
  createActivityLogRecord,
  findUserById,
  updateUserPassword,
} from "@/backend/repositories/platform-repository";

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
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
    return NextResponse.json({ message: "Invalid password payload." }, { status: 400 });
  }

  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid password data." },
      { status: 400 },
    );
  }

  const user = await findUserById(sessionUser.id);
  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  if (!user.passwordHash) {
    return NextResponse.json(
      {
        message:
          "This account currently uses social sign-in only. Add a local password from an account settings flow first.",
      },
      { status: 400 },
    );
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
  }

  const nextHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await updateUserPassword(user.id, nextHash);
  await createActivityLogRecord({
    userId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "change_password",
    entityType: "auth",
    entityId: user.id,
    message: "Changed account password.",
    severity: "success",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
