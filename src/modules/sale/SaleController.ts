import { Request, Response, NextFunction } from "express";
import { SaleService } from "./SaleService.js";

export class SaleController {
  private service = new SaleService();

  /**
   * POST /sales
   * Cria uma nova venda
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sale = await this.service.create(req.body);

      return res.status(201).json({
        message: "Venda criada com sucesso",
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /sales
   * Lista todas as vendas
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clienteId, filialId, status } = req.query;

      const filters = {
        clienteId: clienteId as string,
        filialId: filialId as string,
        status: status as string,
      };

      const sales = await this.service.list(filters);

      return res.status(200).json({
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /sales/:id
   * Busca uma venda por ID
   */
  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const sale = await this.service.findById(id);

      return res.status(200).json({
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /sales/:id/confirm-payment
   * Confirma pagamento da venda
   */
  confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.confirmPayment(id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /sales/:id/cancel
   * Cancela uma venda
   */
  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.cancel(id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /sales/:id/items
   * Adiciona item a uma venda pendente
   */
  addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.addItem(id, req.body);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /sales/:id/items/:itemId
   * Remove item de uma venda pendente
   */
  removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, itemId } = req.params;
      const result = await this.service.removeItem(id, itemId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}