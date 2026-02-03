import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface CreateSaleDTO {
  customer_id?: number;
  branch_id: number;
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
    const { customer_id, branch_id, items, doctor_crm, prescription_date } = data;

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
      if (customer_id) {
        // First resolve the user from the customer
        // Note: We need to use CustomerRepository here. 
        // Since we didn't import it, we must add the import or use raw query if circular dependency is an issue.
        // Assuming we can import:
        const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(customer_id) as any;
        
        if (customer && customer.user_id) {
           const user = UserRepository.findById(customer.user_id);
           
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
               UserRepository.update(customer.user_id, { balance: newBalance });
           }
        } else {
             // Fallback: If for some reason customer has no user_id (legacy?), 
             // check if maybe customer_id IS the user_id (unlikely but user prompted to "add balance to user or customer")
             // For safety, let's not assume ID reuse. If no user linked, we can't deduct balance from a user.
             // Maybe we should allow the sale if payment_method is NOT 'balance'?
             // But the user specifically asked for balance deduction.
        }
      }

      const saleId = SaleRepository.create({
        customer_id,
        branch_id,
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
import { db } from "../../../config/database.js";
import { SaleRepository } from "../repositories/SaleRepository.js";
import { MedicineRepository } from "../../medicine/repositories/MedicineRepository.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { CustomerRepository } from "../../customer/repositories/CustomerRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface CreateSaleDTO {
  customer_id?: number;
  branch_id: number;
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
    const { customer_id, branch_id, items, doctor_crm, prescription_date } = data;

    // Validação de branch_id
    if (!branch_id) {
      throw new AppError({
        message: "Branch ID is required",
        code: ErrorCode.VALIDATION_ERROR,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const result = db.transaction(() => {
      let totalValue = 0;
      const processedItems = [];

      // 1. VALIDAR ITENS E CALCULAR TOTAL
      for (const item of items) {
        const medicine = MedicineRepository.findById(item.medicine_id);

        if (!medicine) {
          throw new AppError({
            message: `Medicine ${item.medicine_id} not found`,
            code: ErrorCode.MEDICINE_NOT_FOUND,
            httpStatus: HttpStatus.NOT_FOUND,
          });
        }

        // Validar estoque disponível (mas NÃO deduzir ainda)
        if (medicine.stock < item.quantity) {
          throw new AppError({
            message: `Insufficient stock for medicine: ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`,
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

        // Validar prescrição se necessário
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

      // 2. VALIDAR SALDO (mas NÃO deduzir ainda - só na confirmação)
      if (customer_id) {
        const customer = CustomerRepository.findById(customer_id);
        
        if (!customer) {
          throw new AppError({
            message: "Customer not found",
            code: ErrorCode.CUSTOMER_NOT_FOUND,
            httpStatus: HttpStatus.NOT_FOUND,
          });
        }

        if (customer.user_id) {
          const user = UserRepository.findById(customer.user_id);
          
          if (user) {
            // Apenas VALIDAR se há saldo suficiente
            if ((user.balance || 0) < totalValue) {
              throw new AppError({
                message: `Insufficient balance. Your balance is R$ ${(user.balance || 0).toFixed(2)}, but the purchase is R$ ${totalValue.toFixed(2)}`,
                code: ErrorCode.INSUFFICIENT_BALANCE,
                httpStatus: HttpStatus.BAD_REQUEST
              });
            }
          }
        }
      }

      // 3. CRIAR VENDA COM STATUS "PENDING"
      const saleId = SaleRepository.create({
        customer_id,
        branch_id,
        total_value: totalValue,
        doctor_crm,
        prescription_date,
        payment_method: data.payment_method,
        status: 'pending' // Aguardando confirmação do admin
      });

      // 4. CRIAR ITENS DA VENDA
      for (const item of processedItems) {
        SaleRepository.createItem({
          sale_id: saleId,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        });
      }

      return {
        id: saleId,
        total: totalValue,
        items: processedItems,
        status: "pending",
        message: "Sale created successfully. Waiting for admin confirmation."
      };
    })();

    return result;
  }
}