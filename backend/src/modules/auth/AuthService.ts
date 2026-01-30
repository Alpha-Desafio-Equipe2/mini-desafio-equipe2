import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

export class AuthService {
  async login(data: any) {
    const { email, password } = data;

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      throw new AppError({
        message: "User not found",
        code: ErrorCode.INVALID_CREDENTIALS,
        httpStatus: HttpStatus.UNAUTHORIZED,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError({
        message: "Invalid password",
        code: ErrorCode.INVALID_CREDENTIALS,
        httpStatus: HttpStatus.UNAUTHORIZED,
      });
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
    if (existingUser)
      throw new AppError({
        message: "Email already registered",
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });

    const existingCustomer = db
      .prepare("SELECT * FROM customers WHERE cpf = ?")
      .get(cpf);
    if (existingCustomer)
      throw new AppError({
        message: "CPF already registered",
        code: ErrorCode.CPF_ALREADY_EXISTS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });

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
