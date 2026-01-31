import { db } from "../../../config/database.js";
import { User } from "../entities/User.js";

export class UserRepository {
  private static findByIdStmt = db.prepare(`
    SELECT id, name, email, role, created_at, updated_at
    FROM users
    WHERE id = ?
  `);

  private static findByEmailStmt = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `);

  private static findAllStmt = db.prepare(`
    SELECT id, name, email, role, created_at, updated_at
    FROM users
  `);

  static create(user: Omit<User, "id" | "created_at" | "updated_at">) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      user.name,
      user.email,
      user.password,
      user.role
    );

    return result.lastInsertRowid;
  }

  static findById(id: number): User | undefined {
    return this.findByIdStmt.get(id) as User | undefined;
  }

  static findByEmail(email: string): User | undefined {
    return this.findByEmailStmt.get(email) as User | undefined;
  }

  static findAll(): User[] {
    return this.findAllStmt.all() as User[];
  }

  static update(id: number, data: Partial<User>) {
    const fields = Object.keys(data)
      .filter(key => key !== "id")
      .map(key => `${key} = ?`)
      .join(", ");
    
    if (!fields) return;

    const values = Object.values(data);
    const stmt = db.prepare(`
      UPDATE users 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    return stmt.run(...values, id);
  }

  static delete(id: number) {
    return db.prepare("DELETE FROM users WHERE id = ?").run(id);
  }
}
