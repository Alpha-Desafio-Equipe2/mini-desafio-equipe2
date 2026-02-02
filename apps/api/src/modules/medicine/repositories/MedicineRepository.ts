import { db } from "../../../config/database.js";
import { Medicine } from "../entities/Medicine.js";

export class MedicineRepository {
  private static findByIdStmt = db.prepare(`
    SELECT id, name, manufacturer, active_principle, requires_prescription, price, stock, image_url, created_at, updated_at
    FROM medicines
    WHERE id = ?
  `);

  private static findAllStmt = db.prepare(`
    SELECT id, name, manufacturer, active_principle, requires_prescription, price, stock, image_url, created_at, updated_at
    FROM medicines
  `);

  static create(medicine: Omit<Medicine, "id" | "created_at" | "updated_at">) {
    const stmt = db.prepare(`
      INSERT INTO medicines (name, manufacturer, active_principle, requires_prescription, price, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      medicine.name,
      medicine.manufacturer,
      medicine.active_principle,
      medicine.requires_prescription ? 1 : 0,
      medicine.price,
      medicine.stock,
      medicine.image_url || null
    );

    return result.lastInsertRowid;
  }

  static findById(id: number): Medicine | undefined {
    return this.findByIdStmt.get(id) as Medicine | undefined;
  }

  static findAll(): Medicine[] {
    return this.findAllStmt.all() as Medicine[];
  }

  static update(id: number, data: Partial<Medicine>) {
    const fields = Object.keys(data)
      .filter(key => key !== "id")
      .map(key => `${key} = ?`)
      .join(", ");
    
    if (!fields) return;

    const values = Object.values(data);
    const stmt = db.prepare(`
      UPDATE medicines 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    return stmt.run(...values, id);
  }

  static decrementStock(id: number, quantity: number) {
    return db.prepare("UPDATE medicines SET stock = stock - ? WHERE id = ?").run(quantity, id);
  }

  static incrementStock(id: number, quantity: number) {
    return db.prepare("UPDATE medicines SET stock = stock + ? WHERE id = ?").run(quantity, id);
  }

  static delete(id: number) {
    return db.prepare("DELETE FROM medicines WHERE id = ?").run(id);
  }
}
