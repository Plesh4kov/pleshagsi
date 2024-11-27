'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface PlayerState {
  health: number;
  armor: number;
  money: number;
  equip_value: number;
}

interface Player {
  name: string;
  team: string;
  state: PlayerState;
  weapons: Record<string, { name: string; state: string }>;
}

interface Team {
  name: string;
  score: number;
}

interface MapInfo {
  name: string;
  team_ct: Team;
  team_t: Team;
}

interface GSIData {
  map: MapInfo;
  player: Player; // Указываем, что player имеет тип Player
  phase_countdowns: { phase: string; phase_ends_in: string };
  round: { phase: string };
}

export default function Home() {
  const [data, setData] = useState<GSIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const json: GSIData[] = await response.json();
        setData(json[json.length - 1]);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { map, player, phase_countdowns, round } = data;

  return (
    <main className="p-4 font-sans bg-gradient-to-b from-gray-800 to-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">Game Status</h1>

      {/* Map and Team Information */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-2">Map: {map.name}</h2>
        <div className="flex justify-between items-center">
          <div className="team-info bg-blue-900 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">{map.team_ct.name} (CT)</h3>
            <p className="text-lg font-medium">Score: {map.team_ct.score}</p>
          </div>
          <div className="team-info bg-red-900 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">{map.team_t.name} (T)</h3>
            <p className="text-lg font-medium">Score: {map.team_t.score}</p>
          </div>
        </div>
      </section>

      {/* Observer and Round Information */}
      <section className="mb-6">
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg animate-slide-in">
          <h2 className="text-xl font-semibold">Observer</h2>
          <p className="text-lg">Currently Observing: <span className="text-yellow-400">{player.name}</span></p>
          <p className="text-lg">Team: <span className="text-yellow-400">{player.team}</span></p>
          <p className="text-lg">Health: <span className="text-green-400">{player.state.health}</span></p>
          <p className="text-lg">Armor: <span className="text-blue-400">{player.state.armor}</span></p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg shadow-lg mt-4">
          <h2 className="text-xl font-semibold">Round Status</h2>
          <p className="text-lg">Phase: <span className="text-yellow-400">{round.phase}</span></p>
          <p className="text-lg">Time Remaining: <span className="text-yellow-400">{phase_countdowns.phase_ends_in}s</span></p>
        </div>
      </section>
    </main>
  );
}
