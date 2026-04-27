export function MarketingBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--marketing-backdrop-base)" }} />
      <div
        className="absolute top-[-8rem] left-[-6rem] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "var(--marketing-backdrop-orb-one)" }}
      />
      <div
        className="absolute right-[-8rem] top-[-2rem] h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "var(--marketing-backdrop-orb-two)" }}
      />
      <div
        className="absolute bottom-[-10rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--marketing-backdrop-orb-three)" }}
      />
    </div>
  );
}
