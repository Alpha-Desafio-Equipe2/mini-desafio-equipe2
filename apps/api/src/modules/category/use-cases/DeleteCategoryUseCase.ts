import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class DeleteCategoryUseCase {
  async execute(id: number) {
    const category = CategoryRepository.findById(id);

    if (!category) {
      throw new AppError({
        message: "Category not found",
        code: ErrorCode.CATEGORY_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    // Verificar se existem medicamentos vinculados
    const medicineCount = CategoryRepository.countMedicinesByCategory(id);

    if (medicineCount > 0) {
      throw new AppError({
        message: `Cannot delete category "${category.name}" because it has ${medicineCount} medicine(s) associated with it`,
        code: ErrorCode.CATEGORY_HAS_MEDICINES,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    CategoryRepository.delete(id);
  }
}