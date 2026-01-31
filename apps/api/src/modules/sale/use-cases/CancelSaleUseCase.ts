import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class CancelSaleUseCase {
  async execute(id: number) {
    const sale = SaleRepository.findById(id);

    if (!sale) {
      throw new AppError({
        message: "Sale not found",
        code: ErrorCode.SALE_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (sale.status === 'cancelled') {
      return;
    }

    db.transaction(() => {
      const items = SaleRepository.findItemsBySaleId(id);

      for (const item of items) {
        MedicineRepository.incrementStock(item.medicine_id, item.quantity);
      }

      SaleRepository.deleteItemsBySaleId(id);
      SaleRepository.delete(id);
    })();
  }
}
