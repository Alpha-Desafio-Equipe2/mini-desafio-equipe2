import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository.js";
import { CreateUserDTO } from "../dtos/CreateUserDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class CreateUserUseCase {
  async execute(data: CreateUserDTO) {
    const { name, email, password, role } = data;

    // Validate email format
    if (!email.includes('@') || !email.includes('.') || email.length < 5) {
      throw new AppError({
        message: "Invalid email format. Email must contain '@' and '.' and be at least 5 characters long.",
        code: ErrorCode.USER_ALREADY_EXISTS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    // Validate password: min 8 chars, uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError({
        message: "Password must have at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)",
        code: ErrorCode.USER_ALREADY_EXISTS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const existingUser = UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError({
        message: "User already exists",
        code: ErrorCode.USER_ALREADY_EXISTS,
        httpStatus: HttpStatus.CONFLICT,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const userId = UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || "attendant" as any,
    });

    return {
      id: userId,
      name,
      email,
      role: role || "attendant",
    };
  }
}
