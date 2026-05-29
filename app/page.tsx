"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import HostAndRef from "./hostandref"; 

// ======================
// TYPES
// ======================
type Team = {
  id: string;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string[];
};

type Game = {
  id?: string;
  week: number;
  home: string;
  away: string;
  home_score?: number | null;
  away_score?: number | null;
  played?: boolean;
};

type WeekSchedule = {
  week: number;
  games: Game[];
};

export default function SoccerTournamentPage() {
  const [standings, setStandings] = useState<Team[]>([]);
  const [schedule, setSchedule] = useState<WeekSchedule[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: { home: number; away: number } }>({});
  const ADMIN_CODE = "1234";
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  // All 4 teams
  const allTeams = ["Binh Gia FC", "Land of Fire UMC", "Highland Warriors FC", "Hustlang FC"];

  // Schedule - Each team plays 1 game per week, 6 weeks total
  const initialSchedule: WeekSchedule[] = [
    {
      week: 1,
      games: [
        { week: 1, home: "Binh Gia FC", away: "Land of Fire UMC" },
        { week: 1, home: "Highland Warriors FC", away: "Hustlang FC" },
      ],
    },
    {
      week: 2,
      games: [
        { week: 2, home: "Binh Gia FC", away: "Hustlang FC" },
        { week: 2, home: "Highland Warriors FC", away: "Land of Fire UMC" },
      ],
    },
    {
      week: 3,
      games: [
        { week: 3, home: "Binh Gia FC", away: "Highland Warriors FC" },
        { week: 3, home: "Land of Fire UMC", away: "Hustlang FC" },
      ],
    },
    {
      week: 4,
      games: [
        { week: 4, home: "Land of Fire UMC", away: "Binh Gia FC" },
        { week: 4, home: "Hustlang FC", away: "Highland Warriors FC" },
      ],
    },
    {
      week: 5,
      games: [
        { week: 5, home: "Hustlang FC", away: "Binh Gia FC" },
        { week: 5, home: "Land of Fire UMC", away: "Highland Warriors FC" },
      ],
    },
    {
      week: 6,
      games: [
        { week: 6, home: "Highland Warriors FC", away: "Binh Gia FC" },
        { week: 6, home: "Hustlang FC", away: "Land of Fire UMC" },
      ],
    },
  ];

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    initializeDatabase();
  }, []);

  async function initializeDatabase() {
    setLoading(true);

    try {
      const { data: existingTeams } = await supabase.from("teams").select("*");

      if (!existingTeams || existingTeams.length === 0) {
        for (const teamName of allTeams) {
          await supabase.from("teams").insert([{
            team: teamName,
            played: 0, wins: 0, draws: 0, losses: 0,
            gf: 0, ga: 0, gd: 0, points: 0, form: []
          }]);
        }
      }

      const { data: existingMatches } = await supabase.from("matches").select("*");

      if (!existingMatches || existingMatches.length === 0) {
        for (const week of initialSchedule) {
          for (const game of week.games) {
            await supabase.from("matches").insert([{
              week: game.week,
              home: game.home,
              away: game.away,
              home_score: null,
              away_score: null,
              played: false,
            }]);
          }
        }
      }

      await loadAllData();

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadAllData() {
    try {
      // Load matches
      const { data: matchesData } = await supabase
        .from("matches")
        .select("*")
        .order("week", { ascending: true });

      if (matchesData) {
        // Group matches by week for schedule
        const grouped: { [key: number]: Game[] } = {};
        matchesData.forEach((match) => {
          if (!grouped[match.week]) grouped[match.week] = [];
          grouped[match.week].push({
            id: match.id,
            week: match.week,
            home: match.home,
            away: match.away,
            home_score: match.home_score,
            away_score: match.away_score,
            played: match.played,
          });
        });

        const scheduleArray = Object.keys(grouped).map((week) => ({
          week: parseInt(week),
          games: grouped[parseInt(week)],
        }));

        setSchedule(scheduleArray);

        // Calculate standings from matches
        await calculateAndUpdateStandings(matchesData);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  async function calculateAndUpdateStandings(matches: any[]) {
    const playedMatches = matches?.filter(m => m.played === true) || [];

    const stats: { [key: string]: any } = {};
    allTeams.forEach((teamName) => {
      stats[teamName] = {
        team: teamName,
        played: 0, wins: 0, draws: 0, losses: 0,
        gf: 0, ga: 0, gd: 0, points: 0, form: [],
      };
    });

    playedMatches.forEach((match) => {
      const home = stats[match.home];
      const away = stats[match.away];
      if (!home || !away) return;

      home.played++;
      away.played++;
      home.gf += match.home_score;
      home.ga += match.away_score;
      away.gf += match.away_score;
      away.ga += match.home_score;

      if (match.home_score > match.away_score) {
        home.wins++;
        away.losses++;
        home.points += 3;
        home.form.unshift('W');
        away.form.unshift('L');
      } else if (match.home_score < match.away_score) {
        away.wins++;
        home.losses++;
        away.points += 3;
        home.form.unshift('L');
        away.form.unshift('W');
      } else {
        home.draws++;
        away.draws++;
        home.points += 1;
        away.points += 1;
        home.form.unshift('D');
        away.form.unshift('D');
      }

      if (home.form.length > 5) home.form.pop();
      if (away.form.length > 5) away.form.pop();
    });

    for (const team of Object.values(stats)) {
      team.gd = team.gf - team.ga;
    }

    const standingsArray = Object.values(stats).map(team => ({
      id: team.team,
      team: team.team,
      played: team.played,
      wins: team.wins,
      draws: team.draws,
      losses: team.losses,
      gf: team.gf,
      ga: team.ga,
      gd: team.gd,
      points: team.points,
      form: team.form,
    }));

    const sorted = standingsArray.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.gd !== b.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    setStandings(sorted);

    // Update teams table
    for (const team of sorted) {
      await supabase
        .from("teams")
        .update({
          played: team.played,
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          gf: team.gf,
          ga: team.ga,
          gd: team.gd,
          points: team.points,
        })
        .eq("team", team.team);
    }
  }

  async function saveScore(matchId: string, homeScore: number, awayScore: number) {
    if (isNaN(homeScore) || isNaN(awayScore)) {
      alert("Please enter valid scores");
      return;
    }

    setSaving(true);

    try {
      await supabase
        .from("matches")
        .update({
          home_score: homeScore,
          away_score: awayScore,
          played: true,
        })
        .eq("id", matchId);

      await loadAllData();
      setEditingGame(null);
      setEditValues({});
      // alert("Score saved! Standings updated.");

    } catch (err) {
      console.error("Error:", err);
      alert("Error saving score");
    } finally {
      setSaving(false);
    }
  }

  async function updateScore(matchId: string, homeScore: number, awayScore: number) {
    if (isNaN(homeScore) || isNaN(awayScore)) {
      alert("Please enter valid scores");
      return;
    }

    setSaving(true);

    try {
      await supabase
        .from("matches")
        .update({
          home_score: homeScore,
          away_score: awayScore,
          played: true,
        })
        .eq("id", matchId);

      await loadAllData();
      setEditingGame(null);
      setEditValues({});
      // alert("Score updated! Standings recalculated.");

    } catch (err) {
      console.error("Error:", err);
      alert("Error updating score");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(gameId: string, currentHome: number, currentAway: number) {
    setEditingGame(gameId);
    setEditValues({
      [gameId]: { home: currentHome, away: currentAway }
    });
  }

  function cancelEdit() {
    setEditingGame(null);
    setEditValues({});
  }

  // Calculate tournament stats for hero
  const totalGoals = standings.reduce((sum, t) => sum + t.gf, 0);
  const totalMatches = schedule.reduce((sum, week) => sum + week.games.length, 0);
  const completedMatches = schedule.reduce((sum, week) => sum + week.games.filter(g => g.played).length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#07111f] to-[#0a1a2a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4a048] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  function requireAdmin(): boolean {
    const code = prompt("Enter 6 digits admin code:");
    return code === ADMIN_CODE;
  }

  function requestAdmin(action: () => void) {
    setPendingAction(() => action);
    setAdminCodeInput("");
    setAdminOpen(true);
  }

  function verifyAdmin() {
    if (adminCodeInput !== ADMIN_CODE) {
      alert("Wrong admin code");
      return;
    }
    setAdminOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07111f] to-[#0a1a2a] text-white pb-20">
      {/* KING OF CHARLOTTE HERO SECTION */}
      <section className="relative overflow-hidden bg-[#07111f]">
        {/* Stadium background image */}
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop')",
        }} />

        {/* Stadium spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,160,72,0.18),transparent_60%)]" />

        {/* Soccer field lines */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-8 border border-white rounded-3xl" />
        </div>

        {/* Floating soccer balls */}
        <div className="absolute top-20 left-10 text-5xl opacity-20 animate-bounce">⚽</div>
        <div className="absolute bottom-24 right-12 text-6xl opacity-10 animate-pulse">⚽</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-10 animate-spin [animation-duration:12s]">⚽</div>

        {/* Golden glow particles */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#d4a048]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#d4a048]/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-[#d4a048]/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Stadium crowd fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Top glow */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#d4a048]/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            {/* Trophy + Soccer Ball */}
            <div className="inline-block mb-8">
              <div className="relative flex items-center justify-center gap-4">
                <span className="text-6xl md:text-7xl animate-bounce inline-block">🏆</span>
                <span className="text-5xl md:text-6xl opacity-90 animate-spin [animation-duration:10s]">⚽</span>
                <div className="absolute -top-2 right-10 w-3 h-3 bg-[#d4a048] rounded-full animate-ping" />
              </div>
            </div>

            {/* Main title */}
            <h3 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-[#d4a048] via-[#f5e6b8] to-[#d4a048] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(212,160,72,0.4)]">
                2026
              </span>
            </h3>

<h1 className="font-black tracking-tight mb-4 leading-none">
  <span className="bg-gradient-to-r from-[#d4a048] via-[#f5e6b8] to-[#d4a048] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(212,160,72,0.5)] text-[5.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]">
    King of Charlotte Cup
  </span>
</h1>

            <h3 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-[#d4a048] via-[#f5e6b8] to-[#d4a048] bg-clip-text text-transparent">
                Winner $1200.00
              </span>
            </h3>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mt-6 leading-relaxed">
              <span className="block text-[#d4a048] font-semibold mt-2">
                Four teams. Six battles. One champion.
              </span>
            </p>

            {/* Tournament tags */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-[#d4a048]/30 shadow-lg shadow-[#d4a048]/10">
                <span className="text-sm uppercase tracking-wider">⚽ Double Round Robin</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-[#d4a048]/30 shadow-lg shadow-[#d4a048]/10">
                <span className="text-sm uppercase tracking-wider">🏟 Charlotte Arena</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-[#d4a048]/30 shadow-lg shadow-[#d4a048]/10">
                <span className="text-sm uppercase tracking-wider">🏆 Crown the Champion</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-[#d4a048]/30 shadow-lg shadow-[#d4a048]/10">
                <span className="text-sm uppercase tracking-wider">🔥 Rivalries Begin</span>
              </div>
            </div>

            {/* Tournament stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-black text-[#d4a048]">4</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Teams</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-black text-[#d4a048]">6</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Match Rounds</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-black text-[#d4a048]">{totalMatches}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Matches</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-black text-[#d4a048]">{totalGoals}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Goals Scored</div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Tournament Progress</span>
                <span>{Math.round((completedMatches / totalMatches) * 100)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#d4a048] to-[#f5e6b8] rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(212,160,72,0.7)]"
                  style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
                />
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex justify-center">
                <div className="w-1 h-2 bg-[#d4a048] rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STANDINGS TABLE */}
<section className="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
  {/* Stadium glow background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,160,72,0.12),transparent_60%)]" />

  {/* Subtle field lines */}
  <div className="absolute inset-0 opacity-[0.05]">
    <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white" />
    <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
  </div>

  {/* Floating soccer balls */}
  <div className="absolute top-10 left-10 text-4xl opacity-10 animate-bounce">
    ⚽
  </div>
  <div className="absolute bottom-10 right-10 text-5xl opacity-10 animate-pulse">
    ⚽
  </div>

  {/* Header */}
  <div className="relative flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
        <span>⚔️ Table of Power</span>
        <span className="text-[#d4a048] animate-pulse">🏆</span>
      </h2>

      <p className="text-gray-400 mt-2 text-sm md:text-base">
        Win = 3 pts • Draw = 1 pt • Loss = 0 pts • Goal difference decides glory
      </p>
    </div>

    <div className="hidden md:flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-full border border-[#d4a048]/30 backdrop-blur-sm">
      <div className="w-3 h-3 bg-[#d4a048] rounded-full animate-ping" />
      <span>Realm Leader</span>
    </div>
  </div>

  {/* Table wrapper */}
  <div className="relative overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(212,160,72,0.08)]">
    {/* Top glow */}
    <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4a048] to-transparent" />

    <table className="w-full min-w-[850px] border-separate border-spacing-0 text-xs md:text-sm">
      <thead className="bg-white/10 text-gray-200 uppercase tracking-wider">
        <tr>
          {/* Sticky Rank */}
          <th className="sticky left-0 z-30 bg-[#0f172a] p-2 md:p-4 text-left w-[45px] md:w-[70px] min-w-[45px] md:min-w-[70px] border-r border-white/10">
            #
          </th>

          {/* Sticky Clan */}
          <th className="sticky left-[45px] md:left-[70px] z-30 bg-[#0f172a] p-2 md:p-4 text-left w-[120px] md:w-[220px] min-w-[120px] md:min-w-[220px] border-r border-white/10 whitespace-nowrap">
            ⚽ Clan
          </th>
          <th className="p-2 md:p-4 text-center">PTS</th>

          <th className="p-2 md:p-4 text-center">P</th>
          <th className="p-2 md:p-4 text-center text-green-300">W</th>
          <th className="p-2 md:p-4 text-center text-yellow-300">D</th>
          <th className="p-2 md:p-4 text-center text-red-300">L</th>
          <th className="p-2 md:p-4 text-center">GF</th>
          <th className="p-2 md:p-4 text-center">GA</th>
          <th className="p-2 md:p-4 text-center">GD</th>
          <th className="p-2 md:p-4 text-center">Form</th>
        </tr>
      </thead>

      <tbody>
        {standings.map((team, idx) => (
          <tr
            key={team.team}
            className={`border-t border-white/5 transition duration-200 hover:bg-white/10 ${
              idx === 0
                ? "bg-[#d4a048]/10 shadow-inner shadow-[#d4a048]/10"
                : ""
            }`}
          >
            {/* Sticky Rank */}
            <td
              className={`sticky left-0 z-20 p-2 md:p-4 font-bold text-white w-[45px] md:w-[70px] min-w-[45px] md:min-w-[70px] border-r border-white/10 ${
                idx === 0 ? "bg-[#2b2415]" : "bg-[#0f172a]"
              }`}
            >
              <div className="flex items-center">
                {idx === 0 && (
                  <span className="text-[#d4a048] mr-1 animate-pulse">
                    👑
                  </span>
                )}

                {idx + 1}
              </div>
            </td>

            {/* Sticky Team */}
            <td
              className={`sticky left-[45px] md:left-[70px] z-20 p-2 md:p-4 font-semibold text-white w-[120px] md:w-[220px] min-w-[120px] md:min-w-[220px] border-r border-white/10 whitespace-nowrap ${
                idx === 0 ? "bg-[#2b2415]" : "bg-[#0f172a]"
              }`}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[#d4a048]">⚽</span>
                <span className="truncate">{team.team}</span>
              </div>
            </td>
            <td className="p-2 md:p-4 text-center">
              <span
                className={`inline-block px-2 md:px-3 py-1 rounded-lg font-bold shadow-md text-xs md:text-sm ${
                  idx === 0
                    ? "bg-[#d4a048] text-black shadow-[#d4a048]/40"
                    : "bg-white/10 text-green-300"
                }`}
              >
                {team.points}
              </span>
            </td>
            <td className="p-2 md:p-4 text-center text-gray-300">
              {team.played}
            </td>

            <td className="p-2 md:p-4 text-center text-green-400 font-semibold">
              {team.wins}
            </td>

            <td className="p-2 md:p-4 text-center text-yellow-300 font-semibold">
              {team.draws}
            </td>

            <td className="p-2 md:p-4 text-center text-red-400 font-semibold">
              {team.losses}
            </td>

            <td className="p-2 md:p-4 text-center text-gray-200">
              {team.gf}
            </td>

            <td className="p-2 md:p-4 text-center text-gray-200">
              {team.ga}
            </td>

            <td className="p-2 md:p-4 text-center font-bold text-white">
              {team.gd}
            </td>



            <td className="p-2 md:p-4 text-center">
              <div className="flex gap-1 justify-center">
                {team.form.map((result, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full text-[10px] md:text-xs flex items-center justify-center ${
                      result === "W"
                        ? "bg-green-600"
                        : result === "D"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Bottom glow */}
    <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#d4a048] to-transparent" />
  </div>
</section>

      {/* SCHEDULE SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">📅 Battle Schedule</h2>
            <p className="text-gray-400 mt-2">Each week, four clans clash for supremacy</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((week) => (
            <div key={week.week}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-[#d4a048]/30 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#d4a048]">Round {week.week}</h3>
                <div className="text-xs text-gray-500">Week {week.week}</div>
              </div>
              <div className="space-y-4">
                {week.games.map((game) => (
                  <div key={game.id} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">{game.home}</span>
                      <span className="text-gray-500 text-sm">⚔️</span>
                      <span className="font-semibold">{game.away}</span>
                    </div>

                    {game.played && editingGame !== game.id ? (
                      <div>
                        <div className="text-center text-2xl font-bold text-green-400 mb-2">
                          {game.home_score} - {game.away_score}
                        </div>
                        <button onClick={() => {
                          if (!requireAdmin()) {
                            alert("Wrong admin code");
                            return;
                          }
                          startEdit(game.id!, game.home_score || 0, game.away_score || 0);
                        }}
                          className="w-full py-2 bg-[#d4a048]/20 rounded-lg text-sm font-semibold text-[#d4a048] hover:bg-[#d4a048]/30 transition">
                          ✏️ Edit Score
                        </button>
                      </div>
                    ) : editingGame === game.id ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input type="number" value={editValues[game.id!]?.home ?? game.home_score ?? 0}
                            onChange={(e) => setEditValues({
                              ...editValues,
                              [game.id!]: {
                                home: parseInt(e.target.value) || 0,
                                away: editValues[game.id!]?.away ?? game.away_score ?? 0
                              }
                            })}
                            className="w-full p-2 rounded bg-black/30 border border-white/10 text-center focus:border-[#d4a048] outline-none"
                            placeholder="Home"
                          />
                          <input type="number" value={editValues[game.id!]?.away ?? game.away_score ?? 0}
                            onChange={(e) => setEditValues({
                              ...editValues,
                              [game.id!]: {
                                home: editValues[game.id!]?.home ?? game.home_score ?? 0,
                                away: parseInt(e.target.value) || 0
                              }
                            })}
                            className="w-full p-2 rounded bg-black/30 border border-white/10 text-center focus:border-[#d4a048] outline-none"
                            placeholder="Away"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => updateScore(
                            game.id!,
                            editValues[game.id!]?.home ?? game.home_score ?? 0,
                            editValues[game.id!]?.away ?? game.away_score ?? 0
                          )}
                            disabled={saving}
                            className="flex-1 py-2 bg-green-600 rounded-lg text-sm font-semibold hover:bg-green-500 transition">
                            {saving ? "Saving..." : "Update"}
                          </button>
                          <button onClick={cancelEdit}
                            className="flex-1 py-2 bg-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-500 transition">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input type="number" id={`home_${game.id}`} placeholder="Home"
                            className="w-full p-2 rounded bg-black/30 border border-white/10 text-center focus:border-[#d4a048] outline-none" />
                          <input type="number" id={`away_${game.id}`} placeholder="Away"
                            className="w-full p-2 rounded bg-black/30 border border-white/10 text-center focus:border-[#d4a048] outline-none" />
                        </div>
                        <button onClick={() => {
                          const homeEl = document.getElementById(`home_${game.id}`) as HTMLInputElement;
                          const awayEl = document.getElementById(`away_${game.id}`) as HTMLInputElement;

                          const homeVal = homeEl?.value;
                          const awayVal = awayEl?.value;

                          if (homeVal === "" || awayVal === "") {
                            alert("Please enter both scores");
                            return;
                          }

                          if (!requireAdmin()) {
                            alert("Wrong admin code");
                            return;
                          }

                          saveScore(
                            game.id!,
                            parseInt(homeVal),
                            parseInt(awayVal)
                          );
                        }}
                          disabled={saving}
                          className="w-full py-2 bg-[#d4a048] rounded-lg text-sm font-semibold text-black hover:bg-[#e8b84a] transition">
                          Record Result
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* REFEREES & HOST SECTION - IMPORTED COMPONENT */}
      <HostAndRef />


      {/* FOOTER QUOTE */}
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-gray-500 text-sm">
          "The crown does not wait for the worthy — it is taken by the brave."
        </p>
        <p className="text-gray-600 text-xs mt-2">© 2026 King of Charlotte Tournament</p>
      </footer>
    </div>
  );
}