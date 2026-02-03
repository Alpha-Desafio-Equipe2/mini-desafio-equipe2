import { db } from "../../../config/database.js";
import { Sale, SaleItem } from "../entities/Sale.js";

export class SaleRepository {
  static create(data: Omit<Sale, "id" | "created_at" | "updated_at">): number {
    const stmt = db.prepare(`
      INSERT INTO sales (customer_id, branch_id, total_value, doctor_crm, prescription_date, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.customer_id || null,
      data.branch_id || 1, // <--- ADICIONAMOS O "|| 1" AQUI
      data.total_value,
      data.doctor_crm || null,
      data.prescription_date || null,
      data.payment_method || null,
      data.status || 'pending'
    );

    return result.lastInsertRowid as number;
  }

  static createItem(data: Omit<SaleItem, "id" | "created_at">): void {
    const stmt = db.prepare(`
      INSERT INTO sale_items (sale_id, medicine_id, quantity, unit_price, total_price)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(data.sale_id, data.medicine_id, data.quantity, data.unit_price, data.total_price);
  }

  static findAll(customerId?: number): Sale[] {
    if (customerId) {
      return db.prepare("SELECT * FROM sales WHERE customer_id = ?").all(customerId) as Sale[];
    }
    return db.prepare("SELECT * FROM sales").all() as Sale[];
  }

  static findById(id: number): (Sale & { items: SaleItem[] }) | undefined {
    const sale = db.prepare("SELECT * FROM sales WHERE id = ?").get(id) as Sale | undefined;
    
    if (!sale) return undefined;

    const items = db.prepare(`
      SELECT si.*, m.name as medicine_name 
      FROM sale_items si 
      JOIN medicines m ON si.medicine_id = m.id 
      WHERE si.sale_id = ?
    `).all(id) as SaleItem[];

    return { ...sale, items };
  }

  static findItemsBySaleId(saleId: number): SaleItem[] {
    return db.prepare("SELECT * FROM sale_items WHERE sale_id = ?").all(saleId) as SaleItem[];
  }

  static findCustomerBySaleId(saleId: number): any | undefined {
    const sale = db.prepare("SELECT customer_id FROM sales WHERE id = ?").get(saleId) as { customer_id: number } | undefined;
    if (!sale || !sale.customer_id) return undefined;
    return db.prepare("SELECT * FROM customers WHERE id = ?").get(sale.customer_id);
  }

  static updateStatus(id: number, status: string): void {
    db.prepare("UPDATE sales SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
  }

  static update(id: number, data: Partial<Sale>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.total_value !== undefined) {
      fields.push("total_value = ?");
      values.push(data.total_value);
    }
    if (data.payment_method !== undefined) {
      fields.push("payment_method = ?");
      values.push(data.payment_method);
    }

    if (fields.length > 0) {
      fields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);
      const stmt = db.prepare(`UPDATE sales SET ${fields.join(", ")} WHERE id = ?`);
      stmt.run(...values);
    }
  }

  static delete(id: number): void {
    db.prepare("DELETE FROM sales WHERE id = ?").run(id);
  }

  static deleteItemsBySaleId(saleId: number): void {
    db.prepare("DELETE FROM sale_items WHERE sale_id = ?").run(saleId);
  }
}
