import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Select, InputNumber, DatePicker } from 'antd';
import { useModel } from 'umi';
import { ScheduleType } from '@/models/studyTracker';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const ScheduleManager: React.FC = () => {
    const { schedules, deleteSchedule, subjects } = useModel('studyTracker');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<ScheduleType | null>(null);
    const [form] = Form.useForm();

    const handleOpenModal = (schedule?: ScheduleType) => {
        if (schedule) {
            setEditingSchedule(schedule);
        } else {
            setEditingSchedule(null);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Môn học',
            dataIndex: 'subjectId',
            key: 'subjectId',
            render: (subjectId: string) => subjects.find((s) => s.id === subjectId)?.name || 'N/A',
        },
        {
            title: 'thời gian học',
            dataIndex: 'time',
            key: 'time',
            render: (time: string) => moment(time).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thời lượng (hours)',
            dataIndex: 'durationHours',
            key: 'durationHours',
        },
        {
            title: 'nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'hành động',
            key: 'action',
            render: (_: any, record: ScheduleType) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleOpenModal(record)}>edit</Button>
                    <Popconfirm title="ar you sure?" onConfirm={() => deleteSchedule(record.id)}>
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={() => handleOpenModal()}>
                    add lịch học
                </Button>
            </div>
            <Table dataSource={schedules} columns={columns} rowKey="id" />

            <Modal
                title={editingSchedule ? 'edit schedule' : 'add schedule'}
                open={isModalVisible}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="subjectId"
                        label="subject"
                        rules={[{ required: true, message: 'hãy chọn môn học' }]}
                    >
                        <Select placeholder="Chọn môn học">
                            {subjects.map((sub) => (
                                <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Thời gian học"
                        rules={[{ required: true, message: 'hãy chọn thời gian' }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="durationHours"
                        label="Thời lượng"
                        rules={[{ required: true, message: 'hãy nhập thời lượng' }]}
                    >
                        <InputNumber min={0.5} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="nội dung đã học"
                        rules={[{ required: true, message: 'hãy nhập nội dung' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="note"
                        label="Ghi chú"
                    >
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ScheduleManager;