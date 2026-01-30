import { NextFunction, Request, Response } from "express";
import { AuthService } from "./AuthService.js";

const authService = new AuthService();

export class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await authService.login(request.body);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await authService.register(request.body);
      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
