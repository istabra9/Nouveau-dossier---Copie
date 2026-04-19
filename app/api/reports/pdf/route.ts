import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import { buildPdfReport } from "@/backend/exports/reporting";

const schema = z.enum([
  "users",
  "trainings",
  "enrollments",
  "revenue",
  "durations",
]);

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const report = schema.parse(new URL(request.url).searchParams.get("report"));
  const pdf = await buildPdfReport(report);

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"advancia-${report}.pdf\"`,
    },
  });
}
