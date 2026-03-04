import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { SubjectType } from '@/models/studyTracker';

const SubjectManager: React.FC = () => {
    const { subjects, addSubject, editSubject, deleteSubject } = useModel('studyTracker');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectType | null>(null);
    const [form] = Form.useForm();

    const handleOpenModal = (subject?: SubjectType) => {
        if (subject) {
            setEditingSubject(subject);
            form.setFieldsValue(subject);
        } else {
            setEditingSubject(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (editingSubject) {
                editSubject(editingSubject.id, values.name);
            } else {
                addSubject(values.name);
            }
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên môn học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: SubjectType) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleOpenModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa môn này?" onConfirm={() => deleteSubject(record.id)}>
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
                    Thêm Môn Học
                </Button>
            </div>
            <Table dataSource={subjects} columns={columns} rowKey="id" />

            <Modal
                title={editingSubject ? 'Sửa môn học' : 'Thêm môn học'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên môn học"
                        rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubjectManager;
