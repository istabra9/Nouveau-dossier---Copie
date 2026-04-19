import type { UserRecord } from "@/frontend/types";

export function UsersTable({ rows }: { rows: UserRecord[] }) {
  return (
    <div className="surface-panel overflow-hidden p-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">All users</h3>
        <p className="text-sm text-ink-soft">Roles, company, focus tracks.</p>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-ink-soft">
            <tr>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Department</th>
              <th className="pb-3 font-medium">Focus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-3 font-medium">{row.name}</td>
                <td className="py-3 capitalize">{row.role.replace("_", " ")}</td>
                <td className="py-3 text-ink-soft">{row.company}</td>
                <td className="py-3 text-ink-soft">{row.department}</td>
                <td className="py-3 text-ink-soft">{row.focusTracks.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
