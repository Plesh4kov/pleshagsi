export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Вызываем напрямую обработчик из src/app/api/gsi/route.js
            const { GET } = await import('@/app/api/gsi/route');

            const response = await GET(); // Вызов функции GET
            const data = await response.json();

            // Устанавливаем заголовки для vMix
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");

            // Возвращаем данные в формате JSON
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data from route.js:", error.message);
            return res.status(500).json({ error: "Failed to fetch data from GSI route" });
        }
    }

    // Если метод запроса не GET
    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
}
