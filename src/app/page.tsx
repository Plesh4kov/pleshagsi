'use client';

import { useEffect, useState } from 'react';

// Типы для данных
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

        if (json.length > 0) {
          setData(json[json.length - 1]);
        } else {
          setError('No data available');
        }
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

  if (!data || !data.map || !data.round) {
    return <p>Loading...</p>;
  }

  const { map, round } = data;

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Game Status</h1>

      <section style={{ marginBottom: '20px' }}>
        <h2>Map Information</h2>
        <p><strong>Map:</strong> {map.name}</p>
        <p><strong>CT Score:</strong> {map.team_ct.score}</p>
        <p><strong>T Score:</strong> {map.team_t.score}</p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Teams</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3>CT Team</h3>
            <ul>
              {map.team_ct.players?.map((player: Player, index: number) => (
                <li key={index}>
                  {player.name} - Kills: {player.kills}, Deaths: {player.deaths}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>T Team</h3>
            <ul>
              {map.team_t.players?.map((player: Player, index: number) => (
                <li key={index}>
                  {player.name} - Kills: {player.kills}, Deaths: {player.deaths}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Round Status</h2>
        <p><strong>Status:</strong> {round.status}</p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Chat Messages</h2>
        <ul>
          {round.chat?.map((msg: ChatMessage, index: number) => (
            <li key={index}>
              <strong>{msg.player}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Server Messages</h2>
        <ul>
          {round.server_messages?.map((msg: string, index: number) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
