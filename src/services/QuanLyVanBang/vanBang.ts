const STORAGE_KEY_VB = 'dsVanBang';
const STORAGE_KEY_QD = 'dsQuyetDinh';
const STORAGE_KEY_SVB = 'dsSoVanBang';

const generateId = () => Math.random().toString(36).substr(2, 9);

export async function getVanBangList() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY_VB) || '[]');
  return { data: { data, success: true, total: data.length } };
}

export async function createVanBang(payload: any) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY_VB) || '[]');
  const qdList = JSON.parse(localStorage.getItem(STORAGE_KEY_QD) || '[]');
  const svbList = JSON.parse(localStorage.getItem(STORAGE_KEY_SVB) || '[]');
  
  const quyetDinh = qdList.find((q: any) => q.id === payload.idQuyetDinh);
  if (!quyetDinh) return { data: { success: false, message: 'Quyết định không tồn tại' } };
  
  const soVanBang = svbList.find((so: any) => so.id === quyetDinh.idSoVanBang);
  if (!soVanBang) return { data: { success: false, message: 'Sổ văn bằng không tồn tại' } };
  
  const soVaoSo = `SVB-${soVanBang.nam}-${soVanBang.soVaoSoHienTai.toString().padStart(4, '0')}`;
  soVanBang.soVaoSoHienTai += 1;
  localStorage.setItem(STORAGE_KEY_SVB, JSON.stringify(svbList)); // update Sổ
  
  const newVB = { ...payload, id: generateId(), soVaoSo };
  data.push(newVB);
  localStorage.setItem(STORAGE_KEY_VB, JSON.stringify(data));
  
  return { data: { success: true, data: newVB } };
}

export async function updateVanBang(id: string, payload: any) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY_VB) || '[]');
  data = data.map((vb: any) => (vb.id === id ? { ...vb, ...payload, soVaoSo: vb.soVaoSo } : vb)); // soVaoSo immutable
  localStorage.setItem(STORAGE_KEY_VB, JSON.stringify(data));
  return { data: { success: true } };
}

export async function deleteVanBang(id: string) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY_VB) || '[]');
  data = data.filter((vb: any) => vb.id !== id);
  localStorage.setItem(STORAGE_KEY_VB, JSON.stringify(data));
  return { data: { success: true } };
}

export async function traCuuVanBang(params: any) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY_VB) || '[]');
  const qdList = JSON.parse(localStorage.getItem(STORAGE_KEY_QD) || '[]');
  
  const { soHieuVanBang, soVaoSo, maSinhVien, hoTen, ngaySinh } = params;
  
  let results = data.filter((vb: any) => {
    let match = true;
    if (soHieuVanBang && vb.soHieuVanBang !== soHieuVanBang) match = false;
    if (soVaoSo && vb.soVaoSo !== soVaoSo) match = false;
    if (maSinhVien && vb.maSinhVien !== maSinhVien) match = false;
    if (hoTen && !vb.hoTen.toLowerCase().includes((hoTen as string).toLowerCase())) match = false;
    if (ngaySinh && vb.ngaySinh !== ngaySinh) match = false;
    return match;
  });

  // Ghi nhận lượt tra cứu
  results.forEach((vb: any) => {
    const qd = qdList.find((q: any) => q.id === vb.idQuyetDinh);
    if (qd) {
      qd.luotTraCuu = (qd.luotTraCuu || 0) + 1;
    }
  });
  localStorage.setItem(STORAGE_KEY_QD, JSON.stringify(qdList));

  return { data: { success: true, data: results, total: results.length } };
}
