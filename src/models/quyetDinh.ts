import { useState, useCallback } from 'react';
import { getQuyetDinhList, createQuyetDinh, updateQuyetDinh, deleteQuyetDinh } from '@/services/QuanLyVanBang/quyetDinh';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuyetDinhList();
      setDanhSach(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    try {
      await createQuyetDinh(payload);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  const update = async (id: string, payload: any) => {
    try {
      await updateQuyetDinh(id, payload);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteQuyetDinh(id);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
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
