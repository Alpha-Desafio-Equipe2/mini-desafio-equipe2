import { Request, Response } from "express";
import { UserService } from "./UserService.js";
import { AppError } from "../../shared/errors/AppError.js";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      role === undefined
    ) {
      throw new AppError('Missing required fields', 400);
    }

    const user = userService.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json(user);
  }


  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const user = await userService.findByEmail(email);
    return res.json(user);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UserService.findById(parseInt(id));
    return res.json(user);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await UserService.update(parseInt(id), {
      name,
      email,
      password,
      role,
    });
    return res.json(user);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UserService.delete(parseInt(id));
    return res.json(user);
  }
}
