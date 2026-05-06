import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import { ITask, ETaskPriority, ETaskStatus } from '@/utils/kanbanStorage';

interface ITaskFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Partial<ITask>;
  title: string;
}

const { Option } = Select;

const TaskFormModal: React.FC<ITaskFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          deadline: values.deadline ? values.deadline.toISOString() : undefined,
        };
        onSubmit(formattedValues);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={title}
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="task_form"
        initialValues={{
          priority: 'MEDIUM' as ETaskPriority,
          status: 'TODO' as ETaskStatus,
          tags: [],
        }}
      >
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Hạn chót (Deadline)"
          rules={[{ required: true, message: 'Vui lòng chọn hạn chót!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
        >
          <Select>
            <Option value="HIGH">Cao</Option>
            <Option value="MEDIUM">Trung bình</Option>
            <Option value="LOW">Thấp</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" hidden>
          <Select>
            <Option value="TODO">Cần làm</Option>
            <Option value="IN_PROGRESS">Đang làm</Option>
            <Option value="DONE">Hoàn thành</Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm tag cho công việc" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
