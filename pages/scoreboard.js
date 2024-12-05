"use client";

import { useEffect, useState } from "react";

export default function Scoreboard() {
    const [rounds, setRounds] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        async function fetchUpdatedRounds() {
            try {
                const response = await fetch("/api/scoreboard", { method: "GET" });
                if (response.ok) {
                    const data = await response.json();
                    
                    // Проверяем изменения
                    if (JSON.stringify(data) !== JSON.stringify(rounds)) {
                        setRounds(data);
                        setLastUpdated(new Date().toISOString());
                    }
                } else {
                    console.error("Failed to fetch updated rounds:", response.status);
                }
            } catch (error) {
                console.error("Error fetching updated rounds:", error);
            }
        }

        // Запрашиваем данные каждые 5 секунд
        const interval = setInterval(fetchUpdatedRounds, 5000);
        fetchUpdatedRounds(); // Первый запуск

        return () => clearInterval(interval);
    }, [rounds]);

    return (
        <div>
            <h1>Scoreboard (JSON)</h1>
            <p>Last Updated: {lastUpdated || "Loading..."}</p>
            <pre>{JSON.stringify(rounds, null, 2)}</pre>
        </div>
    );
}
