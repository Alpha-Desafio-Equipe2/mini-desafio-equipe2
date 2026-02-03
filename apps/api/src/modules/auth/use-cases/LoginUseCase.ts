import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class LoginUseCase {
  async execute(data: any) {
    const { email, password } = data;

    const user = UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError({
        message: "Invalid credentials",
        code: ErrorCode.INVALID_CREDENTIALS,
        httpStatus: HttpStatus.UNAUTHORIZED,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);

    if (!isValidPassword) {
      throw new AppError({
        message: "Invalid credentials",
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
}
