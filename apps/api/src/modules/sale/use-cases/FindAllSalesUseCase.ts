import { SaleRepository } from "../repositories/SaleRepository.js";

export class FindAllSalesUseCase {
  async execute(userId?: number) {
    return SaleRepository.findAll(userId);
  }
}
