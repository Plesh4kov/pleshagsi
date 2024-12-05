export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Делаем запрос к API (куда данные приходят из src/app/api/gsi/route.js)
            const response = await fetch(`${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}/api/gsi`);
            
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();

            // Возвращаем данные в формате JSON
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data from /api/gsi:", error.message);
            return res.status(500).json({ error: "Failed to fetch data from API" });
        }
    }

    // Если метод запроса не GET
    return res.status(405).json({ error: "Method not allowed" });
}
