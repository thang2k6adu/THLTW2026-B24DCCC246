const STORAGE_KEY = 'dsQuyetDinh';

const generateId = () => Math.random().toString(36).substr(2, 9);

export async function getQuyetDinhList() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return { data: { data, success: true, total: data.length } };
}

export async function createQuyetDinh(payload: any) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newQD = { id: generateId(), ...payload, luotTraCuu: 0 };
  data.push(newQD);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true, data: newQD } };
}

export async function updateQuyetDinh(id: string, payload: any) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data = data.map((qd: any) => (qd.id === id ? { ...qd, ...payload } : qd));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true } };
}

export async function deleteQuyetDinh(id: string) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data = data.filter((qd: any) => qd.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true } };
}
