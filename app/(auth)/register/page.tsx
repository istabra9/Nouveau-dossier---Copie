import { RegisterForm } from "@/frontend/components/auth/register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const params = await searchParams;

  return <RegisterForm oauthError={params.oauthError} />;
}
