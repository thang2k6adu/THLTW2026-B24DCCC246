import { Request, Response } from 'express';

let itineraries: any[] = [];

export default {
  'GET /api/itinerary/list': (req: Request, res: Response) => {
    res.send({ data: itineraries, success: true });
  },

  'POST /api/itinerary/save': (req: Request, res: Response) => {
    const newItinerary = { ...req.body, id: Date.now(), createdAt: new Date() };
    itineraries.push(newItinerary);
    res.send({ status: 'ok', data: newItinerary });
  },
};
