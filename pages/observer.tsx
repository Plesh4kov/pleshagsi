import { useEffect, useState } from 'react';
import React from 'react';

export default function Observer() {
  const [observedPlayer, setObservedPlayer] = useState<string>('Loading...');

  useEffect(() => {
    const fetchObserverData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();
        const observer = data.player.name; // Получаем имя игрока, которого держит обсервер
        setObservedPlayer(observer);
      } catch (err) {
        setObservedPlayer('Error loading observer data');
      }
    };

    fetchObserverData();
    const interval = setInterval(fetchObserverData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Observer Camera: {observedPlayer}</h1>
    </main>
  );
}
