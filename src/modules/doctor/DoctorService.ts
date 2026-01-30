import { AppError } from "../../shared/errors/AppError.js";
import { ErrorCode } from "../../shared/errors/ErrorCode.js";
import { ErrorMessage } from "../../shared/errors/ErrorMessage.js";
import { Validators } from "../../shared/utils/validators.js";

// Assumindo que você tem um repositório
// import { DoctorRepository } from "../../repositories/DoctorRepository";

interface CreateDoctorData {
  name: string;
  crm: string;
  specialty: string;
}

interface UpdateDoctorData {
  name?: string;
  crm?: string;
  specialty?: string;
}

export class DoctorService {
  // private repository = new DoctorRepository();

  /**
   * Cria um novo médico
   */
  static async create(data: CreateDoctorData) {
    // 1. Validar nome
    if (!data.name || !Validators.validateName(data.name)) {
      const error = ErrorMessage[ErrorCode.MISSING_MEDIC_NAME];
      throw new AppError({
        message: error.message,
        code: ErrorCode.MISSING_MEDIC_NAME,
        httpStatus: error.httpStatus,
      });
    }

    // 2. Validar CRM
    if (!data.crm || !Validators.validateCRM(data.crm)) {
      const error = ErrorMessage[ErrorCode.INVALID_CRM];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_CRM,
        httpStatus: error.httpStatus,
      });
    }

    // 3. Validar especialidade
    if (!data.specialty || data.specialty.trim().length === 0) {
      const error = ErrorMessage[ErrorCode.MISSING_MEDIC_NAME];
      throw new AppError({
        message: "Especialidade não informada",
        code: ErrorCode.MISSING_MEDIC_NAME,
        httpStatus: error.httpStatus,
      });
    }

    // 4. Verificar se CRM já existe
    // const crmExists = await this.repository.findByCRM(data.crm);
    // if (crmExists) {
    //   const error = ErrorMessage[ErrorCode.INVALID_CRM];
    //   throw new AppError({
    //     message: "CRM já cadastrado",
    //     code: ErrorCode.INVALID_CRM,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 5. Preparar dados para salvar
    const doctorData = {
      name: data.name.trim(),
      crm: data.crm.trim().toUpperCase(),
      specialty: data.specialty.trim(),
    };

    // 6. Salvar no banco
    // const doctor = await this.repository.create(doctorData);

    // 7. Retornar dados
    // return doctor;

    // Mock
    return {
      id: "mock-doctor-123",
      ...doctorData,
      criadoEm: new Date(),
    };
  }

  /**
   * Lista todos os médicos
   */
  static async list(filters?: { specialty?: string }) {
    // if (filters?.specialty) {
    //   return await this.repository.findBySpecialty(filters.specialty);
    // }

    // return await this.repository.findAll();

    return []; // Mock
  }

  /**
   * Busca um médico por ID
   */
  static async findById(id: string) {
    // const doctor = await this.repository.findById(id);

    // if (!doctor) {
    //   const error = ErrorMessage[ErrorCode.MEDIC_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.MEDIC_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // return doctor;

    // Mock
    throw new AppError({
      message: ErrorMessage[ErrorCode.MEDIC_NOT_FOUND].message,
      code: ErrorCode.MEDIC_NOT_FOUND,
      httpStatus: ErrorMessage[ErrorCode.MEDIC_NOT_FOUND].httpStatus,
    });
  }

  /**
   * Busca um médico por CRM
   */
  static async findByCRM(crm: string) {
    // Validar CRM
    if (!Validators.validateCRM(crm)) {
      const error = ErrorMessage[ErrorCode.INVALID_CRM];
      throw new AppError({
        message: error.message,
        code: ErrorCode.INVALID_CRM,
        httpStatus: error.httpStatus,
      });
    }

    // const doctor = await this.repository.findByCRM(crm);

    // if (!doctor) {
    //   const error = ErrorMessage[ErrorCode.MEDIC_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.MEDIC_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // return doctor;

    // Mock
    throw new AppError({
      message: ErrorMessage[ErrorCode.MEDIC_NOT_FOUND].message,
      code: ErrorCode.MEDIC_NOT_FOUND,
      httpStatus: ErrorMessage[ErrorCode.MEDIC_NOT_FOUND].httpStatus,
    });
  }

  /**
   * Atualiza um médico
   */
  static async update(id: string, data: UpdateDoctorData) {
    // 1. Verificar se médico existe
    // const doctor = await this.repository.findById(id);
    // if (!doctor) {
    //   const error = ErrorMessage[ErrorCode.MEDIC_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.MEDIC_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Validar nome (se fornecido)
    if (data.name !== undefined) {
      if (!Validators.validateName(data.name)) {
        const error = ErrorMessage[ErrorCode.MISSING_MEDIC_NAME];
        throw new AppError({
          message: error.message,
          code: ErrorCode.MISSING_MEDIC_NAME,
          httpStatus: error.httpStatus,
        });
      }
    }

    // 3. Validar CRM (se fornecido)
    if (data.crm !== undefined) {
      if (!Validators.validateCRM(data.crm)) {
        const error = ErrorMessage[ErrorCode.INVALID_CRM];
        throw new AppError({
          message: error.message,
          code: ErrorCode.INVALID_CRM,
          httpStatus: error.httpStatus,
        });
      }

      // Verificar se CRM já existe em outro médico
      // const crmExists = await this.repository.findByCRM(data.crm);
      // if (crmExists && crmExists.id !== id) {
      //   const error = ErrorMessage[ErrorCode.INVALID_CRM];
      //   throw new AppError({
      //     message: "CRM já cadastrado",
      //     code: ErrorCode.INVALID_CRM,
      //     httpStatus: error.httpStatus,
      //   });
      // }
    }

    // 4. Validar especialidade (se fornecida)
    if (data.specialty !== undefined && data.specialty.trim().length === 0) {
      const error = ErrorMessage[ErrorCode.MISSING_MEDIC_NAME];
      throw new AppError({
        message: "Especialidade não pode ser vazia",
        code: ErrorCode.MISSING_MEDIC_NAME,
        httpStatus: error.httpStatus,
      });
    }

    // 5. Preparar dados para atualizar
    const updateData = {
      name: data.name?.trim(),
      crm: data.crm?.trim().toUpperCase(),
      specialty: data.specialty?.trim(),
    };

    // 6. Atualizar no banco
    // const updatedDoctor = await this.repository.update(id, updateData);

    // 7. Retornar dados
    // return updatedDoctor;

    // Mock
    return {
      id,
      ...updateData,
      atualizadoEm: new Date(),
    };
  }

  /**
   * Deleta um médico
   */
  static async delete(id: string) {
    // 1. Verificar se médico existe
    // const doctor = await this.repository.findById(id);
    // if (!doctor) {
    //   const error = ErrorMessage[ErrorCode.MEDIC_NOT_FOUND];
    //   throw new AppError({
    //     message: error.message,
    //     code: ErrorCode.MEDIC_NOT_FOUND,
    //     httpStatus: error.httpStatus,
    //   });
    // }

    // 2. Verificar se médico tem prescrições associadas
    // const hasPrescriptions = await this.prescriptionRepository.existsByDoctorId(id);
    // if (hasPrescriptions) {
    //   throw new AppError({
    //     message: "Médico possui prescrições associadas",
    //     code: ErrorCode.MEDIC_NOT_FOUND,
    //     httpStatus: HttpStatus.CONFLICT,
    //   });
    // }

    // 3. Deletar
    // await this.repository.delete(id);

    return { message: "Médico deletado com sucesso" };
  }
}