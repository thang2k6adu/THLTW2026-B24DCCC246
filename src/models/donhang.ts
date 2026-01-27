import { useState, useCallback } from 'react';
import { queryDonHangList, addDonHang, updateDonHangStatus } from '@/services/Sanpham/donhang';
import { message } from 'antd';

export default () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);

    const fetchOrders = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await queryDonHangList(params);
            setOrders(res?.data?.data || []);
            setTotal(res?.data?.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const createOrder = useCallback(async (data: any) => {
        setLoading(true);
        try {
            const res = await addDonHang(data);
            if (res?.data?.success) {
                message.success('Tạo đơn hàng thành công');
                return true;
            } else {
                message.error(res?.data?.message || 'Tạo đơn hàng thất bại');
                return false;
            }
        } catch (error) {
            message.error('Tạo đơn hàng thất bại');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id: string, status: string) => {
        setLoading(true);
        try {
            const res = await updateDonHangStatus(id, status);
            if (res?.data?.success) {
                message.success('Cập nhật trạng thái thành công');
                return true;
            }
            message.error('Cập nhật trạng thái thất bại');
            return false;
        } catch (error) {
            message.error('Cập nhật trạng thái thất bại');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        orders,
        loading,
        total,
        fetchOrders,
        createOrder,
        updateStatus
    };
};
