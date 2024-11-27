let roundData = []; // Хранилище для данных о раундах
let lastProcessedData = null; // Последние обработанные данные

// Функция для парсинга текстовых данных
function parseRoundData(rawData) {
  const lines = rawData.split('\n'); // Разделяем данные на строки
  // Фильтруем строки, содержащие интересные события (например, изменения денег)
  const filteredLines = lines.filter(line => line.includes('money change'));
  return filteredLines.join('\n'); // Собираем отфильтрованные строки обратно в текст
}

export async function POST(request) {
  try {
    const textData = await request.text(); // Читаем текстовые данные
    console.log('Raw data received:', textData);

    // Проверяем, пришли ли новые данные (удаляем дубликаты)
    if (textData === lastProcessedData) {
      return new Response(JSON.stringify({ message: 'Duplicate data ignored' }), {
        status: 200,
      });
    }

    // Сохраняем последние обработанные данные
    lastProcessedData = textData;

    // Парсим данные и сохраняем только интересные строки
    const parsedData = parseRoundData(textData);

    // Добавляем данные в список
    roundData.push({ timestamp: new Date().toISOString(), data: parsedData });

    // Ограничиваем количество записей (например, 100 последних раундов)
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
