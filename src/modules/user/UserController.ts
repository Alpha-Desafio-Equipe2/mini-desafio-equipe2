import { NextFunction, Request, Response } from "express";
import { UserService } from "./UserService.js";
import { AppError } from "../../shared/errors/AppError.js";

import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || role === undefined) {
        throw new AppError({
          message: "Missing required fields",
          code: ErrorCode.MISSING_CUSTOMER_NAME,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }

      const user = userService.create({
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
      const users = await userService.findAll();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await userService.findByEmail(email);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(parseInt(id));
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;
      const user = await UserService.update(parseInt(id), {
        name,
        email,
        password,
        role,
      });
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.delete(parseInt(id));
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
