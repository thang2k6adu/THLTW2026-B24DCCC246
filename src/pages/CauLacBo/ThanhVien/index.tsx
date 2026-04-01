import React, { useEffect, useMemo, useState } from 'react';
import { useModel, useLocation } from 'umi';
import { Table, Card, Select, Button, Modal } from 'antd';

const ClubMembers = () => {
  const { registrations, loading, fetchRegistrations, changeClub } = useModel('registration');
  const { clubs, fetchClubs } = useModel('club');
  
  const location = useLocation();
  const [selectedClubId, setSelectedClubId] = useState<string | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [targetClubId, setTargetClubId] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchRegistrations();
    fetchClubs();
  }, [fetchRegistrations, fetchClubs]);

  useEffect(() => {
    // Parse query params to auto-select club if navigated from Club List
    const searchParams = new URLSearchParams(location.search);
    const clubId = searchParams.get('clubId');
    if (clubId) {
      setSelectedClubId(clubId);
    }
  }, [location.search]);

  // Derived state model logic for members
  const approvedMembers = useMemo(() => {
    let members = registrations.filter(r => r.status === 'Approved');
    if (selectedClubId) {
      members = members.filter(r => r.clubId === selectedClubId);
    }
    return members;
  }, [registrations, selectedClubId]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleTransfer = async () => {
    if (!targetClubId) return;
    await changeClub(selectedRowKeys as string[], targetClubId);
    setIsTransferModalVisible(false);
    setSelectedRowKeys([]);
    setTargetClubId(undefined);
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'candidateName', key: 'candidateName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { 
      title: 'Câu lạc bộ hiện tại', 
      dataIndex: 'clubId', 
      key: 'clubId',
      render: (id: string) => clubs.find((c: any) => c.id === id)?.name || id
    }
  ];

  return (
    <>
      <Card title="Quản lý thành viên câu lạc bộ">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span style={{ marginRight: 8 }}>Lọc theo câu lạc bộ:</span>
            <Select 
              style={{ width: 300 }} 
              allowClear 
              value={selectedClubId}
              placeholder="Tất cả câu lạc bộ" 
              onChange={setSelectedClubId}
              options={clubs.map((c: any) => ({ label: c.name, value: c.id }))}
            />
          </div>
          {selectedRowKeys.length > 0 && (
            <Button type="primary" onClick={() => setIsTransferModalVisible(true)}>
              Đổi câu lạc bộ cho {selectedRowKeys.length} thành viên
            </Button>
          )}
        </div>
        <Table 
          rowSelection={rowSelection}
          columns={columns}
          dataSource={approvedMembers} 
          rowKey="id" 
          loading={loading}
        />
      </Card>

      <Modal
        title={`Chuyển CLB cho ${selectedRowKeys.length} thành viên`}
        visible={isTransferModalVisible}
        onOk={handleTransfer}
        onCancel={() => setIsTransferModalVisible(false)}
        okButtonProps={{ disabled: !targetClubId }}
        destroyOnClose
      >
        <p>Chọn câu lạc bộ muốn chuyển đến:</p>
        <Select 
          style={{ width: '100%' }} 
          placeholder="Chọn câu lạc bộ" 
          value={targetClubId}
          onChange={setTargetClubId}
          options={clubs.map((c: any) => ({ label: c.name, value: c.id }))}
        />
      </Modal>
    </>
  );
};

export default ClubMembers;
