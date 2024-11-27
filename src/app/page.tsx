'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface PlayerState {
  health: number;
  armor: number;
}

interface Player {
  name: string;
  team: string;
  state: PlayerState;
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
  round: { phase: string };
  phase_countdowns: { phase: string; phase_ends_in: string };
  allplayers?: Record<string, Player>;
}

export default function Home() {
  const [data, setData] = useState<GSIData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const json: GSIData = await response.json();
        setData(json);
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

  if (!data || !data.map || !data.map.team_ct || !data.map.team_t) {
    return <p>Loading...</p>;
  }

  const { map, round, phase_countdowns, allplayers } = data;

  // Функция для отображения живых игроков
  const renderPlayers = (team: string) => {
    return (
      <div className="flex space-x-2">
        {allplayers &&
          Object.values(allplayers)
            .filter((player) => player.team === team)
            .map((player, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded ${player.state.health > 0 ? (team === 'CT' ? 'bg-blue-600' : 'bg-yellow-600') : 'bg-gray-600'}`}
              ></div>
            ))}
      </div>
    );
  };

  return (
    <main className="p-4 font-sans bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Game Status</h1>

      {/* Map and Team Information */}
      <section className="mb-6">
        <div className="flex justify-between items-center">
          {/* CT Side */}
          <div className="team-info text-center">
            <h3 className="text-2xl font-bold" style={{ color: '#6E58AB' }}>
              {map.team_ct.name} (CT)
            </h3>
            <p className="text-lg font-medium">Score: {map.team_ct.score}</p>
            {renderPlayers('CT')}
          </div>
          {/* T Side */}
          <div className="team-info text-center">
            <h3 className="text-2xl font-bold" style={{ color: '#998959' }}>
              {map.team_t.name} (T)
            </h3>
            <p className="text-lg font-medium">Score: {map.team_t.score}</p>
            {renderPlayers('T')}
          </div>
        </div>
      </section>

      {/* Round and Phase Information */}
      <section>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Round Info</h2>
          <p>Round Phase: {round.phase}</p>
          <p>Time Remaining: {phase_countdowns.phase_ends_in}s</p>
        </div>
      </section>
    </main>
  );
}
