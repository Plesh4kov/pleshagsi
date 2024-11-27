'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface GSIData {
  map: {
    name: string;
    team_ct: { name: string; score: number };
    team_t: { name: string; score: number };
    round: number;
  };
  phase_countdowns: { phase: string; phase_ends_in: string };
  allplayers: {
    [key: string]: {
      team: string;
      state: { health: number };
    };
  };
}

export default function GameUI() {
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

  if (!data) {
    return <p>Loading...</p>;
  }

  const { map, phase_countdowns, allplayers } = data;

  // Сортируем игроков по командам
  const ctPlayers = Object.values(allplayers).filter((player) => player.team === 'CT');
  const tPlayers = Object.values(allplayers).filter((player) => player.team === 'T');

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      {/* Название карты */}
      <h1 className="text-4xl font-bold mb-4">{map.name}</h1>

      {/* Информация о командах */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold" style={{ color: '#6E58AB' }}>
            {map.team_ct.name}
          </h2>
          <p className="text-3xl">{map.team_ct.score}</p>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold" style={{ color: '#998959' }}>
            {map.team_t.name}
          </h2>
          <p className="text-3xl">{map.team_t.score}</p>
        </div>
      </div>

      {/* Номер раунда */}
      <div className="text-xl mb-6">
        <p>Round: {map.round}</p>
        <p>
          Phase: {phase_countdowns.phase} ({phase_countdowns.phase_ends_in}s left)
        </p>
      </div>

      {/* Состояние игроков */}
      <div className="flex justify-between w-full max-w-4xl">
        {/* CT Players */}
        <div className="flex gap-2">
          {ctPlayers.map((player, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-md ${
                player.state.health > 0 ? 'bg-[#6E58AB]' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>

        {/* T Players */}
        <div className="flex gap-2">
          {tPlayers.map((player, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-md ${
                player.state.health > 0 ? 'bg-[#998959]' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </main>
  );
}
