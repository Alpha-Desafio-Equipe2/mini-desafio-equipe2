import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
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

      // Return stock to inventory
      for (const item of items) {
        MedicineRepository.incrementStock(item.medicine_id, item.quantity);
      }

      // Return balance to customer if sale was confirmed or pending (i.e., balance was deducted)
      if (sale.status === 'confirmed' || sale.status === 'pending') {
        const customer = SaleRepository.findCustomerBySaleId(id);
        if (customer && customer.user_id) {
          const user = UserRepository.findById(customer.user_id);
          if (user) {
            const refundedBalance = (user.balance || 0) + Number(sale.total_value);
            UserRepository.update(customer.user_id, { balance: refundedBalance });
          }
        }
      }

      // Mark sale as cancelled instead of deleting it (for audit trail)
      SaleRepository.update(id, { status: 'cancelled' });
      SaleRepository.deleteItemsBySaleId(id);
    })();
  }
}
