import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface CreateSaleDTO {
  user_id?: number;
  items: {
    medicine_id: number;
    quantity: number;
  }[];
  doctor_crm?: string;
  prescription_date?: string;
  payment_method?: string;
}

export class CreateSaleUseCase {
  async execute(data: CreateSaleDTO) {
    const { user_id, items, doctor_crm, prescription_date } = data;

    const result = db.transaction(() => {
      let totalValue = 0;
      const processedItems = [];

      for (const item of items) {
        const medicine = MedicineRepository.findById(item.medicine_id);

        if (!medicine) {
          throw new AppError({
            message: `Medicine ${item.medicine_id} not found`,
            code: ErrorCode.MEDICINE_NOT_FOUND,
            httpStatus: HttpStatus.NOT_FOUND,
          });
        }

        if (medicine.stock < item.quantity) {
          throw new AppError({
            message: `Insufficient stock for medicine: ${medicine.name}`,
            code: ErrorCode.INSUFFICIENT_STOCK,
            httpStatus: HttpStatus.BAD_REQUEST,
          });
        }

        if (item.quantity <= 0) {
          throw new AppError({
            message: `Invalid quantity for medicine: ${medicine.name}`,
            code: ErrorCode.INVALID_ITEM_QUANTITY,
            httpStatus: HttpStatus.BAD_REQUEST,
          });
        }

        if (Boolean(medicine.requires_prescription)) {
          if (!doctor_crm || !prescription_date) {
            throw new AppError({
              message: `Medicine ${medicine.name} requires prescription details (CRM and Date).`,
              code: ErrorCode.PRESCRIPTION_REQUIRED,
              httpStatus: HttpStatus.BAD_REQUEST,
            });
          }
        }

        const itemTotal = medicine.price * item.quantity;
        totalValue += itemTotal;
        processedItems.push({
          ...item,
          unit_price: medicine.price,
          total_price: itemTotal,
        });
      }

      // Balance Logic
      if (user_id) {
           const user = UserRepository.findById(user_id);
           
           if (user) {
               // Check balance
               if ((user.balance || 0) < totalValue) {
                 throw new AppError({
                   message: `Saldo insuficiente. Seu saldo é R$ ${(user.balance || 0).toFixed(2)}, mas a compra é R$ ${totalValue.toFixed(2)}`,
                   code: ErrorCode.PAYMENT_FAILED,
                   httpStatus: HttpStatus.BAD_REQUEST
                 });
               }
    
               // Deduct Balance
               const newBalance = (user.balance || 0) - totalValue;
               UserRepository.update(user_id, { balance: newBalance });
           }
      }

      const saleId = SaleRepository.create({
        user_id,
        total_value: totalValue,
        doctor_crm,
        prescription_date,
        payment_method: data.payment_method,
        status: 'pending' // Created as pending; only confirmed when admin confirms
      });

      for (const item of processedItems) {
        SaleRepository.createItem({
          sale_id: saleId,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        });
        // Stock decrement will happen when sale is confirmed by admin
      }

      return {
        id: saleId,
        total: totalValue,
        items: processedItems,
        status: "pending" // Return pending
      };
    })();

    return result;
  }
}
