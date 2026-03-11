import React, { useState } from 'react';
import { Card, Table, Tag, Popconfirm, Button, Space, Modal, Typography, Tabs } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const SavedExamsViewer = () => {
  const { exams, removeExam, knowledgeBlocks, savedStructures, removeStructure } = useModel('exam');
  const [viewingExam, setViewingExam] = useState<any>(null);
  const [viewingStructure, setViewingStructure] = useState<any>(null);

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Dễ': return 'success';
      case 'Trung bình': return 'processing';
      case 'Khó': return 'warning';
      case 'Rất khó': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Mã Đề', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Môn Học', dataIndex: 'subject', key: 'subject' },
    { title: 'Ngày Tạo', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => new Date(val).toLocaleString() },
    { 
      title: 'Số Câu', 
      key: 'count',
      render: (_: any, record: any) => record.questions.length
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => setViewingExam(record)}>Xem chi tiết</Button>
          <Popconfirm title="Xóa đề thi này?" onConfirm={() => removeExam && removeExam(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const structColumns = [
    { title: 'Mã Cấu Trúc', dataIndex: 'id', key: 'id', width: 150 },
    { title: 'Tên / Môn', dataIndex: 'name', key: 'name' },
    { title: 'Ngày Lưu', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => new Date(val).toLocaleString() },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => setViewingStructure(record)}>Xem cấu trúc</Button>
          <Popconfirm title="Xóa cấu trúc này?" onConfirm={() => removeStructure && removeStructure(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const questionColumns = [
    { title: 'Mã CH', dataIndex: 'question_id', key: 'question_id', width: 80 },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    { 
      title: 'Độ khó', 
      dataIndex: 'difficulty', 
      key: 'difficulty',
      width: 100,
      render: (val: string) => <Tag color={getDifficultyColor(val)}>{val}</Tag>
    },
    { 
      title: 'Khối KT', 
      dataIndex: 'knowledge_block', 
      key: 'knowledge_block',
      width: 120,
      render: (val: number) => {
        const block = knowledgeBlocks.find(b => b.id === val);
        return block ? block.name : val;
      }
    }
  ];

  return (
    <Card title="Dữ liệu đã lưu" style={{ marginBottom: 24 }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Đề Thi Đã Lưu" key="1">
          <Table 
            dataSource={exams || []} 
            columns={columns} 
            rowKey="id" 
            size="small"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Cấu Trúc Đã Lưu" key="2">
          <Table 
            dataSource={savedStructures || []} 
            columns={structColumns} 
            rowKey="id" 
            size="small"
          />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={`Chi tiết đề thi: ${viewingExam?.id}`}
        visible={!!viewingExam}
        onCancel={() => setViewingExam(null)}
        footer={[
          <Button key="close" onClick={() => setViewingExam(null)}>Đóng</Button>
        ]}
        width={800}
      >
        {viewingExam && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Môn học:</Text> {viewingExam.subject} <br />
              <Text strong>Ngày tạo:</Text> {new Date(viewingExam.createdAt).toLocaleString()} <br />
              <Text strong>Tổng số câu:</Text> {viewingExam.questions.length}
            </div>
            <Table 
              dataSource={viewingExam.questions} 
              columns={questionColumns} 
              rowKey="question_id" 
              pagination={false}
              size="small"
            />
          </>
        )}
      </Modal>

      <Modal
        title={`Chi tiết cấu trúc: ${viewingStructure?.id}`}
        visible={!!viewingStructure}
        onCancel={() => setViewingStructure(null)}
        footer={[
          <Button key="close" onClick={() => setViewingStructure(null)}>Đóng</Button>
        ]}
      >
        {viewingStructure && (
          <div>
            <Text strong>Môn học:</Text> {viewingStructure.data?.subject} <br />
            <Text strong>Độ khó:</Text>
            <ul>
              {Object.entries(viewingStructure.data?.difficulty || {}).map(([diff, count]) => (
                <li key={diff}>{diff}: {Number(count)} câu</li>
              ))}
            </ul>
            <Text strong>Khối kiến thức:</Text>
            <ul>
              {Object.entries(viewingStructure.data?.knowledge_block || {}).map(([blockId, count]) => {
                const bName = knowledgeBlocks.find(b => b.id === Number(blockId))?.name || blockId;
                return <li key={blockId}>{bName}: {Number(count)} câu</li>
              })}
            </ul>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default SavedExamsViewer;
