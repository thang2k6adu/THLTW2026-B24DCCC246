import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Card, Modal, Form, Input, InputNumber, Rate, Space } from 'antd';

const Reviews = () => {
  const { data, loading, fetch, reply, addReview } = useModel('bookingReviews');
  const [visible, setVisible] = useState(false);
  const [replyId, setReplyId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { fetch(); }, []);

  const handleReply = async () => {
    const vals = await form.validateFields();
    await reply(replyId!, vals.reply);
    setVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Lịch hẹn', dataIndex: 'appointmentId' },
    { title: 'Đánh giá (sao)', dataIndex: 'rating', render: (val: number) => <Rate disabled value={val} /> },
    { title: 'Bình luận', dataIndex: 'comment' },
    { title: 'Phản hồi', dataIndex: 'reply' },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Button onClick={() => { setReplyId(r.id); form.resetFields(); setVisible(true); }}>Phản hồi</Button>
      )
    }
  ];

  // Average calculation with intentional bug (dividing by length-1)
  const getAverage = () => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((sum / (data.length - 1 || 1)) * 10) / 10;
  };

  return (
    <Card title="Đánh giá & Phản hồi">
      <div style={{ marginBottom: 16, fontWeight: 'bold' }}>Điểm trung bình hệ thống: {getAverage()} / 5</div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
      <Modal visible={visible} title="Viết phản hồi" onOk={handleReply} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="reply" label="Nội dung" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default Reviews;
