import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
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

    // Decrement stock when admin confirms the sale
    db.transaction(() => {
      const items = SaleRepository.findItemsBySaleId(id);
      
      for (const item of items) {
        const medicine = MedicineRepository.findById(item.medicine_id);
        
        if (!medicine || medicine.stock < item.quantity) {
          throw new AppError({
            message: `Insufficient stock for medicine: ${medicine?.name || item.medicine_id}`,
            code: ErrorCode.INSUFFICIENT_STOCK,
            httpStatus: HttpStatus.BAD_REQUEST,
          });
        }
        
        MedicineRepository.decrementStock(item.medicine_id, item.quantity);
      }
      
      SaleRepository.updateStatus(id, 'confirmed');
    })();

    return { id, status: "confirmed" };
  }
}
