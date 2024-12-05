import { GET } from "@/app/api/gsi/route";

export default async function handler(req, res) {
    if (req.method === "GET") {
        // Получаем данные из API обработчика в App Router
        const response = await GET();
        const data = await response.json();

        // Устанавливаем заголовок Content-Type как JSON
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
}
