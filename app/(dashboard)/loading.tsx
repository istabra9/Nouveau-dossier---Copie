export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="surface-panel h-40 animate-pulse rounded-[32px] bg-white/75" />

      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="surface-panel h-32 animate-pulse rounded-[28px] bg-white/75"
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="space-y-5 lg:col-span-7">
          <div className="surface-panel h-72 animate-pulse rounded-[32px] bg-white/75" />
          <div className="surface-panel h-56 animate-pulse rounded-[32px] bg-white/75" />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div className="surface-panel h-64 animate-pulse rounded-[32px] bg-white/75" />
          <div className="surface-panel h-64 animate-pulse rounded-[32px] bg-white/75" />
        </div>
      </div>
    </div>
  );
}
