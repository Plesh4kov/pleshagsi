'use client';

import { useEffect, useState } from 'react';
import '../styles/styles.css';

interface Team {
    name: string;
    score: number;
}

interface MapInfo {
    name: string;
    team_ct: Team;
    team_t: Team;
    round: number;
}
interface GSIData {
    map: MapInfo;
    phase_countdowns: { phase_ends_in: string };
    round: { phase: string };
    allplayers: Record<string, Player>;
}

export default function Scoreboard() {
    const [data, setData] = useState<GSIData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>('');
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<string>('');

    useEffect(() => {
        if (authenticated) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://pleshagsi.vercel.app/api/gsi');
                    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
                    const json: GSIData[] = await response.json();
                    setData(json[json.length - 1]);
                } catch (err) {
                    setError((err as Error).message);
                }
            };

            fetchData();
            const interval = setInterval(fetchData, 2000); // Обновление данных каждые 2 секунды
            return () => clearInterval(interval);
        }
    }, [authenticated]);

    const handlePasswordSubmit = () => {
        if (password === '2525') {
            setAuthenticated(true);
        } else {
            alert('Incorrect password!');
        }
    };

    const getPlayerNames = () => {
        if (!data || !data.allplayers) return [];
        return Object.values(data.allplayers).map((player) => player.name);
    };

    const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlayer(e.target.value);
    };

    if (!authenticated) {
        return (
            <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Enter Password to Access Stats</h1>
                <input
                    type="password"
                    className="p-2 rounded border-2 border-gray-500 mb-4"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handlePasswordSubmit}
                >
                    Submit
                </button>
            </main>
        );
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (!data) {
        return <p>Loading...</p>;
    }

    const { map, phase_countdowns, round } = data;
    const playerNames = getPlayerNames();

    return (
        <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
            {/* Название карты */}
            <h1 className="text-2xl font-bold mb-4">Map: {map.name}</h1>

            {/* Название команд и счет */}
            <div className="flex justify-center items-center mb-6">
                <div
                    className="text-center p-4 mx-4 rounded-lg shadow-lg"
                    style={{ backgroundColor: '#6E58AB' }}
                >
                    <h2 className="text-xl font-bold">{map.team_ct.name}</h2>
                    <p className="text-3xl font-bold">{map.team_ct.score}</p>
                </div>
                <div
                    className="text-center p-4 mx-4 rounded-lg shadow-lg"
                    style={{ backgroundColor: '#998959' }}
                >
                    <h2 className="text-xl font-bold">{map.team_t.name}</h2>
                    <p className="text-3xl font-bold">{map.team_t.score}</p>
                </div>
            </div>

            {/* Номер раунда */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Round: {map.round}</h2>
            </div>

            {/* Статус раунда и таймер */}
            <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-lg font-semibold mb-2">Round Status: {round.phase}</h2>
                <p className="text-lg">
                    Time Remaining: <span className="font-bold">{phase_countdowns.phase_ends_in}s</span>
                </p>
            </div>

            {/* Выбранный игрок */}
            {selectedPlayer && (
                <div className="text-center bg-gray-700 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Selected Player: {selectedPlayer}</h2>
                </div>
            )}
        </main>
    );
}

interface Player {
    name: string;
}

interface GSIDataPlayers {
    allplayers: Record<string, Player>;
}

export function PageV2() {
    const [players, setPlayers] = useState<string[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string>('');
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        // Fetching players data
        const fetchPlayers = async () => {
            try {
                const response = await fetch('https://pleshagsi.vercel.app/api/gsi');
                if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
                const data: GSIDataPlayers[] = await response.json();
                const allPlayers = data[data.length - 1]?.allplayers || {};
                const playerNames = Object.values(allPlayers).map((player) => player.name);
                setPlayers(playerNames);
            } catch (err) {
                console.error('Error fetching players:', err);
            }
        };

        fetchPlayers();
    }, []);

    useEffect(() => {
        // Fetching cameras
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                setCameras(videoDevices);
            } catch (err) {
                console.error('Error fetching cameras:', err);
            }
        };

        getCameras();
    }, []);

    useEffect(() => {
        // Starting preview for selected camera
        const startPreview = async () => {
            if (selectedCamera) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { deviceId: { exact: selectedCamera } },
                    });
                    setPreviewStream(stream);
                } catch (err) {
                    console.error('Error starting camera preview:', err);
                }
            }
        };

        startPreview();

        return () => {
            if (previewStream) {
                previewStream.getTracks().forEach((track) => track.stop());
                setPreviewStream(null);
            }
        };
    }, [selectedCamera]);

    const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlayer(e.target.value);
    };

    const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCamera(e.target.value);
    };

    return (
        <main className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">Page V2</h1>

            {/* Выбор игрока */}
            <div className="mb-6">
                <label htmlFor="player-select" className="block text-lg font-semibold mb-2">
                    Select Player
                </label>
                <select
                    id="player-select"
                    className="p-2 border-2 border-gray-500 rounded text-black"
                    value={selectedPlayer}
                    onChange={handlePlayerChange}
                >
                    <option value="">Select a player</option>
                    {players.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Выбор камеры */}
            <div className="mb-6">
                <label htmlFor="camera-select" className="block text-lg font-semibold mb-2">
                    Select Camera
                </label>
                <select
                    id="camera-select"
                    className="p-2 border-2 border-gray-500 rounded text-black"
                    value={selectedCamera}
                    onChange={handleCameraChange}
                >
                    <option value="">Select a device</option>
                    {cameras.map((camera) => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${camera.deviceId}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Предварительный просмотр камеры */}
            {previewStream && (
                <div className="mb-6">
                    <video
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '300px', height: '200px', border: '2px solid white' }}
                        ref={(videoElement) => {
                            if (videoElement) videoElement.srcObject = previewStream;
                        }}
                    ></video>
                </div>
            )}

            {/* Выбранный игрок */}
            {selectedPlayer && (
                <div className="text-center bg-gray-700 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Selected Player: {selectedPlayer}</h2>
                </div>
            )}
        </main>
    );
}