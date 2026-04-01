import { useState, useCallback } from 'react';
import { getRegistrations, saveRegistrations } from '@/services/registration';
import type { IRegistration, RegistrationStatus } from '@/services/registration';
import { message } from 'antd';
import moment from 'moment';

export default () => {
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  }, []);

  const addRegistration = async (reg: Omit<IRegistration, 'id' | 'status' | 'history'>) => {
    setLoading(true);
    const newReg: IRegistration = {
      ...reg,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      history: [{
        action: 'Tạo đơn',
        actor: 'Hệ thống',
        timestamp: moment().toISOString(),
      }]
    };
    const newRegs = [...registrations, newReg];
    await saveRegistrations(newRegs);
    setRegistrations(newRegs);
    setLoading(false);
    message.success('Thêm đơn đăng ký thành công');
  };

  const updateRegistration = async (id: string, updatedData: Partial<IRegistration>) => {
    setLoading(true);
    const newRegs = registrations.map(r => r.id === id ? { ...r, ...updatedData } : r);
    await saveRegistrations(newRegs);
    setRegistrations(newRegs);
    setLoading(false);
    message.success('Cập nhật thành công');
  };

  const deleteRegistration = async (id: string) => {
    setLoading(true);
    const newRegs = registrations.filter(r => r.id !== id);
    await saveRegistrations(newRegs);
    setRegistrations(newRegs);
    setLoading(false);
    message.success('Xóa đơn thành công');
  };

  const updateStatus = async (id: string, status: RegistrationStatus, note: string) => {
    setLoading(true);
    const newRegs = registrations.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          notes: note || r.notes,
          history: [...r.history, {
            action: status === 'Approved' ? 'Duyệt đơn' : 'Từ chối đơn',
            actor: 'Admin',
            timestamp: moment().toISOString(),
            note
          }]
        };
      }
      return r;
    });
    await saveRegistrations(newRegs);
    setRegistrations(newRegs);
    setLoading(false);
    message.success(`Đã xử lý đơn thành công`);
  };

  const batchUpdateStatus = async (ids: string[], status: RegistrationStatus, note: string) => {
    setLoading(true);
    const newRegs = registrations.map(r => {
      if (ids.includes(r.id)) {
        return {
          ...r,
          status,
          notes: note || r.notes,
          history: [...r.history, {
            action: status === 'Approved' ? 'Duyệt đơn' : 'Từ chối đơn',
            actor: 'Admin',
            timestamp: moment().toISOString(),
            note
          }]
        };
      }
      return r;
    });
    await saveRegistrations(newRegs);
    setRegistrations(newRegs);
    setLoading(false);
    message.success(`Đã xử lý ${ids.length} đơn`);
  };

  const changeClub = async (memberIds: string[], newClubId: string) => {
    setLoading(true);
    const newRegs = registrations.map(r => {
      if (memberIds.includes(r.id)) {
        return {
          ...r,
          clubId: newClubId,
          history: [...r.history, {
            action: 'Chuyển câu lạc bộ',
            actor: 'Admin',
            timestamp: moment().toISOString(),
            note: `Chuyển tới CLB: ${newClubId}`
          }]
        };
      }
      return r;
    });
    await saveRegistrations(newRegs);
    setRegistrations(newRegs);
    setLoading(false);
    message.success(`Đã chuyển CLB cho ${memberIds.length} thành viên`);
  };

  return {
    registrations,
    loading,
    fetchRegistrations,
    addRegistration,
    updateRegistration,
    deleteRegistration,
    updateStatus,
    batchUpdateStatus,
    changeClub,
  };
};
