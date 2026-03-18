import { Request, Response } from 'express';

const genServices = () => [
  { id: 1, name: 'Cắt tóc nam', price: 100000, duration: 30 },
  { id: 2, name: 'Khám bệnh tổng quát', price: 500000, duration: 60 },
  { id: 3, name: 'Sửa chữa laptop', price: 200000, duration: 120 },
];

let services = genServices();

export default {
  'GET /api/services': (req: Request, res: Response) => {
    res.send({ data: services, success: true });
  },
  'POST /api/services': (req: Request, res: Response) => {
    const newService = { id: Date.now(), ...req.body };
    services.push(newService);
    res.send({ data: newService, success: true });
  },
  'PUT /api/services/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    services = services.map(s => s.id === Number(id) ? { ...s, ...req.body } : s);
    res.send({ success: true });
  },
  'DELETE /api/services/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    services = services.filter(s => s.id !== Number(id));
    res.send({ success: true });
  }
};
