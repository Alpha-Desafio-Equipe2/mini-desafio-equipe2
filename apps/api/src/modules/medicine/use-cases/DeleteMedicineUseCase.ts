import { MedicineRepository } from "../repositories/MedicineRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class DeleteMedicineUseCase {
  async execute(id: number) {
    const medicine = MedicineRepository.findById(id);

    if (!medicine) {
      throw new AppError({
        message: "Medicine not found",
        code: ErrorCode.MEDICINE_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    MedicineRepository.delete(id);
  }
}
