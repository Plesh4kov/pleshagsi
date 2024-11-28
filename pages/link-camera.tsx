import React, { useState } from 'react';

const LinkCamera = () => {
  const [playerName, setPlayerName] = useState('');
  const [cameraLink, setCameraLink] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName || !cameraLink) {
      setStatusMessage('Please fill in all fields.');
      return;
    }
    try {
      const response = await fetch('/api/link-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName, cameraLink }),
      });
      if (response.ok) {
        setStatusMessage('Camera linked successfully!');
        setPlayerName('');
        setCameraLink('');
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error linking camera:', error);
      setStatusMessage('Failed to link camera.');
    }
  };

  return (
    <div>
      <h1>Link a Camera</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="playerName">Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cameraLink">Camera Link:</label>
          <input
            type="text"
            id="cameraLink"
            value={cameraLink}
            onChange={(e) => setCameraLink(e.target.value)}
          />
        </div>
        <button type="submit">Link Camera</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default LinkCamera;
