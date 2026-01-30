import { Request, Response } from 'express';
import { DoctorService } from './DoctorService.js';

export class DoctorController {
  static create(req: Request, res: Response) {
    const {
        name,
        crm,
        specialty
    } = req.body;

    if (
        !name ||
        !crm ||
        !specialty
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const doctor = DoctorService.create({
      name,
      crm,
      specialty
    });

    return res.status(201).json(doctor);
  }
}