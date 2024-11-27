'use client';

import { useEffect, useState } from 'react';

// Интерфейс для данных о раундах
interface RoundData {
  timestamp: string;
  data: string;
}

export default function Home() {
  const [rounds, setRounds] = useState<RoundData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (response.ok) {
          const data: RoundData[] = await response.json();
          setRounds(data); // Обновляем список раундов
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
      {rounds.length > 0 ? (
        <ul>
          {rounds.map((round, index) => (
            <li key={index}>
              <strong>Round {index + 1} (Timestamp: {round.timestamp}):</strong>
              <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                {round.data}
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
