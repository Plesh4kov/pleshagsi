'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface Team {
  name: string;
  score: number;
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
  const [password, setPassword] = useState<string>('');
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (authenticated) {
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
    }
  }, [authenticated]);

  const handlePasswordSubmit = () => {
    if (password === '2525') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  if (!authenticated) {
    return (
      <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Enter Password to Access Stats</h1>
        <input
          type="password"
          className="p-2 rounded border-2 border-gray-500 mb-4"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handlePasswordSubmit}
        >
          Submit
        </button>
      </main>
    );
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { map, phase_countdowns, round } = data;

  return (
    <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* Название карты */}
      <h1 className="text-2xl font-bold mb-4">Map: {map.name}</h1>

      {/* Название команд и счет */}
      <div className="flex justify-center items-center mb-6">
        {/* CT Team */}
        <div
          className="text-center p-4 mx-4 rounded-lg shadow-lg"
          style={{ backgroundColor: '#6E58AB' }}
        >
          <h2 className="text-xl font-bold">{map.team_ct.name}</h2>
          <p className="text-3xl font-bold">{map.team_ct.score}</p>
        </div>

        {/* T Team */}
        <div
          className="text-center p-4 mx-4 rounded-lg shadow-lg"
          style={{ backgroundColor: '#998959' }}
        >
          <h2 className="text-xl font-bold">{map.team_t.name}</h2>
          <p className="text-3xl font-bold">{map.team_t.score}</p>
        </div>
      </div>

      {/* Номер раунда */}
      <div className="mb-4">
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
