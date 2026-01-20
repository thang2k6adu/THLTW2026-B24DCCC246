import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Input, Modal, Form, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const ProductPage = () => {
    const { products, loading, total, fetchProducts, addProduct, removeProduct } = useModel('sanpham');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        fetchProducts({ current: 1, pageSize: 10, name: searchName });
    }, [searchName]);

    const handleAdd = async (values: any) => {
        const success = await addProduct(values);
        if (success) {
            setIsModalVisible(false);
            form.resetFields();
            fetchProducts({ current: 1, pageSize: 10, name: searchName });
        }
    };

    const handleDelete = async (id: number) => {
        const success = await removeProduct(id);
        if (success) {
            fetchProducts({ current: 1, pageSize: 10, name: searchName });
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        { title: 'Số lượng', align: 'center', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_: any, record: any) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />}>Xóa</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <Card title="Quản lý sản phẩm" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Thêm sản phẩm</Button>}>
            <Input.Search
                placeholder="Tìm kiếm theo tên sản phẩm"
                style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <Table
                dataSource={products}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{
                    total,
                    pageSize: 10,
                    onChange: (page) => fetchProducts({ current: page, pageSize: 10, name: searchName })
                }}
            />

            <Modal
                title="Thêm sản phẩm mới"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleAdd}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá' }, { type: 'number', min: 1, message: 'Giá phải là số dương' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="Nhập giá" />
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }, { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương' }]}>
                        <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" precision={0} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ProductPage;
