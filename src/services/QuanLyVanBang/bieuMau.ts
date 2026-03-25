const STORAGE_KEY = 'dsBieuMau';

// Khởi tạo data mặc định nếu chưa có
const initializeDefault = () => {
  const current = localStorage.getItem(STORAGE_KEY);
  if (!current) {
    const defaultData = [
      { id: '1', key: 'danToc', tenTruong: 'Dân tộc', kieuDuLieu: 'String' },
      { id: '2', key: 'noiSinh', tenTruong: 'Nơi sinh', kieuDuLieu: 'String' },
      { id: '3', key: 'diemTrungBinh', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number' },
      { id: '4', key: 'ngayNhapHoc', tenTruong: 'Ngày nhập học', kieuDuLieu: 'Date' },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(current);
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export async function getBieuMauList() {
  const data = initializeDefault();
  return { data: { data, success: true, total: data.length } };
}

export async function createBieuMau(payload: any) {
  const data = initializeDefault();
  const key = payload.tenTruong.toLowerCase().replace(/ \s/g, '');
  const newField = { id: generateId(), key, ...payload };
  data.push(newField);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true, data: newField } };
}

export async function updateBieuMau(id: string, payload: any) {
  let data = initializeDefault();
  data = data.map((bm: any) => (bm.id === id ? { ...bm, ...payload } : bm));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true } };
}

export async function deleteBieuMau(id: string) {
  let data = initializeDefault();
  data = data.filter((bm: any) => bm.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true } };
}
