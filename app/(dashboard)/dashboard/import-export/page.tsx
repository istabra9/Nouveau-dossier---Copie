import Link from "next/link";

import { PageIntro } from "@/frontend/components/shared/page-intro";
import { requireRole } from "@/backend/auth/guards";

const exportLinks = [
  { href: "/api/reports/excel?report=users", label: "Export users to Excel" },
  { href: "/api/reports/excel?report=trainings", label: "Export trainings to Excel" },
  {
    href: "/api/reports/excel?report=enrollments",
    label: "Export enrollments to Excel",
  },
  { href: "/api/reports/pdf?report=revenue", label: "Export revenue report to PDF" },
  {
    href: "/api/reports/pdf?report=durations",
    label: "Export duration report to PDF",
  },
];

export default async function ImportExportPage() {
  await requireRole(["admin", "super_admin"], "/dashboard/import-export");

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Import & export"
        title="Excel import, Excel export, and PDF reporting from one control center."
        description="Admins and super admins can load catalogue sheets, export structured reports, and generate presentation-ready PDF snapshots from the same workspace."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="surface-panel p-6">
          <h3 className="text-xl font-semibold">Import training workbook</h3>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Upload an Excel file with training data. The API parses rows and is
            ready to be extended for persistence workflows.
          </p>
          <form
            action="/api/import/trainings"
            method="post"
            encType="multipart/form-data"
            className="mt-6 space-y-4"
          >
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls"
              className="block w-full rounded-[20px] border border-line bg-white/80 px-4 py-4 text-sm"
              required
            />
            <button className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
              Upload workbook
            </button>
          </form>
        </div>
        <div className="surface-panel p-6">
          <h3 className="text-xl font-semibold">Export reports</h3>
          <div className="mt-6 space-y-3">
            {exportLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-[22px] border border-line bg-white/80 px-4 py-4 text-sm font-medium hover:bg-white"
              >
                {link.label}
                <span className="text-brand-600">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
