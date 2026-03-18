import { Request, Response } from 'express';

let appointments = [
  { id: 1, date: '2026-03-20', time: '09:00', employeeId: 1, serviceId: 1, status: 'confirmed' }
];

export default {
  'GET /api/appointments': (req: Request, res: Response) => {
    res.send({ data: appointments, success: true });
  },
  'POST /api/appointments': (req: Request, res: Response) => {
    const { date, time, employeeId } = req.body;
    const isOverlap = appointments.some(a => a.date === date && a.time === time && a.employeeId === employeeId && a.status !== 'cancelled');
    if (isOverlap) {
      return res.status(400).send({ message: 'Lịch hẹn bị trùng!', success: false });
    }
    const newAppointment = { id: Date.now(), status: 'pending', ...req.body };
    appointments.push(newAppointment);
    res.send({ data: newAppointment, success: true });
  },
  'PUT /api/appointments/:id/status': (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    appointments = appointments.map(a => a.id === Number(id) ? { ...a, status } : a);
    res.send({ success: true });
  }
};
