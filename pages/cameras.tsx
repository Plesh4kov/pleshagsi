import React, { useEffect, useState } from 'react';

type CameraData = {
  playerName: string;
  cameraLink: string;
};

const Cameras = () => {
  const [cameras, setCameras] = useState<CameraData[]>([]);

  useEffect(() => {
    fetch('/api/get-cameras')
      .then((res) => res.json())
      .then((data) => setCameras(data))
      .catch((err) => console.error('Error fetching cameras:', err));
  }, []);

  return (
    <div>
      <h1>Linked Cameras</h1>
      {cameras.length === 0 ? (
        <p>No cameras linked yet.</p>
      ) : (
        cameras.map((camera, index) => (
          <div key={index}>
            <h3>{camera.playerName}</h3>
            <video src={camera.cameraLink} controls width="640" />
          </div>
        ))
      )}
    </div>
  );
};

export default Cameras;
