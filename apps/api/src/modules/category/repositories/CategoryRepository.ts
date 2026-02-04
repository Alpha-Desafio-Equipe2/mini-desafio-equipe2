import { db } from "../../../config/database.js";
import { Category } from "../entities/Category.js";

export class CategoryRepository {
  static create(data: Omit<Category, "id" | "created_at" | "updated_at">): number {
    const stmt = db.prepare(`
      INSERT INTO categories (name, description, icon)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(
      data.name,
      data.description || null,
      data.icon || null
    );
    
    return result.lastInsertRowid as number;
  }

  static findAll(): Category[] {
    return db.prepare(`
      SELECT * FROM categories 
      ORDER BY name ASC
    `).all() as Category[];
  }

  static findById(id: number): Category | undefined {
    return db.prepare(`
      SELECT * FROM categories WHERE id = ?
    `).get(id) as Category | undefined;
  }

  static findByName(name: string): Category | undefined {
    return db.prepare(`
      SELECT * FROM categories WHERE name = ?
    `).get(name) as Category | undefined;
  }

  static update(id: number, data: Partial<Omit<Category, "id" | "created_at" | "updated_at">>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }

    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }

    if (data.icon !== undefined) {
      fields.push("icon = ?");
      values.push(data.icon);
    }

    if (fields.length === 0) return;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...values);
  }

  static delete(id: number): void {
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  }

  // Métodos auxiliares para estatísticas
  static countMedicinesByCategory(categoryId: number): number {
    const result = db.prepare(`
      SELECT COUNT(*) as total 
      FROM medicines 
      WHERE category_id = ?
    `).get(categoryId) as { total: number };
    
    return result.total;
  }

  static getCategoriesWithCount(): Array<Category & { medicine_count: number }> {
    return db.prepare(`
      SELECT 
        c.*,
        COUNT(m.id) as medicine_count
      FROM categories c
      LEFT JOIN medicines m ON c.id = m.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all() as Array<Category & { medicine_count: number }>;
  }
}