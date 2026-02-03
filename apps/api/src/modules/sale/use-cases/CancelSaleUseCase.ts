import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { CustomerRepository } from "../../customer/repositories/CustomerRepository.js";
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

    // Se já está cancelada, não faz nada
    if (sale.status === 'cancelled') {
      return {
        message: "Sale already cancelled",
        status: "cancelled"
      };
    }

    db.transaction(() => {
      const items = SaleRepository.findItemsBySaleId(id);

      // SÓ DEVOLVER ESTOQUE E SALDO SE A VENDA FOI CONFIRMADA
      if (sale.status === 'confirmed') {
        // 1. DEVOLVER ESTOQUE
        for (const item of items) {
          const medicine = MedicineRepository.findById(item.medicine_id);
          
          if (medicine) {
            MedicineRepository.incrementStock(item.medicine_id, item.quantity);
          }
        }

        // 2. DEVOLVER SALDO AO CLIENTE
        if (sale.customer_id) {
          const customer = CustomerRepository.findById(sale.customer_id);
          
          if (customer && customer.user_id) {
            const user = UserRepository.findById(customer.user_id);
            
            if (user) {
              const refundedBalance = (user.balance || 0) + Number(sale.total_value);
              UserRepository.update(customer.user_id, { balance: refundedBalance });
            }
          }
        }
      }
      // Se status era 'pending', não há nada para devolver (estoque e saldo não foram deduzidos)

      // 3. MARCAR VENDA COMO CANCELADA (mantém para auditoria)
      SaleRepository.updateStatus(id, 'cancelled');
      
      // Opcional: manter os itens para histórico ou deletar
      // SaleRepository.deleteItemsBySaleId(id);
    })();

    return {
      message: "Sale cancelled successfully",
      status: "cancelled",
      refunded: sale.status === 'confirmed' // Indica se houve devolução
    };
  }
}