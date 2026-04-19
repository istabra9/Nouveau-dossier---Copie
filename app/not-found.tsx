import Link from "next/link";

import { Button } from "@/frontend/components/ui/button";

export default function NotFound() {
  return (
    <main className="section-wrap flex min-h-screen items-center justify-center py-12">
      <div className="surface-panel-strong max-w-xl space-y-5 p-10 text-center">
        <div className="stat-chip mx-auto w-fit">Page not found</div>
        <h1 className="text-4xl font-semibold tracking-tight">
          This training route doesn’t exist.
        </h1>
        <p className="text-sm leading-7 text-ink-soft">
          Head back to the Advancia catalogue and continue exploring the platform.
        </p>
        <Link href="/trainings">
          <Button>Back to catalogue</Button>
        </Link>
      </div>
    </main>
  );
}
