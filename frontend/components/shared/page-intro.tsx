import { Reveal } from "@/frontend/components/shared/reveal";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <Reveal className="space-y-4">
      {eyebrow ? (
        <div className="stat-chip w-fit">{eyebrow}</div>
      ) : null}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-base leading-7 text-ink-soft sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
