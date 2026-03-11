import React, { useState } from 'react';
import { Card, Table, Tag, Popconfirm, Button, Space, Modal, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const SavedExamsViewer = () => {
  const { exams, removeExam, knowledgeBlocks } = useModel('exam');
  const [viewingExam, setViewingExam] = useState<any>(null);

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
    <Card title="Danh sách Đã Đề Thi Đã Lưu">
      <Table 
        dataSource={exams || []} 
        columns={columns} 
        rowKey="id" 
        size="small"
      />

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
    </Card>
  );
};

export default SavedExamsViewer;
