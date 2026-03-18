import request from '@/utils/axios';

export async function getServices() {
  return request.get('/api/services');
}
export async function createService(data: any) {
  return request.post('/api/services', data);
}
export async function updateService(id: number, data: any) {
  return request.put(`/api/services/${id}`, data);
}
export async function deleteService(id: number) {
  return request.delete(`/api/services/${id}`);
}
