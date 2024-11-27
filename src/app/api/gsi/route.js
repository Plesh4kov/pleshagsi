let lastGSIData = null; // Переменная для хранения последнего GSI-запроса

export async function POST(request) {
  try {
    const data = await request.json();
    lastGSIData = data; // Сохраняем данные GSI
    console.log("GSI Data Received:", data);
    return new Response(JSON.stringify({ message: "GSI data received" }), {
      status: 200,
    });
  } catch (error) {
    // Выводим ошибку явно
    console.error("Error occurred while processing GSI data:", error);
    return new Response(JSON.stringify({ error: "Invalid data" }), {
      status: 400,
    });
  }
}

export function GET() {
  // Возвращаем последнее сохраненное GSI-состояние
  if (lastGSIData) {
    return new Response(JSON.stringify(lastGSIData), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: "No data received yet" }), {
      status: 404,
    });
  }
}
