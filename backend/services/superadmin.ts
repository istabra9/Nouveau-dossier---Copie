import { z } from "zod";

import { getPlatformDataset } from "@/backend/repositories/platform-repository";
import type { Role, UserRecord } from "@/frontend/types";

export type AccountTarget = "user" | "admin";

export type AccountDTO = {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  age?: number;
  sex?: UserRecord["sex"];
  state?: string;
  emailAddress: string;
  phoneNumber?: string;
  isActive: boolean;
  trainingStartDate?: string;
  trainingEndDate?: string;
  role: Role;
  company: string;
  department: string;
  createdAt?: string;
  updatedAt?: string;
};

export function toAccountDTO(user: UserRecord): AccountDTO {
  return {
    id: user.id,
    userId: user.uniqueId,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    sex: user.sex,
    state: user.state,
    emailAddress: user.email,
    phoneNumber: user.phoneNumber,
    isActive: user.status === "active",
    trainingStartDate: user.trainingStartDate,
    trainingEndDate: user.trainingEndDate,
    role: user.role,
    company: user.company,
    department: user.department,
    createdAt: user.joinedAt,
  };
}

export const accountCreateSchema = z
  .object({
    name: z.string().trim().min(2, "Name is required."),
    age: z
      .number({ message: "Age must be numeric." })
      .int("Age must be a whole number.")
      .min(16, "Age must be at least 16.")
      .max(100, "Age must be at most 100."),
    sex: z.enum(["female", "male", "other"], {
      message: "Sex is required.",
    }),
    state: z.string().trim().min(2, "State is required."),
    emailAddress: z.email("Use a valid email address."),
    phoneNumber: z
      .string()
      .trim()
      .min(6, "Phone number is required.")
      .max(24, "Phone number is too long.")
      .regex(/^[+()0-9\s-]+$/, "Use a valid phone number."),
    isActive: z.boolean().default(true),
    trainingStartDate: z
      .string()
      .min(1, "Training start date is required."),
    trainingEndDate: z
      .string()
      .min(1, "Training end date is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    company: z.string().trim().min(2).optional(),
    department: z.string().trim().min(2).optional(),
  })
  .refine(
    (data) =>
      new Date(data.trainingEndDate).getTime() >=
      new Date(data.trainingStartDate).getTime(),
    {
      message: "Training end date must be after the start date.",
      path: ["trainingEndDate"],
    },
  );

export const accountUpdateSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    age: z.number().int().min(16).max(100).optional(),
    sex: z.enum(["female", "male", "other"]).optional(),
    state: z.string().trim().min(2).optional(),
    emailAddress: z.email().optional(),
    phoneNumber: z
      .string()
      .trim()
      .min(6)
      .max(24)
      .regex(/^[+()0-9\s-]+$/, "Use a valid phone number.")
      .optional(),
    isActive: z.boolean().optional(),
    trainingStartDate: z.string().optional(),
    trainingEndDate: z.string().optional(),
    company: z.string().trim().min(2).optional(),
    department: z.string().trim().min(2).optional(),
  })
  .refine(
    (data) => {
      if (data.trainingStartDate && data.trainingEndDate) {
        return (
          new Date(data.trainingEndDate).getTime() >=
          new Date(data.trainingStartDate).getTime()
        );
      }
      return true;
    },
    {
      message: "Training end date must be after the start date.",
      path: ["trainingEndDate"],
    },
  );

export type AccountCreateInput = z.infer<typeof accountCreateSchema>;
export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>;

export function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  };
}

export async function listAccounts(target: AccountTarget) {
  const dataset = await getPlatformDataset();
  const matchRole = target === "admin" ? "admin" : "user";
  return dataset.users
    .filter((user) => user.role === matchRole)
    .map(toAccountDTO);
}

export async function computeUserStats() {
  const dataset = await getPlatformDataset();
  const users = dataset.users.filter((u) => u.role === "user");
  const activeUsers = users.filter((u) => u.status === "active").length;
  return {
    totals: { users: users.length, admins: 0, accounts: users.length },
    active: { users: activeUsers, admins: 0, total: activeUsers },
    inactive: {
      users: users.length - activeUsers,
      admins: 0,
      total: users.length - activeUsers,
    },
  };
}

export async function computeStats() {
  const dataset = await getPlatformDataset();
  const users = dataset.users.filter((u) => u.role === "user");
  const admins = dataset.users.filter((u) => u.role === "admin");
  const activeUsers = users.filter((u) => u.status === "active").length;
  const activeAdmins = admins.filter((u) => u.status === "active").length;
  const inactiveUsers = users.length - activeUsers;
  const inactiveAdmins = admins.length - activeAdmins;

  return {
    totals: {
      users: users.length,
      admins: admins.length,
      accounts: users.length + admins.length,
    },
    active: {
      users: activeUsers,
      admins: activeAdmins,
      total: activeUsers + activeAdmins,
    },
    inactive: {
      users: inactiveUsers,
      admins: inactiveAdmins,
      total: inactiveUsers + inactiveAdmins,
    },
  };
}
