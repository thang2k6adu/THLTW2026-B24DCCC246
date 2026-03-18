import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/services';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getServices();
      setData(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    await api.createService(payload);
    message.success('Thêm thành công');
    fetch();
  };

  const update = async (id: number, payload: any) => {
    await api.updateService(id, payload);
    message.success('Cập nhật thành công');
    fetch();
  };

  const remove = async (id: number) => {
    await api.deleteService(id);
    message.success('Xóa thành công');
    fetch();
  };

  return { data, loading, fetch, add, update, remove };
};
