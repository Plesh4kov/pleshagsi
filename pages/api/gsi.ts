// pages/api/gsi.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Пример структуры данных от GSI
type GSIData = {
  round: string;
  match: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
};

let roundInfo: GSIData = {
  round: '1',
  match: 'Match 1',
  team1: 'Team A',
  team2: 'Team B',
  score1: 0,
  score2: 0,
};

// API для получения информации о раунде
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Можно заменить на логику получения данных от GSI
    res.status(200).json(roundInfo);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
