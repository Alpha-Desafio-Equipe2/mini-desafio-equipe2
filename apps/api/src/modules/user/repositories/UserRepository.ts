import { db } from "../../../config/database.js";
import { User } from "../entities/User.js";
import { UserCreateDTO } from "../dtos/UserCreateDTO.js";
import { UserResponseDTO } from "../dtos/UserResponseDTO.js";

export class UserRepository {
  private static findByIdStmt = db.prepare(`
    SELECT id, name, cpf, email, phone, address, role, balance, created_at, updated_at 
    FROM users
    WHERE id = ?
  `);

  private static findByEmailStmt = db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `);

  private static findByCpfStmt = db.prepare(`
    SELECT *
    FROM users
    WHERE cpf = ?
  `);

  private static findAllStmt = db.prepare(`
    SELECT id, name, cpf, email, phone, address, role, balance, created_at, updated_at
    FROM users
  `);

  static create(user: Omit<UserCreateDTO, "id" | "created_at" | "updated_at">) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, cpf, phone, address, role, balance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      user.name,
      user.email,
      user.password,
      user.cpf,
      user.phone,
      user.address,
      user.role,
      user.balance
    );

    return this.findById(Number(result.lastInsertRowid));
  }

  static findById(id: number): UserResponseDTO | undefined {
    return this.findByIdStmt.get(id) as UserResponseDTO | undefined;
  }

  static findByEmail(email: string): User | undefined {
    return this.findByEmailStmt.get(email) as User | undefined;
  }

  static findByCpf(cpf: string): User | undefined {
    return this.findByCpfStmt.get(cpf) as User | undefined;
  }

  static findAll(): UserResponseDTO[] {
    return this.findAllStmt.all() as UserResponseDTO[];
  }

  static update(id: number, data: Partial<UserResponseDTO>) {
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

