import { Request, Response } from "express";
import { SaleService } from "./SaleService.js";

const saleService = new SaleService();

export class SaleController {
  async create(req: Request, res: Response) {
    try {
      const sale = await saleService.create(req.body);
      return res.status(201).json(sale);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const sales = await saleService.findAll();
      return res.json(sales);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
