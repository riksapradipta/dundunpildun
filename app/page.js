"use client";

import Link from "next/link";
import Marquee from "@/components/animata/container/marquee";
import KineticTopBuild from "@/components/animata/text/kinetic-top-build";
import { WC2026_TEAMS } from "@/lib/teams";
import { useLocale } from "@/lib/locale-context";

export default function Home() {
  const { t } = useLocale();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-15 flex flex-col justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <Marquee key={i} repeat={8} reverse={i % 2 === 0} className="[--duration:60s]" applyMask>
            {WC2026_TEAMS.map((team) => (
              <span
                key={team.slug}
                className="text-4xl sm:text-5xl leading-none"
              >
                {team.flagImg ? <img src={team.flagImg} className="inline-block w-8 h-8 sm:w-10 sm:h-10 align-middle rounded" /> : team.flag}
              </span>
            ))}
          </Marquee>
        ))}
      </div>
      <div className="flex flex-col items-center gap-6 sm:gap-8 text-center max-w-md relative z-10">
        <div className="text-5xl sm:text-7xl">🏆</div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight min-h-[8rem] sm:min-h-[10rem] flex items-center justify-center">
          <KineticTopBuild
            phrases={[["dun", "dun", "pildun"]]}
            className="!aspect-auto !overflow-visible"
          />
        </h1>
        <p className="text-sm sm:text-lg text-gray-500 leading-relaxed px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/40">
          {t("home.subtitle")}
        </p>
        <Link
          href="/setup"
          className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-700 active:scale-95 touch-manipulation"
        >
          {t("home.cta")}
        </Link>
      </div>
    </main>
  );
}
