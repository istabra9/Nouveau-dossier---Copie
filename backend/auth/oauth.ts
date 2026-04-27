import type {
  OAuthProvider,
  Role,
  UserOAuthAccount,
  UserRecord,
} from "@/frontend/types";

export type OAuthFlowMode = "login" | "register";

export type OAuthNormalizedProfile = {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  firstName: string;
  lastName: string;
  picture?: string;
};

type OAuthProviderConfig = {
  provider: OAuthProvider;
  label: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
};

export type OAuthCookiePayload = {
  state: string;
  provider: OAuthProvider;
  mode: OAuthFlowMode;
  next?: string;
};

type OAuthTokenResponse = {
  access_token?: string;
};

const providerLabels: Record<OAuthProvider, string> = {
  google: "Google",
  facebook: "Facebook",
  yahoo: "Yahoo",
};

const providerFunnyAvatars: Record<OAuthProvider, string> = {
  google: "Sunny Bunny",
  facebook: "Brave Fox",
  yahoo: "Wise Owl",
};

const supportedOAuthProviders: OAuthProvider[] = ["google", "facebook", "yahoo"];

function splitName(name: string) {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? "Guest",
    lastName: parts.slice(1).join(" ") || parts[0] || "User",
  };
}

function buildAvatar(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function parseOAuthProvider(value: string): OAuthProvider | null {
  return value === "google" || value === "facebook" || value === "yahoo"
    ? value
    : null;
}

export function getConfiguredOAuthProviders() {
  return supportedOAuthProviders.filter((provider) =>
    Boolean(getOAuthProviderConfig(provider)),
  );
}

export function parseOAuthMode(value: string | null): OAuthFlowMode {
  return value === "register" ? "register" : "login";
}

export function sanitizeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return undefined;
  }

  return next;
}

export function getOAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };
}

export function getOAuthProviderLabel(provider: OAuthProvider) {
  return providerLabels[provider];
}

export function getOAuthRedirectUri(provider: OAuthProvider, requestUrl: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(requestUrl).origin;
  return `${baseUrl}/api/auth/oauth/${provider}/callback`;
}

export function getOAuthErrorRedirect(
  requestUrl: string,
  mode: OAuthFlowMode,
  next: string | undefined,
  message: string,
) {
  const destination = new URL(mode === "register" ? "/register" : "/login", requestUrl);
  destination.searchParams.set("oauthError", message);

  if (next) {
    destination.searchParams.set("next", next);
  }

  return destination;
}

export function resolvePostAuthPath(
  user: Pick<UserRecord, "role" | "onboardingCompleted">,
  next?: string,
) {
  if (user.role === "user" && user.onboardingCompleted === false) {
    return "/onboarding";
  }

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  const dashboardByRole: Record<Role, string> = {
    super_admin: "/dashboard/super-admin",
    admin: "/dashboard/admin",
    user: "/dashboard/user",
  };

  return dashboardByRole[user.role];
}

export function getOAuthProviderConfig(
  provider: OAuthProvider,
): OAuthProviderConfig | null {
  const baseConfig = {
    google: {
      label: "Google",
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
      scope: "openid profile email",
    },
    facebook: {
      label: "Facebook",
      clientId: process.env.FACEBOOK_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET ?? "",
      authorizationUrl: "https://www.facebook.com/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/oauth/access_token",
      userInfoUrl: "https://graph.facebook.com/me",
      scope: "email public_profile",
    },
    yahoo: {
      label: "Yahoo",
      clientId: process.env.YAHOO_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.YAHOO_OAUTH_CLIENT_SECRET ?? "",
      authorizationUrl: "https://api.login.yahoo.com/oauth2/request_auth",
      tokenUrl: "https://api.login.yahoo.com/oauth2/get_token",
      userInfoUrl: "https://api.login.yahoo.com/openid/v1/userinfo",
      scope: "openid profile email",
    },
  } satisfies Record<OAuthProvider, Omit<OAuthProviderConfig, "provider">>;

  const config = baseConfig[provider];

  if (!config.clientId || !config.clientSecret) {
    return null;
  }

  return {
    provider,
    ...config,
  };
}

export function buildOAuthAuthorizationUrl(
  config: OAuthProviderConfig,
  redirectUri: string,
  state: string,
) {
  const authorizationUrl = new URL(config.authorizationUrl);

  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", config.scope);
  authorizationUrl.searchParams.set("state", state);

  if (config.provider === "google") {
    authorizationUrl.searchParams.set("prompt", "select_account");
  }

  return authorizationUrl;
}

async function exchangeOAuthCode(
  config: OAuthProviderConfig,
  code: string,
  redirectUri: string,
) {
  if (config.provider === "facebook") {
    const tokenUrl = new URL(config.tokenUrl);
    tokenUrl.searchParams.set("client_id", config.clientId);
    tokenUrl.searchParams.set("client_secret", config.clientSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const response = await fetch(tokenUrl, { method: "GET", cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to exchange the ${config.label} authorization code.`);
    }

    const payload = (await response.json()) as OAuthTokenResponse;

    if (!payload.access_token) {
      throw new Error(`No ${config.label} access token was returned.`);
    }

    return payload.access_token;
  }

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUri);

  if (config.provider === "yahoo") {
    const basicAuth = Buffer.from(
      `${config.clientId}:${config.clientSecret}`,
      "utf-8",
    ).toString("base64");

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Unable to exchange the ${config.label} authorization code.`);
    }

    const payload = (await response.json()) as OAuthTokenResponse;

    if (!payload.access_token) {
      throw new Error(`No ${config.label} access token was returned.`);
    }

    return payload.access_token;
  }

  body.set("client_id", config.clientId);
  body.set("client_secret", config.clientSecret);

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Unable to exchange the ${config.label} authorization code.`);
  }

  const payload = (await response.json()) as OAuthTokenResponse;

  if (!payload.access_token) {
    throw new Error(`No ${config.label} access token was returned.`);
  }

  return payload.access_token;
}

async function fetchOAuthProfile(
  config: OAuthProviderConfig,
  accessToken: string,
): Promise<OAuthNormalizedProfile> {
  if (config.provider === "facebook") {
    const profileUrl = new URL(config.userInfoUrl);
    profileUrl.searchParams.set("fields", "id,name,email,first_name,last_name,picture.type(large)");
    profileUrl.searchParams.set("access_token", accessToken);

    const response = await fetch(profileUrl, { method: "GET", cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to fetch the ${config.label} profile.`);
    }

    const payload = (await response.json()) as {
      id?: string;
      email?: string;
      name?: string;
      first_name?: string;
      last_name?: string;
      picture?: { data?: { url?: string } };
    };

    const email = payload.email?.trim().toLowerCase();

    if (!payload.id || !payload.name || !email) {
      throw new Error(`${config.label} did not return a usable name and email.`);
    }

    const names = splitName(payload.name);

    return {
      provider: config.provider,
      providerAccountId: payload.id,
      email,
      emailVerified: true,
      name: payload.name,
      firstName: payload.first_name ?? names.firstName,
      lastName: payload.last_name ?? names.lastName,
      picture: payload.picture?.data?.url,
    };
  }

  const response = await fetch(config.userInfoUrl, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch the ${config.label} profile.`);
  }

  const payload = (await response.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
  };

  const email = payload.email?.trim().toLowerCase();
  const name = payload.name?.trim();

  if (!payload.sub || !email || !name) {
    throw new Error(`${config.label} did not return a usable name and email.`);
  }

  const names = splitName(name);

  return {
    provider: config.provider,
    providerAccountId: payload.sub,
    email,
    emailVerified: payload.email_verified ?? true,
    name,
    firstName: payload.given_name ?? names.firstName,
    lastName: payload.family_name ?? names.lastName,
    picture: payload.picture,
  };
}

export async function getOAuthProfileFromCode(
  config: OAuthProviderConfig,
  code: string,
  redirectUri: string,
) {
  const accessToken = await exchangeOAuthCode(config, code, redirectUri);
  return fetchOAuthProfile(config, accessToken);
}

export function buildOAuthAccount(
  profile: OAuthNormalizedProfile,
): UserOAuthAccount {
  return {
    provider: profile.provider,
    providerAccountId: profile.providerAccountId,
    email: profile.email,
    linkedAt: new Date().toISOString(),
  };
}

export function buildOAuthUserInput(profile: OAuthNormalizedProfile): Omit<UserRecord, "id"> {
  return {
    name: profile.name,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    uniqueId: `ADV-USR-${Math.floor(Math.random() * 900000 + 100000)}`,
    role: "user",
    department: "General",
    company: "Personal account",
    status: "active",
    emailVerified: profile.emailVerified,
    authProvider: profile.provider,
    oauthAccounts: [buildOAuthAccount(profile)],
    joinedAt: new Date().toISOString().slice(0, 10),
    avatar: buildAvatar(profile.name),
    funnyAvatar: providerFunnyAvatars[profile.provider],
    profilePicture: profile.picture,
    focusTracks: ["business-productivity"],
    enrolledTrainingSlugs: [],
    preferences: {
      language: "en",
      theme: "light",
    },
    onboardingCompleted: false,
    onboarding: {
      domain: "",
      managesPeople: null,
      skills: [],
      certifications: [],
    },
  };
}
