import { GET as gsiHandler } from '@/app/api/gsi/route';

export async function GET(request) {
  return gsiHandler(request);
}
