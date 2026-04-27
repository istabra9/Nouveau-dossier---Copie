import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import { buildPdfReport } from "@/backend/exports/reporting";
import type { Role } from "@/frontend/types";

const schema = z.enum([
  "users",
  "trainings",
  "enrollments",
  "revenue",
  "durations",
  "all",
]);

const roleSchema = z.enum(["user", "admin", "super_admin"]);

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const report = schema.safeParse(searchParams.get("report"));

  if (!report.success) {
    return NextResponse.json({ message: "Invalid report type." }, { status: 400 });
  }

  const role = roleSchema.safeParse(searchParams.get("role"));
  const pdf = await buildPdfReport(report.data, {
    role: role.success ? (role.data as Role) : undefined,
  });
  const filenameSuffix = role.success ? `-${role.data}` : "";

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"advancia-${report.data}${filenameSuffix}.pdf\"`,
    },
  });
}
