// pages/index.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Интерфейс для типа данных раунда
interface RoundInfo {
  round: string;
  match: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
}

const IndexPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);  // Используем интерфейс RoundInfo

  useEffect(() => {
    const fetchRoundInfo = async () => {
      const res = await fetch('/api/gsi');
      const data: RoundInfo = await res.json();  // Указываем тип для данных, получаемых из API
      setRoundInfo(data);
    };

    fetchRoundInfo();
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2525') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!isAuthenticated ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            placeholder="Enter password"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Round Info</h1>
          {roundInfo ? (
            <div>
              <p className="text-xl">Round: {roundInfo.round}</p>
              <p className="text-xl">Match: {roundInfo.match}</p>
              <p className="text-xl">{roundInfo.team1} vs {roundInfo.team2}</p>
              <p className="text-xl">Score: {roundInfo.score1} - {roundInfo.score2}</p>
            </div>
          ) : (
            <p>Loading round info...</p>
          )}
          <Link href="/cameras">
            <a className="text-blue-600 hover:underline">Go to Camera Links</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
