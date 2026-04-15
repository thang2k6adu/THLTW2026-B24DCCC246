import request from '@/utils/axios';

export async function getDanhSachPhongHoc() {
  return request.get('/api/phong-hoc/list');
}

export async function addPhongHoc(payload: PhongHoc.IRecord) {
  return request.post('/api/phong-hoc', payload);
}

export async function editPhongHoc(payload: PhongHoc.IRecord) {
  return request.put('/api/phong-hoc', payload);
}

export async function deletePhongHoc(id: string) {
  return request.delete(`/api/phong-hoc/${id}`);
}
