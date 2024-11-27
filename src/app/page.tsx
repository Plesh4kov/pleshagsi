'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [gsiData, setGsiData] = useState(null);

  // Функция для периодического получения данных GSI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gsi');
        if (response.ok) {
          const data = await response.json();
          setGsiData(data); // Устанавливаем полученные данные
        }
      } catch (error) {
        console.error('Error fetching GSI data:', error);
      }
    };

    // Запрашиваем данные каждые 2 секунды
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <h1>GSI Data Viewer</h1>
      {gsiData ? (
        <pre>{JSON.stringify(gsiData, null, 2)}</pre>
      ) : (
        <p>No data received yet...</p>
      )}
    </main>
  );
}
