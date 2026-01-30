import { api } from "../../../shared/http/api.js";
import { Customer } from "../../../shared/types.js";

export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    try {
      const response = await api.get<Customer[]>("/customers");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id: number): Promise<Customer> {
    try {
      const response = await api.get<Customer>(`/customers/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async create(customer: Omit<Customer, "id">): Promise<Customer> {
    try {
      const response = await api.post<Customer>("/customers", customer);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async update(
    id: number,
    customer: Partial<Customer>,
  ): Promise<Customer> {
    try {
      const response = await api.put<Customer>(`/customers/${id}`, customer);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
