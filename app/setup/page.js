"use client";

import { useState } from "react";
import { WC2026_TEAMS } from "@/lib/teams";
import { encodeSession } from "@/lib/draw";
import { getColor } from "@/lib/colors";

export default function SetupPage() {
  const [friends, setFriends] = useState([]);
  const [input, setInput] = useState("");
  const DEFAULT_EXCLUDED = new Set(["perguruan-toho", "nankatsu-fc"]);
  const [selectedTeams, setSelectedTeams] = useState(
    new Set(WC2026_TEAMS.filter((t) => !DEFAULT_EXCLUDED.has(t.slug)).map((t) => t.slug))
  );

  const addFriend = (raw) => {
    const names = [...new Set(
      (raw || input)
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n)
    )].filter((n) => !friends.includes(n));
    if (names.length === 0) return;
    setFriends([...friends, ...names]);
    setInput("");
  };

  const removeFriend = (name) => {
    setFriends(friends.filter((f) => f !== name));
  };

  const toggleTeam = (slug) => {
    const next = new Set(selectedTeams);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelectedTeams(next);
  };

  const selectAll = () => {
    setSelectedTeams(new Set(WC2026_TEAMS.map((t) => t.slug)));
  };

  const deselectAll = () => {
    setSelectedTeams(new Set());
  };

  const handleStartDraw = () => {
    if (friends.length < 2) return;
    if (selectedTeams.size < friends.length) return;

    const session = {
      friends,
      teams: Array.from(selectedTeams),
    };

    window.location.href =
      `${process.env.NODE_ENV === "production" ? "/dundunpildun" : ""}` +
      `/draw#${encodeSession(session)}`;
  };

  const canStart = friends.length >= 2 && selectedTeams.size >= friends.length;

  const teamsPerPerson = Math.floor(selectedTeams.size / Math.max(friends.length, 1));
  const remainder = selectedTeams.size % Math.max(friends.length, 1);

  return (
    <main className="mx-auto max-w-3xl px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Buat Drawing Pildun 2026 🌍</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-500">Atur peserta dan tim yang akan diundi pun dirinya itu. Jumlah tim yang dipegang akan dibagi secara merata.</p>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Peserta ({friends.length})</h2>
        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 sm:py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            placeholder="Nama teman, pisah dengan koma (contoh: roy, joni, budi)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFriend()}
          />
          <button
            onClick={() => addFriend()}
            disabled={!input.trim()}
            className="rounded-xl bg-green-600 px-5 py-3 sm:py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-40 touch-manipulation"
          >
            Tambah
          </button>
        </div>
        {friends.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {friends.map((name, i) => {
              const color = getColor(i);
              return (
                <span
                  key={name}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${color.bg} ${color.text}`}
                >
                  <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                  {name}
                  <button
                    onClick={() => removeFriend(name)}
                    className="ml-0.5 hover:opacity-60"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
        {friends.length >= 2 && (
          <p className="mt-2 text-xs text-gray-400">
            Setiap peserta dapat ~{teamsPerPerson}
            {remainder > 0 ? `–${teamsPerPerson + 1}` : ""} tim
          </p>
        )}
      </section>

      <section className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold">
            Tim ({selectedTeams.size}/{WC2026_TEAMS.length})
          </h2>
          <div className="flex gap-2 text-xs sm:text-sm">
            <button onClick={selectAll} className="text-green-600 hover:underline touch-manipulation">
              Pilih Semua
            </button>
            <button onClick={deselectAll} className="text-gray-400 hover:underline touch-manipulation">
              Hapus Semua
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {WC2026_TEAMS.map((team) => {
            const picked = selectedTeams.has(team.slug);
            return (
              <button
                key={team.slug}
                onClick={() => toggleTeam(team.slug)}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs sm:text-sm transition touch-manipulation ${picked
                  ? "border-green-300 bg-green-50 text-green-800"
                  : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                  }`}
              >
                {team.flagImg ? <img src={team.flagImg} className="inline-block w-6 h-6 sm:w-7 sm:h-7 align-middle rounded" /> : <span className="text-xl sm:text-2xl leading-none">{team.flag}</span>}
                <span className="truncate font-medium leading-tight">{team.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        onClick={handleStartDraw}
        disabled={!canStart}
        className="w-full rounded-2xl bg-green-600 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 disabled:opacity-40 disabled:shadow-none touch-manipulation"
      >
        {friends.length < 2
          ? "Tambah minimal 2 peserta"
          : selectedTeams.size < 2
            ? "Pilih minimal 2 tim"
            : selectedTeams.size < friends.length
              ? `Jumlah tim (${selectedTeams.size}) harus ≥ jumlah peserta (${friends.length})`
              : "Mulai Undian ⚽"}
      </button>
    </main>
  );
}
