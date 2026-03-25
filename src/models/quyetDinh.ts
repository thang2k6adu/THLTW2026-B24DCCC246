import { useState, useCallback } from 'react';
import { getQuyetDinhList, createQuyetDinh, updateQuyetDinh, deleteQuyetDinh } from '@/services/QuanLyVanBang/quyetDinh';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await getQuyetDinhList();
      setDanhSach(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    try {
      const res: any = await createQuyetDinh(payload);
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
      const res: any = await updateQuyetDinh(id, payload);
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
      const res: any = await deleteQuyetDinh(id);
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
