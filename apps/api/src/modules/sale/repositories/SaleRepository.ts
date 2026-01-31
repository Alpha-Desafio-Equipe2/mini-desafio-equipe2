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
      data.branch_id,
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

  static findAll(): Sale[] {
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

  static updateStatus(id: number, status: string): void {
    db.prepare("UPDATE sales SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
  }

  static delete(id: number): void {
    db.prepare("DELETE FROM sales WHERE id = ?").run(id);
  }

  static deleteItemsBySaleId(saleId: number): void {
    db.prepare("DELETE FROM sale_items WHERE sale_id = ?").run(saleId);
  }
}
