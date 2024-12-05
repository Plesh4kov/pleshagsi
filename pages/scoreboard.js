let roundData = []; // Хранилище для данных о раундах

export default function handler(req, res) {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'POST') {
        try {
            const jsonData = req.body; // Получаем данные из тела запроса
            roundData.push(jsonData);

            // Ограничиваем размер массива (например, до 100 элементов)
            if (roundData.length > 100) {
                roundData.shift(); // Удаляем самый старый элемент
            }

            return res.status(200).json({ message: 'GSI data received' });
        } catch (error) {
            console.error('Error processing GSI data:', error);
            return res.status(500).json({ error: 'Failed to process GSI data' });
        }
    }

    if (req.method === 'GET') {
        if (roundData.length === 0) {
            return res.status(404).json({ message: 'No data received yet' });
        }
        return res.status(200).json(roundData);
    }

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
