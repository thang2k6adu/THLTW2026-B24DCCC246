import React from 'react';
import { Card, Tabs } from 'antd';
import SubjectManager from './components/SubjectManager';
import ScheduleManager from './components/ScheduleManager';
import GoalManager from './components/GoalManager';

const { TabPane } = Tabs;

const Bai2Page: React.FC = () => {
    return (
        <Card title="Quản lý tiến độ học tập">
            <Tabs defaultActiveKey="1">
                <TabPane tab="Quản lý Lịch Học / Tiến độ" key="1">
                    <ScheduleManager />
                </TabPane>
                <TabPane tab="Quản lý Danh mục Môn học" key="2">
                    <SubjectManager />
                </TabPane>
                <TabPane tab="Mục tiêu học tập" key="3">
                    <GoalManager />
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default Bai2Page;
