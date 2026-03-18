import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/appointments';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('bookingAppointments');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        const res = await api.getAppointments();
        const initialData = res.data?.data || [];
        setData(initialData);
        localStorage.setItem('bookingAppointments', JSON.stringify(initialData));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const book = async (payload: any) => {
    try {
      // Overlap check
      const isOverlap = data.some(a => a.date === payload.date && a.time === payload.time && a.employeeId === payload.employeeId && a.status !== 'cancelled');
      if (isOverlap) {
        message.error('Lịch hẹn bị trùng!');
        return false;
      }
      const newAppointment = { id: Date.now(), status: 'pending', ...payload };
      const newData = [...data, newAppointment];
      setData(newData);
      localStorage.setItem('bookingAppointments', JSON.stringify(newData));
      message.success('Đặt lịch thành công');
      return true;
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const changeStatus = async (id: number, status: string) => {
    const newData = data.map(a => a.id === Number(id) ? { ...a, status } : a);
    setData(newData);
    localStorage.setItem('bookingAppointments', JSON.stringify(newData));
    message.success('Cập nhật trạng thái thành công');
  };

  return { data, loading, fetch, book, changeStatus };
};
