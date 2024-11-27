'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface Player {
  name: string;
  health: number;
  armor: number;
  money: number;
  kills: number;
  assists: number;
  deaths: number;
  adr: number;
  team: 'CT' | 'T';
}

interface Team {
  name: string;
  score: number;
}

interface GameData {
  mapName: string;
  round: number;
  timeLeft: string;
  teamCT: Team;
  teamT: Team;
  players: Player[];
}

export default function Scoreboard() {
  const [data, setData] = useState<GameData | null>(null);

  useEffect(() => {
    // Симуляция данных
    const fetchData = () => {
      setData({
        mapName: 'anubis',
        round: 18,
        timeLeft: '1:47',
        teamCT: { name: 'Gaimin Gladiators', score: 5 },
        teamT: { name: 'Apogee', score: 12 },
        players: [
          { name: 'Nodios', health: 100, armor: 100, money: 200, kills: 10, assists: 3, deaths: 13, adr: 73.3, team: 'CT' },
          { name: 'roej', health: 100, armor: 100, money: 50, kills: 10, assists: 3, deaths: 13, adr: 68.7, team: 'CT' },
          { name: 'nicoodoz', health: 100, armor: 100, money: 0, kills: 9, assists: 4, deaths: 15, adr: 53.6, team: 'CT' },
          { name: 'kraghen', health: 100, armor: 100, money: 150, kills: 4, assists: 3, deaths: 13, adr: 36.9, team: 'CT' },
          { name: 'hypex', health: 100, armor: 100, money: 2900, kills: 15, assists: 2, deaths: 6, adr: 72.1, team: 'T' },
          { name: 'Demho', health: 100, armor: 100, money: 2200, kills: 14, assists: 5, deaths: 6, adr: 98.1, team: 'T' },
          { name: 'jcobbb', health: 100, armor: 100, money: 3700, kills: 15, assists: 4, deaths: 7, adr: 78.7, team: 'T' },
          { name: 'hfah', health: 76, armor: 100, money: 4100, kills: 13, assists: 3, deaths: 6, adr: 63.9, team: 'T' },
          { name: 'Prism', health: 100, armor: 100, money: 2250, kills: 11, assists: 1, deaths: 10, adr: 63.9, team: 'T' },
        ],
      });
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <main className="p-4 font-sans bg-gradient-to-b from-gray-800 to-black text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          R: {data.round} - {data.mapName}
        </h1>
        <span className="text-yellow-400 text-xl">{data.timeLeft}</span>
      </header>

      {/* Scoreboard */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-4">
        {/* Teams */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-400">{data.teamCT.name} ({data.teamCT.score})</h2>
          <h2 className="text-lg font-bold text-red-400">{data.teamT.name} ({data.teamT.score})</h2>
        </div>

        {/* Table */}
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-sm text-gray-400">
              <th className="p-2">Player</th>
              <th className="p-2">HP</th>
              <th className="p-2">Armor</th>
              <th className="p-2">$</th>
              <th className="p-2">K</th>
              <th className="p-2">A</th>
              <th className="p-2">D</th>
              <th className="p-2">ADR</th>
            </tr>
          </thead>
          <tbody>
            {data.players.map((player, index) => (
              <tr
                key={index}
                className={`text-sm ${player.team === 'CT' ? 'bg-blue-800' : 'bg-red-800'} ${
                  index % 2 === 0 ? 'bg-opacity-75' : 'bg-opacity-50'
                }`}
              >
                <td className="p-2">{player.name}</td>
                <td className="p-2">{player.health}</td>
                <td className="p-2">{player.armor}</td>
                <td className="p-2">{player.money}</td>
                <td className="p-2">{player.kills}</td>
                <td className="p-2">{player.assists}</td>
                <td className="p-2">{player.deaths}</td>
                <td className="p-2">{player.adr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
