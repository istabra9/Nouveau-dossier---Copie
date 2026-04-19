import { BrandMark } from "@/frontend/components/shared/brand-mark";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),rgba(251,242,243,0.92)_38%,rgba(245,245,244,0.92)_100%)] py-8 sm:py-10">
      <div className="section-wrap space-y-8">
        <div className="flex items-center justify-between gap-4">
          <BrandMark />
        </div>
        {children}
      </div>
    </main>
  );
}
