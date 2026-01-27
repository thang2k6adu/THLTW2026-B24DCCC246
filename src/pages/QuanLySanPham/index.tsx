import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import OrderManager from './components/OrderManager';

const { TabPane } = Tabs;

const QuanLySanPham = () => {
    return (
        <PageContainer>
            <Dashboard />
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Quản lý Sản phẩm" key="1">
                        <ProductManager />
                    </TabPane>
                    <TabPane tab="Quản lý Đơn hàng" key="2">
                        <OrderManager />
                    </TabPane>
                </Tabs>
            </Card>
        </PageContainer>
    );
};

export default QuanLySanPham;
