"use client";

import { useEffect, useState } from "react";

export default function Scoreboard() {
    const [rounds, setRounds] = useState([]);

    useEffect(() => {
        async function fetchRounds() {
            try {
                const response = await fetch("/api/gsi", { method: "GET" });
                if (response.ok) {
                    const data = await response.json();
                    setRounds(data);
                } else {
                    console.error("Failed to fetch rounds:", response.status);
                }
            } catch (error) {
                console.error("Error fetching rounds:", error);
            }
        }

        fetchRounds();

        // Автообновление каждые 5 секунд
        const interval = setInterval(fetchRounds, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!rounds.length) {
        return <p>No data received yet.</p>;
    }

    return (
        <div>
            <h1>Scoreboard</h1>
            {rounds.map((round, index) => (
                <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                    <h3>Round {index + 1}</h3>
                    <pre>{JSON.stringify(round, null, 2)}</pre>
                </div>
            ))}
        </div>
    );
}
