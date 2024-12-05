export async function GET() {
  try {
    // Делаем запрос к существующему API /api/gsi
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/gsi`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data from /api/gsi: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in /api/scoreboard:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch scoreboard" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
