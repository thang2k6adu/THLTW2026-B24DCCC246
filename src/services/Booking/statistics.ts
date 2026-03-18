import request from '@/utils/axios';

export async function getStatistics() {
  return request.get('/api/statistics');
}
