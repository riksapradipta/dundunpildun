"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WC2026_TEAMS } from "@/lib/teams";
import { decodeSession } from "@/lib/draw";
import { getColorByFriend } from "@/lib/colors";
import Marquee from "@/components/animata/container/marquee";
import StoryGenerator from "@/components/StoryGenerator";
import Link from "next/link";

const TEAM_MAP = Object.fromEntries(WC2026_TEAMS.map((t) => [t.slug, t]));

function FriendResultCard({ friend, color, teams }) {
  return (
    <div className={`rounded-2xl border ${color.border} ${color.bg} p-4 sm:p-5 shadow-sm animate-slide-up`}>
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${color.dot} text-white font-bold text-xs sm:text-sm`}>
          {friend.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-base sm:text-lg truncate">{friend}</h2>
          <p className={`text-xs sm:text-sm ${color.text}`}>{teams.length} tim</p>
        </div>
        <StoryGenerator friend={friend} color={color} teams={teams} />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-1.5">
        {teams.map((slug) => {
          const team = TEAM_MAP[slug];
          return (
            <div key={slug} className="flex flex-col items-center rounded-lg border border-gray-100 bg-white px-0.5 py-1.5 text-center">
              {team?.flagImg ? <img src={team.flagImg} className="inline-block w-7 h-7 sm:w-8 sm:h-8 align-middle rounded" /> : <span className="text-2xl sm:text-3xl leading-none">{team?.flag}</span>}
              <span className="text-[8px] sm:text-[10px] font-medium mt-0.5">{team?.name}</span>
              <span className="text-[7px] sm:text-[9px] text-gray-400">{team?.group}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PersonalView({ friend, color, teams }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-10 flex flex-col justify-between pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <Marquee key={i} repeat={8} reverse={i % 2 === 0} className="[--duration:60s]" applyMask>
            {WC2026_TEAMS.map((team) => (
              <span key={team.slug} className="text-4xl sm:text-5xl leading-none">{team.flagImg ? <img src={team.flagImg} className="inline-block w-8 h-8 sm:w-10 sm:h-10 align-middle rounded" /> : team.flag}</span>
            ))}
          </Marquee>
        ))}
      </div>
      <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
        <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full ${color.dot} text-white font-bold text-2xl sm:text-3xl shadow-lg mb-4`}>
          {friend.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{friend}</h1>
        <p className={`text-sm sm:text-base ${color.text}`}>{teams.length} tim</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
        {teams.map((slug) => {
          const team = TEAM_MAP[slug];
          return (
            <div key={slug} className={`flex flex-col items-center rounded-2xl border-2 ${color.border} ${color.bg} p-3 sm:p-4 text-center shadow-sm`}>
              {team?.flagImg ? <img src={team.flagImg} className="inline-block w-8 h-8 sm:w-9 sm:h-9 align-middle rounded" /> : <span className="text-3xl sm:text-4xl leading-none">{team?.flag}</span>}
              <span className="text-xs sm:text-sm font-bold mt-1.5">{team?.name}</span>
              <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Grup {team?.group}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState(null);
  const [copied, setCopied] = useState(false);
  const friendParam = searchParams.get("friend");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      router.replace("/");
      return;
    }
    const decoded = decodeSession(hash);
    if (!decoded || !decoded.batches) {
      router.replace("/");
      return;
    }
    setSession(decoded);
  }, [router]);

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (!session) return null;

  const grouped = {};
  session.friends.forEach((f) => { grouped[f] = []; });
  session.batches.forEach((b) => {
    if (grouped[b.friend]) grouped[b.friend].push(...b.teams);
  });

  if (friendParam && grouped[friendParam]) {
    const color = getColorByFriend(session.friends, friendParam);
    const teams = grouped[friendParam];
    return (
      <div>
        <PersonalView friend={friendParam} color={color} teams={teams} />
        <div className="flex flex-col items-center gap-3 pb-8">
          <StoryGenerator
            friend={friendParam}
            color={color}
            teams={teams}
          />
          <Link
            href={window.location.pathname + window.location.hash}
            className="text-sm text-gray-400 hover:text-gray-600 underline touch-manipulation py-2"
          >
            Lihat semua hasil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-3 sm:px-4 py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-10 flex flex-col justify-between pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <Marquee key={i} repeat={8} reverse={i % 2 === 0} className="[--duration:60s]" applyMask>
            {WC2026_TEAMS.map((team) => (
              <span key={team.slug} className="text-4xl sm:text-5xl leading-none">{team.flagImg ? <img src={team.flagImg} className="inline-block w-8 h-8 sm:w-10 sm:h-10 align-middle rounded" /> : team.flag}</span>
            ))}
          </Marquee>
        ))}
      </div>
      <div className="text-center mb-6 sm:mb-10">
        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hasil Undian!</h1>
        <p className="text-sm sm:text-base text-gray-500">
          {session.friends.length} peserta — {session.teams.length} tim
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-8 sm:mb-10">
        {session.friends.map((friend) => {
          const color = getColorByFriend(session.friends, friend);
          const teams = grouped[friend] || [];
          return (
            <FriendResultCard key={friend} friend={friend} color={color} teams={teams} />
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleCopyAll}
          className="inline-flex items-center gap-2 rounded-2xl bg-gray-800 px-8 py-3.5 text-sm sm:text-base font-semibold text-white transition hover:bg-gray-900 active:scale-95 touch-manipulation"
        >
          {copied ? "✓ Link Tersalin!" : "Salin Link Undian"}
        </button>
        <Link href="/setup" className="text-sm text-green-600 hover:underline touch-manipulation py-2">
          Buat Undian Pildun 2026 🌍
        </Link>
      </div>
    </main>
  );
}

export default function ResultsPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ResultsPage />
    </Suspense>
  );
}
