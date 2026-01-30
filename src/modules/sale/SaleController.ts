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

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const sale = await saleService.findById(id);
      if (!sale) return res.status(404).json({ error: "Sale not found" });
      return res.json(sale);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async confirm(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await saleService.confirm(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async cancel(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await saleService.cancel(id);
      return res.status(200).json({ message: "Sale cancelled successfully" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
