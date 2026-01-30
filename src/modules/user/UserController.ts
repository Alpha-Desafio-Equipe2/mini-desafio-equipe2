import { Request, Response, NextFunction } from "express";
import { UserService } from "./UserService.js";

export class UserController {
  private service = new UserService();

  /**
   * POST /users
   * Cria um novo usuário
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.create(req.body);

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /users
   * Lista todos os usuários
   */
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.findAll();

      return res.status(200).json({
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /users/:id
   * Busca um usuário por ID
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.service.findById(id);

      return res.status(200).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /users/email/:email
   * Busca um usuário por email
   */
  getByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const user = await this.service.findByEmail(email);

      return res.status(200).json({
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /users/:id
   * Atualiza um usuário
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.service.update(id, req.body);

      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /users/:id
   * Deleta um usuário
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}