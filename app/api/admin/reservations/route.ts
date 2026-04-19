import { NextResponse } from "next/server";

import { getCurrentUser } from "@/backend/auth/session";
import { listEnrollmentRequests } from "@/backend/repositories/enrollment-request-repository";
import {
  findTrainingBySlug,
  findUserById,
} from "@/backend/repositories/platform-repository";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return NextResponse.json(
      { ok: false, message: "Forbidden." },
      { status: 403 },
    );
  }

  const records = await listEnrollmentRequests();

  const enriched = await Promise.all(
    records.map(async (record) => {
      const [requester, training] = await Promise.all([
        findUserById(record.userId),
        findTrainingBySlug(record.trainingSlug),
      ]);
      return {
        ...record,
        userName: requester?.name ?? record.userId,
        userEmail: requester?.email ?? "",
        userAvatar: requester?.funnyAvatar ?? requester?.avatar,
        trainingTitle: training?.title ?? record.trainingSlug,
        trainingStartDate: training?.startDate,
        trainingEndDate: training?.endDate,
      };
    }),
  );

  return NextResponse.json({ ok: true, records: enriched });
}
