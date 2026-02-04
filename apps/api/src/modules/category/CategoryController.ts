import { NextFunction, Request, Response } from "express";
import { CreateCategoryUseCase } from "./use-cases/CreateCategoryUseCase.js";
import { FindAllCategoriesUseCase } from "./use-cases/FindAllCategoriesUseCase.js";
import { UpdateCategoryUseCase } from "./use-cases/UpdateCategoryUseCase.js";
import { DeleteCategoryUseCase } from "./use-cases/DeleteCategoryUseCase.js";
import { CategoryRepository } from "./repositories/CategoryRepository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

const createCategoryUseCase = new CreateCategoryUseCase();
const findAllCategoriesUseCase = new FindAllCategoriesUseCase();
const updateCategoryUseCase = new UpdateCategoryUseCase();
const deleteCategoryUseCase = new DeleteCategoryUseCase();

export class CategoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await createCategoryUseCase.execute(req.body);
      return res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeCount = req.query.includeCount === 'true';
      const categories = await findAllCategoriesUseCase.execute(includeCount);
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = CategoryRepository.findById(parseInt(id));
      
      if (!category) {
        throw new AppError({
          message: "Category not found",
          code: ErrorCode.CATEGORY_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }

      // Incluir contagem de medicamentos
      const medicineCount = CategoryRepository.countMedicinesByCategory(category.id);

      return res.status(200).json({
        ...category,
        medicine_count: medicineCount
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await updateCategoryUseCase.execute(Number(id), req.body);
      return res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await deleteCategoryUseCase.execute(Number(id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}