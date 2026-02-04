import { NextFunction, Request, Response } from "express";
import { CreateCustomerUseCase } from "./use-cases/CreateCustomerUseCase.js";
import { FindAllCustomersUseCase } from "./use-cases/FindAllCustomersUseCase.js";
import { FindCustomerByIdUseCase } from "./use-cases/FindCustomerByIdUseCase.js";
import { UpdateCustomerUseCase } from "./use-cases/UpdateCustomerUseCase.js";
import { DeleteCustomerUseCase } from "./use-cases/DeleteCustomerUseCase.js";

const createCustomerUseCase = new CreateCustomerUseCase();
const findAllCustomersUseCase = new FindAllCustomersUseCase();
const findCustomerByIdUseCase = new FindCustomerByIdUseCase();
const updateCustomerUseCase = new UpdateCustomerUseCase();
const deleteCustomerUseCase = new DeleteCustomerUseCase();

export class CustomerController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await createCustomerUseCase.execute(req.body);
      return res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await findAllCustomersUseCase.execute();
      return res.json(customers);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const customer = await findCustomerByIdUseCase.execute(Number(id));
      return res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const customer = await updateCustomerUseCase.execute(Number(id), req.body);
      return res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await deleteCustomerUseCase.execute(Number(id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
