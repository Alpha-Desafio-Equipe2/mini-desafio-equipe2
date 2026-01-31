import { SaleRepository } from "../repositories/SaleRepository.js";

export class FindAllSalesUseCase {
  async execute() {
    return SaleRepository.findAll();
  }
}
