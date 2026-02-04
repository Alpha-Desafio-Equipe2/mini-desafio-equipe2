import { NextFunction, Request, Response } from "express";
import { CreateMedicineUseCase } from "./use-cases/CreateMedicineUseCase.js";
import { FindAllMedicinesUseCase } from "./use-cases/FindAllMedicinesUseCase.js";
import { UpdateMedicineUseCase } from "./use-cases/UpdateMedicineUseCase.js";
import { DeleteMedicineUseCase } from "./use-cases/DeleteMedicineUseCase.js";
import { MedicineRepository } from "./repositories/MedicineRepository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

const createMedicineUseCase = new CreateMedicineUseCase();
const findAllMedicinesUseCase = new FindAllMedicinesUseCase();
const updateMedicineUseCase = new UpdateMedicineUseCase();
const deleteMedicineUseCase = new DeleteMedicineUseCase();

export class MedicineController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const medicine = await createMedicineUseCase.execute(req.body);
      return res.status(201).json(medicine);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Extrair filtros da query string
      const filters: any = {};

      if (req.query.category_id) {
        filters.category_id = Number(req.query.category_id);
      }

      if (req.query.requires_prescription !== undefined) {
        filters.requires_prescription = req.query.requires_prescription === 'true';
      }

      if (req.query.search) {
        filters.search = String(req.query.search);
      }

      if (req.query.min_price) {
        filters.min_price = Number(req.query.min_price);
      }

      if (req.query.max_price) {
        filters.max_price = Number(req.query.max_price);
      }

      const medicines = await findAllMedicinesUseCase.execute(filters);
      return res.status(200).json(medicines);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const medicine = MedicineRepository.findById(parseInt(id));
      
      if (!medicine) {
        throw new AppError({
          message: "Medicine not found",
          code: ErrorCode.MEDICINE_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }

      return res.status(200).json(medicine);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await updateMedicineUseCase.execute(Number(id), req.body);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await deleteMedicineUseCase.execute(Number(id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}