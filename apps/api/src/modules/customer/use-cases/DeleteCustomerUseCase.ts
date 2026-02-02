import { CustomerRepository } from "../repositories/CustomerRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

export class DeleteCustomerUseCase {
  async execute(id: number) {
    const customer = CustomerRepository.findById(id);

    if (!customer) {
      throw new AppError({
        message: "Customer not found",
        code: ErrorCode.CUSTOMER_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    CustomerRepository.delete(id);
  }
}
