import { NextResponse } from "next/server";

import { requireApiRole } from "@/backend/auth/api";
import { buildExcelReport } from "@/backend/exports/reporting";

export async function GET() {
  const auth = await requireApiRole(["admin", "super_admin"]);
  if (auth.response) return auth.response;

  const workbook = await buildExcelReport("users", { role: "user" });

  return new NextResponse(workbook, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="advancia-users.xlsx"',
    },
  });
}
