import React, { useState } from 'react';
import { Card, Button, InputNumber, Typography, Space, Form } from 'antd';

const { Title, Text } = Typography;

const Bai1Page: React.FC = () => {
    const [attempts, setAttempts] = useState<number>(10);
    const [form] = Form.useForm();

    return (
        <Card style={{ maxWidth: 600, margin: '0 auto', marginTop: 50 }} title={<Title level={3}>game đoán số</Title>}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Form form={form} layout="inline">
                    <Form.Item name="guess">
                        <InputNumber placeholder="nhập Số" style={{ width: 200 }} autoFocus />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">đoán</Button>
                    </Form.Item>
                </Form>

                <Text strong>remaining: <Text type="success">{attempts}</Text></Text>
            </Space>
        </Card>
    );
};

export default Bai1Page;
