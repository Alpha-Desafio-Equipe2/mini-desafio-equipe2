import { NextFunction, Request, Response } from "express";
import { CreateSaleUseCase } from "./use-cases/CreateSaleUseCase.js";
import { FindAllSalesUseCase } from "./use-cases/FindAllSalesUseCase.js";
import { FindSaleByIdUseCase } from "./use-cases/FindSaleByIdUseCase.js";
import { ConfirmSaleUseCase } from "./use-cases/ConfirmSaleUseCase.js";
import { CancelSaleUseCase } from "./use-cases/CancelSaleUseCase.js";

const createSaleUseCase = new CreateSaleUseCase();
const findAllSalesUseCase = new FindAllSalesUseCase();
const findSaleByIdUseCase = new FindSaleByIdUseCase();
const confirmSaleUseCase = new ConfirmSaleUseCase();
const cancelSaleUseCase = new CancelSaleUseCase();

import { CustomerRepository } from "../customer/repositories/CustomerRepository.js";

export class SaleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await createSaleUseCase.execute(req.body);
      return res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      let customerId: number | undefined;

      if (user && user.role === 'client') {
        const customer = CustomerRepository.findByUserId(user.id);
        if (customer) {
          customerId = customer.id;
        } else {
          // If a client user has no customer record, they have no sales.
          return res.json([]); 
        }
      }

      const sales = await findAllSalesUseCase.execute(customerId);
      return res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sale = await findSaleByIdUseCase.execute(Number(id));
      return res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await confirmSaleUseCase.execute(Number(id));
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await cancelSaleUseCase.execute(Number(id));
      return res.status(200).json({ message: "Sale cancelled successfully" });
    } catch (error) {
      next(error);
    }
  }
}
