import request from '@/utils/axios';

export async function getEmployees() {
  return request.get('/api/employees');
}
export async function createEmployee(data: any) {
  return request.post('/api/employees', data);
}
export async function updateEmployee(id: number, data: any) {
  return request.put(`/api/employees/${id}`, data);
}
export async function deleteEmployee(id: number) {
  return request.delete(`/api/employees/${id}`);
}
