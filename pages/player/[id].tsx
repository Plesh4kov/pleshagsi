import { useRouter } from 'next/router';

export default function PlayerCamera() {
  const router = useRouter();
  const { id } = router.query; // Получаем ID игрока из URL

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Camera for Player: {id}</h1>
    </main>
  );
}
