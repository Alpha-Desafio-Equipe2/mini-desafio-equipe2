import { api } from "../../../shared/http/api.js";
import { CreateSaleDTO, Customer, Order } from "../../../shared/types.js";

export class SaleService {
  static async createSale(saleData: CreateSaleDTO): Promise<Order> {
    try {
      // O guide menciona /sales
      const response = await api.post<Order>("/sales", saleData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getCustomers(): Promise<Customer[]> {
    try {
      const response = await api.get<Customer[]>("/customers");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getSalesHistory(): Promise<Order[]> {
    try {
      const response = await api.get<Order[]>("/sales");
      return response;
    } catch (error) {
      throw error;
    }
  }
}
