import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface CreateCategoryDTO {
  name: string;
  description?: string;
  icon?: string;
}

export class CreateCategoryUseCase {
  async execute(data: CreateCategoryDTO) {
    // Verificar se já existe categoria com esse nome
    const existingCategory = CategoryRepository.findByName(data.name);
    
    if (existingCategory) {
      throw new AppError({
        message: `Category with name "${data.name}" already exists`,
        code: ErrorCode.CATEGORY_ALREADY_EXISTS,
        httpStatus: HttpStatus.CONFLICT,
      });
    }

    // Validar nome
    if (!data.name || data.name.trim().length === 0) {
      throw new AppError({
        message: "Category name is required",
        code: ErrorCode.VALIDATION_ERROR,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const categoryId = CategoryRepository.create({
      name: data.name.trim(),
      description: data.description?.trim(),
      icon: data.icon?.trim(),
    });

    return CategoryRepository.findById(categoryId);
  }
}