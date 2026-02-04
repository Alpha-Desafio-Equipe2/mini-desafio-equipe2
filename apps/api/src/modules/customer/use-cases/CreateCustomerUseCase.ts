import { CustomerRepository } from "../repositories/CustomerRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ErrorCode } from "../../../shared/errors/ErrorCode.js";
import { HttpStatus } from "../../../shared/errors/httpStatus.js";

interface CreateCustomerDTO {
  name: string;
  cpf: string;
  email?: string;
  user_id?: number;
}

export class CreateCustomerUseCase {
  async execute(data: CreateCustomerDTO) {
    this.validateCpf(data.cpf);

    const customerAlreadyExists = CustomerRepository.findByCpf(data.cpf);

    if (customerAlreadyExists) {
      throw new AppError({
        message: "Customer already exists with this CPF",
        code: ErrorCode.CPF_ALREADY_EXISTS,
        httpStatus: HttpStatus.CONFLICT,
      });
    }

    const customerId = CustomerRepository.create(data);

    return {
      id: customerId,
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
