import { NextResponse } from "next/server";

import { requireApiRole } from "@/backend/auth/api";
import { computeStats } from "@/backend/services/superadmin";

export async function GET() {
  const auth = await requireApiRole(["super_admin"]);
  if (auth.response) return auth.response;

  const stats = await computeStats();
  return NextResponse.json({ ok: true, stats });
}
