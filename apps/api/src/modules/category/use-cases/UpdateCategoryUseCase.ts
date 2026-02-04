import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  icon?: string;
}

export class UpdateCategoryUseCase {
  async execute(id: number, data: UpdateCategoryDTO) {
    const category = CategoryRepository.findById(id);

    if (!category) {
      throw new AppError({
        message: "Category not found",
        code: ErrorCode.CATEGORY_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    // Se estiver alterando o nome, verificar se já existe outra categoria com esse nome
    if (data.name && data.name !== category.name) {
      const existingCategory = CategoryRepository.findByName(data.name);
      
      if (existingCategory && existingCategory.id !== id) {
        throw new AppError({
          message: `Category with name "${data.name}" already exists`,
          code: ErrorCode.CATEGORY_ALREADY_EXISTS,
          httpStatus: HttpStatus.CONFLICT,
        });
      }
    }

    CategoryRepository.update(id, {
      name: data.name?.trim(),
      description: data.description?.trim(),
      icon: data.icon?.trim(),
    });

    return CategoryRepository.findById(id);
  }
}