import { GET } from "@/app/api/gsi/route";

export default async function handler(req, res) {
    const response = await GET(); // Вызываем существующий GET-обработчик
    const data = await response.json(); // Конвертируем данные в JSON

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data); // Отправляем чистый JSON
}
