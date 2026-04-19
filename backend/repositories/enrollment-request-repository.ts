import { promises as fs } from "node:fs";
import path from "node:path";

import { connectToDatabase } from "@/backend/db/connect";
import { EnrollmentRequestModel } from "@/backend/models/enrollment-request";
import type { EnrollmentRequestRecord } from "@/frontend/types";

const STORE_FILE = path.join(
  process.cwd(),
  "backend",
  "data",
  "enrollment-requests.json",
);

async function readStore(): Promise<EnrollmentRequestRecord[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EnrollmentRequestRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeStore(entries: EnrollmentRequestRecord[]) {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function serialise<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function listEnrollmentRequests(): Promise<EnrollmentRequestRecord[]> {
  const connection = await connectToDatabase();

  if (connection) {
    const docs = await EnrollmentRequestModel.find({}).sort({ requestedAt: -1 }).lean();
    if (docs.length > 0) {
      return serialise(docs as unknown as EnrollmentRequestRecord[]);
    }
  }

  return readStore();
}

export async function createEnrollmentRequest(
  input: Omit<EnrollmentRequestRecord, "id" | "status" | "requestedAt"> & {
    status?: EnrollmentRequestRecord["status"];
  },
): Promise<EnrollmentRequestRecord> {
  const record: EnrollmentRequestRecord = {
    id: `req-${crypto.randomUUID().slice(0, 8)}`,
    status: input.status ?? "pending",
    requestedAt: new Date().toISOString(),
    userId: input.userId,
    trainingSlug: input.trainingSlug,
    scheduleId: input.scheduleId,
    reason: input.reason,
  };

  const connection = await connectToDatabase();
  if (connection) {
    const created = await EnrollmentRequestModel.create(record);
    return serialise(created.toObject() as unknown as EnrollmentRequestRecord);
  }

  const store = await readStore();
  store.unshift(record);
  await writeStore(store);
  return record;
}

export async function findEnrollmentRequestById(
  id: string,
): Promise<EnrollmentRequestRecord | null> {
  const connection = await connectToDatabase();
  if (connection) {
    const doc = await EnrollmentRequestModel.findOne({ id }).lean();
    if (doc) {
      return serialise(doc as unknown as EnrollmentRequestRecord);
    }
  }

  const store = await readStore();
  return store.find((entry) => entry.id === id) ?? null;
}

export async function updateEnrollmentRequest(
  id: string,
  patch: Partial<Pick<EnrollmentRequestRecord, "status" | "reason" | "decidedAt" | "decidedBy">>,
): Promise<EnrollmentRequestRecord | null> {
  const connection = await connectToDatabase();
  if (connection) {
    const updated = await EnrollmentRequestModel.findOneAndUpdate(
      { id },
      { $set: patch },
      { new: true },
    ).lean();
    if (updated) {
      return serialise(updated as unknown as EnrollmentRequestRecord);
    }
  }

  const store = await readStore();
  const index = store.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return null;
  }

  const next: EnrollmentRequestRecord = { ...store[index], ...patch };
  store[index] = next;
  await writeStore(store);
  return next;
}

export async function deleteEnrollmentRequest(id: string): Promise<boolean> {
  const connection = await connectToDatabase();
  if (connection) {
    const deleted = await EnrollmentRequestModel.findOneAndDelete({ id }).lean();
    if (deleted) {
      return true;
    }
  }

  const store = await readStore();
  const next = store.filter((entry) => entry.id !== id);
  if (next.length === store.length) {
    return false;
  }
  await writeStore(next);
  return true;
}

export async function findPendingRequestForUserAndTraining(
  userId: string,
  trainingSlug: string,
): Promise<EnrollmentRequestRecord | null> {
  const all = await listEnrollmentRequests();
  return (
    all.find(
      (req) =>
        req.userId === userId &&
        req.trainingSlug === trainingSlug &&
        req.status === "pending",
    ) ?? null
  );
}
