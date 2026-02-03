import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { CustomerRepository } from "../../customer/repositories/CustomerRepository.js";
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

    // Se já está confirmada, retorna sem fazer nada
    if (sale.status === 'confirmed') {
      return { 
        id, 
        status: "confirmed",
        message: "Sale already confirmed"
      };
    }

    // Se foi cancelada, não pode confirmar
    if (sale.status === 'cancelled') {
      throw new AppError({
        message: "Cannot confirm a cancelled sale",
        code: ErrorCode.INVALID_SALE_STATUS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    // Confirmar venda: deduzir estoque E saldo
    db.transaction(() => {
      const items = SaleRepository.findItemsBySaleId(id);
      
      // 1. DEDUZIR ESTOQUE
      for (const item of items) {
        const medicine = MedicineRepository.findById(item.medicine_id);
        
        if (!medicine) {
          throw new AppError({
            message: `Medicine ${item.medicine_id} not found`,
            code: ErrorCode.MEDICINE_NOT_FOUND,
            httpStatus: HttpStatus.NOT_FOUND,
          });
        }

        // Verificar estoque novamente (pode ter mudado desde a criação)
        if (medicine.stock < item.quantity) {
          throw new AppError({
            message: `Insufficient stock for medicine: ${medicine.name}. Available: ${medicine.stock}, Required: ${item.quantity}`,
            code: ErrorCode.INSUFFICIENT_STOCK,
            httpStatus: HttpStatus.BAD_REQUEST,
          });
        }
        
        // DEDUZIR ESTOQUE
        MedicineRepository.decrementStock(item.medicine_id, item.quantity);
      }

      // 2. DEDUZIR SALDO DO CLIENTE (se existir)
      if (sale.customer_id) {
        const customer = CustomerRepository.findById(sale.customer_id);
        
        if (customer && customer.user_id) {
          const user = UserRepository.findById(customer.user_id);
          
          if (user) {
            // Verificar saldo novamente
            if ((user.balance || 0) < sale.total_value) {
              throw new AppError({
                message: `Insufficient balance. User balance is R$ ${(user.balance || 0).toFixed(2)}, but sale total is R$ ${sale.total_value.toFixed(2)}`,
                code: ErrorCode.INSUFFICIENT_BALANCE,
                httpStatus: HttpStatus.BAD_REQUEST
              });
            }

            // DEDUZIR SALDO
            const newBalance = (user.balance || 0) - Number(sale.total_value);
            UserRepository.update(customer.user_id, { balance: newBalance });
          }
        }
      }

      // 3. ATUALIZAR STATUS DA VENDA
      SaleRepository.updateStatus(id, 'confirmed');
    })();

    return { 
      id, 
      status: "confirmed",
      message: "Sale confirmed successfully. Stock and balance updated."
    };
  }
}