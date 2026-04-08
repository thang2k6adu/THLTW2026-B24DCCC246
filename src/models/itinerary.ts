import { useState, useCallback, useMemo, useEffect } from 'react';
import { message } from 'antd';

export interface IDayPlan {
  day: number;
  destinations: any[];
}

export default () => {
  const [days, setDays] = useState<IDayPlan[]>(() => {
    const stored = localStorage.getItem('travel_itinerary_days');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [{ day: 1, destinations: [] }];
  });

  const [totalBudgetLimit, setTotalBudgetLimit] = useState<number>(() => {
    const stored = localStorage.getItem('travel_itinerary_budget');
    if (stored) return Number(stored);
    return 10000000;
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('travel_itinerary_days', JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    localStorage.setItem('travel_itinerary_budget', totalBudgetLimit.toString());
  }, [totalBudgetLimit]);

  const addDay = useCallback(() => {
    setDays((prev) => [...prev, { day: prev.length + 1, destinations: [] }]);
  }, []);

  const removeDay = useCallback((dayIndex: number) => {
    setDays((prev) => {
      const newDays = prev.filter((_, idx) => idx !== dayIndex);
      return newDays.map((d, i) => ({ ...d, day: i + 1 }));
    });
  }, []);

  const addDestinationToDay = useCallback((dayIndex: number, destination: any) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex].destinations.push(destination);
      return newDays;
    });
  }, []);

  const removeDestinationFromDay = useCallback((dayIndex: number, destIndex: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex].destinations.splice(destIndex, 1);
      return newDays;
    });
  }, []);

  const reorderDestination = useCallback((dayIndex: number, startIndex: number, endIndex: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      const items = Array.from(newDays[dayIndex].destinations);
      const [reorderedItem] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, reorderedItem);
      newDays[dayIndex].destinations = items;
      return newDays;
    });
  }, []);

  const moveDestinationBetweenDays = useCallback((sourceDayIdx: number, destDayIdx: number, sourceIdx: number, destIdx: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      const sourceClone = Array.from(newDays[sourceDayIdx].destinations);
      const destClone = Array.from(newDays[destDayIdx].destinations);
      const [removed] = sourceClone.splice(sourceIdx, 1);
      destClone.splice(destIdx, 0, removed);
      newDays[sourceDayIdx].destinations = sourceClone;
      newDays[destDayIdx].destinations = destClone;
      return newDays;
    });
  }, []);

  const summary = useMemo(() => {
    let totalFood = 0;
    let totalTransport = 0;
    let totalAcc = 0;
    let totalCost = 0;
    let travelTime = 0;

    days.forEach(d => {
      d.destinations.forEach(dest => {
        totalCost += dest.priceLevel || 0;
        totalFood += dest.expenses?.food || 0;
        totalTransport += dest.expenses?.transport || 0;
        totalAcc += dest.expenses?.accommodation || 0;
        travelTime += parseInt(dest.prepTime) || 1;
      });
    });

    return {
      totalCost,
      totalFood,
      totalTransport,
      totalAcc,
      travelTime
    };
  }, [days]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      localStorage.setItem('travel_itinerary_days', JSON.stringify(days));
      message.success('Lịch trình của bạn đã được đối chiếu & sao lưu thành công!');
    } catch (e) {
      console.error(e);
      message.error('Có lỗi xảy ra khi lưu trữ!');
    } finally {
      setSaving(false);
    }
  }, [days]);

  return {
    days,
    totalBudgetLimit,
    saving,
    summary,
    setTotalBudgetLimit,
    addDay,
    removeDay,
    addDestinationToDay,
    removeDestinationFromDay,
    reorderDestination,
    moveDestinationBetweenDays,
    save
  };
};
