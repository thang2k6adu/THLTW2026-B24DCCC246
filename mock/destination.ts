import { Request, Response } from 'express';

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

let destinations = [...defaultDestinations];

export default {
  'GET /api/destination/list': (req: Request, res: Response) => {
    const { type, minPrice, maxPrice, sortBy } = req.query;
    let data = [...destinations];

    if (type) {
      data = data.filter((d) => d.type === type);
    }
    if (minPrice) {
      data = data.filter((d) => d.priceLevel >= Number(minPrice));
    }
    if (maxPrice) {
      data = data.filter((d) => d.priceLevel <= Number(maxPrice));
    }
    if (sortBy === 'price_asc') {
      data.sort((a, b) => a.priceLevel - b.priceLevel);
    } else if (sortBy === 'price_desc') {
      data.sort((a, b) => b.priceLevel - a.priceLevel);
    } else if (sortBy === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    }

    res.send({
      data,
      total: data.length,
      success: true,
    });
  },

  'POST /api/destination/create': (req: Request, res: Response) => {
    const newDest = { ...req.body, id: Date.now() };
    destinations.push(newDest);
    res.send({ status: 'ok', data: newDest });
  },

  'PUT /api/destination/update': (req: Request, res: Response) => {
    const { id } = req.body;
    destinations = destinations.map((d) => (d.id === id ? { ...d, ...req.body } : d));
    res.send({ status: 'ok' });
  },

  'DELETE /api/destination/delete': (req: Request, res: Response) => {
    const { id } = req.query;
    destinations = destinations.filter((d) => d.id !== Number(id));
    res.send({ status: 'ok' });
  },
};
