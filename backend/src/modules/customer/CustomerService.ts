import { CreateCustomerDTO } from "./dtos/CreateCustomerDTO.js";
import { UpdateCustomerDTO } from "./dtos/UpdateCustomerDTO.js";
import { db } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

interface CustomerEntity {
  id: number;
  name: string;
  cpf: string;
}

export class CustomerService {
  static createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.prepare(query).run();
  }

  static execute(data: CreateCustomerDTO): CustomerEntity {
    this.validateCpf(data.cpf);

    // 1. Check if customer exists
    const findQuery = `SELECT * FROM customers WHERE cpf = ?`;
    const customerAlreadyExists = db.prepare(findQuery).get(data.cpf);

    if (customerAlreadyExists) {
      throw new AppError({
        message: "Customer already exists with this CPF",
        code: ErrorCode.CPF_ALREADY_EXISTS,
        httpStatus: HttpStatus.CONFLICT,
      });
    }

    // 2. Create customer
    const insertQuery = `
      INSERT INTO customers (name, cpf)
      VALUES (?, ?)
    `;

    const info = db.prepare(insertQuery).run(data.name, data.cpf);

    return {
      id: info.lastInsertRowid as number,
      name: data.name,
      cpf: data.cpf,
    };
  }

  private static validateCpf(cpf: string): void {
    const numericCpf = cpf.replace(/\D/g, "");

    if (numericCpf.length !== 11) {
      throw new AppError({
        message: "CPF must contain exactly 11 digits",
        code: ErrorCode.INVALID_CPF,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }
  }

  static findAll(): CustomerEntity[] {
    return db.prepare("SELECT * FROM customers").all() as CustomerEntity[];
  }

  static findById(id: number): CustomerEntity {
    const customer = db
      .prepare("SELECT * FROM customers WHERE id = ?")
      .get(id) as CustomerEntity | undefined;

    if (!customer) {
      throw new AppError({
        message: "Customer not found",
        code: ErrorCode.CUSTOMER_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    return customer;
  }

  static update(id: string, data: UpdateCustomerDTO): CustomerEntity {
    const customer = this.findById(Number(id));

    if (!customer) {
      throw new AppError({
        message: "Customer not found",
        code: ErrorCode.CUSTOMER_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    // Check if CPF is being updated and if it's unique (excluding current user)
    if (data.cpf && data.cpf !== customer.cpf) {
      this.validateCpf(data.cpf);
      const existing = db
        .prepare("SELECT id FROM customers WHERE cpf = ?")
        .get(data.cpf) as { id: number } | undefined;
      if (existing && existing.id !== customer.id) {
        throw new AppError({
          message: "CPF already currently in use",
          code: ErrorCode.CPF_ALREADY_EXISTS,
          httpStatus: HttpStatus.CONFLICT,
        });
      }
    }

    const newName = data.name || customer.name;
    const newCpf = data.cpf || customer.cpf;

    db.prepare(
      `
      UPDATE customers 
      SET name = ?, cpf = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(newName, newCpf, id);

    return {
      id: customer.id,
      name: newName,
      cpf: newCpf,
    };
  }

  static delete(id: string): void {
    const result = db.prepare("DELETE FROM customers WHERE id = ?").run(id);

    if (result.changes === 0) {
      throw new AppError({
        message: "Customer not found",
        code: ErrorCode.CUSTOMER_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }
  }
}
