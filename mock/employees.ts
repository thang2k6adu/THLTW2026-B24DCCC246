import { Request, Response } from 'express';

const genEmployees = () => [
  { id: 1, name: 'Nguyễn Văn A', maxCustomers: 10, schedule: 'Thứ 2 - Thứ 6: 08:00 - 17:00' },
  { id: 2, name: 'Trần Thị B', maxCustomers: 5, schedule: 'Thứ 7 - CN: 09:00 - 21:00' },
];

let employees = genEmployees();

export default {
  'GET /api/employees': (req: Request, res: Response) => {
    res.send({ data: employees, success: true });
  },
  'POST /api/employees': (req: Request, res: Response) => {
    const newEmployee = { id: Date.now(), ...req.body };
    employees.push(newEmployee);
    res.send({ data: newEmployee, success: true });
  },
  'PUT /api/employees/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    employees = employees.map(e => e.id === Number(id) ? { ...e, ...req.body } : e);
    res.send({ success: true });
  },
  'DELETE /api/employees/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    employees = employees.filter(e => e.id !== Number(id));
    res.send({ success: true });
  }
};
