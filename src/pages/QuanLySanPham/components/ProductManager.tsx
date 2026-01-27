import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Table, Tag, Row, Col, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Option } = Select;

const ProductManager = () => {
    const { products, loading, total, fetchProducts, addProduct, editProduct, removeProduct } = useModel('sanpham');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();

    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [filters, setFilters] = useState<any>({});
    const [sorter, setSorter] = useState<any>({});

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
        fetchProducts(params);
    };

    const handleTableChange = (newPagination: any, newFilters: any, newSorter: any) => {
        setPagination(newPagination);
        setSorter(newSorter);
    };

    const handleSearch = (values: any) => {
        setFilters(values);
        setPagination({ ...pagination, current: 1 });
    };

    const handleEdit = (record: any) => {
        setCurrentProduct(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        setCurrentProduct(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleSubmit = async (values: any) => {
        let success = false;
        if (currentProduct) {
            success = await editProduct({ ...currentProduct, ...values });
        } else {
            success = await addProduct(values);
        }

        if (success) {
            setIsModalVisible(false);
            form.resetFields();
            loadData();
        }
    };

    const handleDelete = async (id: number) => {
        const success = await removeProduct(id);
        if (success) {
            loadData();
        }
    };

    const columns: any = [
        {
            title: 'STT',
            align: 'center',
            render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: true,
            align: 'right',
            render: (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            sorter: true,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_: any, record: any) => {
                let color = 'green';
                let text = 'Còn hàng';
                if (record.quantity === 0) {
                    color = 'red';
                    text = 'Hết hàng';
                } else if (record.quantity <= 10) {
                    color = 'orange';
                    text = 'Sắp hết';
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Thao tác',
            align: 'center',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Form form={searchForm} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
                <Form.Item name="name">
                    <Input placeholder="Tên sản phẩm" />
                </Form.Item>
                <Form.Item name="category">
                    <Select placeholder="Danh mục" style={{ width: 120 }} allowClear>
                        <Option value="Laptop">Laptop</Option>
                        <Option value="Điện thoại">Điện thoại</Option>
                        <Option value="Máy tính bảng">Máy tính bảng</Option>
                        <Option value="Phụ kiện">Phụ kiện</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="status">
                    <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
                        <Option value="con_hang">Còn hàng</Option>
                        <Option value="sap_het">Sắp hết</Option>
                        <Option value="het_hang">Hết hàng</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="minPrice">
                    <InputNumber placeholder="Giá min" style={{ width: 100 }} />
                </Form.Item>
                <Form.Item name="maxPrice">
                    <InputNumber placeholder="Giá max" style={{ width: 100 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Tìm kiếm</Button>
                </Form.Item>
                <Form.Item>
                    <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>Thêm sản phẩm</Button>
                </Form.Item>
            </Form>

            <Table
                dataSource={products}
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
                title={currentProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
                        <Select placeholder="Chọn danh mục">
                            <Option value="Laptop">Laptop</Option>
                            <Option value="Điện thoại">Điện thoại</Option>
                            <Option value="Máy tính bảng">Máy tính bảng</Option>
                            <Option value="Phụ kiện">Phụ kiện</Option>
                        </Select>
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá' }, { type: 'number', min: 1, message: 'Giá phải là số dương' }]}>
                                <InputNumber style={{ width: '100%' }} placeholder="Nhập giá" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }, { type: 'number', min: 0, message: 'Số lượng không được âm' }]}>
                                <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" precision={0} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManager;
