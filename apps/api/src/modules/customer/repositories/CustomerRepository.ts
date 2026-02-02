import { db } from "../../../config/database.js";
import { Customer } from "../entities/Customer.js";

export class CustomerRepository {
  static create(data: Omit<Customer, "id" | "created_at" | "updated_at">): number {
    const stmt = db.prepare(`
      INSERT INTO customers (name, cpf, user_id, email)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(data.name, data.cpf, data.user_id, data.email);
    return result.lastInsertRowid as number;
  }

  static findAll(): Customer[] {
    return db.prepare("SELECT * FROM customers").all() as Customer[];
  }

  static findById(id: number): Customer | undefined {
    return db.prepare("SELECT * FROM customers WHERE id = ?").get(id) as Customer | undefined;
  }

  static findByCpf(cpf: string): Customer | undefined {
    return db.prepare("SELECT * FROM customers WHERE cpf = ?").get(cpf) as Customer | undefined;
  }

  static findByUserId(userId: number): Customer | undefined {
    return db.prepare("SELECT * FROM customers WHERE user_id = ?").get(userId) as Customer | undefined;
  }

  static update(id: number, data: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>): void {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(", ");
    const values = Object.values(data);
    
    if (fields.length === 0) return;

    const stmt = db.prepare(`
      UPDATE customers 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(...values, id);
  }

  static delete(id: number): void {
    db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  }
}
