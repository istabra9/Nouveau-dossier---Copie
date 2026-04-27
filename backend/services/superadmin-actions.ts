import bcrypt from "bcryptjs";

import {
  createActivityLogRecord,
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "@/backend/repositories/platform-repository";
import type { SessionUser } from "@/frontend/types";

import {
  type AccountCreateInput,
  type AccountTarget,
  type AccountUpdateInput,
  splitName,
  toAccountDTO,
} from "./superadmin";

export async function createAccount(
  actor: SessionUser,
  target: AccountTarget,
  input: AccountCreateInput,
) {
  const email = input.emailAddress.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const name = input.name.trim();
  const { firstName, lastName } = splitName(name);
  const createdAt = new Date().toISOString().slice(0, 10);
  const role = target === "admin" ? "admin" : "user";

  const user = await createUser({
    name,
    firstName,
    lastName,
    email,
    phoneNumber: input.phoneNumber.trim(),
    age: input.age,
    sex: input.sex,
    state: input.state.trim(),
    uniqueId: `ADV-${role === "admin" ? "ADM" : "USR"}-${Date.now().toString().slice(-6)}`,
    role,
    department: input.department?.trim() ?? (role === "admin" ? "Operations" : "Learner"),
    company: input.company?.trim() ?? "Advancia Trainings",
    status: input.isActive ? "active" : "pending",
    authProvider: "local",
    joinedAt: createdAt,
    avatar: `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ""}`.toUpperCase(),
    focusTracks: [],
    enrolledTrainingSlugs: [],
    passwordHash: await bcrypt.hash(input.password, 10),
    preferences: { language: "en", theme: "dark" },
    trainingStartDate: input.trainingStartDate,
    trainingEndDate: input.trainingEndDate,
    onboardingCompleted: true,
  });

  await createActivityLogRecord({
    userId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: `${role}-created`,
    entityType: "user",
    entityId: user.id,
    message: `Created ${role} account for ${user.name}.`,
    severity: "success",
    createdAt: new Date().toISOString(),
  });

  return toAccountDTO(user);
}

export async function updateAccount(
  actor: SessionUser,
  target: AccountTarget,
  id: string,
  input: AccountUpdateInput,
) {
  const existing = await findUserById(id);
  if (!existing) {
    throw new Error("Account not found.");
  }

  const expectedRole = target === "admin" ? "admin" : "user";
  if (existing.role !== expectedRole) {
    throw new Error(`This account is not a ${expectedRole}.`);
  }

  if (input.emailAddress && input.emailAddress.toLowerCase() !== existing.email) {
    const duplicate = await findUserByEmail(input.emailAddress.toLowerCase());
    if (duplicate && duplicate.id !== id) {
      throw new Error("An account with this email already exists.");
    }
  }

  const name = input.name?.trim() ?? existing.name;
  const { firstName, lastName } = splitName(name);

  const updated = await updateUserById(id, {
    name,
    firstName,
    lastName,
    email: input.emailAddress?.trim().toLowerCase(),
    phoneNumber: input.phoneNumber?.trim(),
    age: input.age,
    sex: input.sex,
    state: input.state?.trim(),
    department: input.department?.trim(),
    company: input.company?.trim(),
    status:
      input.isActive === undefined
        ? undefined
        : input.isActive
          ? "active"
          : "pending",
    trainingStartDate: input.trainingStartDate,
    trainingEndDate: input.trainingEndDate,
  });

  if (!updated) {
    throw new Error("Unable to update account.");
  }

  await createActivityLogRecord({
    userId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: `${expectedRole}-updated`,
    entityType: "user",
    entityId: id,
    message: `Updated ${expectedRole} ${updated.name}.`,
    severity: "info",
    createdAt: new Date().toISOString(),
  });

  return toAccountDTO(updated);
}

export async function deleteAccount(
  actor: SessionUser,
  target: AccountTarget,
  id: string,
) {
  const existing = await findUserById(id);
  if (!existing) {
    throw new Error("Account not found.");
  }

  if (existing.id === actor.id) {
    throw new Error("You cannot delete your own account.");
  }

  const expectedRole = target === "admin" ? "admin" : "user";
  if (existing.role !== expectedRole) {
    throw new Error(`This account is not a ${expectedRole}.`);
  }

  const deleted = await deleteUserById(id);
  if (!deleted) {
    throw new Error("Unable to delete the account.");
  }

  await createActivityLogRecord({
    userId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: `${expectedRole}-deleted`,
    entityType: "user",
    entityId: id,
    message: `Deleted ${expectedRole} ${existing.name}.`,
    severity: "warning",
    createdAt: new Date().toISOString(),
  });

  return true;
}
