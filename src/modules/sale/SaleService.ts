import { db } from "../../config/database.js";

export class SaleService {
  async create(data: any) {
    // MVP: Receive { customer_id, branch_id, items: [{ medicine_id, quantity }] }
    // 1. Calculate total
    // 2. Create Sale
    // 3. Create SaleItems
    // 4. Update Stock (simple decrement)

    const { customer_id, branch_id, items } = data;

    const createSaleTransaction = db.transaction(() => {
      let totalValue = 0;
      const processedItems = [];

      // Calculate total and prepare items
      for (const item of items) {
        const medicine = db
          .prepare("SELECT * FROM medicines WHERE id = ?")
          .get(item.medicine_id) as any;
        if (!medicine)
          throw new Error(`Medicine ${item.medicine_id} not found`);

        // Check stock (MVP: Basic check)
        // In a real app check stock table. Here assuming global stock for simplicity or ignoring if stock table empty
        // To be proper MVP let's check basic medicine stock field if exists, or just proceed.
        // Using medicine.price
        const itemTotal = medicine.price * item.quantity;
        totalValue += itemTotal;
        processedItems.push({
          ...item,
          unit_price: medicine.price,
          total_price: itemTotal,
        });
      }

      const stmt = db.prepare(
        "INSERT INTO sales (customer_id, branch_id, total_value) VALUES (?, ?, ?)",
      );
      const result = stmt.run(customer_id, branch_id, totalValue);
      const saleId = result.lastInsertRowid;

      const itemStmt = db.prepare(
        "INSERT INTO sale_items (sale_id, medicine_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)",
      );

      for (const item of processedItems) {
        itemStmt.run(
          saleId,
          item.medicine_id,
          item.quantity,
          item.unit_price,
          item.total_price,
        );

        // Decrement medicine global stock (from medicines table) for simplicity in MVP
        db.prepare("UPDATE medicines SET stock = stock - ? WHERE id = ?").run(
          item.quantity,
          item.medicine_id,
        );
      }

      return { id: saleId, total: totalValue, items: processedItems };
    });

    return createSaleTransaction();
  }

  async findAll() {
    return db.prepare("SELECT * FROM sales").all();
  }
}
