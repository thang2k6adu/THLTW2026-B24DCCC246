import { useState, useCallback } from 'react';
import { getBieuMauList, createBieuMau, updateBieuMau, deleteBieuMau } from '@/services/QuanLyVanBang/bieuMau';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBieuMauList();
      setDanhSach(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    try {
      await createBieuMau(payload);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  const update = async (id: string, payload: any) => {
    try {
      await updateBieuMau(id, payload);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteBieuMau(id);
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
