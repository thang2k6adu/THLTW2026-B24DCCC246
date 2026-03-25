import { useState, useCallback } from 'react';
import { getVanBangList, createVanBang, updateVanBang, deleteVanBang, traCuuVanBang } from '@/services/QuanLyVanBang/vanBang';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [ketQuaTraCuu, setKetQuaTraCuu] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDanhSach = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getVanBangList();
      setDanhSach(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const traCuu = async (params: any) => {
    setLoading(true);
    try {
      const res = await traCuuVanBang(params);
      if (res?.data?.success) {
        setKetQuaTraCuu(res?.data?.data || []);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const add = async (payload: any) => {
    try {
      await createVanBang(payload);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  const update = async (id: string, payload: any) => {
    try {
      await updateVanBang(id, payload);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteVanBang(id);
      fetchDanhSach();
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    danhSach,
    ketQuaTraCuu,
    loading,
    fetchDanhSach,
    traCuu,
    add,
    update,
    remove,
  };
};
