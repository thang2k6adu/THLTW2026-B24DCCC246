import { useEffect } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Form, Input, Row, Col, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const TraCuuPage = () => {
  const { ketQuaTraCuu, loading, traCuu } = useModel('vanBang');
  const { danhSach: dsQuyetDinh, fetchDanhSach: fetchQD } = useModel('quyetDinh');
  const { danhSach: dsBieuMau, fetchDanhSach: fetchBM } = useModel('bieuMau');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQD();
    fetchBM();
  }, [fetchQD, fetchBM]);

  const onFinish = async (values: any) => {
    const filledParams = Object.values(values).filter(v => v && (v as string).trim() !== '');
    if (filledParams.length < 2) {
      message.warning('Yêu cầu nhập ít nhất 2 tham số để tra cứu');
      return;
    }
    const success = await traCuu(values);
    if (!success) {
      message.error('Có lỗi xảy ra trong quá trình tra cứu');
    } else {
        message.success('Tra cứu thành công');
    }
  };

  // Base columns
  const baseColumns = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
    { title: 'Mã SV', dataIndex: 'maSinhVien', key: 'maSinhVien' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    { 
      title: 'Quyết Định', 
      dataIndex: 'idQuyetDinh', 
      key: 'idQuyetDinh',
      render: (val: string) => {
        const qd = dsQuyetDinh.find((q: any) => q.id === val);
        return qd ? qd.soQuyetDinh : val;
      }
    },
  ];

  // Dynamic columns
  const dynamicColumns = dsBieuMau.map((bm: any) => ({
    title: bm.tenTruong,
    dataIndex: bm.key,
    key: bm.key,
  }));

  const columns = [...baseColumns, ...dynamicColumns];

  return (
    <Card title="Tra Cứu Thông Tin Văn Bằng">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng">
              <Input placeholder="Nhập số hiệu văn bằng" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="soVaoSo" label="Số vào sổ">
              <Input placeholder="Nhập số vào sổ" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maSinhVien" label="Mã sinh viên">
              <Input placeholder="Nhập mã sinh viên" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="hoTen" label="Họ tên">
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ngaySinh" label="Ngày sinh">
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                Tra Cứu
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={ketQuaTraCuu}
        columns={columns}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1500 }}
        style={{ marginTop: 24 }}
      />
    </Card>
  );
};

export default TraCuuPage;
