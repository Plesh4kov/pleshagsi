let lastGSIData = null; // Переменная для хранения последнего GSI-запроса

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      // Если данные не JSON, читаем их как текст
      const textData = await request.text();
      try {
        data = JSON.parse(textData);
      } catch {
        console.error('Invalid JSON:', textData);
        return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
          status: 400,
        });
      }
    }

    lastGSIData = data; // Сохраняем данные
    console.log('GSI Data Received:', data);

    return new Response(JSON.stringify({ message: 'GSI data received' }), {
      status: 200,
    });
  } catch {
    // Линтер не требует переменной 'error' в catch
    console.error('An unexpected error occurred while processing data.');
    return new Response(JSON.stringify({ error: 'Error processing data' }), {
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
