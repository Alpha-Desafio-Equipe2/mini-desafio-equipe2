import { Request, Response, NextFunction } from "express";
import { DoctorService } from "./DoctorService.js";

export class DoctorController {
  /**
   * POST /doctors
   * Cria um novo médico
   */
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctor = await DoctorService.create(req.body);

      return res.status(201).json({
        message: "Médico cadastrado com sucesso",
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /doctors
   * Lista todos os médicos
   */
  static list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { specialty } = req.query;

      const filters = {
        specialty: specialty as string,
      };

      const doctors = await DoctorService.list(filters);

      return res.status(200).json({
        data: doctors,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /doctors/:id
   * Busca um médico por ID
   */
  static show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const doctor = await DoctorService.findById(id);

      return res.status(200).json({
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /doctors/crm/:crm
   * Busca um médico por CRM
   */
  static findByCRM = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { crm } = req.params;
      const doctor = await DoctorService.findByCRM(crm);

      return res.status(200).json({
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /doctors/:id
   * Atualiza um médico
   */
  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const doctor = await DoctorService.update(id, req.body);

      return res.status(200).json({
        message: "Médico atualizado com sucesso",
        data: doctor,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /doctors/:id
   * Deleta um médico
   */
  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await DoctorService.delete(id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}