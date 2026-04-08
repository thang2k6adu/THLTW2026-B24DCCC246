import { useState, useCallback, useMemo } from 'react';
import { saveItinerary } from '@/services/itinerary';

export interface IDayPlan {
  day: number;
  destinations: any[];
}

export default () => {
  const [days, setDays] = useState<IDayPlan[]>([{ day: 1, destinations: [] }]);
  const [totalBudgetLimit, setTotalBudgetLimit] = useState<number>(10000000);
  const [saving, setSaving] = useState(false);

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
      await saveItinerary({ days, summary });
      setDays([{ day: 1, destinations: [] }]);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, [days, summary]);

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
    save
  };
};
