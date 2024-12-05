export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Формируем URL для локального API
            const protocol = req.headers["x-forwarded-proto"] || "http";
            const host = req.headers.host;
            const apiUrl = `${protocol}://${host}/api/gsi`;

            // Запрашиваем данные из API
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();

            // Устанавливаем заголовки для CORS
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");

            // Возвращаем данные
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
