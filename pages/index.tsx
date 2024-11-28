import { useEffect, useState } from 'react';

type PlayerData = {
  name: string;
  team: string;
  health: number;
};

const Home = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch('/api/gsi');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000); // Обновляем данные каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Игроки на сервере</h1>
      <div className="player-list">
        {players.map((player, index) => (
          <div key={index} className={`player-card ${player.team.toLowerCase()}`}>
            <h2>{player.name}</h2>
            <p>Команда: {player.team}</p>
            <p>Здоровье: {player.health}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
        }
        .player-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .player-card {
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .player-card.ct {
          background-color: #e0f7fa;
        }
        .player-card.t {
          background-color: #ffebee;
        }
      `}</style>
    </div>
  );
};

export default Home;
