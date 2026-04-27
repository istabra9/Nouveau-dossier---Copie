import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/backend/auth/constants";
import {
  buildOAuthAccount,
  buildOAuthUserInput,
  getOAuthErrorRedirect,
  getOAuthProfileFromCode,
  getOAuthProviderConfig,
  getOAuthRedirectUri,
  resolvePostAuthPath,
  parseOAuthProvider,
  type OAuthCookiePayload,
} from "@/backend/auth/oauth";
import {
  createSessionToken,
  getSessionCookieOptions,
  toSessionUser,
} from "@/backend/auth/session";
import {
  createActivityLogRecord,
  createUser,
  findUserByEmail,
  findUserByOAuthAccount,
  linkOAuthAccountToUser,
  updateUserLastLogin,
} from "@/backend/repositories/platform-repository";

function parseOAuthCookie(rawValue?: string): OAuthCookiePayload | null {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(rawValue, "base64url").toString("utf-8"),
    ) as OAuthCookiePayload;
  } catch {
    return null;
  }
}

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
  const queryError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const oauthCookie = parseOAuthCookie(
    cookieStore.get("advancia_oauth_state")?.value,
  );

  const fallbackMode = oauthCookie?.mode ?? "login";
  const fallbackNext = oauthCookie?.next;

  const errorRedirect = (message: string) => {
    const response = NextResponse.redirect(
      getOAuthErrorRedirect(request.url, fallbackMode, fallbackNext, message),
    );
    response.cookies.delete("advancia_oauth_state");
    return response;
  };

  if (!oauthCookie || oauthCookie.provider !== provider || oauthCookie.state !== state) {
    return errorRedirect("The social sign-in session expired. Please try again.");
  }

  if (queryError) {
    return errorRedirect(
      `The ${provider} sign-in request was not completed.`,
    );
  }

  if (!code) {
    return errorRedirect("No authorization code was returned by the provider.");
  }

  const config = getOAuthProviderConfig(provider);

  if (!config) {
    return errorRedirect("This social provider is not configured yet.");
  }

  try {
    const profile = await getOAuthProfileFromCode(
      config,
      code,
      getOAuthRedirectUri(provider, request.url),
    );
    const linkedAccount = buildOAuthAccount(profile);
    const loginTimestamp = new Date().toISOString();

    let user =
      (await findUserByOAuthAccount(provider, profile.providerAccountId)) ??
      null;

    if (!user) {
      const existingByEmail = await findUserByEmail(profile.email);

      if (existingByEmail) {
        user = await linkOAuthAccountToUser(existingByEmail.id, linkedAccount, {
          authProvider: existingByEmail.authProvider ?? "local",
          emailVerified: profile.emailVerified || existingByEmail.emailVerified,
          profilePicture: profile.picture,
        });
      } else {
        const createdUser = await createUser(buildOAuthUserInput(profile));
        user = createdUser;

        await createActivityLogRecord({
          userId: createdUser.id,
          actorName: createdUser.name,
          actorRole: createdUser.role,
          action: "register-social",
          entityType: "auth",
          entityId: createdUser.id,
          message: `Created an account with ${config.label}.`,
          severity: "success",
          createdAt: loginTimestamp,
        });
      }
    } else {
      const currentUser = user;

      if (
        !currentUser.oauthAccounts?.some(
        (account) =>
          account.provider === linkedAccount.provider &&
          account.providerAccountId === linkedAccount.providerAccountId,
        )
      ) {
        user = await linkOAuthAccountToUser(currentUser.id, linkedAccount, {
          authProvider: currentUser.authProvider ?? "local",
          emailVerified: profile.emailVerified || currentUser.emailVerified,
          profilePicture: profile.picture,
        });
      }
    }

    if (!user) {
      return errorRedirect("We could not complete social sign-in.");
    }

    const resolvedUser = user;

    await updateUserLastLogin(resolvedUser.id, loginTimestamp);
    await createActivityLogRecord({
      userId: resolvedUser.id,
      actorName: resolvedUser.name,
      actorRole: resolvedUser.role,
      action: "login-social",
      entityType: "auth",
      entityId: resolvedUser.id,
      message: `Signed in with ${config.label}.`,
      severity: "info",
      createdAt: loginTimestamp,
    });

    const response = NextResponse.redirect(
      new URL(resolvePostAuthPath(resolvedUser, oauthCookie.next), request.url),
    );
    response.cookies.delete("advancia_oauth_state");
    response.cookies.set(
      SESSION_COOKIE,
      await createSessionToken(toSessionUser(resolvedUser)),
      getSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We could not complete social sign-in.";
    return errorRedirect(message);
  }
}
