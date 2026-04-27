"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";

import { useLocale } from "@/frontend/components/providers/locale-provider";
import { useTheme } from "@/frontend/components/providers/theme-provider";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Select } from "@/frontend/components/ui/select";
import type { AppLocale, ThemePreference, UserRecord } from "@/frontend/types";

const funnyAvatars = [
  "Sunny Bunny",
  "Rocket Fox",
  "Pixel Panda",
  "Mango Cat",
  "Byte Koala",
  "Neon Owl",
] as const;

export function ProfileSettingsForm({
  user,
}: {
  user: UserRecord;
}) {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const { setTheme } = useTheme();
  const [profileState, setProfileState] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    department: user.department,
    age: user.age?.toString() ?? "",
    sex: user.sex ?? "prefer_not_to_say",
    funnyAvatar: user.funnyAvatar ?? funnyAvatars[0],
    profilePicture: user.profilePicture ?? "",
    language: user.preferences?.language ?? locale,
    theme: user.preferences?.theme ?? "dark",
  });
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const initials = useMemo(
    () =>
      `${profileState.firstName.charAt(0)}${profileState.lastName.charAt(0)}`.toUpperCase(),
    [profileState.firstName, profileState.lastName],
  );

  function updateField<Key extends keyof typeof profileState>(
    key: Key,
    value: (typeof profileState)[Key],
  ) {
    setProfileState((current) => ({ ...current, [key]: value }));
  }

  async function handleProfilePicture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("profilePicture", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileMessage(null);
    setIsSavingProfile(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profileState.firstName,
          lastName: profileState.lastName,
          company: profileState.company,
          department: profileState.department,
          age: profileState.age ? Number(profileState.age) : undefined,
          sex: profileState.sex,
          funnyAvatar: profileState.funnyAvatar,
          profilePicture: profileState.profilePicture || undefined,
          preferences: {
            language: profileState.language,
            theme: profileState.theme,
          },
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setProfileMessage(payload.message ?? "Unable to update profile.");
        return;
      }

      setLocale(profileState.language as AppLocale);
      setTheme(profileState.theme as ThemePreference);
      setProfileMessage("Profile updated.");
      startTransition(() => router.refresh());
    } catch {
      setProfileMessage("Unable to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordState.currentPassword,
          newPassword: passwordState.newPassword,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setPasswordMessage(payload.message ?? "Unable to change password.");
        return;
      }

      setPasswordState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage("Password updated.");
    } catch {
      setPasswordMessage("Unable to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="surface-panel space-y-5 p-6">
        <div className="flex items-center gap-4">
          {profileState.profilePicture ? (
            <Image
              src={profileState.profilePicture}
              alt={user.name}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-[28px] object-cover shadow-[0_18px_30px_rgba(62,18,23,0.12)]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#be223c_0%,#ff8f76_100%)] text-2xl font-semibold text-white shadow-[0_18px_30px_rgba(62,18,23,0.18)]">
              {initials}
            </div>
          )}
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.24em] text-ink-soft">
              Avatar
            </div>
            <div className="text-xl font-semibold">{profileState.funnyAvatar}</div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-white/80">
              Upload picture
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicture}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {funnyAvatars.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => updateField("funnyAvatar", avatar)}
              className={`rounded-[20px] border px-4 py-3 text-left text-sm font-medium transition ${
                profileState.funnyAvatar === avatar
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-line bg-white/70 hover:bg-white"
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleProfileSave} className="surface-panel space-y-5 p-6">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Profile settings</h3>
            <p className="text-sm text-ink-soft">Update your info and preferences.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First name</label>
              <Input
                value={profileState.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last name</label>
              <Input
                value={profileState.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                value={profileState.company}
                onChange={(event) => updateField("company", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                value={profileState.department}
                onChange={(event) => updateField("department", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                min={16}
                value={profileState.age}
                onChange={(event) => updateField("age", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sex</label>
              <Select
                value={profileState.sex}
                onChange={(event) => updateField("sex", event.target.value as typeof profileState.sex)}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={profileState.language}
                onChange={(event) =>
                  updateField("language", event.target.value as AppLocale)
                }
              >
                <option value="en">English</option>
                <option value="fr">Francais</option>
                <option value="ar">Arabic</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={profileState.theme}
                onChange={(event) =>
                  updateField("theme", event.target.value as ThemePreference)
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </div>
          </div>

          {profileMessage ? (
            <div className="rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-brand-700">
              {profileMessage}
            </div>
          ) : null}

          <Button type="submit" disabled={isSavingProfile}>
            {isSavingProfile ? "Saving..." : "Save profile"}
          </Button>
        </form>

        <form onSubmit={handlePasswordSave} className="surface-panel space-y-5 p-6">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Password</h3>
            <p className="text-sm text-ink-soft">Keep your account secure.</p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current password</label>
              <Input
                type="password"
                value={passwordState.currentPassword}
                onChange={(event) =>
                  setPasswordState((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New password</label>
              <Input
                type="password"
                value={passwordState.newPassword}
                onChange={(event) =>
                  setPasswordState((current) => ({
                    ...current,
                    newPassword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm password</label>
              <Input
                type="password"
                value={passwordState.confirmPassword}
                onChange={(event) =>
                  setPasswordState((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          {passwordMessage ? (
            <div className="rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-brand-700">
              {passwordMessage}
            </div>
          ) : null}

          <Button type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? "Saving..." : "Change password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
