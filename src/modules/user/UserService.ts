import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import { CreateUserDTO } from "./dtos/CreateUserDTO.js";
import { UserRole } from "./domain/enums/UserRole.js";
import { AppError } from "../../shared/errors/AppError.js";
import { UpdateUserDTO } from "./dtos/UpdateUserDTO.js";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export class UserService {
  async create(data: CreateUserDTO) {
    const { role, name, email, password } = data;

    if (!isValidUserRole(role)) {
      throw new Error("Invalid role");
    }

    const existing = await this.findByEmail(email);
    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const stmt = db.prepare(`
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      email,
      hashedPassword,
      role ?? UserRole.USER
    );

    return {
      id: result.lastInsertRowid,
      name,
      email,
      role,
    };
  }

  async findAll() {
    return db
      .prepare("SELECT id, name, email, role FROM users")
      .all();
  }

  async findByEmail(email: string) {
    const existing = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (!existing) {
      throw new Error("User not found");
    }
    return existing;
  }

  static findById(id: number) {
    const row = db.prepare(`
    SELECT
      id,
      name,
      email,
      role
    FROM users
    WHERE id = ?
  `).get(id) as UserRow || undefined;

    if (!row) {
      throw new AppError('User not found', 404);
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
    };
  }

  static update(id: number, data: UpdateUserDTO) {
    const user = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.role !== undefined && !isValidUserRole(data.role)) {
      throw new AppError('Invalid role', 400);
    }

    const updated = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      role: data.role ?? user.role,
    };

    db.prepare(`
    UPDATE users SET
      name = ?,
      email = ?,
      role = ?
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
      `).run(
      updated.name,
      updated.email,
      updated.role,
      id
    );

    return { id, ...updated };
  }

  static delete(id: number) {

    const user = UserService.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const stmt = db.prepare(`
      DELETE FROM users WHERE id = ?
      `);

    const result = stmt.run(id);

    return result;
  }
}

function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
} 