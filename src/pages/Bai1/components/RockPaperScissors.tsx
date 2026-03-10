import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Row, Col, Table, Tag } from 'antd';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao' | null;
type Result = 'Thắng' | 'Thua' | 'Hòa' | null;

interface MatchHistory {
  key: number;
  time: string;
  player: Choice;
  computer: Choice;
  result: Result;
}

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
  const [history, setHistory] = useState<MatchHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rps_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    localStorage.setItem('rps_history', JSON.stringify(history));
  }, [history]);

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
    let currentResult: Result = 'Hòa';
    if (WIN_CONDITIONS[pChoice] === cChoice) {
      currentResult = 'Thắng';
    } else if (pChoice !== cChoice) {
      currentResult = 'Thua';
    }
    
    setResult(currentResult);

    // Add to history
    const newMatch: MatchHistory = {
      key: Date.now(),
      time: new Date().toLocaleTimeString(),
      player: pChoice,
      computer: cChoice,
      result: currentResult
    };
    
    setHistory(prev => [newMatch, ...prev]);
  };

  const getResultColor = (res: Result) => {
    if (res === 'Thắng') return 'success';
    if (res === 'Thua') return 'error';
    return 'warning'; // Hòa
  };

  const columns = [
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    { title: 'Người chơi', dataIndex: 'player', key: 'player', render: (val: Choice) => `${val} ${getIcon(val)}` },
    { title: 'Máy tính', dataIndex: 'computer', key: 'computer', render: (val: Choice) => `${val} ${getIcon(val)}` },
    { 
      title: 'Kết quả', 
      dataIndex: 'result', 
      key: 'result',
      render: (val: Result) => <Tag color={getResultColor(val)}>{val}</Tag>
    },
  ];

  const clearHistory = () => {
    setHistory([]);
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
          <Title level={3} type={getResultColor(result) === 'success' ? 'success' : getResultColor(result) === 'error' ? 'danger' : 'warning'}>Kết quả: Bạn {result}!</Title>
        ) : (
          <Title level={3} type="secondary">Vui lòng chọn Kéo, Búa, hoặc Bao</Title>
        )}
      </div>

      <div style={{ marginTop: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4}>Lịch sử đấu</Title>
          <Button danger onClick={clearHistory} disabled={history.length === 0}>Xóa lịch sử</Button>
        </div>
        <Table 
          dataSource={history} 
          columns={columns} 
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </div>
    </Card>
  );
};

export default RockPaperScissors;
