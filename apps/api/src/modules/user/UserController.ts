import { NextFunction, Request, Response } from "express";
import { CreateUserUseCase } from "./use-cases/CreateUserUseCase.js";
import { FindAllUsersUseCase } from "./use-cases/FindAllUsersUseCase.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";
import { UserRole } from "./domain/enums/UserRole.js";
import { UserResponseDTO } from "./dtos/UserResponseDTO.js";
import { UserUpdateDTO } from "./dtos/UserUpdateDTO.js";

const createUserUseCase = new CreateUserUseCase();
const findAllUsersUseCase = new FindAllUsersUseCase();

export class UserController {
  async create(req: Request, res: Response, next: NextFunction): Promise<Response<UserResponseDTO>> {
    try {
      const { name, cpf, email, password, role, phone, address } = req.body;

      if (!name || !cpf || !email || !password) {
        throw new AppError({
          message: "Missing required fields",
          code: ErrorCode.MISSING_CUSTOMER_NAME,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }

      // Validate email format
      if (!email.includes('@') || !email.includes('.') || email.length < 5) {
        throw new AppError({
          message: "Invalid email format",
          code: ErrorCode.MISSING_CUSTOMER_NAME,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }

      // Validate password: min 8 chars, uppercase, lowercase, number, special char
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new AppError({
          message: "Password must have at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)",
          code: ErrorCode.WEAK_PASSWORD,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }


      if (role && !Object.values(UserRole).includes(role)) {
        throw new AppError({
          message: "Invalid role",
          code: ErrorCode.INVALID_USER_ROLE,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }

      const userResponse: UserResponseDTO = await createUserUseCase.execute({
        name,
        cpf,
        phone,
        address,
        email,
        password,
        role,
        balance: 0,
      });

      return res.status(201).json({
        name: userResponse.name,
        cpf: userResponse.cpf,
        phone: userResponse.phone,
        address: userResponse.address,
        email: userResponse.email,
        role: userResponse.role,
        balance: userResponse.balance,
      } satisfies UserResponseDTO);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<UserResponseDTO[]>> {
    try {
      const users = findAllUsersUseCase.execute();

      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = UserRepository.findByEmail(email);
      if (!user) {
        throw new AppError({
          message: "User not found",
          code: ErrorCode.USER_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }
      return res.json(user.name, user.cpf, user.email, user.role, user.balance, user.phone, user.address);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = UserRepository.findById(parseInt(id));
      if (!user) {
        throw new AppError({
          message: "User not found",
          code: ErrorCode.USER_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }
      return res.json({ name: user.name, cpf: user.cpf, email: user.email, role: user.role, balance: user.balance });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, role, balance, password } = req.body;

      const updateData: Partial<UserUpdateDTO> = {};

      const user = await UserRepository.findById(parseInt(id));
      if (!user) {
        throw new AppError({
          message: "User not found",
          code: ErrorCode.USER_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }

      if (name !== undefined && name !== null) updateData.name = name;
      if (email !== undefined && email !== null) updateData.email = email;
      if (role !== undefined && role !== null) {
        if (!Object.values(UserRole).includes(role as UserRole)) {
          throw new AppError({
            message: "Invalid role",
            code: ErrorCode.INVALID_USER_ROLE,
            httpStatus: HttpStatus.BAD_REQUEST,
          });
        }
        updateData.role = role as UserRole;
      }
      if (balance !== undefined && balance !== null) updateData.balance = balance;
      if (password !== undefined && password !== null) updateData.password = password;


      if (Object.keys(updateData).length > 0) {
        UserRepository.update(parseInt(id), updateData);
      }

      return res.json({
        name: updateData.name ?? user.name ?? "",
        cpf: updateData.cpf ?? user.cpf ?? "",
        phone: updateData.phone ?? user.phone ?? "",
        address: updateData.address ?? user.address ?? "",
        email: updateData.email ?? user.email ?? "",
        role: (updateData.role as UserRole) ?? (user.role as UserRole) ?? UserRole.CLIENT,
        balance: updateData.balance ?? user.balance ?? 0
      } satisfies UserResponseDTO);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = UserRepository.findById(parseInt(id));
      if (!user) {
        throw new AppError({
          message: "User not found",
          code: ErrorCode.USER_NOT_FOUND,
          httpStatus: HttpStatus.NOT_FOUND,
        });
      }

      UserRepository.delete(parseInt(id));
      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async addBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const user = UserRepository.findById(parseInt(id));
      if (!user) {
        throw new AppError({ message: "User not found", code: ErrorCode.USER_NOT_FOUND, httpStatus: HttpStatus.NOT_FOUND });
      }

      const newBalance = (user.balance || 0) + parseFloat(amount);
      UserRepository.update(parseInt(id), { balance: newBalance });

      return res.json({ newBalance });
    } catch (error) {
      next(error);
    }
  }
}
