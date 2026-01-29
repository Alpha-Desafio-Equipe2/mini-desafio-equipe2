import { CreateCustomerDTO } from "./dtos/CreateCustomerDTO.js";
import { db } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";

// Define the entity shape internally if model folder is removed
interface CustomerEntity {
  id: number | bigint;
  name: string;
  cpf: string;
}

export class CustomerService {
  createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE
      )
    `;
    db.prepare(query).run();
  }

  execute(data: CreateCustomerDTO): CustomerEntity {
    // 1. Check if customer exists
    const findQuery = `SELECT * FROM customers WHERE cpf = ?`;
    const customerAlreadyExists = db.prepare(findQuery).get(data.cpf);

    if (customerAlreadyExists) {
      throw new AppError("Customer already exists with this CPF", 409);
    }

    // 2. Create customer
    const insertQuery = `
      INSERT INTO customers (name, cpf)
      VALUES (?, ?)
    `;

    const info = db.prepare(insertQuery).run(data.name, data.cpf);

    return {
      id: info.lastInsertRowid,
      name: data.name,
      cpf: data.cpf,
    };
  }

  findAll(): CustomerEntity[] {
    return db.prepare("SELECT * FROM customers").all() as CustomerEntity[];
  }
}
