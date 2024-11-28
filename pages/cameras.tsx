import React from 'react';

export default function Cameras() {
  const cameras = Array.from({ length: 10 }, (_, i) => `Player${i + 1}`);

  return (
    <main className="min-h-screen bg-gray-900 text-white grid grid-cols-2 gap-4 p-6">
      {cameras.map((camera, index) => (
        <div
          key={index}
          className="bg-gray-800 p-4 rounded shadow-lg text-center flex items-center justify-center"
        >
          <h2 className="text-xl font-bold">{camera}</h2>
        </div>
      ))}
    </main>
  );
}
