import { MedicineRepository } from "../repositories/MedicineRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface UpdateMedicineDTO {
  name?: string;
  manufacturer?: string;
  active_principle?: string;
  requires_prescription?: boolean;
  price?: number;
  stock?: number;
}

export class UpdateMedicineUseCase {
  async execute(id: number, data: UpdateMedicineDTO) {
    const medicine = MedicineRepository.findById(id);

    if (!medicine) {
      throw new AppError({
        message: "Medicine not found",
        code: ErrorCode.MEDICINE_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new AppError({
        message: "Stock cannot be negative",
        code: ErrorCode.INVALID_ITEM_QUANTITY,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    if (data.price !== undefined && data.price <= 0) {
      throw new AppError({
        message: "Price must be greater than zero",
        code: ErrorCode.INVALID_ITEM_PRICE,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    MedicineRepository.update(id, data);

    return {
      ...medicine,
      ...data,
    };
  }
}
