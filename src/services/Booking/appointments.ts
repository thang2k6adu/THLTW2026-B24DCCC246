import request from '@/utils/axios';

export async function getAppointments() {
  return request.get('/api/appointments');
}
export async function createAppointment(data: any) {
  return request.post('/api/appointments', data);
}
export async function updateAppointmentStatus(id: number, status: string) {
  return request.put(`/api/appointments/${id}/status`, { status });
}
