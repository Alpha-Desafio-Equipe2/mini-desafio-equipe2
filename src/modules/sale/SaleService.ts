import { db } from "../../config/database.js";
import { CreateSaleDTO } from "./dtos/CreateSaleDTO.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

export class SaleService {
  async create(data: CreateSaleDTO) {
    const { customer_id, branch_id, items, doctor_crm, prescription_date } =
      data;

    const createSaleTransaction = db.transaction(() => {
      let totalValue = 0;
      const processedItems = [];

      // 1. Validate Items / Calculate Total / Check Prescriptions
      for (const item of items) {
        const medicine = db
          .prepare("SELECT * FROM medicines WHERE id = ?")
          .get(item.medicine_id) as any;

        if (!medicine) {
          throw new AppError({
            message: `Medicine ${item.medicine_id} not found`,
            code: ErrorCode.MEDICINE_NOT_FOUND,
            httpStatus: HttpStatus.NOT_FOUND,
          });
        }

        // Stock Check
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

        // Prescription Check
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

      // 2. Create Sale
      const stmt = db.prepare(
        "INSERT INTO sales (customer_id, branch_id, total_value, doctor_crm, prescription_date, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      );
      const result = stmt.run(
        customer_id,
        branch_id,
        totalValue,
        doctor_crm || null,
        prescription_date || null,
      );

      const saleId = result.lastInsertRowid;

      // 3. Create Sale Items and Update Stock
      const itemStmt = db.prepare(
        "INSERT INTO sale_items (sale_id, medicine_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)",
      );

      const updateStockStmt = db.prepare(
        "UPDATE medicines SET stock = stock - ? WHERE id = ?",
      );

      for (const item of processedItems) {
        itemStmt.run(
          saleId,
          item.medicine_id,
          item.quantity,
          item.unit_price,
          item.total_price,
        );

        updateStockStmt.run(item.quantity, item.medicine_id);
      }

      return {
        id: saleId,
        total: totalValue,
        items: processedItems,
        status: "pending",
        doctor_crm,
      };
    });

    return createSaleTransaction();
  }

  async cancel(id: number | string) {
    const cancelTransaction = db.transaction(() => {
      // 1. Get sale items to know what to restore
      const items = db
        .prepare("SELECT * FROM sale_items WHERE sale_id = ?")
        .all(id) as any[];

      if (items.length === 0) {
        throw new AppError({
          message: "Sale not found or already cancelled",
          code: ErrorCode.SALE_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }

      // 2. Restore stock for each item
      const updateStock = db.prepare(
        "UPDATE medicines SET stock = stock + ? WHERE id = ?",
      );

      for (const item of items) {
        updateStock.run(item.quantity, item.medicine_id);
      }

      // 3. Delete items and sale
      db.prepare("DELETE FROM sale_items WHERE sale_id = ?").run(id);
      db.prepare("DELETE FROM sales WHERE id = ?").run(id);
    });

    return cancelTransaction();
  }

  async confirm(id: number | string) {
    const result = db
      .prepare("UPDATE sales SET status = 'confirmed' WHERE id = ?")
      .run(id);
    if (result.changes === 0)
      throw new AppError({
        message: "Sale not found",
        code: ErrorCode.SALE_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    return { id, status: "confirmed" };
  }

  async findAll() {
    return db.prepare("SELECT * FROM sales").all();
  }

  async findById(id: number | string) {
    const sale = db.prepare("SELECT * FROM sales WHERE id = ?").get(id) as any;
    if (!sale) return null;

    const items = db
      .prepare(
        `
      SELECT si.*, m.name as medicine_name 
      FROM sale_items si 
      JOIN medicines m ON si.medicine_id = m.id 
      WHERE si.sale_id = ?
    `,
      )
      .all(id);

    return { ...sale, items };
  }
}
