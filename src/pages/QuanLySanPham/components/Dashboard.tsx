import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/services/Sanpham/sanpham';
import { getAllOrders } from '@/services/Sanpham/donhang';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalInventoryValue: 0,
        totalOrders: 0,
        revenue: 0,
        ordersByStatus: {
            pending: 0,
            shipping: 0,
            completed: 0,
            cancelled: 0,
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            const products: any = await getAllProducts();
            const orders: any = await getAllOrders();

            const totalProducts = products.length;
            const totalInventoryValue = products.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);

            const totalOrders = orders.length;
            const revenue = orders
                .filter((o: any) => o.status === 'completed')
                .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

            const ordersByStatus = orders.reduce((acc: any, o: any) => {
                acc[o.status] = (acc[o.status] || 0) + 1;
                return acc;
            }, { pending: 0, shipping: 0, completed: 0, cancelled: 0 });

            setStats({
                totalProducts,
                totalInventoryValue,
                totalOrders,
                revenue,
                ordersByStatus
            });
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng số sản phẩm" value={stats.totalProducts} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng giá trị tồn kho"
                            value={stats.totalInventoryValue}
                            formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Tổng số đơn hàng" value={stats.totalOrders} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu"
                            value={stats.revenue}
                            valueStyle={{ color: '#3f8600' }}
                            formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Chờ xử lý" value={stats.ordersByStatus.pending} valueStyle={{ color: '#faad14' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Đang giao" value={stats.ordersByStatus.shipping} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Hoàn thành" value={stats.ordersByStatus.completed} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Đã hủy" value={stats.ordersByStatus.cancelled} valueStyle={{ color: '#ff4d4f' }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
