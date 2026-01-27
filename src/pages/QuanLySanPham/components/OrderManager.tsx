import { Button, Form, Input, InputNumber, Modal, Select, Table, Tag, Row, Col, Typography, Space, DatePicker } from 'antd';
import { EyeOutlined, PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getAllProducts } from '@/services/Sanpham/sanpham';

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const OrderManager = () => {
    const { orders, loading, total, fetchOrders, createOrder, updateStatus } = useModel('donhang');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<any>(null);
    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();

    const [productList, setProductList] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [filters, setFilters] = useState<any>({});
    const [sorter, setSorter] = useState<any>({});

    useEffect(() => {
        const loadProducts = async () => {
            const data: any = await getAllProducts();
            setProductList(data || []);
        };
        loadProducts();
    }, []);

    useEffect(() => {
        loadData();
    }, [pagination.current, pagination.pageSize, filters, sorter]);

    const loadData = () => {
        const params = {
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...filters,
            sortField: sorter.field,
            sortOrder: sorter.order,
        };
        fetchOrders(params);
    };

    const handleTableChange = (newPagination: any, newFilters: any, newSorter: any) => {
        setPagination(newPagination);
        setSorter(newSorter);
    };

    const handleSearch = (values: any) => {
        const searchValues = { ...values };
        if (values.dateRange) {
            searchValues.startDate = values.dateRange[0].format('YYYY-MM-DD');
            searchValues.endDate = values.dateRange[1].format('YYYY-MM-DD');
            delete searchValues.dateRange;
        }
        setFilters(searchValues);
        setPagination({ ...pagination, current: 1 });
    };

    const handleCreate = async (values: any) => {
        const orderData = {
            customerName: values.customerName,
            phone: values.phone,
            address: values.address,
            products: selectedProducts,
            totalAmount: totalAmount,
        };

        const success = await createOrder(orderData);
        if (success) {
            setIsCreateModalVisible(false);
            form.resetFields();
            setSelectedProducts([]);
            setTotalAmount(0);
            loadData();
        }
    };

    const handleProductSelect = (values: any) => {
        const newSelectedProducts = values.map((itemId: number) => {
            const product = productList.find(p => p.id === itemId);
            return {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: 1,
                maxQuantity: product.quantity
            };
        });

        const mergedProducts = newSelectedProducts.map((newItem: any) => {
            const existingItem = selectedProducts.find(p => p.productId === newItem.productId);
            return existingItem ? existingItem : newItem;
        });

        setSelectedProducts(mergedProducts);
        calculateTotal(mergedProducts);
    };

    const handleQuantityChange = (productId: number, quantity: number) => {
        const updatedProducts = selectedProducts.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity };
            }
            return item;
        });
        setSelectedProducts(updatedProducts);
        calculateTotal(updatedProducts);
    };

    const calculateTotal = (products: any[]) => {
        const total = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    };

    const columns: any = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
        },
        {
            title: 'Số sản phẩm',
            dataIndex: 'products',
            render: (_: any, record: any) => record.products.length,
            align: 'center',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            align: 'right',
            sorter: true,
            render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_: any, record: any) => {
                let color = 'default';
                let text = 'Chờ xử lý';
                if (record.status === 'shipping') { color = 'blue'; text = 'Đang giao'; }
                else if (record.status === 'completed') { color = 'green'; text = 'Hoàn thành'; }
                else if (record.status === 'cancelled') { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            sorter: true,
        },
        {
            title: 'Thao tác',
            align: 'center',
            render: (_: any, record: any) => (
                <Space>
                    <Select
                        defaultValue={record.status}
                        style={{ width: 120 }}
                        onChange={(value) => updateStatus(record.id, value).then(() => loadData())}
                    >
                        <Option value="pending">Chờ xử lý</Option>
                        <Option value="shipping">Đang giao</Option>
                        <Option value="completed">Hoàn thành</Option>
                        <Option value="cancelled">Đã hủy</Option>
                    </Select>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => { setCurrentOrder(record); setIsDetailModalVisible(true); }}>Chi tiết</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Form form={searchForm} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
                <Form.Item name="keyword">
                    <Input placeholder="Mã ĐH / Tên KH" />
                </Form.Item>
                <Form.Item name="status">
                    <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
                        <Option value="pending">Chờ xử lý</Option>
                        <Option value="shipping">Đang giao</Option>
                        <Option value="completed">Hoàn thành</Option>
                        <Option value="cancelled">Đã hủy</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="dateRange">
                    <RangePicker />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsCreateModalVisible(true)}>
                        Tạo đơn hàng
                    </Button>
                </Form.Item>
            </Form>

            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                pagination={{
                    ...pagination,
                    total: total,
                }}
                loading={loading}
                onChange={handleTableChange}
            />

            <Modal
                title="Tạo đơn hàng mới"
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => form.submit()}
                width={800}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}>
                                <Input placeholder="Nhập tên khách hàng" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                        <Input placeholder="Nhập địa chỉ nhận hàng" />
                    </Form.Item>

                    <Form.Item label="Sản phẩm" required>
                        <Select
                            mode="multiple"
                            placeholder="Chọn sản phẩm"
                            onChange={(values) => handleProductSelect(values)}
                            optionFilterProp="children"
                        >
                            {productList.filter(p => p.quantity > 0).map(p => (
                                <Option key={p.id} value={p.id}>
                                    {p.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)} (SL: {p.quantity})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedProducts.length > 0 && (
                        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                            {selectedProducts.map(item => (
                                <Row key={item.productId} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                                    <Col span={10}>
                                        <Text>{item.productName}</Text>
                                    </Col>
                                    <Col span={6}>
                                        <Text>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Text>
                                    </Col>
                                    <Col span={6}>
                                        <InputNumber
                                            min={1}
                                            max={item.maxQuantity}
                                            value={item.quantity}
                                            onChange={(val) => handleQuantityChange(item.productId, val || 1)}
                                        />
                                    </Col>
                                    <Col span={2}>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                const newProducts = selectedProducts.filter(p => p.productId !== item.productId);
                                                setSelectedProducts(newProducts);
                                                calculateTotal(newProducts);
                                            }}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Row justify="end" style={{ marginTop: 16 }}>
                                <Text strong style={{ fontSize: 16 }}>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</Text>
                            </Row>
                        </div>
                    )}
                </Form>
            </Modal>

            <Modal
                title="Chi tiết đơn hàng"
                visible={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                width={700}
            >
                {currentOrder && (
                    <div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>Mã đơn hàng:</strong> {currentOrder.id}</p>
                                <p><strong>Khách hàng:</strong> {currentOrder.customerName}</p>
                                <p><strong>Số điện thoại:</strong> {currentOrder.phone}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Ngày tạo:</strong> {currentOrder.createdAt}</p>
                                <p><strong>Trạng thái:</strong> <Tag color={currentOrder.status === 'completed' ? 'green' : currentOrder.status === 'cancelled' ? 'red' : 'orange'}>{currentOrder.status}</Tag></p>
                                <p><strong>Địa chỉ:</strong> {currentOrder.address}</p>
                            </Col>
                        </Row>
                        <Table
                            dataSource={currentOrder.products}
                            pagination={false}
                            rowKey="productId"
                            columns={[
                                { title: 'Sản phẩm', dataIndex: 'productName' },
                                { title: 'Đơn giá', dataIndex: 'price', render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val) },
                                { title: 'Số lượng', dataIndex: 'quantity', align: 'center' },
                                { title: 'Thành tiền', render: (_, r: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.price * r.quantity) }
                            ]}
                        />
                        <Row justify="end" style={{ marginTop: 16 }}>
                            <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>Tổng cộng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentOrder.totalAmount)}</Text>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderManager;
