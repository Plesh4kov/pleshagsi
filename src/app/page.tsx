'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/gsi');
      const json = await response.json();
      setData(json[json.length - 1]); // Берём последний элемент из массива
    };

    // Обновляем данные каждые 2 секунды
    const interval = setInterval(fetchData, 2000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Game Status</h1>

      <section style={{ marginBottom: '20px' }}>
        <h2>Map Information</h2>
        <p><strong>Map:</strong> {data.map.name}</p>
        <p><strong>CT Score:</strong> {data.map.team_ct.score}</p>
        <p><strong>T Score:</strong> {data.map.team_t.score}</p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Teams</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3>CT Team</h3>
            <ul>
              {data.map.team_ct.players.map((player: any, index: number) => (
                <li key={index}>
                  {player.name} - Kills: {player.kills}, Deaths: {player.deaths}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>T Team</h3>
            <ul>
              {data.map.team_t.players.map((player: any, index: number) => (
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
        <p><strong>Status:</strong> {data.round.status}</p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>Chat Messages</h2>
        <ul>
          {data.round.chat.map((msg: any, index: number) => (
            <li key={index}>
              <strong>{msg.player}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Server Messages</h2>
        <ul>
          {data.round.server_messages.map((msg: string, index: number) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
