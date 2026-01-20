import request from '@/utils/axios';

export async function querySanphamList(params: { current?: number; pageSize?: number; name?: string }) {
    return request.get('/api/sanpham/list', { params });
}

export async function addSanpham(data: { name: string; price: number; quantity: number }) {
    return request.post('/api/sanpham/add', data);
}

export async function deleteSanpham(id: number) {
    return request.delete('/api/sanpham/delete', { data: { id } });
}
