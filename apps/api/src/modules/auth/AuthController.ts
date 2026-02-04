import { NextFunction, Request, Response } from "express";
import { LoginUseCase } from "./use-cases/LoginUseCase.js";
import { RegisterUseCase } from "./use-cases/RegisterUseCase.js";

const loginUseCase = new LoginUseCase();
const registerUseCase = new RegisterUseCase();

export class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await loginUseCase.execute(request.body);
      
      // Set Cookie
      response.cookie("token", result.token, {
        httpOnly: false, // Accessible by JS for this challenge, usually true for security
        secure: false, // HTTPS only if true
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/'
      });

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
