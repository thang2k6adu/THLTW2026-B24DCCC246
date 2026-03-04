import { useState, useEffect } from 'react';
import { message } from 'antd';

export interface SubjectType {
    id: string;
    name: string;
}

export interface ScheduleType {
    id: string;
    subjectId: string;
    time: string;
    durationHours: number;
    content: string;
    note: string;
}

export interface GoalType {
    id: string;
    subjectId: string | 'TOTAL';
    month: string;
    targetHours: number;
}

export default () => {
    const loadFromStorage = (key: string, defaultVal: any) => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return defaultVal;
            }
        }
        return defaultVal;
    };

    const defaultSubjects: SubjectType[] = [
        { id: '1', name: 'toán' },
        { id: '2', name: 'văn' },
        { id: '3', name: 'anh' },
        { id: '4', name: 'khoa học' },
        { id: '5', name: 'công nghệ' },
    ];

    const [subjects, setSubjects] = useState<SubjectType[]>(loadFromStorage('APP_SUBJECTS', defaultSubjects));
    const [schedules, setSchedules] = useState<ScheduleType[]>(loadFromStorage('APP_SCHEDULES', []));
    const [goals, setGoals] = useState<GoalType[]>(loadFromStorage('APP_GOALS', []));

    useEffect(() => {
        localStorage.setItem('APP_SUBJECTS', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('APP_SCHEDULES', JSON.stringify(schedules));
    }, [schedules]);

    useEffect(() => {
        localStorage.setItem('APP_GOALS', JSON.stringify(goals));
    }, [goals]);


    const addSubject = (name: string) => {
        const newSub: SubjectType = { id: Date.now().toString(), name };
        setSubjects([...subjects, newSub]);
        message.success('đã thêm môn học');
    };

    const editSubject = (id: string, name: string) => {
        setSubjects(subjects.map((sub) => (sub.id === id ? { ...sub, name } : sub)));
        message.success('đã cập nhật môn học');
    };

    const deleteSubject = (id: string) => {
        setSubjects(subjects.filter((sub) => sub.id !== id));
        setSchedules(schedules.filter((sch) => sch.subjectId !== id));
        setGoals(goals.filter((g) => g.subjectId !== id));
        message.success('đã xóa môn học thành coong');
    };

    const addSchedule = (data: Omit<ScheduleType, 'id'>) => {
        const newSch: ScheduleType = { id: Date.now().toString(), ...data };
        setSchedules([...schedules, newSch]);
        message.success('đã thêm lịch học');
    };

    const editSchedule = (id: string, data: Partial<ScheduleType>) => {
        setSchedules(schedules.map((sch) => (sch.id === id ? { ...sch, ...data } : sch)));
        message.success('đã cập nhật lịch học');
    };

    const deleteSchedule = (id: string) => {
        setSchedules(schedules.filter((sch) => sch.id !== id));
        message.success('đã xóa lịch học thành công');
    };
    return {
        subjects,
        addSubject,
        editSubject,
        deleteSubject,
        schedules,
        addSchedule,
        editSchedule,
        deleteSchedule,
        goals
    };
};