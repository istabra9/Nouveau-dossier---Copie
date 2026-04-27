import { LoginForm } from "@/frontend/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; oauthError?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoginForm
      next={params.next}
      oauthError={params.oauthError}
    />
  );
}
