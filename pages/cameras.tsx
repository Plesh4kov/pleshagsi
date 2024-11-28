// pages/cameras.tsx
import { useEffect, useState } from 'react';

type CameraData = {
  playerName: string;
  cameraLink: string;
};

const CamerasPage = () => {
  const [cameras, setCameras] = useState<CameraData[]>([]);

  useEffect(() => {
    const fetchCameras = async () => {
      const res = await fetch('/api/get-cameras');
      const data: CameraData[] = await res.json();
      setCameras(data);
    };

    fetchCameras();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-4">Player Cameras</h1>
      <ul className="space-y-4">
        {cameras.map((camera, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100">
            <p className="text-xl font-medium">{camera.playerName}</p>
            <a href={camera.cameraLink} className="text-blue-600 hover:underline">
              Watch Camera
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CamerasPage;
