import { promises as fs } from "node:fs";
import path from "node:path";

import { connectToDatabase } from "@/backend/db/connect";
import { GameScoreModel } from "@/backend/models/game-score";

export type GameScoreRecord = {
  id: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  gameType: string;
  score: number;
  moves: number;
  durationSeconds: number;
  playedAt: string;
};

const STORE_FILE = path.join(
  process.cwd(),
  "backend",
  "data",
  "game-scores.json",
);

async function readStore(): Promise<GameScoreRecord[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GameScoreRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeStore(entries: GameScoreRecord[]) {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

function serialise<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function createGameScore(
  input: Omit<GameScoreRecord, "id" | "playedAt"> & { playedAt?: string },
): Promise<GameScoreRecord> {
  const record: GameScoreRecord = {
    id: `gs-${crypto.randomUUID().slice(0, 8)}`,
    playedAt: input.playedAt ?? new Date().toISOString(),
    userId: input.userId,
    userName: input.userName,
    userAvatar: input.userAvatar,
    gameType: input.gameType,
    score: input.score,
    moves: input.moves,
    durationSeconds: input.durationSeconds,
  };

  const connection = await connectToDatabase();
  if (connection) {
    const created = await GameScoreModel.create(record);
    return serialise(created.toObject() as unknown as GameScoreRecord);
  }

  const store = await readStore();
  store.unshift(record);
  await writeStore(store.slice(0, 1000));
  return record;
}

export async function listTopScores(
  limit = 10,
  gameType = "memory-match",
): Promise<GameScoreRecord[]> {
  const connection = await connectToDatabase();
  if (connection) {
    const docs = await GameScoreModel.find({ gameType })
      .sort({ score: -1, durationSeconds: 1 })
      .limit(limit)
      .lean();
    if (docs.length > 0) {
      return serialise(docs as unknown as GameScoreRecord[]);
    }
  }

  const store = await readStore();
  return store
    .filter((item) => item.gameType === gameType)
    .sort((left, right) =>
      right.score === left.score
        ? left.durationSeconds - right.durationSeconds
        : right.score - left.score,
    )
    .slice(0, limit);
}

export async function findUserBestScore(
  userId: string,
  gameType = "memory-match",
): Promise<GameScoreRecord | null> {
  const connection = await connectToDatabase();
  if (connection) {
    const doc = await GameScoreModel.findOne({ userId, gameType })
      .sort({ score: -1 })
      .lean();
    if (doc) {
      return serialise(doc as unknown as GameScoreRecord);
    }
  }

  const store = await readStore();
  return (
    store
      .filter((item) => item.userId === userId && item.gameType === gameType)
      .sort((left, right) => right.score - left.score)[0] ?? null
  );
}
