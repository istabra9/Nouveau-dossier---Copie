import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { getCurrentUser } from "@/backend/auth/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

  return NextResponse.json({
    message: "Workbook parsed successfully.",
    sheet: firstSheet,
    rowsImported: rows.length,
    preview: rows.slice(0, 5),
  });
}
