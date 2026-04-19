import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as XLSX from "xlsx";

import { getReportRows } from "@/backend/services/platform";
import type { ReportType } from "@/frontend/types";

export async function buildExcelReport(report: ReportType) {
  const rows = await getReportRows();
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows[report]);
  XLSX.utils.book_append_sheet(workbook, sheet, report);
  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}

export async function buildPdfReport(report: ReportType) {
  const rows = await getReportRows();
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText(`Advancia Trainings • ${report} report`, {
    x: 40,
    y: 555,
    size: 24,
    font: bold,
    color: rgb(0.16, 0.06, 0.09),
  });

  page.drawText(
    "Generated from the local reporting layer. Replace placeholder rows with your real catalogue data later.",
    {
      x: 40,
      y: 530,
      size: 11,
      font,
      color: rgb(0.36, 0.33, 0.35),
    },
  );

  const entries = rows[report].slice(0, 12);
  let y = 500;

  entries.forEach((entry, index) => {
    const text = JSON.stringify(entry);
    page.drawText(`${index + 1}. ${text.slice(0, 120)}`, {
      x: 40,
      y,
      size: 10,
      font,
      color: rgb(0.15, 0.11, 0.12),
    });
    y -= 28;
  });

  return Buffer.from(await pdf.save());
}
