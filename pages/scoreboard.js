import { GET } from "@/app/api/gsi/route"; // Берём данные из существующего API

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Вызываем обработчик GET из src/app/api/gsi/route.js
            const response = await GET();
            const data = await response.json();

            // Устанавливаем заголовки и возвращаем JSON
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*"); // Чтобы vMix мог обращаться к API
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
    }

    // Если метод запроса не GET
    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Method not allowed" });
}
