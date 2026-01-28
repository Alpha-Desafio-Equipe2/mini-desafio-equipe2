import { Request, Response } from 'express';
import { CustomerService } from './CustomerService.js';

export class CustomerController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cpf } = request.body;
    
    const customerService = new CustomerService();
    
    // Simple validation for required fields
    if (!name || !cpf) {
      return response.status(400).json({ error: 'Name and CPF are required.' });
    }

    try {
      const customer = customerService.execute({ name, cpf });
      return response.status(201).json(customer);
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return response.status(statusCode).json({ error: error.message });
    }
  }
}
