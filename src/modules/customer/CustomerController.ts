import { Request, Response } from "express";
import { CustomerService } from "./CustomerService.js";

export class CustomerController {
  static create(request: Request, response: Response) {
    const { name, cpf } = request.body;

    // Simple validation for required fields
    if (!name || !cpf) {
      return response.status(400).json({ error: "Name and CPF are required." });
    }

    try {
      const customer = CustomerService.execute({ name, cpf });
      return response.status(201).json(customer);
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return response.status(statusCode).json({ error: error.message });
    }
  }

  static getAll(request: Request, response: Response) {
    try {
      const customers = CustomerService.findAll();
      return response.json(customers);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }

  static getById(request: Request, response: Response) {
    const { id } = request.params;
    
    try {
      const customer = CustomerService.findById(Number(id));
      return response.json(customer);
    } catch (error: any) {
      const statusCode = error.statusCode || 404;
      return response.status(statusCode).json({ error: error.message });
    }
  }

  static update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, cpf } = request.body;

    try {
      const customer = CustomerService.update(id, { name, cpf });
      return response.json(customer);
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return response.status(statusCode).json({ error: error.message });
    }
  }

  static delete(request: Request, response: Response) {
    const { id } = request.params;

    try {
      CustomerService.delete(id);
      return response.status(204).send();
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return response.status(statusCode).json({ error: error.message });
    }
  }
}
