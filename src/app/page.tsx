'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface Player {
  name: string;
  state: { health: number };
}

interface Team {
  name: string;
  score: number;
  players: Player[];
}

interface MapInfo {
  name: string;
  team_ct: Team;
  team_t: Team;
  round: number;
}

interface GSIData {
  map: MapInfo;
  phase_countdowns: { phase_ends_in: string };
  round: { phase: string };
}

export default function Scoreboard() {
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

  // Добавляем проверку наличия данных
  if (!data || !data.map || !data.map.team_ct || !data.map.team_t) {
    return <p>Loading...</p>;
  }

  const { map, phase_countdowns, round } = data;

  return (
    <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* Название карты */}
      <h1 className="text-2xl font-bold mb-6">Map: {map.name}</h1>

      {/* Название команд и счет */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        {/* CT Team */}
        <div className="text-center p-4 mx-4 rounded-lg shadow-lg w-1/3" style={{ backgroundColor: '#6E58AB' }}>
          <h2 className="text-xl font-bold">{map.team_ct.name}</h2>
          <p className="text-3xl font-bold">{map.team_ct.score}</p>
        </div>

        {/* T Team */}
        <div className="text-center p-4 mx-4 rounded-lg shadow-lg w-1/3" style={{ backgroundColor: '#998959' }}>
          <h2 className="text-xl font-bold">{map.team_t.name}</h2>
          <p className="text-3xl font-bold">{map.team_t.score}</p>
        </div>
      </div>

      {/* Состояние игроков */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        {/* CT Players */}
        <div className="flex space-x-2">
          {map.team_ct.players.map((player, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-lg shadow-lg"
              style={{
                backgroundColor: player.state.health > 0 ? '#6E58AB' : '#4A4A4A',
              }}
              title={player.name}
            ></div>
          ))}
        </div>

        {/* T Players */}
        <div className="flex space-x-2">
          {map.team_t.players.map((player, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-lg shadow-lg"
              style={{
                backgroundColor: player.state.health > 0 ? '#998959' : '#4A4A4A',
              }}
              title={player.name}
            ></div>
          ))}
        </div>
      </div>

      {/* Номер раунда */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Round: {map.round}</h2>
      </div>

      {/* Статус раунда и таймер */}
      <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Round Status: {round.phase}</h2>
        <p className="text-lg">
          Time Remaining: <span className="font-bold">{phase_countdowns.phase_ends_in}s</span>
        </p>
      </div>
    </main>
  );
}
