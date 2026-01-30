import { NextFunction, Request, Response } from "express";
import { MedicineService } from "./MedicineService.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

export class MedicineController {
  static create(req: Request, res: Response, next: NextFunction) {
    try {
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
        throw new AppError({
          message: "Missing required fields",
          code: ErrorCode.MISSING_MEDICINE_NAME,
          httpStatus: HttpStatus.BAD_REQUEST,
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
    } catch (error) {
      next(error);
    }
  }

  static getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const medicines = MedicineService.getAll();
      return res.status(200).json(medicines);
    } catch (error) {
      next(error);
    }
  }

  static getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const medicine = MedicineService.getById(parseInt(id));
      return res.status(200).json(medicine);
    } catch (error) {
      next(error);
    }
  }

  static update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const medicine = MedicineService.update(id, req.body);
      return res.json(medicine);
    } catch (error) {
      next(error);
    }
  }

  static delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      MedicineService.delete(parseInt(id));
      return res.status(204).json(`Medicine id :${id} deleted successfully`);
    } catch (error) {
      next(error);
    }
  }
}
