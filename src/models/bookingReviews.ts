import { useState, useCallback } from 'react';
import * as api from '@/services/Booking/reviews';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getReviews();
      setData(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const addReview = async (payload: any) => {
    await api.createReview(payload);
    message.success('Đánh giá thành công');
    fetch();
  };

  const reply = async (id: number, text: string) => {
    await api.replyReview(id, text);
    message.success('Phản hồi thành công');
    fetch();
  };

  return { data, loading, fetch, addReview, reply };
};
