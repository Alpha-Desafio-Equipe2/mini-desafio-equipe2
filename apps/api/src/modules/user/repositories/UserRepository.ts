import { db } from "../../../config/database.js";
import { CreateUserDTO } from "../dtos/CreateUserDTO.js";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO.js";

export class UserRepository {
  private static findByIdStmt = db.prepare(`
    SELECT id, name, email, role, balance, created_at, updated_at
    FROM users
    WHERE id = ?
  `);

  private static findByEmailStmt = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `);

  private static findAllStmt = db.prepare(`
    SELECT id, name, email, role, balance, created_at, updated_at
    FROM users
  `);

  static create(user: Omit<CreateUserDTO, "id" | "created_at" | "updated_at">) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role, balance)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      user.name,
      user.email,
      user.password,
      user.role,
      user.balance
    );

    return result.lastInsertRowid;
  }

  static findById(id: number): UpdateUserDTO | undefined {
    return this.findByIdStmt.get(id) as UpdateUserDTO | undefined;
  }

  static findByEmail(email: string): UpdateUserDTO | undefined {
    return this.findByEmailStmt.get(email) as UpdateUserDTO | undefined;
  }

  static findAll(): UpdateUserDTO[] {
    return this.findAllStmt.all() as UpdateUserDTO[];
  }

  static update(id: number, data: Partial<UpdateUserDTO>) {
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
