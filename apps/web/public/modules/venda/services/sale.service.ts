import { api } from "../../../shared/http/api.js";
import { CreateSaleDTO, Order } from "../../../shared/types.js";

export class SaleService {
  static async createSale(saleData: CreateSaleDTO): Promise<Order> {
    try {
      // O guide menciona /sales
      const response = await api.post<Order>("/sales", saleData);
      return response;
    } catch (error) {
      console.error("Erro ao realizar venda", error);
      throw error;
    }
  }



  static async getSalesHistory(): Promise<Order[]> {
    try {
      const response = await api.get<Order[]>("/sales");
      return response;
    } catch (error) {
      console.error("Erro ao buscar histórico de vendas", error);
      throw error;
    }
  }
}
