import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/employees';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('bookingEmployees');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        const res = await api.getEmployees();
        const initialData = res.data?.data || [];
        setData(initialData);
        localStorage.setItem('bookingEmployees', JSON.stringify(initialData));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const add = async (payload: any) => {
    const newEmployee = { id: Date.now(), ...payload };
    const newData = [...data, newEmployee];
    setData(newData);
    localStorage.setItem('bookingEmployees', JSON.stringify(newData));
    message.success('Thêm thành công');
  };

  const update = async (id: number, payload: any) => {
    const newData = data.map(e => e.id === Number(id) ? { ...e, ...payload } : e);
    setData(newData);
    localStorage.setItem('bookingEmployees', JSON.stringify(newData));
    message.success('Cập nhật thành công');
  };

  const remove = async (id: number) => {
    const newData = data.filter(e => e.id !== Number(id));
    setData(newData);
    localStorage.setItem('bookingEmployees', JSON.stringify(newData));
    message.success('Xóa thành công');
  };

  return { data, loading, fetch, add, update, remove };
};
