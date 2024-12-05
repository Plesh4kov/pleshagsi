export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Формируем полный URL для обращения к API
            const protocol = req.headers["x-forwarded-proto"] || "http";
            const host = req.headers.host;
            const apiUrl = `${protocol}://${host}/api/gsi`;

            // Выполняем запрос к API
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();

            // Устанавливаем заголовки и возвращаем данные
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data from API:", error.message);
            return res.status(500).json({ error: "Failed to fetch data from API" });
        }
    }

    // Если метод запроса не GET
    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
}
