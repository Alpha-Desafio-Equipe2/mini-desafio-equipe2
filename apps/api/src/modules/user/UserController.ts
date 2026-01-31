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

      const user = await createUserUseCase.execute({
        name,
        email,
        password,
        role,
      });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await findAllUsersUseCase.execute();
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
      const { name, email, role } = req.body;
      
      UserRepository.update(parseInt(id), { name, email, role });
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
}
