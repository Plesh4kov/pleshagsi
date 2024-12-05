"use client";

import { useEffect, useState } from "react";

export default function Scoreboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/gsi"); // HTTP-запрос к API
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchData();

        // Автообновление каждые 5 секунд
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!data.length) {
        return <p>No data received yet.</p>;
    }

    return (
        <div>
            <h1>Scoreboard</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
