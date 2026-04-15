import React, { useEffect } from 'react';
import { useModel, useIntl } from 'umi';
import { Card, Table, Button, Space, Tag, Input, Select, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import FormPhongHoc from './components/FormPhongHoc';

const PhongHoc = () => {
  const {
    danhSachPhongHoc,
    loading,
    fetchPhongHoc,
    visibleForm,
    setVisibleForm,
    danhSachCanBo,
    setEditRecord,
    handleDelete,
  } = useModel('phongHoc');

  useEffect(() => {
    fetchPhongHoc();
  }, [fetchPhongHoc]);

  const onAddClick = () => {
    setEditRecord(undefined);
    setVisibleForm(true);
  };

  const onEditClick = (record: PhongHoc.IRecord) => {
    setEditRecord(record);
    setVisibleForm(true);
  };

  const checkCanDelete = (soChoNgoi: number) => {
    return soChoNgoi < 30;
  };

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm mã phòng"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Tìm
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: string, record: PhongHoc.IRecord) =>
        record.maPhong.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
      key: 'tenPhong',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên phòng"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Tìm
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: string, record: PhongHoc.IRecord) =>
        record.tenPhong.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'soChoNgoi',
      key: 'soChoNgoi',
      sorter: (a: any, b: any) => a.soChoNgoi - b.soChoNgoi,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
      filters: [
        { text: 'Lý thuyết', value: 'Lý thuyết' },
        { text: 'Thực hành', value: 'Thực hành' },
        { text: 'Hội trường', value: 'Hội trường' },
      ],
      onFilter: (value: string, record: PhongHoc.IRecord) => record.loaiPhong === value,
      render: (val: string) => {
        const color = val === 'Lý thuyết' ? 'blue' : val === 'Thực hành' ? 'green' : 'orange';
        return <Tag color={color}>{val}</Tag>;
      },
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
      key: 'nguoiPhuTrach',
      filters: danhSachCanBo.map((cb: string) => ({ text: cb, value: cb })),
      onFilter: (value: string, record: PhongHoc.IRecord) => record.nguoiPhuTrach === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: PhongHoc.IRecord) => {
        const canDelete = checkCanDelete(record.soChoNgoi);
        return (
          <Space size="middle">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEditClick(record)}
            >
              Sửa
            </Button>
            <Popconfirm
              title={`Bạn có chắc chắn muốn xóa phòng ${record.tenPhong}?`}
              onConfirm={() => {
                if (!canDelete) {
                  message.error('Không thể xóa phòng có từ 30 chỗ ngồi trở lên!');
                  return;
                }
                handleDelete(record._id as string);
              }}
              disabled={!canDelete}
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                disabled={!canDelete}
                title={!canDelete ? "Chỉ thể xóa phòng dưới 30 chỗ" : "Xóa"}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Card title="Quản lý phòng học">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
            Thêm mới
          </Button>
        </div>

        <Table
          dataSource={danhSachPhongHoc}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {visibleForm && <FormPhongHoc />}
    </>
  );
};

export default PhongHoc;
