import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  async login(data: any) {
    const { email, password } = data;

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      },
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async register(data: any) {
    const { name, email, password, cpf } = data;

    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);
    if (existingUser) throw new Error("Email already registered");

    const existingCustomer = db
      .prepare("SELECT * FROM customers WHERE cpf = ?")
      .get(cpf);
    if (existingCustomer) throw new Error("CPF already registered");

    const hashedPassword = await bcrypt.hash(password, 8);

    const registerTransaction = db.transaction(() => {
      const userResult = db
        .prepare(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'client')",
        )
        .run(name, email, hashedPassword);

      const userId = userResult.lastInsertRowid;

      db.prepare(
        "INSERT INTO customers (name, cpf, user_id, email) VALUES (?, ?, ?, ?)",
      ).run(name, cpf, userId, email);

      return { message: "User created successfully" };
    });

    return registerTransaction();
  }
}
