import bcrypt from "bcryptjs";
import { db } from "../../../config/database.js";
import { UserRepository } from "../../user/repositories/UserRepository.js";
import { UserRole } from "../../user/domain/enums/UserRole.js";

import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class RegisterUseCase {
  async execute(data: any) {
    const { name, email, password, cpf } = data;

    const existingUser = UserRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError({
        message: "Email already registered",
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const existingUserCpf = UserRepository.findByCpf(cpf);
    if (existingUserCpf) {
      throw new AppError({
        message: "CPF already registered",
        code: ErrorCode.CPF_ALREADY_EXISTS,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);


    const result = db.transaction(() => {
      const user = UserRepository.create({
        name,
        email,
        password: hashedPassword,
        role: UserRole.CLIENT,
        cpf,
        phone: data.phone || "",
        address: data.address || "",
      });

      return { message: "User created successfully", id: user?.id };
    })();

    return result;
  }
}
