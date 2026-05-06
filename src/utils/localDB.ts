export const FIT_DATA_KEY = 'FITNESS_DATA_V1';

export interface Workout {
  id: string;
  date: string;
  exerciseType: string;
  duration: number; // minutes
  calories: number;
  notes: string;
  status: 'Completed' | 'Missed';
}

export interface HealthMetric {
  id: string;
  date: string;
  weight: number; // kg
  height: number; // cm
  bmi: number;
  restingHeartRate: number; // bpm
  sleepHours: number;
}

export interface Goal {
  id: string;
  name: string;
  type: string; // Giảm cân / Tăng cơ / Cải thiện sức bền / Khác
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  description: string;
  caloriesPerHour: number;
}

export interface FitnessDB {
  workouts: Workout[];
  healthMetrics: HealthMetric[];
  goals: Goal[];
  exercises: Exercise[];
}

const defaultDB: FitnessDB = {
  workouts: [
    { id: '1', date: '2026-04-20', exerciseType: 'Cardio', duration: 30, calories: 300, notes: 'Morning run', status: 'Completed' },
    { id: '2', date: '2026-04-22', exerciseType: 'Strength', duration: 45, calories: 400, notes: 'Leg day', status: 'Completed' },
    { id: '3', date: '2026-04-24', exerciseType: 'Yoga', duration: 60, calories: 200, notes: 'Relaxing stretch', status: 'Completed' },
    { id: '4', date: '2026-04-26', exerciseType: 'HIIT', duration: 20, calories: 250, notes: 'Quick session', status: 'Completed' },
    { id: '5', date: '2026-04-28', exerciseType: 'Other', duration: 30, calories: 150, notes: 'Walking', status: 'Completed' },
  ],
  healthMetrics: [
    { id: '1', date: '2026-04-20', weight: 70, height: 175, bmi: 22.86, restingHeartRate: 65, sleepHours: 7 },
    { id: '2', date: '2026-04-24', weight: 69.5, height: 175, bmi: 22.69, restingHeartRate: 64, sleepHours: 7.5 },
    { id: '3', date: '2026-04-28', weight: 69, height: 175, bmi: 22.53, restingHeartRate: 62, sleepHours: 8 },
  ],
  goals: [],
  exercises: [],
};

export const getDB = (): FitnessDB => {
  const data = localStorage.getItem(FIT_DATA_KEY);
  if (!data) {
    localStorage.setItem(FIT_DATA_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
  return JSON.parse(data);
};

export const saveDB = (db: FitnessDB) => {
  localStorage.setItem(FIT_DATA_KEY, JSON.stringify(db));
};
