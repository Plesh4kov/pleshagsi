export async function POST(request) {
    try {
      const data = await request.json();
      console.log(data); // Логируйте данные GSI для проверки
  
      return new Response(JSON.stringify({ message: 'GSI data received' }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), {
        status: 400,
      });
    }
  }
  
  export function GET() {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
    });
  }
  