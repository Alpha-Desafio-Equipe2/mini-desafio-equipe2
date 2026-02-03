import { NextFunction, Request, Response } from "express";
import { CreateUserUseCase } from "./use-cases/CreateUserUseCase.js";
import { FindAllUsersUseCase } from "./use-cases/FindAllUsersUseCase.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

const createUserUseCase = new CreateUserUseCase();
const findAllUsersUseCase = new FindAllUsersUseCase();

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || role === undefined) {
        throw new AppError({
          message: "Missing required fields",
          code: ErrorCode.MISSING_CUSTOMER_NAME, // Note: Should probably be MISSING_USER_FIELDS 
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
          code: ErrorCode.MISSING_CUSTOMER_NAME,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }

      const user = await createUserUseCase.execute({
        name,
        email,
        password,
        role,
        balance: 0,
      });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
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
      return res.json(user);
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
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, role, balance } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined && role !== null) updateData.role = role;
      if (balance !== undefined && balance !== null) updateData.balance = balance;


      if (Object.keys(updateData).length > 0) {
        UserRepository.update(parseInt(id), updateData);
      }

      const user = UserRepository.findById(parseInt(id));

      return res.json(user);
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
