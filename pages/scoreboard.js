import { GET } from "@/app/api/gsi/route";

export default async function handler(req, res) {
    const response = await GET(); // Используем существующий метод
    const data = await response.json();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data); // Отправляем JSON
}
