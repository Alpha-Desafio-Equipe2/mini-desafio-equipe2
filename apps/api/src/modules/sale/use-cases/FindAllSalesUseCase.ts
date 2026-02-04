import { SaleRepository } from "../repositories/SaleRepository.js";

export class FindAllSalesUseCase {
  async execute(customerId?: number) {
    return SaleRepository.findAll(customerId);
  }
}
