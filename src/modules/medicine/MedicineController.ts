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

  static getAll(req: Request, res: Response) {
    const medicines = MedicineService.getAll();

    return res.status(200).json(medicines);
  }

  static getById(req: Request, res: Response) {
    const { id } = req.params;
    const medicine = MedicineService.getById(parseInt(id));

    if (!medicine) {
      return res.status(404).json({
        message: 'Medicine not found',
      });
    }

    return res.status(200).json(medicine);
  }

  static update(req: Request, res: Response) {
    const id = req.params.id;

    const medicine = MedicineService.update(id, req.body);

    return res.json(medicine);
  }

  static delete(req: Request, res: Response) {
    const id = req.params.id;

    MedicineService.delete(parseInt(id));

    return res.status(204).json(`Medicine id :${id} deleted successfully`);
  }
}
