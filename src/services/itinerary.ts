import request from '@/utils/axios';

export async function getItineraries() {
  return request.get('/api/itinerary/list');
}

export async function saveItinerary(data: any) {
  return request.post('/api/itinerary/save', { data });
}
