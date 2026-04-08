import { useState, useCallback } from 'react';

const defaultDestinations = [
  {
    id: 1,
    name: 'Vịnh Hạ Long',
    location: 'Quảng Ninh',
    type: 'biển',
    priceLevel: 1500000,
    rating: 4.8,
    description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn hòn đảo kỳ vĩ.',
    prepTime: '2 ngày',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    expenses: { food: 500000, transport: 300000, accommodation: 700000 },
  },
  {
    id: 2,
    name: 'Sapa',
    location: 'Lào Cai',
    type: 'núi',
    priceLevel: 1200000,
    rating: 4.5,
    description: 'Thị trấn trong sương với khí hậu mát mẻ và ruộng bậc thang.',
    prepTime: '3 ngày',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    expenses: { food: 400000, transport: 500000, accommodation: 300000 },
  },
  {
    id: 3,
    name: 'Phố cổ Hội An',
    location: 'Quảng Nam',
    type: 'thành phố',
    priceLevel: 800000,
    rating: 4.9,
    description: 'Di sản văn hóa thế giới với những ngôi nhà cổ kính.',
    prepTime: '1 ngày',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    expenses: { food: 300000, transport: 100000, accommodation: 400000 },
  },
  {
    id: 4,
    name: 'Phú Quốc',
    location: 'Kiên Giang',
    type: 'biển',
    priceLevel: 2500000,
    rating: 4.7,
    description: 'Đảo ngọc thiên đường với những bãi biển cát trắng.',
    prepTime: '3 ngày',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    expenses: { food: 800000, transport: 700000, accommodation: 1000000 },
  },
];

const LOCAL_KEY = 'travel_destinations';

const getLocalDestinations = () => {
  const stored = localStorage.getItem(LOCAL_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch(e) {}
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultDestinations));
  return [...defaultDestinations];
};

export default () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDestinations = useCallback(async (params: any = {}) => {
    setLoading(true);
    try {
      let data = getLocalDestinations();
      if (params.type) data = data.filter((d: any) => d.type === params.type);
      if (params.sortBy === 'price_asc') data.sort((a: any, b: any) => a.priceLevel - b.priceLevel);
      if (params.sortBy === 'price_desc') data.sort((a: any, b: any) => b.priceLevel - a.priceLevel);
      if (params.sortBy === 'rating') data.sort((a: any, b: any) => b.rating - a.rating);
      
      setDestinations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const allDests = getLocalDestinations();
      const newDests = [...allDests, { ...data, id: Date.now() }];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newDests));
      await fetchDestinations();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDestinations]);

  const update = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const allDests = getLocalDestinations();
      const newDests = allDests.map((d: any) => d.id === data.id ? { ...d, ...data } : d);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newDests));
      await fetchDestinations();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDestinations]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const allDests = getLocalDestinations();
      const newDests = allDests.filter((d: any) => d.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(newDests));
      await fetchDestinations();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDestinations]);

  return {
    destinations,
    loading,
    fetchDestinations,
    create,
    update,
    remove,
  };
};
