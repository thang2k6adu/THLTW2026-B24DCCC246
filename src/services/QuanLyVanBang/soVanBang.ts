const STORAGE_KEY = 'dsSoVanBang';

const generateId = () => Math.random().toString(36).substr(2, 9);

export async function getSoVanBangList() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return { data: { data, success: true, total: data.length } };
}

export async function createSoVanBang(payload: any) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newSo = { id: generateId(), ...payload, soVaoSoHienTai: 1 };
  data.push(newSo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true, data: newSo } };
}

export async function updateSoVanBang(id: string, payload: any) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data = data.map((so: any) => (so.id === id ? { ...so, ...payload } : so));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true } };
}

export async function deleteSoVanBang(id: string) {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  data = data.filter((so: any) => so.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return { data: { success: true } };
}
