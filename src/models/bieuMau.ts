import { useState, useCallback } from 'react';
import { getBieuMauList, createBieuMau, updateBieuMau, deleteBieuMau } from '@/services/QuanLyVanBang/bieuMau';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await getBieuMauList();
      setDanhSach(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    try {
      const res: any = await createBieuMau(payload);
      if (res?.data?.success) {
        fetchDanhSach();
        return { success: true, message: undefined };
      }
      return { success: false, message: res?.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const update = async (id: string, payload: any) => {
    try {
      const res: any = await updateBieuMau(id, payload);
      if (res?.data?.success) {
        fetchDanhSach();
        return { success: true, message: undefined };
      }
      return { success: false, message: res?.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const remove = async (id: string) => {
    try {
      const res: any = await deleteBieuMau(id);
      if (res?.data?.success) {
        fetchDanhSach();
        return { success: true, message: undefined };
      }
      return { success: false, message: res?.data?.message };
    } catch (error: any) {
      return { success: false, message: error.message };
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
