import { formatCurrency } from "@/frontend/utils/format";
import type { PaymentRecord, PopularTrainingRow } from "@/frontend/types";

export function TrainingTable({ rows }: { rows: PopularTrainingRow[] }) {
  return (
    <div className="surface-panel overflow-hidden p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Popular trainings</h3>
        <p className="text-sm text-ink-soft">
          Enrollment demand, category mix, trainer assignment, and duration.
        </p>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-ink-soft">
            <tr>
              <th className="pb-3 font-medium">Training</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Trainer</th>
              <th className="pb-3 font-medium">Enrollments</th>
              <th className="pb-3 font-medium">Hours</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-line">
                <td className="py-4 font-medium">{row.name}</td>
                <td className="py-4 text-ink-soft">{row.category}</td>
                <td className="py-4 text-ink-soft">{row.trainerName}</td>
                <td className="py-4">{row.enrollments}</td>
                <td className="py-4">{row.duration}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PaymentTable({ rows }: { rows: PaymentRecord[] }) {
  return (
    <div className="surface-panel overflow-hidden p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Payment history</h3>
        <p className="text-sm text-ink-soft">
          Mock checkout records, invoices, and receipt statuses.
        </p>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-ink-soft">
            <tr>
              <th className="pb-3 font-medium">Invoice</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Method</th>
              <th className="pb-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-4 font-medium">{row.invoiceNumber}</td>
                <td className="py-4 capitalize">{row.status}</td>
                <td className="py-4 text-ink-soft">{row.method}</td>
                <td className="py-4">{formatCurrency(row.amount, row.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
