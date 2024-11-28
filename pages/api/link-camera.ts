import type { NextApiRequest, NextApiResponse } from 'next';

type CameraData = {
  playerName: string;
  cameraLink: string;
};

let cameras: CameraData[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { playerName, cameraLink } = req.body;
    if (!playerName || !cameraLink) {
      res.status(400).json({ message: 'Missing playerName or cameraLink' });
      return;
    }
    cameras.push({ playerName, cameraLink });
    res.status(200).json({ message: 'Camera linked successfully' });
  } else if (req.method === 'GET') {
    res.status(200).json(cameras);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
