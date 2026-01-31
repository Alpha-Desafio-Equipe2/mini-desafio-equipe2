import { CustomerRepository } from "../repositories/CustomerRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface UpdateCustomerDTO {
  name?: string;
  cpf?: string;
  email?: string;
}

export class UpdateCustomerUseCase {
  async execute(id: number, data: UpdateCustomerDTO) {
    const customer = CustomerRepository.findById(id);

    if (!customer) {
      throw new AppError({
        message: "Customer not found",
        code: ErrorCode.CUSTOMER_NOT_FOUND,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }

    if (data.cpf && data.cpf !== customer.cpf) {
      this.validateCpf(data.cpf);
      const existing = CustomerRepository.findByCpf(data.cpf);
      if (existing && existing.id !== id) {
        throw new AppError({
          message: "CPF already currently in use",
          code: ErrorCode.CPF_ALREADY_EXISTS,
          httpStatus: HttpStatus.CONFLICT,
        });
      }
    }

    CustomerRepository.update(id, data);

    return {
      ...customer,
      ...data,
    };
  }

  private validateCpf(cpf: string): void {
    const numericCpf = cpf.replace(/\D/g, "");

    if (numericCpf.length !== 11) {
      throw new AppError({
        message: "CPF must contain exactly 11 digits",
        code: ErrorCode.INVALID_CPF,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
