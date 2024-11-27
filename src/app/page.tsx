'use client';

import { useEffect, useState } from 'react';

interface PlayerState {
  health: number;
  armor: number;
  money: number;
  equip_value: number;
}

interface Player {
  name: string;
  state: PlayerState;
  match_stats: {
    kills: number;
    assists: number;
    deaths: number;
  };
  weapons: Record<string, { name: string; state: string }>;
}

interface Team {
  name: string;
  score: number;
}

interface Map {
  name: string;
  team_ct: Team;
  team_t: Team;
}

interface GSIData {
  map: Map;
  allplayers: Record<string, Player>;
  round: {
    phase: string;
  };
}

export default function Home() {
  const [data, setData] = useState<GSIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const json: GSIData[] = await response.json();
        setData(json[json.length - 1]);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    const interval = setInterval(fetchData, 2000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { map, allplayers, round } = data;

  return (
    <main className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Game Status</h1>

      {/* Map and Team Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Map Information</h2>
        <p><strong>Map:</strong> {map.name}</p>
        <p><strong>CT Team:</strong> {map.team_ct.name} - {map.team_ct.score}</p>
        <p><strong>T Team:</strong> {map.team_t.name} - {map.team_t.score}</p>
      </section>

      {/* Player Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Players</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(allplayers).map((player, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-bold">{player.name}</h3>
              <p><strong>Health:</strong> {player.state.health}</p>
              <p><strong>Armor:</strong> {player.state.armor}</p>
              <p><strong>Money:</strong> ${player.state.money}</p>
              <p><strong>Kills:</strong> {player.match_stats.kills}</p>
              <p><strong>Deaths:</strong> {player.match_stats.deaths}</p>
              <p><strong>Active Weapon:</strong> {
                Object.values(player.weapons).find(w => w.state === 'active')?.name || 'None'
              }</p>
            </div>
          ))}
        </div>
      </section>

      {/* Round Status */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Round Status</h2>
        <p><strong>Phase:</strong> {round.phase}</p>
      </section>
    </main>
  );
}
