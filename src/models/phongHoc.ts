import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getDanhSachPhongHoc, addPhongHoc, editPhongHoc, deletePhongHoc } from '@/services/PhongHoc/phongHoc';

export default () => {
  const [danhSachPhongHoc, setDanhSachPhongHoc] = useState<PhongHoc.IRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [editRecord, setEditRecord] = useState<PhongHoc.IRecord | undefined>(undefined);

  // Danh sách cán bộ cố định theo giả định (hoặc API thật sẽ lấy từ user list)
  const danhSachCanBo = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Văn D', 'Hoàng Thị E'];

  const fetchPhongHoc = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDanhSachPhongHoc();
      if (res?.data?.data) {
        setDanhSachPhongHoc(res.data.data);
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi lấy danh sách phòng học');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAdd = async (payload: PhongHoc.IRecord) => {
    setLoading(true);
    try {
      const res = await addPhongHoc(payload);
      if (res?.data?.success) {
        message.success(res.data.message || 'Thêm phòng học thành công');
        fetchPhongHoc();
        setVisibleForm(false);
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm phòng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (payload: PhongHoc.IRecord) => {
    setLoading(true);
    try {
      const res = await editPhongHoc(payload);
      if (res?.data?.success) {
        message.success(res.data.message || 'Cập nhật phòng học thành công');
        fetchPhongHoc();
        setVisibleForm(false);
        setEditRecord(undefined);
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật phòng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await deletePhongHoc(id);
      if (res?.data?.success) {
        message.success(res.data.message || 'Xóa phòng học thành công');
        fetchPhongHoc();
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa phòng');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSachPhongHoc,
    loading,
    visibleForm,
    setVisibleForm,
    editRecord,
    setEditRecord,
    danhSachCanBo,
    fetchPhongHoc,
    handleAdd,
    handleEdit,
    handleDelete,
  };
};
