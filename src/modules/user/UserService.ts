import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";

export class UserService {
  async create(data: any) {
    const { name, email, password, role } = data;

    // Check if user exists
    const existing = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);
    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, hashedPassword, role || "attendant");

    return {
      id: result.lastInsertRowid,
      name,
      email,
      role,
    };
  }

  async findAll() {
    return db
      .prepare("SELECT id, name, email, role, created_at FROM users")
      .all();
  }

  async findByEmail(email: string) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }
}
