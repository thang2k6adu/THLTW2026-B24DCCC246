import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/reviews';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('bookingReviews');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        const res = await api.getReviews();
        const initialData = res.data?.data || [];
        setData(initialData);
        localStorage.setItem('bookingReviews', JSON.stringify(initialData));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addReview = async (payload: any) => {
    const newReview = { id: Date.now(), reply: '', ...payload };
    const newData = [...data, newReview];
    setData(newData);
    localStorage.setItem('bookingReviews', JSON.stringify(newData));
    message.success('Đánh giá thành công');
  };

  const reply = async (id: number, text: string) => {
    const newData = data.map(r => r.id === Number(id) ? { ...r, reply: text } : r);
    setData(newData);
    localStorage.setItem('bookingReviews', JSON.stringify(newData));
    message.success('Phản hồi thành công');
  };

  return { data, loading, fetch, addReview, reply };
};
