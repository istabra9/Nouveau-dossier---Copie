"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Medal, RotateCcw, Sparkles, Trophy } from "lucide-react";

const SYMBOLS = ["JS", "PY", "GO", "TS", "AI", "ML", "UX", "DB"] as const;

type Card = {
  id: number;
  symbol: string;
  matched: boolean;
};

type LeaderboardRecord = {
  id: string;
  userName: string;
  userAvatar?: string;
  score: number;
  moves: number;
  durationSeconds: number;
  playedAt: string;
};

function buildDeck(): Card[] {
  const pairs = SYMBOLS.flatMap((s) => [s, s]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((symbol, id) => ({ id, symbol, matched: false }));
}

export function MemoryGameSection() {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const submittedRef = useRef(false);

  const won = useMemo(() => deck.every((c) => c.matched), [deck]);

  useEffect(() => {
    if (won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [won]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const ca = deck.find((c) => c.id === a);
    const cb = deck.find((c) => c.id === b);
    setMoves((m) => m + 1);
    if (ca && cb && ca.symbol === cb.symbol) {
      setDeck((d) =>
        d.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)),
      );
      setFlipped([]);
    } else {
      const id = setTimeout(() => setFlipped([]), 800);
      return () => clearTimeout(id);
    }
  }, [flipped, deck]);

  async function loadLeaderboard() {
    try {
      const response = await fetch("/api/game/leaderboard?limit=10", {
        cache: "no-store",
      });
      const payload = await response.json();
      setLeaderboard(payload.records ?? []);
    } catch {
      // ignore - leaderboard is best-effort
    }
  }

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (!won || submittedRef.current) return;
    submittedRef.current = true;
    (async () => {
      try {
        const response = await fetch("/api/game/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameType: "memory-match",
            moves,
            durationSeconds: Math.max(1, seconds),
          }),
        });
        const payload = await response.json();
        if (payload.ok && payload.record) {
          setSubmittedScore(payload.record.score);
        }
        await loadLeaderboard();
      } catch {
        // ignore - best-effort
      }
    })();
  }, [won, moves, seconds]);

  function reset() {
    setDeck(buildDeck());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setSubmittedScore(null);
    submittedRef.current = false;
  }

  function onFlip(id: number) {
    if (flipped.length === 2) return;
    if (flipped.includes(id)) return;
    const card = deck.find((c) => c.id === id);
    if (!card || card.matched) return;
    setFlipped((f) => [...f, id]);
  }

  return (
    <section className="section-wrap py-12">
      <div className="rounded-[34px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 sm:p-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              Brain break
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">
              Memory match
            </h2>
            <p className="mt-2 max-w-xl text-slate-600">
              Flip two cards at a time. Match all eight pairs in the fewest moves.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <div>
              Moves <span className="ml-1 text-lg font-semibold text-slate-900">{moves}</span>
            </div>
            <div>
              Time
              <span className="ml-1 text-lg font-semibold text-slate-900">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {won && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">
              You won in {moves} moves and {seconds}s
              {submittedScore !== null ? ` — score ${submittedScore}` : ""}!
            </span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 sm:gap-4">
            {deck.map((card) => {
              const isFlipped = flipped.includes(card.id) || card.matched;
              return (
                <button
                  key={card.id}
                  onClick={() => onFlip(card.id)}
                  aria-label={isFlipped ? card.symbol : "hidden card"}
                  className={`relative aspect-square select-none rounded-2xl text-2xl font-bold transition-all duration-300 sm:text-3xl ${
                    isFlipped
                      ? card.matched
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "bg-brand-500 text-white shadow-lg"
                      : "bg-slate-200 text-transparent hover:bg-slate-300"
                  }`}
                >
                  {isFlipped ? card.symbol : "?"}
                </button>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
              <Medal className="h-4 w-4" />
              Leaderboard
            </div>
            {leaderboard.length === 0 ? (
              <div className="text-sm text-slate-500">
                No scores yet. Play a round to claim the top spot.
              </div>
            ) : (
              <ol className="space-y-2 text-sm">
                {leaderboard.map((record, index) => (
                  <li
                    key={record.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-amber-400 text-white"
                            : index === 1
                              ? "bg-slate-400 text-white"
                              : index === 2
                                ? "bg-orange-400 text-white"
                                : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      {record.userAvatar ? (
                        <span className="text-lg">{record.userAvatar}</span>
                      ) : null}
                      <span className="font-semibold text-slate-800">
                        {record.userName}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {record.score}
                      </span>
                      <span className="text-xs">
                        {record.moves}m / {record.durationSeconds}s
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
