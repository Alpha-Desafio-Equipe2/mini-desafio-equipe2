import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import { CreateUserDTO } from "./dtos/CreateUserDTO.js";
import { UserRole } from "./domain/enums/UserRole.js";
import { AppError } from "../../shared/errors/AppError.js";
import { UpdateUserDTO } from "./dtos/UpdateUserDTO.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { Validators } from "../../shared/utils/validators.js";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string;
};

export class UserService {
  async create(data: CreateUserDTO) {
    const { role, name, email, password, cpf } = data
    const userRole =
      role && isValidUserRole(role) ? role : UserRole.USER;

    if (userRole && !isValidUserRole(userRole)) {
      throw new AppError(ErrorCode.INVALID_USER_ROLE);
    }

    if (data.cpf && !isUserCpfUnique(data.cpf)) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS);
    }

    if (data.email && !isUserEmailUnique(data.email)) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const stmt = db.prepare(`
      INSERT INTO users (
        name,
        email,
        password,
        role,
        cpf
      )
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      email,
      hashedPassword,
      userRole,
      cpf
    );

    return {
      id: result.lastInsertRowid,
      name,
      email,
      role: userRole,
      cpf
    };
  }

  async findAll() {
    return db
      .prepare(`
        SELECT 
        id, 
        name, 
        email, 
        role, 
        cpf 
        FROM users
      `)
      .all() as UserRow[];
  }

  async findByEmail(email: string) {
    const existing = db
      .prepare(`
        SELECT 
        id, 
        name, 
        email, 
        role, 
        cpf 
        FROM users 
        WHERE email = ?
      `)
      .get(email) as UserRow || undefined;

    if (!existing) {
      throw new AppError(ErrorCode.USER_NOT_FOUND);
    }
    return existing;
  }

  async findById(id: number) {
    const existing = db.prepare(`
    SELECT
      id,
      name,
      email,
      role,
      cpf
    FROM users
    WHERE id = ?
  `).get(id) as UserRow || undefined;

    if (!existing) {
      throw new AppError(ErrorCode.USER_NOT_FOUND);
    }

    return existing;
  }

  async update(id: number, data: UpdateUserDTO) {
    const user = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as UserRow | undefined;

    const userRole =
      data.role && isValidUserRole(data.role) ? data.role : UserRole.USER;

    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND);
    }

    if (data.name && !Validators.validateName(data.name)) {
      throw new AppError(ErrorCode.INVALID_USER_NAME);
    }

    if (data.email && !Validators.validateEmail(data.email)) {
      throw new AppError(ErrorCode.INVALID_EMAIL);
    }

    if (data.password && !Validators.validatePassword(data.password)) {
      throw new AppError(ErrorCode.INVALID_PASSWORD);
    }

    if (data.cpf && !Validators.validateCPF(data.cpf)) {
      throw new AppError(ErrorCode.INVALID_CPF);
    }

    if (data.cpf && !isUserCpfUnique(data.cpf)) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS);
    }

    if (data.email && !isUserEmailUnique(data.email)) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS);
    }

    if (data.role && !isValidUserRole(data.role)) {
      throw new AppError(ErrorCode.INVALID_USER_ROLE);
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 8) : user.password;

    const updated = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      password: hashedPassword,
      role: userRole ?? user.role,
      cpf: data.cpf ?? user.cpf
    };

    const stmt = db.prepare(`
    UPDATE users SET
      name = ?,
      email = ?,
      role = ?,
      password = ?,
      cpf = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
      `)

    const result = stmt.run(
      updated.name,
      updated.email,
      updated.role,
      updated.password,
      updated.cpf,
      id
    );

    return ({ id, name: updated.name, email: updated.email, role: updated.role, cpf: updated.cpf });
  }

  async delete(id: number) {
    const user = await this.findById(id);

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

function isUserCpfUnique(cpf: string) {
  const existing = db
    .prepare('SELECT * FROM users WHERE cpf = ?')
    .get(cpf) as UserRow | undefined;
  return !existing;
}

function isUserEmailUnique(email: string) {
  const existing = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as UserRow | undefined;
  return !existing;
}  