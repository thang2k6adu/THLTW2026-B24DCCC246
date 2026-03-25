import { useState, useCallback } from 'react';
import { getSoVanBangList, createSoVanBang, updateSoVanBang, deleteSoVanBang } from '@/services/QuanLyVanBang/soVanBang';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await getSoVanBangList();
      setDanhSach(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    try {
      const res: any = await createSoVanBang(payload);
      if (res?.data?.success) {
        fetchDanhSach();
        return { success: true, message: undefined };
      }
      return { success: false, message: res?.data?.message };
    } catch (error) {
      return { success: false };
    }
  };

  const update = async (id: string, payload: any) => {
    try {
      const res: any = await updateSoVanBang(id, payload);
      if (res?.data?.success) {
        fetchDanhSach();
        return { success: true, message: undefined };
      }
      return { success: false, message: res?.data?.message };
    } catch (error) {
      return { success: false };
    }
  };

  const remove = async (id: string) => {
    try {
      const res: any = await deleteSoVanBang(id);
      if (res?.data?.success) {
        fetchDanhSach();
        return { success: true, message: undefined };
      }
      return { success: false, message: res?.data?.message };
    } catch (error) {
      return { success: false };
    }
  };

  return {
    danhSach,
    loading,
    fetchDanhSach,
    add,
    update,
    remove,
  };
};
