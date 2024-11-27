let lastGSIData = null; // Переменная для хранения последнего GSI-запроса

export async function POST(request) {
  try {
    const textData = await request.text(); // Читаем тело запроса как текст
    console.log('Raw data received:', textData);

    // Сохраняем сырые данные для отображения
    lastGSIData = { raw: textData };

    return new Response(JSON.stringify({ message: 'Data received' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing data:', error);
    return new Response(JSON.stringify({ error: 'Failed to process data' }), {
      status: 500,
    });
  }
}

export function GET() {
  if (lastGSIData) {
    return new Response(JSON.stringify(lastGSIData), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'No data received yet' }), {
      status: 404,
    });
  }
}
