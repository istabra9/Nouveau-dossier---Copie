import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/backend/auth/api";
import {
  createActivityLogRecord,
  createNotificationRecord,
  createUser,
} from "@/backend/repositories/platform-repository";

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.email("Use a valid email address."),
  company: z.string().min(2, "Company is required."),
  department: z.string().min(2, "Department is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["user", "admin"]).optional(),
});

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  };
}

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

  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid user data." },
      { status: 400 },
    );
  }

  const role =
    auth.user.role === "super_admin" ? parsed.data.role ?? "user" : "user";
  const name = parsed.data.name.trim();
  const { firstName, lastName } = splitName(name);
  const createdAt = new Date().toISOString().slice(0, 10);

  let user;

  try {
    user = await createUser({
      name,
      firstName,
      lastName,
      email: parsed.data.email.trim().toLowerCase(),
      uniqueId: `ADV-${Date.now().toString().slice(-8)}`,
      role,
      department: parsed.data.department.trim(),
      company: parsed.data.company.trim(),
      status: "active",
      joinedAt: createdAt,
      avatar: `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ""}`.toUpperCase(),
      funnyAvatar: "Sunny Bunny",
      focusTracks: [],
      enrolledTrainingSlugs: [],
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      preferences: {
        language: "en",
        theme: "light",
      },
      onboardingCompleted: false,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to create user. The email may already exist." },
      { status: 400 },
    );
  }

  await createNotificationRecord({
    title: "Account created",
    message: `${user.name}, your Advancia account is ready.`,
    audience: "user",
    userId: user.id,
    type: "system",
    status: "unread",
    createdAt: new Date().toISOString(),
    link: "/login",
  });

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "user-created",
    entityType: "user",
    entityId: user.id,
    message: `Created ${user.role} account for ${user.name}.`,
    severity: "success",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, user });
}
