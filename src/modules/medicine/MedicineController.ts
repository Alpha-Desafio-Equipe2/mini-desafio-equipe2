import { Request, Response } from 'express';
import { MedicineService } from './MedicineService.js';

export class MedicineController {
  static create(req: Request, res: Response) {
    const {
      name,
      manufacturer,
      active_principle,
      requires_prescription,
      price,
      stock,
    } = req.body;

    if (
      !name ||
      !active_principle ||
      requires_prescription === undefined ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const medicine = MedicineService.create({
      name,
      manufacturer,
      active_principle,
      requires_prescription,
      price,
      stock,
    });

    return res.status(201).json(medicine);
  }
}
