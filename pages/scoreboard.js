export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Формируем абсолютный URL для API
            const protocol = req.headers["x-forwarded-proto"] || "http";
            const host = req.headers.host;
            const apiUrl = `${protocol}://${host}/api/gsi`;

            // Делаем запрос к API
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
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

export const config = {
    runtime: "edge", // Для обработки только на сервере
};
