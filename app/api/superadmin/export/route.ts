import { NextResponse } from "next/server";
import { z } from "zod";

import { requireApiRole } from "@/backend/auth/api";
import { buildExcelReport } from "@/backend/exports/reporting";

const schema = z.enum(["users", "admins"]);

export async function GET(request: Request) {
  const auth = await requireApiRole(["super_admin"]);
  if (auth.response) return auth.response;

  const target = schema.safeParse(
    new URL(request.url).searchParams.get("target"),
  );

  if (!target.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid target." },
      { status: 400 },
    );
  }

  const role = target.data === "admins" ? "admin" : "user";
  const workbook = await buildExcelReport("users", { role });

  return new NextResponse(workbook, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="advancia-${target.data}.xlsx"`,
    },
  });
}
