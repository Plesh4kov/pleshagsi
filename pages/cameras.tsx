// pages/cameras.tsx
import { useEffect, useState } from "react";

type CameraData = {
  playerName: string;
  cameraLink: string;
};

const CamerasPage = () => {
  const [cameras, setCameras] = useState<CameraData[]>([]);  // Указываем тип для состояния

  useEffect(() => {
    const fetchCameras = async () => {
      const res = await fetch("/api/get-cameras");
      const data: CameraData[] = await res.json();  // Явно указываем, что ожидаем массив CameraData
      setCameras(data);
    };

    fetchCameras();
  }, []);

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Cameras</h1>
      <ul className="space-y-4">
        {cameras.map((camera, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-200">
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
