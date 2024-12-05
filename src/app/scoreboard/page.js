export const dynamic = "force-dynamic"; // Указываем, что страница будет рендериться на сервере

async function getScoreboardData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gsi`, {
      next: { revalidate: 0 }, // Отключаем кэширование
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    return { error: "Failed to fetch scoreboard data" };
  }
}

export default async function ScoreboardPage() {
  const data = await getScoreboardData();

  return (
    <div>
      <h1>Scoreboard (JSON)</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
