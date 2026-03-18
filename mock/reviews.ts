import { Request, Response } from 'express';

let reviews = [
  { id: 1, employeeId: 1, appointmentId: 1, rating: 5, comment: 'Dịch vụ rất tốt!', reply: '' }
];

export default {
  'GET /api/reviews': (req: Request, res: Response) => {
    res.send({ data: reviews, success: true });
  },
  'POST /api/reviews': (req: Request, res: Response) => {
    const newReview = { id: Date.now(), reply: '', ...req.body };
    reviews.push(newReview);
    res.send({ data: newReview, success: true });
  },
  'PUT /api/reviews/:id/reply': (req: Request, res: Response) => {
    const { id } = req.params;
    const { reply } = req.body;
    reviews = reviews.map(r => r.id === Number(id) ? { ...r, reply } : r);
    res.send({ success: true });
  }
};
