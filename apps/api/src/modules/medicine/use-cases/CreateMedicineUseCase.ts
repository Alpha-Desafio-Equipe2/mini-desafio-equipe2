import { MedicineRepository } from "../repositories/MedicineRepository.js";
import { CreateMedicineDTO } from "../dtos/CreateMedicineDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class CreateMedicineUseCase {
  async execute(data: CreateMedicineDTO) {
    const { name, active_principle, price, stock, category } = data;

    if (!name || !active_principle || !category || price === undefined || stock === undefined) {
      throw new AppError({
        message: "Missing required fields",
        code: ErrorCode.MISSING_MEDICINE_NAME,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    if (stock < 0) {
      throw new AppError({
        message: "Stock cannot be negative",
        code: ErrorCode.INVALID_ITEM_QUANTITY,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    if (price <= 0) {
      throw new AppError({
        message: "Price must be greater than zero",
        code: ErrorCode.INVALID_ITEM_PRICE,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const medicineId = MedicineRepository.create({
      ...data,
      image_url: data.image_url || `https://placehold.co/400x300?text=${encodeURIComponent(data.name)}`
    });
    return MedicineRepository.findById(Number(medicineId));
  }
}
