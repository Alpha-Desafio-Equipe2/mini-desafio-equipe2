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
      const medicines = await findAllMedicinesUseCase.execute();
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
