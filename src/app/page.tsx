'use client';

import { useEffect, useState } from 'react';

// Интерфейс для описания данных GSI
interface GSIProvider {
  name: string;
  appid: number;
  version: number;
  steamid: string;
  timestamp: number;
}

interface GSITeam {
  score: number;
  players_alive: number;
  timeouts_remaining: number;
}

interface GSIMap {
  mode: string;
  name: string;
  phase: string;
  round: number;
  team_ct: GSITeam;
  team_t: GSITeam;
}

interface GSIPlayerState {
  health: number;
  armor: number;
  helmet: boolean;
  money: number;
  round_kills: number;
  round_killhs: number;
}

interface GSIPlayerWeapon {
  name: string;
  ammo_clip: number;
  ammo_clip_max: number;
  ammo_reserve: number;
  state: string;
}

interface GSIPlayer {
  steamid: string;
  name: string;
  team: string;
  state: GSIPlayerState;
  weapons: Record<string, GSIPlayerWeapon>;
}

interface GSIRound {
  phase: string;
  bomb: string | null;
  win_team: string | null;
}

interface GSIData {
  provider: GSIProvider;
  map: GSIMap;
  player: GSIPlayer;
  round: GSIRound;
}

export default function Home() {
  const [data, setData] = useState<GSIData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (response.ok) {
          const json = await response.json();
          setData(json); // Обновляем данные
        }
      } catch (error) {
        console.error('Error fetching GSI data:', error);
      }
    };

    // Запрашиваем данные каждые 2 секунды
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <h1>GSI Data Viewer</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((entry, index) => (
            <li key={index}>
              <strong>Round {index + 1}:</strong>
              <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                {JSON.stringify(entry, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data received yet...</p>
      )}
    </main>
  );
}
