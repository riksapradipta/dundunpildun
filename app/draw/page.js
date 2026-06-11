"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WC2026_TEAMS } from "@/lib/teams";
import { decodeSession, encodeSession, runDraw } from "@/lib/draw";
import { getColorByFriend } from "@/lib/colors";

const TEAM_MAP = Object.fromEntries(WC2026_TEAMS.map((t) => [t.slug, t]));

function Confetti({ color }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = 6 + Math.random() * 8;
        const c = color || [
          "bg-green-500",
          "bg-yellow-400",
          "bg-red-500",
          "bg-blue-500",
          "bg-purple-500",
          "bg-orange-500",
        ][Math.floor(Math.random() * 6)];
        return (
          <div
            key={i}
            className={`absolute top-0 rounded-sm ${c}`}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 1.5}px`,
              animation: `confetti-fall ${1.5 + Math.random()}s ease-out ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function DrawPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [batches, setBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [completedBatches, setCompletedBatches] = useState(0);
  const [displayTeams, setDisplayTeams] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [stoppedCount, setStoppedCount] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const spinRef = useRef(null);
  const celebrateRef = useRef(null);
  const stoppedRef = useRef(new Set());
  const advanceRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      router.replace("/");
      return;
    }
    const decoded = decodeSession(hash);
    if (!decoded) {
      router.replace("/");
      return;
    }
    setSession(decoded);
  }, [router]);

  const startSpin = useCallback((batch, unassignedSlugs, onDone) => {
    setSpinning(true);
    setCelebrate(false);
    setStoppedCount(0);
    stoppedRef.current = new Set();

    const baseDuration = 1500 + Math.random() * 500;
    const slotStagger = 500;
    const startTime = Date.now();

    const candidates = batch.teams.map((target) =>
      unassignedSlugs.filter((s) => s !== target)
    );

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const newStopped = new Set();

      const currentDisplay = batch.teams.map((target, i) => {
        const slotStopTime = baseDuration + i * slotStagger;
        if (elapsed >= slotStopTime) {
          newStopped.add(i);
          return target;
        }
        const pool = candidates[i];
        return pool[Math.floor(Math.random() * pool.length)];
      });

      setDisplayTeams(currentDisplay);

      if (newStopped.size > stoppedRef.current.size) {
        stoppedRef.current = newStopped;
        setStoppedCount(newStopped.size);
      }

      if (newStopped.size >= batch.teams.length) {
        setSpinning(false);
        setCelebrate(true);
        advanceRef.current = setTimeout(() => {
          setCelebrate(false);
          onDone();
        }, 2000);
      } else {
        spinRef.current = setTimeout(tick, 50);
      }
    };

    tick();
  }, []);

  const handleStart = () => {
    if (!session) return;
    const allBatches = runDraw(session.friends, session.teams);
    setBatches(allBatches);
    setCurrentBatch(0);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || currentBatch === null || !batches.length) return;
    if (currentBatch >= batches.length) {
      setDone(true);
      return;
    }

    const batch = batches[currentBatch];
    const pickedSoFar = batches
      .slice(0, completedBatches)
      .flatMap((b) => b.teams);
    const unassigned = session.teams.filter(
      (s) => !pickedSoFar.includes(s)
    );

    startSpin(batch, unassigned, () => {
      setCompletedBatches((prev) => prev + 1);
      setCurrentBatch((prev) => prev + 1);
    });

    return () => {
      if (spinRef.current) clearTimeout(spinRef.current);
      if (celebrateRef.current) clearTimeout(celebrateRef.current);
      if (advanceRef.current) clearTimeout(advanceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, currentBatch, batches, session, startSpin]);

  useEffect(() => {
    if (!done || !session || !batches.length) return;

    const completedSession = {
      ...session,
      batches,
      completed: true,
    };

    const hash = encodeSession(completedSession);
    const timeout = setTimeout(() => {
      window.location.href = `/results#${hash}`;
    }, 800);

    return () => clearTimeout(timeout);
  }, [done, session, batches, router]);

  if (!session) return null;

  const batch = currentBatch !== null && currentBatch < batches.length
    ? batches[currentBatch]
    : null;
  const currentFriend = batch?.friend || session.friends[0];
  const currentColor = batch
    ? getColorByFriend(session.friends, batch.friend)
    : null;

  const teamToColor = {};
  batches.slice(0, completedBatches).forEach((b) => {
    b.teams.forEach((team) => {
      teamToColor[team] = getColorByFriend(session.friends, b.friend);
    });
  });
  if (celebrate && batch) {
    batch.teams.forEach((team) => {
      teamToColor[team] = getColorByFriend(session.friends, batch.friend);
    });
  }

  const totalTeams = session.teams.length;
  const pickedSoFarCount = batches
    .slice(0, completedBatches)
    .flatMap((b) => b.teams).length;

  const friendStats = {};
  session.friends.forEach((f) => {
    const fb = batches.filter((b) => b.friend === f);
    const total = fb.reduce((s, b) => s + b.teams.length, 0);
    const done = fb
      .slice(0, Math.max(0, Math.min(completedBatches, batches.length)))
      .filter((b) => b.friend === f)
      .reduce((s, b) => s + b.teams.length, 0);
    friendStats[f] = { total, done };
  });

  const rouletteTeamCount = displayTeams.length || batch?.teams.length || 4;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-3 sm:px-4 py-4 sm:py-6">
      {celebrate && <Confetti color={currentColor?.dot} />}

      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <h1 className="text-base sm:text-xl font-bold">Undian Piala Dunia 2026</h1>
        <span className="text-xs sm:text-sm text-gray-500">
          {pickedSoFarCount}/{totalTeams}
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-4 sm:mb-8 flex-wrap">
        {session.friends.map((f, i) => {
          const color = getColorByFriend(session.friends, f);
          const stats = friendStats[f];
          const isActive = batch?.friend === f && !done;
          const isComplete = stats && stats.done >= stats.total && stats.total > 0;

          return (
            <div
              key={f}
              className={`flex items-center gap-1 rounded-full px-2 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-sm font-medium transition-all ring-1 ${
                isActive
                  ? `${color.bg} ${color.text} ${color.ring} scale-110 shadow-lg`
                  : isComplete
                    ? `${color.bg} ${color.text} opacity-80`
                    : "bg-gray-100 text-gray-500 ring-gray-200"
              }`}
            >
              <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${color.dot}`} />
              <span>{f}</span>
              {stats && (
                <span className="text-[10px] sm:text-xs opacity-70">
                  {stats.done}/{stats.total}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mb-6 sm:mb-8">
        <div className="mb-3 sm:mb-4 h-6 sm:h-8 flex items-center">
          {spinning ? (
            <span className="text-sm sm:text-lg font-semibold text-gray-500">
              {stoppedCount > 0
                ? `Tim ke-${stoppedCount} terpilih...`
                : "Mengundi..."}
            </span>
          ) : celebrate ? (
            <span
              className={`text-sm sm:text-lg font-semibold animate-pop-in ${currentColor?.text || "text-green-600"}`}
            >
              {currentFriend} mendapat {rouletteTeamCount} tim! 🎉
            </span>
          ) : done ? (
            <span className="text-sm sm:text-lg font-semibold text-green-600">
              Undian selesai! 🎉
            </span>
          ) : (
            <span className="text-sm sm:text-lg font-semibold text-gray-500">
              {started ? "Siap..." : "Klik Mulai untuk mengundi"}
            </span>
          )}
        </div>

        <div className="flex gap-2 sm:gap-4 justify-center w-full max-w-lg mx-auto mb-4 px-2">
          {Array.from({ length: rouletteTeamCount }).map((_, slotIdx) => {
            const teamSlug = displayTeams[slotIdx];
            const t = teamSlug ? TEAM_MAP[teamSlug] : null;
            return (
              <div
                key={slotIdx}
                className={`flex-1 min-w-0 h-28 sm:h-44 flex items-center justify-center rounded-2xl border-[3px] sm:border-4 bg-white shadow-xl transition-all px-1 sm:px-2 ${
                  celebrate && currentColor
                    ? `${currentColor.border} ${currentColor.bg}`
                    : slotIdx < stoppedCount && spinning
                      ? "border-green-400 bg-green-50"
                      : spinning
                        ? "border-yellow-300"
                        : "border-gray-300"
                }`}
              >
                {t ? (
                  <div
                    className={`flex flex-col items-center gap-0.5 sm:gap-1 ${
                      celebrate ? "animate-pop-in" : ""
                    }`}
                  >
                    <span
                      className={`transition-all ${
                        spinning && slotIdx >= stoppedCount
                          ? "text-lg sm:text-4xl scale-75 opacity-60"
                          : "text-2xl sm:text-5xl"
                      }`}
                    >
                      {t.flag}
                    </span>
                    <span
                      className={`font-bold text-center leading-tight px-0.5 ${
                        spinning && slotIdx >= stoppedCount
                          ? "text-[8px] sm:text-sm opacity-40"
                          : "text-[9px] sm:text-sm"
                      }`}
                    >
                      {t.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-5xl">⚽</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-[260px] sm:w-72 bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{
              width: `${(pickedSoFarCount / totalTeams) * 100}%`,
            }}
          />
        </div>
      </div>

      {!started && (
        <button
          onClick={handleStart}
          className="w-full rounded-2xl bg-green-600 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 active:scale-95 touch-manipulation"
        >
          Mulai Undian ⚽
        </button>
      )}

      {started && !done && (
        <p className="text-center text-xs sm:text-sm text-gray-400 mb-2">
          Giliran: <span className="font-semibold">{currentFriend}</span>
        </p>
      )}

      <div className="mt-4 sm:mt-8 mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {Object.entries(
          WC2026_TEAMS.filter((t) => session.teams.includes(t.slug))
            .reduce((acc, t) => {
              if (!acc[t.group]) acc[t.group] = [];
              acc[t.group].push(t);
              return acc;
            }, {})
        ).map(([group, teams]) => (
          <div key={group} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grup {group}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {teams.map((team, idx) => {
                const rank = idx + 1;
                const pickColor = teamToColor[team.slug];
                const isPicked = !!pickColor;
                const isInRoulette =
                  displayTeams.includes(team.slug) && celebrate;

                let rowBg = "bg-white";
                if (isInRoulette) {
                  rowBg = "animate-pulse-glow";
                } else if (isPicked) {
                  rowBg = pickColor.bg;
                }

                return (
                  <div
                    key={team.slug}
                    className={`flex items-center gap-2 px-3 py-2 transition-all ${rowBg}`}
                  >
                    <span className="text-[11px] text-gray-400 font-medium w-5 shrink-0">{rank}</span>
                    <span className="text-base sm:text-lg leading-none">{team.flag}</span>
                    <span className="text-xs sm:text-sm font-medium truncate">{team.name}</span>
                    {isPicked && (
                      <span className={`ml-auto h-2 w-2 rounded-full ${pickColor.dot} ring-1 ring-white shrink-0`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
