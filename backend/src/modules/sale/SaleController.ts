import { NextFunction, Request, Response } from "express";
import { SaleService } from "./SaleService.js";

const saleService = new SaleService();

export class SaleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await saleService.create(req.body);
      return res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const sales = await saleService.findAll();
      return res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sale = await saleService.findById(id);
      return res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await saleService.confirm(id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await saleService.cancel(id);
      return res.status(200).json({ message: "Sale cancelled successfully" });
    } catch (error) {
      next(error);
    }
  }
}
