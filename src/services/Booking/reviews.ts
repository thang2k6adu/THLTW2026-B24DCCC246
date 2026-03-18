import request from '@/utils/axios';

export async function getReviews() {
  return request.get('/api/reviews');
}
export async function createReview(data: any) {
  return request.post('/api/reviews', data);
}
export async function replyReview(id: number, reply: string) {
  return request.put(`/api/reviews/${id}/reply`, { reply });
}
