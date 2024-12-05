export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Формируем корректный URL для запроса
            const apiUrl = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}/api/gsi`;

            // Делаем запрос к API
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from API: ${response.status}`);
            }

            const data = await response.json();

            // Устанавливаем заголовки и возвращаем данные
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
