import { NextApiRequest, NextApiResponse } from 'next';
import { updateCameraMapping } from '../../store';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { playerName, cameraURL } = req.body;

    if (!playerName || !cameraURL) {
      return res.status(400).json({ error: 'Player name and camera URL are required' });
    }

    updateCameraMapping(playerName, cameraURL);

    return res.status(200).json({ message: `Camera for ${playerName} updated successfully` });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
