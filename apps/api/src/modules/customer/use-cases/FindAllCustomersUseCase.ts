import { CustomerRepository } from "../repositories/CustomerRepository.js";

export class FindAllCustomersUseCase {
  async execute() {
    return CustomerRepository.findAll();
  }
}
