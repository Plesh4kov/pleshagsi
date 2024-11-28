import { useState } from 'react';

interface Player {
  id: string;
  name: string;
}

const players: Player[] = [
  { id: '1', name: 'Player1' },
  { id: '2', name: 'Player2' },
  // Добавьте остальных игроков...
];

export default function LinkCamera() {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedPlayer(id);
    alert(`Camera linked to ${players.find((p) => p.id === id)?.name}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Link Your Camera</h1>
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Select Your Name</h2>
        <ul>
          {players.map((player) => (
            <li
              key={player.id}
              className="cursor-pointer hover:text-yellow-400"
              onClick={() => handleSelect(player.id)}
            >
              {player.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedPlayer && (
        <p className="mt-4 text-green-400">
          Camera linked to: {players.find((p) => p.id === selectedPlayer)?.name}
        </p>
      )}
    </main>
  );
}
