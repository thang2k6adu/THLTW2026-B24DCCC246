import React, { useState } from 'react';
import { Table, Button, Modal, Form, Space, Popconfirm, Select, InputNumber, Progress } from 'antd';
import { useModel } from 'umi';
import { GoalType } from '@/models/studyTracker';
import moment from 'moment';

const { Option } = Select;

const GoalManager: React.FC = () => {
    const { goals, setGoal, deleteGoal, subjects, getProgressByMonthAndSubject } = useModel('studyTracker');
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

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => handleOpenModal()}>
                    add goal
                </Button>
            </div>

            <Modal
                title={editingGoal ? 'edit goal' : 'add goal'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="month"
                        label="month"
                        rules={[{ required: true, message: 'hãy chọn tháng' }]}
                    >
                        <Select placeholder="select month" />
                    </Form.Item>

                    <Form.Item
                        name="subjectId"
                        label="Môn học áp dụng"
                        rules={[{ required: true, message: 'hãy chọn môn học!' }]}
                    >
                        <Select placeholder="select subject or total time" />
                    </Form.Item>

                    <Form.Item
                        name="targetHours"
                        label="mục tiêu (giờ)"
                        rules={[{ required: true, message: 'hãy nhập mục tiêu' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GoalManager;