let roundData = []; // Хранилище для данных о раундах

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

    return new Response(JSON.stringify({ message: 'GSI data received' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing GSI data:', error);
    return new Response(JSON.stringify({ error: 'Failed to process GSI data' }), {
      status: 500,
    });
  }
}

export function GET() {
  if (roundData.length > 0) {
    return new Response(JSON.stringify(roundData, null, 2), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'No data received yet' }), {
      status: 404,
    });
  }
}
