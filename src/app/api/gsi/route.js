export async function POST(request) {
    try {
      // Попробуем прочитать тело запроса как JSON
      const contentType = request.headers.get('content-type') || '';
      let data;
  
      if (contentType.includes('application/json')) {
        data = await request.json();
      } else {
        // Если данные не JSON, читаем их как текст
        const textData = await request.text();
        try {
          data = JSON.parse(textData); // Попробуем преобразовать текст в JSON
        } catch (error) {
          console.error('Failed to parse JSON:', textData);
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
    } catch (error) {
      console.error('Error occurred while processing GSI data:', error);
      return new Response(JSON.stringify({ error: 'Error processing data' }), {
        status: 500,
      });
    }
  }
  