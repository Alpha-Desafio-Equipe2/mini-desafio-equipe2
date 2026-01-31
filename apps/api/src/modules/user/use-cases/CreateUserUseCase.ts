import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository.js";
import { CreateUserDTO } from "../dtos/CreateUserDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class CreateUserUseCase {
  async execute(data: CreateUserDTO) {
    const { name, email, password, role } = data;

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
