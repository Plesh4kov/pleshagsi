import {useEffect, useState} from "react";

export default function V2() {
    return <PageV2 />;
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
                        video: {deviceId: {exact: selectedCamera}},
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
        <main
            className="p-4 bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex flex-col items-center justify-center">
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
                        style={{width: '300px', height: '200px', border: '2px solid white'}}
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