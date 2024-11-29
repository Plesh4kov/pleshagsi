'use client';

import { useEffect, useState } from 'react';
import '/styles/styles.css';

interface RoundData {
  map: {
    name: string;
    round: number;
    team_ct: { name: string; score: number };
    team_t: { name: string; score: number };
  };
  round: {
    phase: string;
  };
}

export default function Rounds() {
  const [data, setData] = useState<RoundData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const json: RoundData[] = await response.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchRounds();
    const interval = setInterval(fetchRounds, 2000); // Обновляем каждые 2 секунды
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Round History</h1>
      <div className="w-full max-w-4xl">
        {data.map((round, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4"
          >
            <h2 className="text-xl font-bold mb-2">Map: {round.map.name}</h2>
            <div className="flex justify-between">
              <div className="text-center">
                <h3 className="font-bold">CT Team</h3>
                <p>Name: {round.map.team_ct.name}</p>
                <p>Score: {round.map.team_ct.score}</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold">T Team</h3>
                <p>Name: {round.map.team_t.name}</p>
                <p>Score: {round.map.team_t.score}</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p>Round: {round.map.round}</p>
              <p>Phase: {round.round.phase}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
