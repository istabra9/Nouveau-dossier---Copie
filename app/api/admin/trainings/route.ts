import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/backend/auth/api";
import {
  createActivityLogRecord,
  createTrainingRecord,
} from "@/backend/repositories/platform-repository";
import type { TrainingStatus } from "@/frontend/types";

const createTrainingSchema = z.object({
  title: z.string().min(3, "Title is required."),
  code: z.string().min(2, "Code is required."),
  categorySlug: z.string().min(2, "Category is required."),
  trainerName: z.string().min(2, "Trainer name is required."),
  trainerEmail: z.email("Use a valid trainer email."),
  trainerExpertise: z.string().min(2, "Trainer expertise is required."),
  startDate: z.string().min(8, "Start date is required."),
  endDate: z.string().min(8, "End date is required."),
  status: z.enum(["upcoming", "ongoing", "completed", "delayed"]).default("upcoming"),
  durationDays: z.coerce.number().min(1).default(3),
  totalHours: z.coerce.number().min(1).default(18),
  format: z.enum(["Virtual", "Hybrid", "In person"]).default("Hybrid"),
  level: z.enum(["Foundation", "Intermediate", "Advanced", "Executive"]).default("Foundation"),
});

const palettes: Record<TrainingStatus, [string, string, string]> = {
  upcoming: ["#4b0913", "#8e1d32", "#f68b82"],
  ongoing: ["#16202d", "#204a66", "#9bd1ff"],
  completed: ["#1d1022", "#453061", "#c39cff"],
  delayed: ["#4e1e12", "#b34c2d", "#ffd0a5"],
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const auth = await requireApiRole(["super_admin"]);

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

  const parsed = createTrainingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid training data." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const slug = slugify(`${data.code}-${data.title}`);
  let training;

  try {
    training = await createTrainingRecord({
      slug,
      code: data.code.toUpperCase(),
      title: data.title.trim(),
      summary: `${data.level} ${data.categorySlug.replace(/-/g, " ")} track.`,
      description: `${data.title.trim()} led by ${data.trainerName.trim()}.`,
      badge: data.status === "ongoing" ? "Hands-on lab" : "Certification track",
      categorySlug: data.categorySlug,
      level: data.level,
      format: data.format,
      price: 0,
      durationDays: data.durationDays,
      totalHours: data.totalHours,
      seats: 12,
      rating: 4.8,
      rankingScore: 80,
      featured: false,
      accent: palettes[data.status][1],
      coverPalette: palettes[data.status],
      visualFamily: data.categorySlug,
      heroKicker: data.level,
      nextSession: data.startDate,
      imageUrl: undefined,
      trainerName: data.trainerName.trim(),
      trainerEmail: data.trainerEmail.trim().toLowerCase(),
      trainerExpertise: data.trainerExpertise.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      enrolledUsersCount: 0,
      completionRate: 0,
      engagementLevel: "medium",
      tags: [data.categorySlug, data.level.toLowerCase()],
      audience: ["Learners", "Teams"],
      outcomes: ["Structured learning path", "Certification readiness"],
      modules: ["Core concepts", "Guided labs", "Review session"],
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to create training. Check the code and title." },
      { status: 400 },
    );
  }

  await createActivityLogRecord({
    userId: auth.user.id,
    actorName: auth.user.name,
    actorRole: auth.user.role,
    action: "training-created",
    entityType: "training",
    entityId: training.id,
    message: `Created training ${training.title}.`,
    severity: "success",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, training });
}
