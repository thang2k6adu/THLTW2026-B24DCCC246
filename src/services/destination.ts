import request from '@/utils/axios';

export async function queryDestinationList(params: { type?: string; minPrice?: number; maxPrice?: number; sortBy?: string }) {
  return request.get('/api/destination/list', { params });
}

export async function addDestination(data: any) {
  return request.post('/api/destination/create', { data });
}

export async function updateDestination(data: any) {
  return request.put('/api/destination/update', { data });
}

export async function removeDestination(id: number) {
  return request.delete('/api/destination/delete', { params: { id } });
}
