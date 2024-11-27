let roundData = []; // Хранилище для данных о раундах

export async function POST(request) {
  try {
    const textData = await request.text(); // Читаем текстовые данные
    console.log('Raw data received:', textData);

    // Сохраняем данные о текущем раунде
    roundData.push({ timestamp: new Date().toISOString(), data: textData });

    // Ограничиваем количество записей в списке (например, 100 последних раундов)
    if (roundData.length > 100) {
      roundData.shift(); // Удаляем самый старый элемент
    }

    return new Response(JSON.stringify({ message: 'Data received' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error processing GSI data:', error);
    return new Response(JSON.stringify({ error: 'Failed to process data' }), {
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
