import React, { useState } from 'react';
import { Card, Button, Space, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao' | null;
type Result = 'Thắng' | 'Thua' | 'Hòa' | null;

const CHOICES: Choice[] = ['Kéo', 'Búa', 'Bao'];
const WIN_CONDITIONS: Record<string, string> = {
  'Kéo': 'Bao', // Kéo thắng Bao
  'Búa': 'Kéo', // Búa thắng Kéo
  'Bao': 'Búa', // Bao thắng Búa
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);

  const getIcon = (choice: Choice) => {
    switch(choice) {
      case 'Kéo': return '✌️';
      case 'Búa': return '✊';
      case 'Bao': return '✋';
      default: return '';
    }
  };

  const play = (pChoice: Choice) => {
    if (!pChoice) return;
    
    // Random computer choice
    const cChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    
    setPlayerChoice(pChoice);
    setComputerChoice(cChoice);
    
    // Determine winner
    if (pChoice === cChoice) {
      setResult('Hòa');
    } else if (WIN_CONDITIONS[pChoice] === cChoice) {
      setResult('Thắng');
    } else {
      setResult('Thua');
    }
  };

  const getResultColor = () => {
    if (result === 'Thắng') return 'success';
    if (result === 'Thua') return 'danger';
    return 'warning'; // Hòa
  };

  return (
    <Card style={{ margin: 24 }} title="Trò chơi Oẳn Tù Tì">
      <Row justify="center" align="middle" gutter={32}>
        <Col span={10} style={{ textAlign: 'center' }}>
          <Title level={4}>Người chơi</Title>
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9', borderRadius: 8, marginBottom: 16, fontSize: '3rem' }}>
            {playerChoice ? <span>{playerChoice} {getIcon(playerChoice)}</span> : <Text type="secondary">Chưa chọn</Text>}
          </div>
          <Space>
            {CHOICES.map(c => (
              <Button key={c as string} size="large" onClick={() => play(c)}>
                {c} {getIcon(c)}
              </Button>
            ))}
          </Space>
        </Col>
        
        <Col span={4} style={{ textAlign: 'center' }}>
          <Title level={2}>VS</Title>
        </Col>
        
        <Col span={10} style={{ textAlign: 'center' }}>
          <Title level={4}>Máy tính</Title>
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9', borderRadius: 8, marginBottom: 16, fontSize: '3rem' }}>
            {computerChoice ? <span>{computerChoice} {getIcon(computerChoice)}</span> : <Text type="secondary">Đang chờ...</Text>}
          </div>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'center', marginTop: 32, height: 60 }}>
        {result ? (
          <Title level={3} type={getResultColor()}>Kết quả: Bạn {result}!</Title>
        ) : (
          <Title level={3} type="secondary">Vui lòng chọn Kéo, Búa, hoặc Bao</Title>
        )}
      </div>
    </Card>
  );
};

export default RockPaperScissors;
