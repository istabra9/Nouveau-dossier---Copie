import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE } from "@/backend/auth/constants";
import {
  createSessionToken,
  getSessionCookieOptions,
  toSessionUser,
} from "@/backend/auth/session";
import {
  buildVerificationUrl,
  generateVerificationToken,
} from "@/backend/auth/verification";
import {
  createActivityLogRecord,
  createUser,
  findUserByEmail,
} from "@/backend/repositories/platform-repository";
import {
  getEmailService,
  renderConfirmationEmail,
} from "@/backend/services/email";
import { onboardingDomains } from "@/frontend/content/onboarding";

const registrationDomainIds = new Set(onboardingDomains.map((item) => item.id));
const registrationDomainTracks = new Map(
  onboardingDomains.map((item) => [item.id, item.focusTracks]),
);

const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required."),
  email: z.email("Use a valid email address."),
  phoneNumber: z
    .string()
    .trim()
    .max(24, "Phone number is too long.")
    .regex(/^[+()0-9\s-]+$/, "Use a valid phone number.")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().min(2, "Company is required."),
  department: z.string().trim().min(2, "Department is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  interestDomains: z
    .array(z.string())
    .max(4, "You can choose up to 4 training interests.")
    .refine((values) => values.every((value) => registrationDomainIds.has(value)), {
      message: "Invalid training interests.",
    })
    .optional()
    .default([]),
  age: z.number().int().min(10).max(120).optional(),
  sex: z.enum(["female", "male", "other"]).optional(),
  funnyAvatar: z.string().trim().min(1).max(60).optional(),
  avatarEmoji: z.string().trim().min(1).max(8).optional(),
});

function buildAvatar(name: string) {
  return name
    .split(/\s+/)
    .map((token) => token[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function splitName(name: string) {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return {
    firstName: firstName || "Learner",
    lastName: rest.join(" ") || "User",
  };
}

function inferFocusTracks(department: string) {
  const normalized = department.toLowerCase();

  if (/(security|soc|risk|audit|ssi|cyber)/i.test(normalized)) {
    return ["cyber-security"];
  }

  if (/(data|analytics|bi|power bi|fabric)/i.test(normalized)) {
    return ["microsoft-cloud-data"];
  }

  if (/(infra|cloud|ops|system|network|it)/i.test(normalized)) {
    return ["cloud-infrastructure"];
  }

  if (/(project|pmo|delivery|governance|service)/i.test(normalized)) {
    return ["project-governance"];
  }

  if (/(dev|software|engineering|qa|test|integration)/i.test(normalized)) {
    return ["software-engineering"];
  }

  return ["business-productivity"];
}

function deriveRegisterFocusTracks(interestDomains: string[], department: string) {
  const mapped = new Set<string>();

  for (const domainId of interestDomains) {
    for (const track of registrationDomainTracks.get(domainId) ?? []) {
      mapped.add(track);
    }
  }

  return mapped.size ? Array.from(mapped) : inferFocusTracks(department);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid registration payload." },
      { status: 400 },
    );
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message ?? "Invalid registration data.",
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      { message: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const { firstName, lastName } = splitName(parsed.data.name);
  const verification = generateVerificationToken();
  const createdUser = await createUser({
    name: parsed.data.name,
    firstName,
    lastName,
    email,
    phoneNumber: parsed.data.phoneNumber?.trim() || undefined,
    age: parsed.data.age,
    sex: parsed.data.sex,
    uniqueId: `ADV-USR-${Math.floor(Math.random() * 900000 + 100000)}`,
    role: "user",
    department: parsed.data.department,
    company: parsed.data.company,
    status: "active",
    emailVerified: false,
    verificationTokenHash: verification.hash,
    verificationTokenExpiresAt: verification.expiresAt,
    authProvider: "local",
    joinedAt: new Date().toISOString().slice(0, 10),
    avatar: parsed.data.avatarEmoji ?? buildAvatar(parsed.data.name),
    funnyAvatar: parsed.data.funnyAvatar ?? "Sunny Bunny",
    focusTracks: deriveRegisterFocusTracks(
      parsed.data.interestDomains,
      parsed.data.department,
    ),
    enrolledTrainingSlugs: [],
    passwordHash,
    preferences: { language: "en", theme: "dark" },
    onboardingCompleted: false,
    onboarding: {
      domain: parsed.data.interestDomains[0] ?? "",
      managesPeople: null,
      skills: [],
      certifications: [],
      goals: parsed.data.interestDomains,
    },
  });

  const verifyUrl = buildVerificationUrl(verification.token);
  const confirmation = renderConfirmationEmail({
    to: email,
    userName: firstName,
    verifyUrl,
  });

  void getEmailService()
    .send({
      to: email,
      subject: confirmation.subject,
      body: confirmation.body,
      html: confirmation.html,
      template: "signup-confirmation",
      meta: { userId: createdUser.id },
    })
    .catch((error: unknown) => {
      console.error(
        `[auth:register] failed to send confirmation email to ${email}:`,
        error,
      );
    });

  await createActivityLogRecord({
    userId: createdUser.id,
    actorName: createdUser.name,
    actorRole: "user",
    action: "register",
    entityType: "auth",
    entityId: createdUser.id,
    message: "Created a new learner account.",
    severity: "success",
    createdAt: new Date().toISOString(),
  });

  const response = NextResponse.json({
    redirectTo: "/onboarding",
  });

  response.cookies.set(
    SESSION_COOKIE,
    await createSessionToken(toSessionUser(createdUser)),
    getSessionCookieOptions(),
  );

  return response;
}
