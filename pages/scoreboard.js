export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Используем абсолютный URL для API-запроса
            const apiUrl = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}/api/gsi`;

            // Делаем запрос к API
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch API: ${response.status}`);
            }

            const data = await response.json();

            // Возвращаем данные клиенту
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching API:", error.message);
            return res.status(500).json({ error: "Failed to fetch API" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
