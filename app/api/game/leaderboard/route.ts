import { NextResponse } from "next/server";

import { listTopScores } from "@/backend/repositories/game-score-repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? "10"), 1),
    50,
  );
  const gameType = url.searchParams.get("gameType") ?? "memory-match";

  const records = await listTopScores(limit, gameType);
  return NextResponse.json({ ok: true, records });
}
