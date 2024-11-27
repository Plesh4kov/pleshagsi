'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface PlayerState {
  health: number;
  armor: number;
  money: number;
  round_kills: number;
  round_assists: number;
  round_deaths: number;
  adr: number;
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
  allplayers: Record<string, Player>;
  phase_countdowns: { phase_ends_in: string };
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

  if (!data) {
    return <p>Loading...</p>;
  }

  const { map, allplayers, phase_countdowns } = data;
  const players = Object.values(allplayers);
  const ctPlayers = players.filter((player) => player.team === 'CT');
  const tPlayers = players.filter((player) => player.team === 'T');

  return (
    <main className="p-4 bg-gradient-to-b from-gray-800 to-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Scoreboard</h1>
      <h2 className="text-xl font-bold text-center mb-4">
        {map.name.toUpperCase()} — {map.team_ct.name} ({map.team_ct.score}) vs {map.team_t.name} ({map.team_t.score})
      </h2>
      <section className="grid grid-cols-2 gap-4 animate-fade-in">
        {/* CT Team */}
        <div className="bg-blue-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">CT Team: {map.team_ct.name}</h3>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Player</th>
                <th>HP</th>
                <th>Armor</th>
                <th>$</th>
                <th>K</th>
                <th>A</th>
                <th>D</th>
                <th>ADR</th>
              </tr>
            </thead>
            <tbody>
              {ctPlayers.map((player, index) => (
                <tr key={index} className="hover:bg-blue-700 transition-all">
                  <td>{player.name}</td>
                  <td>{player.state.health}</td>
                  <td>{player.state.armor}</td>
                  <td>{player.state.money}</td>
                  <td>{player.state.round_kills}</td>
                  <td>{player.state.round_assists}</td>
                  <td>{player.state.round_deaths}</td>
                  <td>{player.state.adr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* T Team */}
        <div className="bg-red-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">T Team: {map.team_t.name}</h3>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left">Player</th>
                <th>HP</th>
                <th>Armor</th>
                <th>$</th>
                <th>K</th>
                <th>A</th>
                <th>D</th>
                <th>ADR</th>
              </tr>
            </thead>
            <tbody>
              {tPlayers.map((player, index) => (
                <tr key={index} className="hover:bg-red-700 transition-all">
                  <td>{player.name}</td>
                  <td>{player.state.health}</td>
                  <td>{player.state.armor}</td>
                  <td>{player.state.money}</td>
                  <td>{player.state.round_kills}</td>
                  <td>{player.state.round_assists}</td>
                  <td>{player.state.round_deaths}</td>
                  <td>{player.state.adr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="text-center mt-6">
        <p>Time Remaining: {phase_countdowns.phase_ends_in}s</p>
      </footer>
    </main>
  );
}
