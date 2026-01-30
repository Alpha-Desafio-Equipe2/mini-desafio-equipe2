import { NextFunction, Request, Response } from "express";
import { CustomerService } from "./CustomerService.js";
import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../shared/errors/httpStatus.js";

export class CustomerController {
  static create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, cpf } = request.body;

      // Simple validation for required fields
      if (!name || !cpf) {
        throw new AppError({
          message: "Name and CPF are required.",
          code: ErrorCode.MISSING_CUSTOMER_NAME,
          httpStatus: HttpStatus.BAD_REQUEST,
        });
      }

      const customer = CustomerService.execute({ name, cpf });
      return response.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  static getAll(request: Request, response: Response, next: NextFunction) {
    try {
      const customers = CustomerService.findAll();
      return response.json(customers);
    } catch (error) {
      next(error);
    }
  }

  static getById(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const customer = CustomerService.findById(Number(id));
      return response.json(customer);
    } catch (error) {
      next(error);
    }
  }

  static update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      const { name, cpf } = request.body;
      const customer = CustomerService.update(id, { name, cpf });
      return response.json(customer);
    } catch (error) {
      next(error);
    }
  }

  static delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;
      CustomerService.delete(id);
      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
