import { redirect } from "next/navigation";

import { dashboardHomeByRole } from "@/backend/auth/constants";
import { requireAuthenticatedUser } from "@/backend/auth/guards";
import { findUserById } from "@/backend/repositories/platform-repository";
import { OnboardingForm } from "@/frontend/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const sessionUser = await requireAuthenticatedUser("/onboarding");

  if (sessionUser.role !== "user") {
    redirect(dashboardHomeByRole[sessionUser.role]);
  }

  const user = await findUserById(sessionUser.id);

  if (user?.onboardingCompleted === true) {
    redirect("/dashboard/user");
  }

  return (
    <OnboardingForm
      userName={sessionUser.name}
      initialValue={user?.onboarding}
    />
  );
}
