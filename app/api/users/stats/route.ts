import { NextResponse } from "next/server";

import { requireApiRole } from "@/backend/auth/api";
import { computeUserStats } from "@/backend/services/superadmin";

export async function GET() {
  const auth = await requireApiRole(["admin", "super_admin"]);
  if (auth.response) return auth.response;

  const stats = await computeUserStats();
  return NextResponse.json({ ok: true, stats });
}
