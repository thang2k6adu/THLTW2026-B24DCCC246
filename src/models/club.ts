import { useState, useCallback } from 'react';
import { getClubs, saveClubs, IClub } from '@/services/club';
import { message } from 'antd';

export default () => {
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClubs();
      setClubs(data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách câu lạc bộ');
    } finally {
      setLoading(false);
    }
  }, []);

  const addClub = async (club: IClub) => {
    setLoading(true);
    const newClubs = [...clubs, club];
    await saveClubs(newClubs);
    setClubs(newClubs);
    setLoading(false);
    message.success('Thêm câu lạc bộ thành công');
  };

  const updateClub = async (id: string, updatedClub: Partial<IClub>) => {
    setLoading(true);
    const newClubs = clubs.map(c => c.id === id ? { ...c, ...updatedClub } : c);
    await saveClubs(newClubs);
    setClubs(newClubs);
    setLoading(false);
    message.success('Cập nhật câu lạc bộ thành công');
  };

  const deleteClub = async (id: string) => {
    setLoading(true);
    const newClubs = clubs.filter(c => c.id !== id);
    await saveClubs(newClubs);
    setClubs(newClubs);
    setLoading(false);
    message.success('Xóa câu lạc bộ thành công');
  };

  return {
    clubs,
    loading,
    fetchClubs,
    addClub,
    updateClub,
    deleteClub,
  };
};
