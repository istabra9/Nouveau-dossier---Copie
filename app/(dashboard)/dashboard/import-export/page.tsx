import Link from "next/link";

import { requireRole } from "@/backend/auth/guards";
import { PageIntro } from "@/frontend/components/shared/page-intro";

const exportLinks = [
  {
    href: "/api/reports/excel?report=all",
    label: "Export everything to Excel",
    description:
      "One workbook with detailed tables for users, trainings, enrollments, revenue, and durations.",
  },
  {
    href: "/api/reports/pdf?report=all",
    label: "Export everything to PDF",
    description:
      "One readable PDF with structured tables for users, trainings, enrollments, revenue, and durations.",
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
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            One click, one file. The users export now includes IDs, gender,
            post, age, email, phone, training dates, in-training state, active
            state, and extra operational details.
          </p>
          <div className="mt-6 space-y-3">
            {exportLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-line bg-white/80 px-4 py-4 text-sm font-medium hover:bg-white"
              >
                <span>
                  <span className="block">{link.label}</span>
                  <span className="mt-1 block text-xs font-normal text-ink-soft">
                    {link.description}
                  </span>
                </span>
                <span className="shrink-0 text-brand-600">Download</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
