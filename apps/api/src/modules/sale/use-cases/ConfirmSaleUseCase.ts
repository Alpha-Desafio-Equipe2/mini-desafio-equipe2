import { SaleRepository } from "../repositories/SaleRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class ConfirmSaleUseCase {
  async execute(id: number) {
    const sale = SaleRepository.findById(id);

    if (!sale) {
      throw new AppError({
        message: "Sale not found",
        code: ErrorCode.SALE_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (sale.status === 'confirmed') {
      return { id, status: "confirmed" };
    }

    SaleRepository.updateStatus(id, 'confirmed');

    return { id, status: "confirmed" };
  }
}
