import { NextFunction, Request, Response } from "express";
import { LoginUseCase } from "./use-cases/LoginUseCase.js";
import { RegisterUseCase } from "./use-cases/RegisterUseCase.js";

const loginUseCase = new LoginUseCase();
const registerUseCase = new RegisterUseCase();

export class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await loginUseCase.execute(request.body);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await registerUseCase.execute(request.body);
      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
