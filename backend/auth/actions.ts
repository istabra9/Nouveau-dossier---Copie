"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { AuthActionState } from "@/backend/auth/action-state";

import {
  createActivityLogRecord,
  findUserByEmail,
  updateUserLastLogin,
} from "@/backend/repositories/platform-repository";
import { dashboardHomeByRole } from "./constants";
import { clearSessionCookie, setSessionCookie, toSessionUser } from "./session";

const loginSchema = z.object({
  email: z.email("Use a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  next: z.string().optional(),
});

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error" as const,
      message: parsed.error.issues[0]?.message ?? "Invalid credentials.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      status: "error" as const,
      message: "No account matches this email.",
    };
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!isValid) {
    return {
      status: "error" as const,
      message: "Incorrect email or password.",
    };
  }

  const loginTimestamp = new Date().toISOString();
  await updateUserLastLogin(user.id, loginTimestamp);
  await createActivityLogRecord({
    userId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: "login",
    entityType: "auth",
    entityId: user.id,
    message: "Signed in successfully.",
    severity: "info",
    createdAt: loginTimestamp,
  });

  await setSessionCookie(toSessionUser(user));

  const nextPath = parsed.data.next;
  if (user.role === "user" && user.onboardingCompleted === false) {
    redirect("/onboarding");
  }

  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    redirect(nextPath);
  }

  redirect(dashboardHomeByRole[user.role]);
}
export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
