import React, { useState, useEffect } from 'react';
import { Card, Button, InputNumber, Typography, List, Alert, Space, Form } from 'antd';

const { Title, Text } = Typography;

const Bai1Page: React.FC = () => {
    const [targetNumber, setTargetNumber] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(10);

    const [history, setHistory] = useState<{ guess: number; result: string }[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);


    const [message, setMessage] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; text: string } | null>(null);

    const [form] = Form.useForm();


    // khởi tạo data cần thiết cho gaem
    const initGame = () => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setAttempts(10);
        setHistory([]);
        setGameOver(false);
        setMessage(null);
        form.resetFields();
    };

    useEffect(() => {
        initGame();
    }, []);


    // when guess??
    const handleGuess = (values: { guess: number }) => {
        const { guess } = values;
        if (gameOver || attempts <= 0) return;

        let newResult = '';
        let newGameOver = false;

        if (guess === targetNumber) {
            newResult = 'Chúc mừng! Bạn đã đoán đúng!';
            setMessage({ type: 'success', text: newResult });
            newGameOver = true;
        } else if (guess < targetNumber) {
            newResult = 'Bạn đoán quá thấp!';
            setMessage({ type: 'warning', text: newResult });
        } else {
            newResult = 'Bạn đoán quá cao!';
            setMessage({ type: 'warning', text: newResult });
        }
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        setHistory([{ guess, result: newResult }, ...history]);

        if (!newGameOver && newAttempts === 0) {
            setMessage({ type: 'error', text: `Bạn đã hết lượt! Số đúng là ${targetNumber}.` });
            newGameOver = true;
        }
        setGameOver(newGameOver);
        form.resetFields();
    };

    return (
        <Card style={{ maxWidth: 600, margin: '0 auto', marginTop: 50 }} title={<Title level={3}>game đoán số</Title>}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Form form={form} onFinish={handleGuess} layout="inline">
                    <Form.Item
                        name="guess"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số!' },
                            { type: 'number', min: 1, max: 100, message: 'Số từ 1 đến 100!' }
                        ]}
                    >
                        <InputNumber
                            placeholder="nhập Số"
                            style={{ width: 200 }}
                            disabled={gameOver}
                            autoFocus
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={gameOver}>
                            đoán
                        </Button>
                    </Form.Item>
                </Form>

                {message && (
                    <Alert message={message.text} type={message.type} showIcon />
                )}

                <Text strong>remaining: <Text type={attempts > 3 ? 'success' : 'danger'}>{attempts}</Text></Text>

                {gameOver && (
                    <Button type="dashed" onClick={initGame} block>
                        Chơi lại
                    </Button>
                )}

                <List
                    size="small"
                    header={<div>hístory</div>}
                    bordered
                    dataSource={history}
                    renderItem={(item) => (
                        <List.Item>
                            <Text strong>{item.guess}</Text>:{' '}
                            <Text type={item.result.includes('đúng') ? 'success' : 'warning'}>{item.result}</Text>
                        </List.Item>
                    )}
                />
            </Space>
        </Card>
    );
};

export default Bai1Page;