import { db } from "../../../config/database.js";
import { Medicine } from "../entities/Medicine.js";

export class MedicineRepository {
  private static findByIdStmt = db.prepare(`
    SELECT 
      m.id, 
      m.name, 
      m.manufacturer, 
      m.active_principle, 
      m.requires_prescription, 
      m.price, 
      m.stock, 
      m.image_url,
      m.category_id,
      m.created_at, 
      m.updated_at,
      c.name as category_name
    FROM medicines m
    LEFT JOIN categories c ON m.category_id = c.id
    WHERE m.id = ?
  `);

  private static findAllStmt = db.prepare(`
    SELECT 
      m.id, 
      m.name, 
      m.manufacturer, 
      m.active_principle, 
      m.requires_prescription, 
      m.price, 
      m.stock, 
      m.image_url,
      m.category_id,
      m.created_at, 
      m.updated_at,
      c.name as category_name
    FROM medicines m
    LEFT JOIN categories c ON m.category_id = c.id
  `);

  static create(medicine: Omit<Medicine, "id" | "created_at" | "updated_at">) {
    const stmt = db.prepare(`
      INSERT INTO medicines (name, manufacturer, active_principle, requires_prescription, price, stock, image_url, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      medicine.name,
      medicine.manufacturer,
      medicine.active_principle,
      medicine.requires_prescription ? 1 : 0,
      medicine.price,
      medicine.stock,
      medicine.image_url || null,
      medicine.category_id || null
    );
    return result.lastInsertRowid;
  }

  static findById(id: number): (Medicine & { category_name?: string }) | undefined {
    return this.findByIdStmt.get(id) as (Medicine & { category_name?: string }) | undefined;
  }

  static findAll(): (Medicine & { category_name?: string })[] {
    return this.findAllStmt.all() as (Medicine & { category_name?: string })[];
  }

  /**
   * Buscar medicamentos com filtros opcionais
   */
  static findWithFilters(filters: {
    category_id?: number;
    requires_prescription?: boolean;
    search?: string;
    min_price?: number;
    max_price?: number;
  }): (Medicine & { category_name?: string })[] {
    let sql = `
      SELECT 
        m.id, 
        m.name, 
        m.manufacturer, 
        m.active_principle, 
        m.requires_prescription, 
        m.price, 
        m.stock, 
        m.image_url,
        m.category_id,
        m.created_at, 
        m.updated_at,
        c.name as category_name
      FROM medicines m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters.category_id !== undefined) {
      sql += ` AND m.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters.requires_prescription !== undefined) {
      sql += ` AND m.requires_prescription = ?`;
      params.push(filters.requires_prescription ? 1 : 0);
    }

    if (filters.search) {
      sql += ` AND (m.name LIKE ? OR m.active_principle LIKE ? OR m.manufacturer LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.min_price !== undefined) {
      sql += ` AND m.price >= ?`;
      params.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
      sql += ` AND m.price <= ?`;
      params.push(filters.max_price);
    }

    sql += ` ORDER BY m.name ASC`;

    return db.prepare(sql).all(...params) as (Medicine & { category_name?: string })[];
  }

  static update(id: number, data: Partial<Medicine>) {
    const fields = Object.keys(data)
      .filter(key => key !== "id")
      .map(key => `${key} = ?`)
      .join(", ");
    
    if (!fields) return;

    // Prepare values, coercing some JS types to SQLite-compatible types
    const rawValues = Object.values(data);
    const values = rawValues.map((v: any) => {
      if (typeof v === 'boolean') return v ? 1 : 0;
      if (v === undefined) return null;
      return v;
    });

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

  /**
   * Buscar medicamentos por categoria (para frontend)
   */
  static findByCategory(categoryId: number): (Medicine & { category_name?: string })[] {
    return db.prepare(`
      SELECT 
        m.id, 
        m.name, 
        m.manufacturer, 
        m.active_principle, 
        m.requires_prescription, 
        m.price, 
        m.stock, 
        m.image_url,
        m.category_id,
        m.created_at, 
        m.updated_at,
        c.name as category_name
      FROM medicines m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.category_id = ?
      ORDER BY m.name ASC
    `).all(categoryId) as (Medicine & { category_name?: string })[];
  }
}