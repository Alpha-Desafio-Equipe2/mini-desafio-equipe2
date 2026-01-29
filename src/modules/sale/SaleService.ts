import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { ErrorMessage } from "../../shared/errors/ErrorMessage.js";
import { Validators } from "../../shared/utils/validators.js";
import { MedicineService } from "../medicine/MedicineService.js";

// Assumindo que você tem repositórios
// import { SaleRepository } from "../repositories/SaleRepository";
// import { CustomerRepository } from "../repositories/CustomerRepository";
// import { BranchRepository } from "../repositories/BranchRepository";

interface PrescriptionData {
  nomeMedico: string;
  crm: string;
  dataReceita: Date;
  numeroReceita?: string | number;
}

interface SaleItemData {
  medicamentoId: string;
  quantidade: number;
}

interface CreateSaleData {
  clienteId: string;
  filialId: string;
  itens: SaleItemData[];
  receita?: PrescriptionData;
}

interface SaleStatus {
  PENDENTE: 'PENDENTE';
  PAGA: 'PAGA';
  CANCELADA: 'CANCELADA';
}

export class SaleService {
  // private repository = new SaleRepository();
  // private customerRepository = new CustomerRepository();
  // private branchRepository = new BranchRepository();
  private medicineService = new MedicineService();

  /**
   * Cria uma nova venda
   */
  async create(data: CreateSaleData) {
    // 1. Validar se cliente foi informado
    if (!data.clienteId || data.clienteId.trim().length === 0) {
      const error = ErrorMessage[ErrorCode.CUSTOMER_NOT_INFORMED];
      throw new AppError({
        message: error.message,
        code: ErrorCode.CUSTOMER_NOT_INFORMED,
        httpStatus: error.httpStatus,
      });
    }

    // 2. Validar se filial foi informada
    if (!data.filialId || data.filialId.trim().length === 0) {
      const error = ErrorMessage[ErrorCode.BRANCH_NOT_INFORMED];
      throw new AppError({
        message: error.message,
        code: ErrorCode.BRANCH_NOT_INFORMED,
        httpStatus: error.httpStatus,
      });
    }

    // 3. Validar se venda tem itens
    if (!data.itens || data.itens.length === 0) {
      const error = ErrorMessage[ErrorCode.SALE_WITHOUT_ITEMS];
      throw new AppError({
        message: error.message,
        code: ErrorCode.SALE_WITHOUT_ITEMS,
        httpStatus: error.httpStatus,
      });
    }

    // 4. Verificar se cliente existe
    // const customer = await this.customerRepository.findById(data.clienteId);
    // if (!customer) {
    //   const error = ErrorMessage[ErrorCode.CUSTOMER_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.CUSTOMER_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 5. Verificar se filial existe
    // const branch = await this.branchRepository.findById(data.filialId);
    // if (!branch) {
    //   const error = ErrorMessage[ErrorCode.BRANCH_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.BRANCH_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 6. Validar cada item da venda
    let valorTotal = 0;
    let exigeReceita = false;
    const itensValidados = [];

    for (const item of data.itens) {
      // 6.1. Validar quantidade
      if (!Validators.validatePositiveQuantity(item.quantidade)) {
        const error = ErrorMessage[ErrorCode.INVALID_ITEM_QUANTITY];
        throw new AppError({
          message: error.message,
          code: ErrorCode.INVALID_ITEM_QUANTITY,
          httpStatus: error.httpStatus,
        });
      }

      // 6.2. Buscar medicamento
      // const medicine = await this.medicineService.findById(item.medicamentoId);
      
      // Mock do medicamento (remover quando tiver banco)
      const medicine = {
        id: item.medicamentoId,
        nome: "Medicamento Teste",
        valor: 50.00,
        quantidade: 100,
        prescricao: true, // Simula que exige receita
      };

      // 6.3. Verificar estoque
      await this.medicineService.checkStock(item.medicamentoId, item.quantidade);

      // 6.4. Verificar se algum medicamento exige receita
      if (medicine.prescricao) {
        exigeReceita = true;
      }

      // 6.5. Calcular subtotal
      const subtotal = medicine.valor * item.quantidade;
      valorTotal += subtotal;

      itensValidados.push({
        medicamentoId: item.medicamentoId,
        quantidade: item.quantidade,
        valorUnitario: medicine.valor,
        subtotal,
      });
    }

    // 7. Se algum medicamento exige receita, validar receita médica
    if (exigeReceita) {
      if (!data.receita) {
        const error = ErrorMessage[ErrorCode.PRESCRIPTION_REQUIRED];
        throw new AppError({
          message: error.message,
          code: ErrorCode.PRESCRIPTION_REQUIRED,
          httpStatus: error.httpStatus,
        });
      }

      // Validar receita
      this.validatePrescription(data.receita);
    }

    // 8. Criar a venda no banco
    // const sale = await this.repository.create({
    //   clienteId: data.clienteId,
    //   filialId: data.filialId,
    //   itens: itensValidados,
    //   receita: data.receita,
    //   valorTotal,
    //   status: 'PENDENTE',
    // });

    // 9. Decrementar estoque de cada medicamento
    for (const item of itensValidados) {
      await this.medicineService.decrementStock(item.medicamentoId, item.quantidade);
    }

    // 10. Retornar venda criada
    // return sale;

    // Mock
    return {
      id: "mock-sale-123",
      clienteId: data.clienteId,
      filialId: data.filialId,
      itens: itensValidados,
      receita: data.receita,
      valorTotal,
      status: 'PENDENTE',
      criadoEm: new Date(),
    };
  }

  /**
   * Valida os dados da receita médica
   */
  private validatePrescription(receita: PrescriptionData): void {
    // 1. Validar nome do médico
    if (!receita.nomeMedico || !Validators.validateName(receita.nomeMedico)) {
      const error = ErrorMessage[ErrorCode.INVALID_MEDIC_NAME];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_MEDIC_NAME,
        httpStatus: error.httpStatus,
      });
    }

    // 2. Validar CRM
    if (!receita.crm || !Validators.validateCRM(receita.crm)) {
      const error = ErrorMessage[ErrorCode.INVALID_CRM];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_CRM,
        httpStatus: error.httpStatus,
      });
    }

    // 3. Validar data da receita
    if (!receita.dataReceita || !Validators.validatePrescriptionDate(receita.dataReceita)) {
      const error = ErrorMessage[ErrorCode.PRESCRIPTION_EXPIRED];
      throw new AppError({
        message: error.message,
        code: ErrorCode.PRESCRIPTION_EXPIRED,
        httpStatus: error.httpStatus,
      });
    }

    // 4. Validar número da receita (se fornecido)
    if (!Validators.validatePrescriptionNumber(receita.numeroReceita)) {
      const error = ErrorMessage[ErrorCode.INVALID_PRESCRIPTION];
      throw new AppError({
        message: "Número da receita inválido",
        code: ErrorCode.INVALID_PRESCRIPTION,
        httpStatus: error.httpStatus,
      });
    }
  }

  /**
   * Lista todas as vendas
   */
  async list(filters?: {
    clienteId?: string;
    filialId?: string;
    status?: string;
  }) {
    // if (filters?.clienteId) {
    //   return await this.repository.findByCustomer(filters.clienteId);
    // }

    // if (filters?.filialId) {
    //   return await this.repository.findByBranch(filters.filialId);
    // }

    // if (filters?.status) {
    //   return await this.repository.findByStatus(filters.status);
    // }

    // return await this.repository.findAll();

    return []; // Mock
  }

  /**
   * Busca uma venda por ID
   */
  async findById(id: string) {
    // const sale = await this.repository.findById(id);

    // if (!sale) {
    //   const error = ErrorMessage[ErrorCode.SALE_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // return sale;

    // Mock
    throw new AppError({
      message: ErrorMessage[ErrorCode.SALE_NOT_FOUND].message,
      code: ErrorCode.SALE_NOT_FOUND,
      httpStatus: ErrorMessage[ErrorCode.SALE_NOT_FOUND].httpStatus,
    });
  }

  /**
   * Confirma pagamento da venda
   */
  async confirmPayment(id: string) {
    // 1. Buscar venda
    // const sale = await this.repository.findById(id);

    // if (!sale) {
    //   const error = ErrorMessage[ErrorCode.SALE_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Verificar se já está paga
    // if (sale.status === 'PAGA') {
    //   const error = ErrorMessage[ErrorCode.SALE_ALREADY_FINISHED];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_ALREADY_FINISHED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 3. Verificar se está cancelada
    // if (sale.status === 'CANCELADA') {
    //   const error = ErrorMessage[ErrorCode.SALE_CANCELLED];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_CANCELLED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 4. Atualizar status para PAGA
    // await this.repository.updateStatus(id, 'PAGA');

    // return {
    //   id,
    //   status: 'PAGA',
    //   message: "Pagamento confirmado com sucesso",
    // };

    // Mock
    return {
      id,
      status: 'PAGA',
      message: "Pagamento confirmado com sucesso",
    };
  }

  /**
   * Cancela uma venda
   */
  async cancel(id: string) {
    // 1. Buscar venda
    // const sale = await this.repository.findById(id);

    // if (!sale) {
    //   const error = ErrorMessage[ErrorCode.SALE_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Verificar se já está cancelada
    // if (sale.status === 'CANCELADA') {
    //   const error = ErrorMessage[ErrorCode.SALE_CANCELLED];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_CANCELLED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 3. Verificar se já está paga
    // if (sale.status === 'PAGA') {
    //   const error = ErrorMessage[ErrorCode.SALE_ALREADY_FINISHED];
    //   throw new AppError({
    //     message: "Venda já paga não pode ser cancelada",
    //     code: ErrorCode.SALE_ALREADY_FINISHED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 4. Devolver estoque dos medicamentos
    // for (const item of sale.itens) {
    //   await this.medicineService.incrementStock(item.medicamentoId, item.quantidade);
    // }

    // 5. Atualizar status para CANCELADA
    // await this.repository.updateStatus(id, 'CANCELADA');

    // return {
    //   id,
    //   status: 'CANCELADA',
    //   message: "Venda cancelada com sucesso",
    // };

    // Mock
    return {
      id,
      status: 'CANCELADA',
      message: "Venda cancelada com sucesso",
    };
  }

  /**
   * Adiciona item a uma venda pendente
   */
  async addItem(saleId: string, itemData: SaleItemData) {
    // 1. Buscar venda
    // const sale = await this.repository.findById(saleId);

    // if (!sale) {
    //   const error = ErrorMessage[ErrorCode.SALE_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Verificar se venda está pendente
    // if (sale.status !== 'PENDENTE') {
    //   const error = ErrorMessage[ErrorCode.SALE_ALREADY_FINISHED];
    //   throw new AppError({
    //     message: "Não é possível adicionar itens a uma venda finalizada",
    //     code: ErrorCode.SALE_ALREADY_FINISHED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 3. Validar quantidade
    if (!Validators.validatePositiveQuantity(itemData.quantidade)) {
      const error = ErrorMessage[ErrorCode.INVALID_ITEM_QUANTITY];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_ITEM_QUANTITY,
        httpStatus: error.httpStatus,
      });
    }

    // 4. Buscar medicamento
    // const medicine = await this.medicineService.findById(itemData.medicamentoId);

    // 5. Verificar estoque
    await this.medicineService.checkStock(itemData.medicamentoId, itemData.quantidade);

    // 6. Verificar se medicamento exige receita e se venda tem receita
    // if (medicine.prescricao && !sale.receita) {
    //   const error = ErrorMessage[ErrorCode.PRESCRIPTION_REQUIRED];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.PRESCRIPTION_REQUIRED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 7. Calcular subtotal
    // const subtotal = medicine.valor * itemData.quantidade;

    // 8. Adicionar item à venda
    // await this.repository.addItem(saleId, {
    //   medicamentoId: itemData.medicamentoId,
    //   quantidade: itemData.quantidade,
    //   valorUnitario: medicine.valor,
    //   subtotal,
    // });

    // 9. Decrementar estoque
    await this.medicineService.decrementStock(itemData.medicamentoId, itemData.quantidade);

    // 10. Atualizar valor total da venda
    // const newTotal = sale.valorTotal + subtotal;
    // await this.repository.updateTotal(saleId, newTotal);

    // return {
    //   message: "Item adicionado com sucesso",
    //   valorTotal: newTotal,
    // };

    // Mock
    return {
      message: "Item adicionado com sucesso",
      valorTotal: 150.00,
    };
  }

  /**
   * Remove item de uma venda pendente
   */
  async removeItem(saleId: string, itemId: string) {
    // 1. Buscar venda
    // const sale = await this.repository.findById(saleId);

    // if (!sale) {
    //   const error = ErrorMessage[ErrorCode.SALE_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Verificar se venda está pendente
    // if (sale.status !== 'PENDENTE') {
    //   const error = ErrorMessage[ErrorCode.SALE_ALREADY_FINISHED];
    //   throw new AppError({
    //     message: "Não é possível remover itens de uma venda finalizada",
    //     code: ErrorCode.SALE_ALREADY_FINISHED,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 3. Buscar item
    // const item = sale.itens.find(i => i.id === itemId);

    // if (!item) {
    //   const error = ErrorMessage[ErrorCode.SALE_ITEM_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.SALE_ITEM_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 4. Devolver estoque
    // await this.medicineService.incrementStock(item.medicamentoId, item.quantidade);

    // 5. Remover item da venda
    // await this.repository.removeItem(saleId, itemId);

    // 6. Atualizar valor total
    // const newTotal = sale.valorTotal - item.subtotal;
    // await this.repository.updateTotal(saleId, newTotal);

    // return {
    //   message: "Item removido com sucesso",
    //   valorTotal: newTotal,
    // };

    // Mock
    return {
      message: "Item removido com sucesso",
      valorTotal: 100.00,
    };
  }
}