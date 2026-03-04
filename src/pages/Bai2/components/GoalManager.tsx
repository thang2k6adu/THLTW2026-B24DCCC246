import React, { useState } from 'react';
import { Table, Button, Modal, Form, Space, Popconfirm, Select, InputNumber } from 'antd';
import { useModel } from 'umi';
import { GoalType } from '@/models/studyTracker';
import moment from 'moment';

const { Option } = Select;

const GoalManager: React.FC = () => {
    const { goals, setGoal, deleteGoal, subjects } = useModel('studyTracker');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingGoal, setEditingGoal] = useState<GoalType | null>(null);
    const [form] = Form.useForm();

    const handleOpenModal = (goal?: GoalType) => {
        if (goal) {
            setEditingGoal(goal);
            form.setFieldsValue(goal);
        } else {
            setEditingGoal(null);
            form.resetFields();
            form.setFieldsValue({ month: moment().format('YYYY-MM') });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            setGoal(values);
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: 'tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'mục tiêu',
            dataIndex: 'subjectId',
            key: 'subjectId',
            render: (subjectId: string) => {
                if (subjectId === 'TOTAL') return <strong>Tổng tất cả môn học</strong>;
                return subjects.find((s) => s.id === subjectId)?.name || 'N/A';
            },
        },
        {
            title: 'chỉ tiêu(hours)',
            dataIndex: 'targetHours',
            key: 'targetHours',
        },
        {
            title: 'hành động',
            key: 'action',
            render: (_: any, record: GoalType) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleOpenModal(record)}>sửa</Button>
                    <Popconfirm title="are you sure?" onConfirm={() => deleteGoal(record.id)}>
                        <Button type="link" danger>delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => handleOpenModal()}>
                    add goal
                </Button>
            </div>
            <Table dataSource={goals} columns={columns} rowKey="id" />

            <Modal
                title={editingGoal ? 'edit goal' : 'add goal'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="month" label="month" rules={[{ required: true, message: 'hãy chọn tháng' }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="subjectId" label="Môn học áp dụng" rules={[{ required: true, message: 'hãy chọn môn học!' }]}>
                        <Select>
                            <Option key="TOTAL" value="TOTAL">all subjects</Option>
                            {subjects.map((sub) => (
                                <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="targetHours" label="mục tiêu (giờ)" rules={[{ required: true, message: 'hãy nhập mục tiêu' }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GoalManager;