import React, { useEffect, useMemo, useState } from 'react';
import { useModel, useLocation } from 'umi';
import { Table, Card, Select } from 'antd';

const ClubMembers = () => {
  const { registrations, loading, fetchRegistrations, changeClub } = useModel('registration');
  const { clubs, fetchClubs } = useModel('club');
  
  const location = useLocation();
  const [selectedClubId, setSelectedClubId] = useState<string | undefined>(undefined);

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
    <Card title="Quản lý thành viên câu lạc bộ">
      <div style={{ marginBottom: 16 }}>
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
      <Table 
        columns={columns}
        dataSource={approvedMembers} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

export default ClubMembers;
