import { NextFunction, Request, Response } from "express";
import { UserService } from "./UserService.js";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role, cpf } = req.body;
      const user = await userService.create({
        name,
        email,
        password,
        role,
        cpf,
      });

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await userService.findAll();
    return res.json(users);
  }

  async getByEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;
    const user = await userService.findByEmail(email);
    return res.json(user);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await userService.findById(parseInt(id));
    return res.json(user);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { name, email, password, role, cpf } = req.body;
    const user = await userService.update(parseInt(id),
      {
        name,
        email,
        password,
        role,
        cpf
      });
    return res.json(user);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await userService.delete(parseInt(id));
    return res.json(user);
  }
}
