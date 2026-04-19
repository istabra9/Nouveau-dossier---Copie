import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/backend/auth/session";
import {
  createGameScore,
  findUserBestScore,
} from "@/backend/repositories/game-score-repository";

const schema = z.object({
  gameType: z.string().default("memory-match"),
  moves: z.number().int().min(1).max(10000),
  durationSeconds: z.number().int().min(1).max(86400),
  guestName: z.string().min(1).max(40).optional(),
});

function computeScore(moves: number, durationSeconds: number) {
  const raw = 1000 - moves * 10 - durationSeconds;
  return Math.max(0, Math.round(raw));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid score payload." },
      { status: 400 },
    );
  }

  const user = await getCurrentUser();
  const userName = user?.name ?? parsed.data.guestName ?? "Guest player";
  const userAvatar = user?.avatar ?? undefined;
  const score = computeScore(parsed.data.moves, parsed.data.durationSeconds);

  const record = await createGameScore({
    userId: user?.id,
    userName,
    userAvatar,
    gameType: parsed.data.gameType,
    score,
    moves: parsed.data.moves,
    durationSeconds: parsed.data.durationSeconds,
  });

  const best = user ? await findUserBestScore(user.id, parsed.data.gameType) : null;

  return NextResponse.json({ ok: true, record, personalBest: best }, { status: 201 });
}
