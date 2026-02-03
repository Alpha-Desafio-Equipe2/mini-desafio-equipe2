import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository.js";
import { CreateUserDTO } from "../dtos/UserCreateDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";
import { UserRole } from "../domain/enums/UserRole.js";
import { UserResponseDTO } from "../dtos/UserResponseDTO.js";

export class CreateUserUseCase {
  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    const { name, email, password, role, balance, cpf } = data;

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

    const userRole = data.role ?? UserRole.CLIENT;

    const hashedPassword = await bcrypt.hash(password, 8);

    const userResponse: UserResponseDTO = UserRepository.create({
      name,
      email,
      cpf,
      password: hashedPassword,
      role: userRole,
      balance: 0,
    });

    return {
      name: userResponse.name,
      email: userResponse.email,
      cpf: userResponse.cpf,
      role: userResponse.role,
      balance: userResponse.balance,
    } satisfies UserResponseDTO;
  }
}
