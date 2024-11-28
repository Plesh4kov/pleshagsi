// pages/api/get-cameras.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type CameraData = {
  playerName: string;
  cameraLink: string;
};

let cameras: CameraData[] = [
  { playerName: 'Player 1', cameraLink: 'https://camera-link1.com' },
  { playerName: 'Player 2', cameraLink: 'https://camera-link2.com' },
  // Добавьте другие камеры по мере необходимости
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(cameras);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
