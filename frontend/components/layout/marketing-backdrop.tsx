export function MarketingBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff7f4_0%,#f7f0ed_42%,#f4ece9_100%)]" />
      <div className="absolute top-[-8rem] left-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,164,137,0.28),transparent_62%)] blur-3xl" />
      <div className="absolute right-[-8rem] top-[-2rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(223,54,72,0.18),transparent_62%)] blur-3xl" />
      <div className="absolute bottom-[-10rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,177,127,0.18),transparent_68%)] blur-3xl" />
    </div>
  );
}
