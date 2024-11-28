/* eslint-disable prefer-const */
import type { NextApiRequest, NextApiResponse } from 'next';

type CameraData = {
  playerName: string;
  cameraLink: string;
};

const cameras: CameraData[] = []; // Уже заменено на const

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(cameras);
}
