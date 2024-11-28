import type { NextApiRequest, NextApiResponse } from 'next';

type CameraData = {
  playerName: string;
  cameraLink: string;
};

let cameras: CameraData[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(cameras);
}
