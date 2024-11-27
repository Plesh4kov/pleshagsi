'use client';

import { useEffect, useState } from 'react';

// Интерфейсы для типов данных
interface Player {
  name: string;
  kills: number;
  deaths: number;
}

interface Team {
  score: number;
  players: Player[];
}

interface MapData {
  name: string;
  team_ct: Team;
  team_t: Team;
}

interface ChatMessage {
  player: string;
  message: string;
}

interface RoundData {
  status: string;
  chat: ChatMessage[];
  server_messages: string[];
}

interface GSIData {
  map: MapData;
  round: RoundData;
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

        // Убедимся, что JSON содержит нужные данные
        if (Array.isArray(json) && json.length > 0) {
          setData(json[json.length - 1]); // Получаем последние данные
        } else {
          setError('No data available');
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'An unknown error occurred');
      }
    };

    // Запрашиваем данные каждые 2 секунды
    const interval = setInterval(fetchData, 2000);
    fetchData(); // Первый вызов сразу
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { map, round } = data;

  return (
    <main style={{ padding: '20px' }}>
      <h1>Game Status</h1>
      <h2>Map: {map.name}</h2>
      <h3>Score</h3>
      <p>CT: {map.team_ct.score} - T: {map.team_t.score}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>CT Players</h3>
          <ul>
            {map.team_ct.players.map((player: Player, index: number) => (
              <li key={index}>
                {player.name} - Kills: {player.kills}, Deaths: {player.deaths}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>T Players</h3>
          <ul>
            {map.team_t.players.map((player: Player, index: number) => (
              <li key={index}>
                {player.name} - Kills: {player.kills}, Deaths: {player.deaths}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3>Round Status: {round.status}</h3>

      <div>
        <h3>Chat</h3>
        <ul>
          {round.chat.map((msg: ChatMessage, index: number) => (
            <li key={index}>
              <strong>{msg.player}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Server Messages</h3>
        <ul>
          {round.server_messages.map((msg: string, index: number) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
