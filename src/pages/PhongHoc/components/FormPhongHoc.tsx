import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;

const FormPhongHoc = () => {
  const [form] = Form.useForm();
  const {
    visibleForm,
    setVisibleForm,
    editRecord,
    setEditRecord,
    handleAdd,
    handleEdit,
    danhSachCanBo,
  } = useModel('phongHoc');

  const isEdit = !!editRecord;

  useEffect(() => {
    if (visibleForm && isEdit && editRecord) {
      form.setFieldsValue({
        ...editRecord,
      });
    } else {
      form.resetFields();
    }
  }, [visibleForm, editRecord, form]);

  const onCancel = () => {
    setVisibleForm(false);
    setEditRecord(undefined);
    form.resetFields();
  };

  const onOk = () => {
    form
      .validateFields()
      .then(async (values: PhongHoc.IRecord) => {
        const payload = { ...values };
        let success = false;
        
        if (isEdit && editRecord) {
          payload._id = editRecord._id;
          success = await handleEdit(payload);
        } else {
          success = await handleAdd(payload);
        }
        
        if (success) {
          onCancel();
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa phòng học' : 'Thêm mới phòng học'}
      open={visibleForm}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="maPhong"
          label="Mã phòng"
          rules={[
            { required: true, message: 'Vui lòng nhập mã phòng!' },
            { max: 10, message: 'Mã phòng tối đa 10 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập mã phòng" />
        </Form.Item>

        <Form.Item
          name="tenPhong"
          label="Tên phòng"
          rules={[
            { required: true, message: 'Vui lòng nhập tên phòng!' },
            { max: 50, message: 'Tên phòng tối đa 50 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>

        <Form.Item
          name="soChoNgoi"
          label="Số chỗ ngồi"
          rules={[
            { required: true, message: 'Vui lòng nhập số chỗ ngồi!' },
            { type: 'number', min: 10, max: 200, message: 'Số chỗ ngồi từ 10 đến 200!' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Nhập số chỗ ngồi" />
        </Form.Item>

        <Form.Item
          name="loaiPhong"
          label="Loại phòng"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
        >
          <Select placeholder="Chọn loại phòng">
            <Option value="Lý thuyết">Lý thuyết</Option>
            <Option value="Thực hành">Thực hành</Option>
            <Option value="Hội trường">Hội trường</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="nguoiPhuTrach"
          label="Người phụ trách"
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách!' }]}
        >
          <Select placeholder="Chọn người phụ trách" showSearch>
            {danhSachCanBo.map((cb: string) => (
              <Option key={cb} value={cb}>
                {cb}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormPhongHoc;
