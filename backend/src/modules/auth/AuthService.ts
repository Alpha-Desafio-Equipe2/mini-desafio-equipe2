import { db } from "../../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { LoginDTO } from "./dtos/loginDTO.js";

export class AuthService {
  async login(data: LoginDTO) {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError(ErrorCode.JWT_SECRET_NOT_DEFINED);
    }

    const user = db
      .prepare("SELECT id, name, email, password, role FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
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
}
