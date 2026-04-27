import type { Role, UserSex } from "@/frontend/types";

export type AccountRecord = {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  age?: number;
  sex?: UserSex;
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

export type ManagementStats = {
  totals: { users: number; admins: number; accounts: number };
  active: { users: number; admins: number; total: number };
  inactive: { users: number; admins: number; total: number };
};

export type AccountTarget = "user" | "admin";
