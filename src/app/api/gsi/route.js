let roundData = []; // Хранилище для данных о раундах

// Настройка заголовков CORS
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Разрешить доступ с любых источников
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Разрешённые методы
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешённые заголовки
  return response;
}

export async function POST(request) {
  try {
    const jsonData = await request.json(); // Читаем JSON данные
    console.log('GSI Data Received:', jsonData);

    // Сохраняем данные в массив
    roundData.push(jsonData);

    // Ограничиваем количество записей (например, 100 последних раундов)
    if (roundData.length > 100) {
      roundData.shift(); // Удаляем самый старый элемент
    }

    const response = new Response(
        JSON.stringify({ message: 'GSI data received' }),
        { status: 200 }
    );
    return setCorsHeaders(response); // Добавляем CORS заголовки
  } catch (error) {
    console.error('Error processing GSI data:', error);
    const response = new Response(
        JSON.stringify({ error: 'Failed to process GSI data' }),
        { status: 500 }
    );
    return setCorsHeaders(response); // Добавляем CORS заголовки
  }
}

export function GET() {
  const response = roundData.length > 0
      ? new Response(JSON.stringify(roundData, null, 2), { status: 200 })
      : new Response(JSON.stringify({ message: 'No data received yet' }), {
        status: 404,
      });

  return setCorsHeaders(response); // Добавляем CORS заголовки
}

// Обработка OPTIONS запроса (предварительный запрос для CORS)
export function OPTIONS() {
  const response = new Response(null, { status: 204 });
  return setCorsHeaders(response); // Добавляем CORS заголовки
}
