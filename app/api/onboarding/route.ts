import { NextResponse } from "next/server";
import { z } from "zod";

import { SESSION_COOKIE } from "@/backend/auth/constants";
import {
  createSessionToken,
  getCurrentUser,
  getSessionCookieOptions,
  toSessionUser,
} from "@/backend/auth/session";
import {
  createActivityLogRecord,
  updateUserOnboarding,
} from "@/backend/repositories/platform-repository";
import {
  deriveFocusTracksFromOnboarding,
  onboardingCertifications,
  onboardingDomains,
  onboardingSkills,
} from "@/frontend/content/onboarding";

const domainIds = new Set(onboardingDomains.map((item) => item.id));
const skillIds = new Set(onboardingSkills.map((item) => item.id));
const certificationIds = new Set(onboardingCertifications.map((item) => item.id));

const onboardingSchema = z.object({
  domain: z.string().refine((value) => domainIds.has(value), {
    message: "Invalid domain.",
  }),
  managesPeople: z.boolean().nullable(),
  skills: z.array(z.string()).max(8).refine((values) => values.every((value) => skillIds.has(value)), {
    message: "Invalid skills.",
  }),
  certifications: z
    .array(z.string())
    .max(6)
    .refine((values) => values.every((value) => certificationIds.has(value)), {
      message: "Invalid certifications.",
    }),
});

export async function POST(request: Request) {
  const sessionUser = await getCurrentUser();

  if (!sessionUser || sessionUser.role !== "user") {
    return NextResponse.json(
      { message: "Please log in as a learner first." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid onboarding payload." },
      { status: 400 },
    );
  }

  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid onboarding data." },
      { status: 400 },
    );
  }

  const onboarding = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
  };

  const updatedUser = await updateUserOnboarding(sessionUser.id, {
    onboardingCompleted: true,
    onboarding,
    focusTracks: deriveFocusTracksFromOnboarding(onboarding),
  });

  if (!updatedUser) {
    return NextResponse.json(
      { message: "Unable to save your preferences." },
      { status: 404 },
    );
  }

  await createActivityLogRecord({
    userId: sessionUser.id,
    actorName: updatedUser.name,
    actorRole: updatedUser.role,
    action: "onboarding-completed",
    entityType: "user",
    entityId: sessionUser.id,
    message: "Completed onboarding questionnaire.",
    severity: "success",
    createdAt: new Date().toISOString(),
  });

  const response = NextResponse.json({
    ok: true,
    redirectTo: "/dashboard/user",
  });

  response.cookies.set(
    SESSION_COOKIE,
    await createSessionToken(toSessionUser(updatedUser)),
    getSessionCookieOptions(),
  );

  return response;
}
