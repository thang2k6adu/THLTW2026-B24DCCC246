import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/services';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('bookingServices');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        const res = await api.getServices();
        const initialData = res.data?.data || [];
        setData(initialData);
        localStorage.setItem('bookingServices', JSON.stringify(initialData));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    const newService = { id: Date.now(), ...payload };
    const newData = [...data, newService];
    setData(newData);
    localStorage.setItem('bookingServices', JSON.stringify(newData));
    message.success('Thêm thành công');
  };

  const update = async (id: number, payload: any) => {
    const newData = data.map(s => s.id === Number(id) ? { ...s, ...payload } : s);
    setData(newData);
    localStorage.setItem('bookingServices', JSON.stringify(newData));
    message.success('Cập nhật thành công');
  };

  const remove = async (id: number) => {
    const newData = data.filter(s => s.id !== Number(id));
    setData(newData);
    localStorage.setItem('bookingServices', JSON.stringify(newData));
    message.success('Xóa thành công');
  };

  return { data, loading, fetch, add, update, remove };
};
