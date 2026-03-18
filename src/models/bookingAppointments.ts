import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/appointments';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments();
      setData(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const book = async (payload: any) => {
    try {
      await api.createAppointment(payload);
      message.success('Đặt lịch thành công');
      fetch();
      return true;
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const changeStatus = async (id: number, status: string) => {
    await api.updateAppointmentStatus(id, status);
    message.success('Cập nhật trạng thái thành công');
    fetch();
  };

  return { data, loading, fetch, book, changeStatus };
};
