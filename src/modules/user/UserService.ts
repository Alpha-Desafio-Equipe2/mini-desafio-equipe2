import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { ErrorMessage } from "../../shared/errors/ErrorMessage.js";
import { Validators } from "../../shared/utils/validators.js";
import { CreateUserDTO } from "./dtos/CreateUserDTO.js";
import { UpdateUserDTO } from "./dtos/UpdateUserDTO.js";
import { UserRole } from "./domain/enums/UserRole.js";
// import bcrypt from "bcryptjs";
// import { db } from "../../config/database";

// Assumindo que você tem um repositório
// import { UserRepository } from "../../repositories/UserRepository";

export class UserService {
  // private repository = new UserRepository();

  /**
   * Valida se o role é válido
   */
  private isValidUserRole(role: string): role is UserRole {
    return Object.values(UserRole).includes(role as UserRole);
  }

  /**
   * Valida senha
   */
  private validatePassword(password: string): void {
    if (!password || password.length < 6) {
      const error = ErrorMessage[ErrorCode.WEAK_PASSWORD];
      throw new AppError({
        message: error.message,
        code: ErrorCode.WEAK_PASSWORD,
        httpStatus: error.httpStatus,
      });
    }
  }

  /**
   * Cria um novo usuário
   */
  async create(data: CreateUserDTO) {
    // 1. Validar nome
    if (!data.name || !Validators.validateName(data.name)) {
      const error = ErrorMessage[ErrorCode.INVALID_USER_NAME];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_USER_NAME,
        httpStatus: error.httpStatus,
      });
    }

    // 2. Validar email
    if (!data.email || !Validators.validateEmail(data.email)) {
      const error = ErrorMessage[ErrorCode.INVALID_EMAIL];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_EMAIL,
        httpStatus: error.httpStatus,
      });
    }

    // 3. Validar senha
    this.validatePassword(data.password);

    // 4. Validar role (se fornecido)
    const role = data.role ?? UserRole.USER;
    if (!this.isValidUserRole(role)) {
      const error = ErrorMessage[ErrorCode.INVALID_USER_ROLE];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_USER_ROLE,
        httpStatus: error.httpStatus,
      });
    }

    // 5. Verificar se email já existe
    // const existing = await this.repository.findByEmail(data.email);
    // if (existing) {
    //   const error = ErrorMessage[ErrorCode.USER_ALREADY_EXISTS];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.USER_ALREADY_EXISTS,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 6. Hash da senha
    // const hashedPassword = await bcrypt.hash(data.password, 8);

    // 7. Preparar dados para salvar
    const userData = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: "hashed_password", // hashedPassword quando tiver bcrypt
      role,
    };

    // 8. Salvar no banco
    // const user = await this.repository.create(userData);

    // 9. Retornar dados (sem a senha)
    // return {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   criadoEm: user.criadoEm,
    // };

    // Mock
    return {
      id: "mock-user-123",
      name: userData.name,
      email: userData.email,
      role: userData.role,
      criadoEm: new Date(),
    };
  }

  /**
   * Lista todos os usuários
   */
  async findAll() {
    // return await this.repository.findAll();
    return []; // Mock
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string) {
    // const user = await this.repository.findById(id);

    // if (!user) {
    //   const error = ErrorMessage[ErrorCode.USER_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.USER_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // // Retorna sem a senha
    // return {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   criadoEm: user.criadoEm,
    // };

    // Mock
    throw new AppError({
      message: ErrorMessage[ErrorCode.USER_NOT_FOUND].message,
      code: ErrorCode.USER_NOT_FOUND,
      httpStatus: ErrorMessage[ErrorCode.USER_NOT_FOUND].httpStatus,
    });
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string) {
    // Validar email
    if (!Validators.validateEmail(email)) {
      const error = ErrorMessage[ErrorCode.INVALID_EMAIL];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_EMAIL,
        httpStatus: error.httpStatus,
      });
    }

    // const user = await this.repository.findByEmail(email.toLowerCase().trim());

    // if (!user) {
    //   const error = ErrorMessage[ErrorCode.USER_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.USER_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // // Retorna sem a senha
    // return {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    //   criadoEm: user.criadoEm,
    // };

    // Mock
    throw new AppError({
      message: ErrorMessage[ErrorCode.USER_NOT_FOUND].message,
      code: ErrorCode.USER_NOT_FOUND,
      httpStatus: ErrorMessage[ErrorCode.USER_NOT_FOUND].httpStatus,
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: string, data: UpdateUserDTO) {
    // 1. Verificar se usuário existe
    // const user = await this.repository.findById(id);
    // if (!user) {
    //   const error = ErrorMessage[ErrorCode.USER_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.USER_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Validar nome (se fornecido)
    if (data.name !== undefined) {
      if (!Validators.validateName(data.name)) {
        const error = ErrorMessage[ErrorCode.INVALID_USER_NAME];
        throw new AppError({
          message: error.message,
          code: ErrorCode.INVALID_USER_NAME,
          httpStatus: error.httpStatus,
        });
      }
    }

    // 3. Validar email (se fornecido)
    if (data.email !== undefined) {
      if (!Validators.validateEmail(data.email)) {
        const error = ErrorMessage[ErrorCode.INVALID_EMAIL];
        throw new AppError({
          message: error.message,
          code: ErrorCode.INVALID_EMAIL,
          httpStatus: error.httpStatus,
        });
      }

      // Verificar se email já existe em outro usuário
      // const emailExists = await this.repository.findByEmail(data.email);
      // if (emailExists && emailExists.id !== id) {
      //   const error = ErrorMessage[ErrorCode.USER_ALREADY_EXISTS];
      //   throw new AppError({
      //     message: error.message,
      //     code: ErrorCode.USER_ALREADY_EXISTS,
      //     httpStatus: error.httpStatus,
      //   });
      // }
    }

    // 4. Validar senha (se fornecida)
    let hashedPassword;
    if (data.password !== undefined) {
      this.validatePassword(data.password);
      // hashedPassword = await bcrypt.hash(data.password, 8);
      hashedPassword = "new_hashed_password";
    }

    // 5. Validar role (se fornecido)
    if (data.role !== undefined && !this.isValidUserRole(data.role)) {
      const error = ErrorMessage[ErrorCode.INVALID_USER_ROLE];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_USER_ROLE,
        httpStatus: error.httpStatus,
      });
    }

    // 6. Preparar dados para atualizar
    const updateData = {
      name: data.name?.trim(),
      email: data.email?.toLowerCase().trim(),
      password: hashedPassword,
      role: data.role,
    };

    // 7. Atualizar no banco
    // const updatedUser = await this.repository.update(id, updateData);

    // 8. Retornar dados (sem a senha)
    // return {
    //   id: updatedUser.id,
    //   name: updatedUser.name,
    //   email: updatedUser.email,
    //   role: updatedUser.role,
    //   atualizadoEm: updatedUser.atualizadoEm,
    // };

    // Mock
    return {
      id,
      ...updateData,
      atualizadoEm: new Date(),
    };
  }

  /**
   * Deleta um usuário
   */
  async delete(id: string) {
    // 1. Verificar se usuário existe
    // const user = await this.repository.findById(id);
    // if (!user) {
    //   const error = ErrorMessage[ErrorCode.USER_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.USER_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Deletar
    // await this.repository.delete(id);

    return { message: "Usuário deletado com sucesso" };
  }
}