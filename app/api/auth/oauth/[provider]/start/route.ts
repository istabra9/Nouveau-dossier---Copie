import { NextResponse } from "next/server";

import {
  buildOAuthAuthorizationUrl,
  getOAuthCookieOptions,
  getOAuthErrorRedirect,
  getOAuthProviderConfig,
  getOAuthProviderLabel,
  getOAuthRedirectUri,
  parseOAuthMode,
  parseOAuthProvider,
  sanitizeNextPath,
} from "@/backend/auth/oauth";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider: rawProvider } = await context.params;
  const provider = parseOAuthProvider(rawProvider);

  if (!provider) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requestUrl = new URL(request.url);
  const next = sanitizeNextPath(requestUrl.searchParams.get("next"));
  const mode = parseOAuthMode(requestUrl.searchParams.get("mode"));
  const config = getOAuthProviderConfig(provider);

  if (!config) {
    return NextResponse.redirect(
      getOAuthErrorRedirect(
        request.url,
        mode,
        next,
        `${getOAuthProviderLabel(provider)} sign-in is not configured yet.`,
      ),
    );
  }

  const state = crypto.randomUUID();
  const redirectUri = getOAuthRedirectUri(provider, request.url);
  const authorizationUrl = buildOAuthAuthorizationUrl(config, redirectUri, state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(
    "advancia_oauth_state",
    Buffer.from(
      JSON.stringify({ state, provider, mode, next }),
      "utf-8",
    ).toString("base64url"),
    getOAuthCookieOptions(),
  );

  return response;
}
