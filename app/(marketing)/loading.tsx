export default function MarketingLoading() {
  return (
    <div className="section-wrap space-y-8 py-12" aria-hidden="true">
      <div className="space-y-4">
        <div className="h-11 w-40 animate-pulse rounded-full bg-white/75" />
        <div className="h-16 max-w-3xl animate-pulse rounded-[28px] bg-white/75" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-panel h-[340px] animate-pulse rounded-[36px] bg-white/75" />
        <div className="space-y-4">
          <div className="surface-panel h-40 animate-pulse rounded-[32px] bg-white/75" />
          <div className="surface-panel h-40 animate-pulse rounded-[32px] bg-white/75" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="surface-panel h-52 animate-pulse rounded-[30px] bg-white/75"
          />
        ))}
      </div>
    </div>
  );
}
