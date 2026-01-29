import { db } from "../../config/database.js";
import { CreateSaleDTO } from "./dtos/CreateSaleDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class SaleService {
  async create(data: CreateSaleDTO) {
    const { customer_id, branch_id, items, doctor } = data;

    const createSaleTransaction = db.transaction(() => {
      let totalValue = 0;
      const processedItems = [];

      // 1. Validate Items / Calculate Total / Check Prescriptions
      for (const item of items) {
        const medicine = db
          .prepare("SELECT * FROM medicines WHERE id = ?")
          .get(item.medicine_id) as any;

        if (!medicine) {
          throw new AppError(`Medicine ${item.medicine_id} not found`, 404);
        }

        // Stock Check
        if (medicine.stock < item.quantity) {
          throw new AppError(`Insufficient stock for medicine: ${medicine.name}`, 400);
        }

        // Prescription Check
        if (Boolean(medicine.requires_prescription)) {
          if (!doctor || !doctor.crm || !doctor.name) {
             throw new AppError(`Medicine ${medicine.name} requires prescription/doctor details.`, 400);
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
        "INSERT INTO sales (customer_id, branch_id, total_value) VALUES (?, ?, ?)",
      );
      const result = stmt.run(customer_id || null, branch_id, totalValue);
      const saleId = result.lastInsertRowid;

      // 3. Create Sale Items and Update Stock
      const itemStmt = db.prepare(
        "INSERT INTO sale_items (sale_id, medicine_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)",
      );

      const updateStockStmt = db.prepare(
        "UPDATE medicines SET stock = stock - ? WHERE id = ?"
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
        doctor: doctor // Return doctor info if was part of sale
      };
    });

    return createSaleTransaction();
  }

  async findAll() {
    return db.prepare("SELECT * FROM sales").all();
  }
}
