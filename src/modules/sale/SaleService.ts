import { db } from "../../config/database.js";
import { CreateSaleDTO } from "./dtos/CreateSaleDTO.js";
import { AppError } from "../../shared/errors/AppError.js";

export class SaleService {
  async create(data: any) {
    // MVP: Receive { customer_id, branch_id, items: [{ medicine_id, quantity }] }
    // 1. Calculate total
    // 2. Create Sale
    // 3. Create SaleItems
    // 4. Update Stock (simple decrement)

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

        // Check stock (MVP: Basic check)
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
        "INSERT INTO sales (customer_id, branch_id, total_value, doctor_crm, prescription_date) VALUES (?, ?, ?, ?, ?)",
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
        status: "pending",
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
        throw new Error("Sale not found or already cancelled");
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
    if (result.changes === 0) throw new Error("Sale not found");
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
