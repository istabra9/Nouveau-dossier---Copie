import type { Training } from "@/frontend/types";

type TrainingCoverProps = {
  training: Pick<Training, "title" | "code" | "coverPalette" | "badge" | "nextSession" | "imageUrl">;
  compact?: boolean;
};

export function TrainingCover({ training, compact = false }: TrainingCoverProps) {
  const [base, mid, glow] = training.coverPalette;

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] ${compact ? "h-52" : "h-72"}`}
      style={{
        backgroundImage: training.imageUrl
          ? `linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.15)), url(${training.imageUrl})`
          : `linear-gradient(135deg, ${base} 0%, ${mid} 55%, ${glow} 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-black/12 to-black/38" />

      <div className="absolute inset-0 opacity-75">
        {/* Arc */}
        <div
          className="absolute -left-32 -bottom-20 rotate-6"
          style={{
            width: "220%",
            height: "160%",
            borderRadius: "50%",
            border: "14px solid rgba(255,255,255,0.38)",
          }}
        />
        {/* Dots */}
        {[
          { x: "18%", y: "32%" },
          { x: "44%", y: "18%" },
          { x: "62%", y: "44%" },
          { x: "78%", y: "26%" },
          { x: "52%", y: "68%" },
        ].map((dot, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-white/88"
            style={{
              width: compact ? 12 : 16,
              height: compact ? 12 : 16,
              left: dot.x,
              top: dot.y,
            }}
          />
        ))}
        {/* Accent pill behind dots */}
        <div
          className="absolute right-4 top-4 h-10 w-16 rounded-full bg-white/16 backdrop-blur"
          style={{ border: "1px solid rgba(255,255,255,0.18)" }}
        />
      </div>

      {/* Badge */}
      <div className="absolute left-4 top-4 rounded-full bg-white/18 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_20px_rgba(0,0,0,0.12)] backdrop-blur">
        {training.badge || "Track"}
      </div>

      {/* Dots on pill */}
      <div className="absolute right-4 top-5 flex items-center gap-1">
        {[0.9, 0.55, 0.3].map((opacity, i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-white" style={{ opacity }} />
        ))}
      </div>

      {/* Gradient mask for text readability */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/32 to-transparent p-5 text-white">
        <div className="text-[11px] uppercase tracking-[0.24em] text-white/78">{training.code}</div>
        <div className={`mt-2 font-semibold leading-tight ${compact ? "text-xl" : "text-2xl"}`}>
          {training.title}
        </div>
        {!compact && training.nextSession ? (
          <div className="mt-2 text-sm text-white/78">Next: {training.nextSession}</div>
        ) : null}
      </div>
    </div>
  );
}
