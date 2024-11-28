'use client';

import { useEffect, useState } from 'react';

interface Player {
  steamid: string;
  name: string;
}

export default function LinkCamera() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        const allPlayers = data[data.length - 1]?.allplayers || {};
        const playerList = Object.entries(allPlayers).map(([steamid, playerData]: any) => ({
          steamid,
          name: playerData.name,
        }));
        setPlayers(playerList);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  const handleSelectPlayer = (playerName: string) => {
    setSelectedPlayer(playerName);
    console.log(`Player selected: ${playerName}`);
    // Здесь можно добавить логику для отправки привязки камеры
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Link Your Camera</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Select Your Name</h2>
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => (
            <button
              key={player.steamid}
              onClick={() => handleSelectPlayer(player.name)}
              className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600"
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>
      {selectedPlayer && (
        <div className="mt-4 text-xl">
          Selected Player: <span className="font-bold">{selectedPlayer}</span>
        </div>
      )}
    </main>
  );
}
