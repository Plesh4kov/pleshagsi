// pages/cameras.tsx
import { useState, useEffect } from 'react';

interface CameraData {
  playerName: string;
  cameraLink: string;
}

const CamerasPage = () => {
  const [cameras, setCameras] = useState<CameraData[]>([]);  // Типизируем как массив объектов CameraData

  useEffect(() => {
    const fetchCameras = async () => {
      const res = await fetch('/api/get-cameras');
      const data: CameraData[] = await res.json();  // Указываем тип данных как массив CameraData
      setCameras(data);
    };

    fetchCameras();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Player Cameras</h1>
      {cameras.length === 0 ? (
        <p>Loading cameras...</p>
      ) : (
        <ul>
          {cameras.map((camera, index) => (
            <li key={index} className="mb-4">
              <h2 className="text-xl">{camera.playerName}</h2>
              <a href={camera.cameraLink} target="_blank" className="text-blue-600 hover:underline">
                Watch Camera
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CamerasPage;
