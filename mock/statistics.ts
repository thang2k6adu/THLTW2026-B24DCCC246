import { Request, Response } from 'express';

export default {
  'GET /api/statistics': (req: Request, res: Response) => {
    res.send({
      data: {
        appointmentsPerDay: { '2026-03-20': 5, '2026-03-21': 3 },
        revenueByService: { 1: 500000, 2: 1500000 },
        revenueByEmployee: { 1: 1000000, 2: 1000000 }
      },
      success: true
    });
  }
};
