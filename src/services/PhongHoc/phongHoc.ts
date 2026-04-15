const STORAGE_KEY = 'PHONG_HOC_DATA';

// Dữ liệu mẫu (8 phòng, đủ loại, đủ chỗ ngồi)
const MOCK_DATA: PhongHoc.IRecord[] = [
  { _id: '1', maPhong: 'P101', tenPhong: 'Phòng 101', soChoNgoi: 50, loaiPhong: 'Lý thuyết', nguoiPhuTrach: 'Nguyễn Văn A' },
  { _id: '2', maPhong: 'P102', tenPhong: 'Phòng 102', soChoNgoi: 100, loaiPhong: 'Hội trường', nguoiPhuTrach: 'Trần Thị B' },
  { _id: '3', maPhong: 'PM1', tenPhong: 'Phòng Máy 1', soChoNgoi: 20, loaiPhong: 'Thực hành', nguoiPhuTrach: 'Lê Văn C' },
  { _id: '4', maPhong: 'PM2', tenPhong: 'Phòng Máy 2', soChoNgoi: 25, loaiPhong: 'Thực hành', nguoiPhuTrach: 'Phạm Văn D' },
  { _id: '5', maPhong: 'P202', tenPhong: 'Phòng 202', soChoNgoi: 40, loaiPhong: 'Lý thuyết', nguoiPhuTrach: 'Hoàng Thị E' },
  { _id: '6', maPhong: 'HT1', tenPhong: 'Hội trường Lớn', soChoNgoi: 200, loaiPhong: 'Hội trường', nguoiPhuTrach: 'Nguyễn Văn A' },
  { _id: '7', maPhong: 'P301', tenPhong: 'Phòng 301', soChoNgoi: 30, loaiPhong: 'Lý thuyết', nguoiPhuTrach: 'Trần Thị B' },
  { _id: '8', maPhong: 'PM3', tenPhong: 'Phòng Máy 3', soChoNgoi: 15, loaiPhong: 'Thực hành', nguoiPhuTrach: 'Lê Văn C' }
];

const getLocalData = (): PhongHoc.IRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
  return MOCK_DATA;
};

const saveLocalData = (data: PhongHoc.IRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Delay ảo để giống gọi API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDanhSachPhongHoc() {
  await delay(300);
  return { data: { data: getLocalData(), success: true } };
}

export async function addPhongHoc(payload: PhongHoc.IRecord) {
  await delay(300);
  const data = getLocalData();
  
  if (data.some(p => p.maPhong === payload.maPhong || p.tenPhong === payload.tenPhong)) {
    return Promise.reject({ response: { data: { message: 'Mã phòng hoặc Tên phòng đã tồn tại!' } } });
  }

  const newRecord = { ...payload, _id: Date.now().toString() };
  data.push(newRecord);
  saveLocalData(data);
  
  return { data: { data: newRecord, success: true, message: 'Thêm phòng thành công' } };
}

export async function editPhongHoc(payload: PhongHoc.IRecord) {
  await delay(300);
  const data = getLocalData();
  const index = data.findIndex(p => p._id === payload._id);
  
  if (index === -1) {
    return Promise.reject({ response: { data: { message: 'Không tìm thấy phòng!' } } });
  }

  if (data.some(p => p._id !== payload._id && (p.maPhong === payload.maPhong || p.tenPhong === payload.tenPhong))) {
    return Promise.reject({ response: { data: { message: 'Mã phòng hoặc Tên phòng đã bị trùng lặp!' } } });
  }

  data[index] = { ...data[index], ...payload };
  saveLocalData(data);
  
  return { data: { data: data[index], success: true, message: 'Cập nhật thành công' } };
}

export async function deletePhongHoc(id: string) {
  await delay(200);
  let data = getLocalData();
  data = data.filter(p => p._id !== id);
  saveLocalData(data);
  
  return { data: { success: true, message: 'Xóa phòng thành công' } };
}
