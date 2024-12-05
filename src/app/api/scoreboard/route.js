import { GET as getGSI } from '@/app/api/gsi/route'; // Импортируем GSI обработчик

export async function GET() {
    return getGSI(); // Просто возвращаем данные из существующего обработчика
}
