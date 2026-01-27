import { useState, useCallback } from 'react';
import { querySanphamList, addSanpham, deleteSanpham, updateSanpham } from '@/services/Sanpham/sanpham';
import { message } from 'antd';

export default () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);

    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await querySanphamList(params);
            setProducts(res?.data?.data || []);
            setTotal(res?.data?.total || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = useCallback(async (data: any) => {
        setLoading(true);
        try {
            const res = await addSanpham(data);
            if (res?.data?.success) {
                message.success('Thêm sản phẩm thành công');
                return true;
            }
            return false;
        } catch (error) {
            message.error('Thêm sản phẩm thất bại');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const editProduct = useCallback(async (data: any) => {
        setLoading(true);
        try {
            const res = await updateSanpham(data);
            if (res?.data?.success) {
                message.success('Cập nhật sản phẩm thành công');
                return true;
            }
            message.error('Cập nhật sản phẩm thất bại');
            return false;
        } catch (error) {
            message.error('Cập nhật sản phẩm thất bại');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeProduct = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const res = await deleteSanpham(id);
            if (res?.data?.success) {
                message.success('Xóa sản phẩm thành công');
                return true;
            }
            return false;
        } catch (error) {
            message.error('Xóa sản phẩm thất bại');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        products,
        loading,
        total,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct
    };
};
