let roundData = []; // Хранилище данных GSI

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const jsonData = await req.json(); // Чтение JSON данных из запроса
            console.log("GSI Data Received:", jsonData);

            // Сохраняем данные
            roundData.push(jsonData);

            // Ограничиваем количество записей (например, последние 100 раундов)
            if (roundData.length > 100) {
                roundData.shift();
            }

            res.setHeader("Access-Control-Allow-Origin", "*");
            return res.status(200).json({ message: "GSI data received" });
        } catch (error) {
            console.error("Error processing GSI data:", error);
            res.setHeader("Access-Control-Allow-Origin", "*");
            return res.status(500).json({ error: "Failed to process GSI data" });
        }
    } else if (req.method === "GET") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(200).json(roundData);
    } else if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
}
