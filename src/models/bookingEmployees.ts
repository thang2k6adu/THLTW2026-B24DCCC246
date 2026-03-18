import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/employees';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees();
      setData(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    await api.createEmployee(payload);
    message.success('Thêm thành công');
    fetch();
  };

  const update = async (id: number, payload: any) => {
    await api.updateEmployee(id, payload);
    message.success('Cập nhật thành công');
    fetch();
  };

  const remove = async (id: number) => {
    await api.deleteEmployee(id);
    message.success('Xóa thành công');
    fetch();
  };

  return { data, loading, fetch, add, update, remove };
};
