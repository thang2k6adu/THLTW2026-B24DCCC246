import { useState, useCallback } from 'react';
import { getDB } from '@/utils/localDB';
import moment from 'moment';

export default () => {
  const [data, setData] = useState<any>({
    totalWorkouts: 0,
    totalCalories: 0,
    streak: 0,
    goalCompletion: 0,
    recentWorkouts: [],
    workoutsByWeek: [],
    weightOverTime: [],
  });

  const fetchDashboardData = useCallback(() => {
    const db = getDB();
    const currentMonth = moment().format('YYYY-MM');
    
    // Total Workouts this month
    const monthWorkouts = db.workouts.filter(w => w.date.startsWith(currentMonth) && w.status === 'Completed');
    const totalWorkouts = monthWorkouts.length;
    
    // Total Calories this month
    const totalCalories = monthWorkouts.reduce((sum, w) => sum + w.calories, 0);
    
    // Streak (consecutive days)
    let streak = 0;
    let checkDate = moment();
    const completedDates = db.workouts.filter(w => w.status === 'Completed').map(w => w.date);
    while (completedDates.includes(checkDate.format('YYYY-MM-DD'))) {
        streak++;
        checkDate.subtract(1, 'days');
    }
    if (streak === 0) {
        checkDate = moment().subtract(1, 'days');
        while (completedDates.includes(checkDate.format('YYYY-MM-DD'))) {
            streak++;
            checkDate.subtract(1, 'days');
        }
    }

    // Goal Completion %
    const activeGoals = db.goals.filter(g => g.status !== 'Đã hủy');
    let goalCompletion = 0;
    if (activeGoals.length > 0) {
        const totalPercent = activeGoals.reduce((sum, g) => {
            const percent = Math.min(100, Math.max(0, (g.currentValue / g.targetValue) * 100));
            return sum + percent;
        }, 0);
        goalCompletion = Math.round(totalPercent / activeGoals.length);
    }

    // Recent 5 workouts
    const recentWorkouts = [...db.workouts].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()).slice(0, 5);

    // Workouts by week (Current month)
    const weekCounts = [0, 0, 0, 0];
    monthWorkouts.forEach(w => {
      const date = moment(w.date);
      const weekOfMonth = Math.ceil(date.date() / 7) - 1;
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        weekCounts[weekOfMonth]++;
      }
    });

    const weightOverTime = db.healthMetrics.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()).map(m => ({
        x: m.date,
        y: m.weight
    }));

    setData({
      totalWorkouts,
      totalCalories,
      streak,
      goalCompletion,
      recentWorkouts,
      workoutsByWeek: [{ name: 'Buổi tập', data: weekCounts }],
      weightOverTime: [{ name: 'Cân nặng', data: weightOverTime }]
    });
  }, []);

  return {
    data,
    fetchDashboardData
  };
};
