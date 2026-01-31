import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";
import { HttpStatus } from "../errors/httpStatus.js";

export class Validators {
  // ============ VALIDADORES PUROS ============

  static validateCPF(cpf: string): boolean {
    if (!cpf) return false;
    const cleanCPF = cpf.replace(/[.\-\s]/g, '');
    return /^\d{11}$/.test(cleanCPF);
  }

  static validateCRM(crm: string): boolean {
    if (!crm) return false;
    return /^[A-Z]{2}[0-9]{4,6}$/.test(crm);
  }

  static validateCEP(cep: string): boolean {
    if (!cep) return false;
    const cleanCEP = cep.replace(/[.\-\s]/g, '');
    return /^\d{8}$/.test(cleanCEP);
  }

  static validateEmail(email: string): boolean {
    if (!email) return false;
    return email.includes('@') && email.includes('.') && email.length >= 5;
  }

  static validateName(name: string): boolean {
    if (!name) return false;
    const trimmedName = name.trim();
    return /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(trimmedName);
  }

  static validatePrescriptionDate(date: Date): boolean {
    if (!date) return false;
    const now = new Date();
    const prescriptionDate = new Date(date);
    if (prescriptionDate > now) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    return prescriptionDate >= thirtyDaysAgo;
  }

  static validatePositiveValue(value: number): boolean {
    return value > 0;
  }

  static validateNonNegativeQuantity(quantity: number): boolean {
    return quantity >= 0;
  }

  static validatePositiveQuantity(quantity: number): boolean {
    return quantity > 0;
  }

  static cleanCPF(cpf: string): string {
    return cpf.replace(/[.\-\s]/g, '');
  }

  static cleanCEP(cep: string): string {
    return cep.replace(/[.\-\s]/g, '');
  }

  static formatCPF(cpf: string): string {
    const clean = this.cleanCPF(cpf);
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  static formatCEP(cep: string): string {
    const clean = this.cleanCEP(cep);
    return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  static validatePassword(password: string) {
    if (!password) {
      throw new AppError(ErrorCode.INVALID_PASSWORD);
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new AppError(ErrorCode.WEAK_PASSWORD);
    }

    return password;
  }

  static validatePrescriptionNumber(numero: string | number | undefined): boolean {
    if (numero === undefined || numero === null) return true;
    if (typeof numero === 'string') {
      return numero.trim().length > 0;
    }
    return numero > 0;
  }

  // ============ MIDDLEWARES DE BODY ============

  static validateNameMiddleware(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    if (!name || !Validators.validateName(name)) {
      throw new AppError(ErrorCode.INVALID_USER_NAME);
    }

    next();
  }

  static validateEmailMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    if (!email || !Validators.validateEmail(email)) {
      throw new AppError(ErrorCode.INVALID_EMAIL);
    }

    next();
  }

  static validateCPFMiddleware(req: Request, res: Response, next: NextFunction) {
    const { cpf } = req.body;

    if (!cpf) {
      throw new AppError(ErrorCode.INVALID_CPF);
    }

    req.body.cpf = Validators.cleanCPF(cpf);

    if (!Validators.validateCPF(req.body.cpf)) {
      throw new AppError(ErrorCode.INVALID_CPF);
    }

    next();
  }

  static validateCEPMiddleware(req: Request, res: Response, next: NextFunction) {
    const { cep } = req.body;

    if (!cep) {
      throw new AppError(ErrorCode.INVALID_CEP);
    }

    req.body.cep = Validators.cleanCEP(cep);

    if (!Validators.validateCEP(req.body.cep)) {
      throw new AppError(ErrorCode.INVALID_CEP);
    }

    next();
  }

  static validatePasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;

    if (!password) {
      throw new AppError(ErrorCode.INVALID_PASSWORD);
    };

    // Regex que exige: 8+ caracteres, maiúscula, minúscula, número e caractere especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new AppError(ErrorCode.WEAK_PASSWORD);
    }

    next();
  }

  // ============ MIDDLEWARES DE PARAMS ============

  static validateIdParamMiddleware(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      throw new AppError(ErrorCode.INVALID_ID);
    }

    req.params.id = numericId.toString();
    next();
  }

  static validateCPFParamMiddleware(req: Request, res: Response, next: NextFunction) {
    const { cpf } = req.params;

    if (!Validators.validateCPF(cpf)) {
      throw new AppError(ErrorCode.INVALID_CPF);
    }

    req.params.cpf = Validators.cleanCPF(cpf);
    next();
  }

  static validateEmailParamMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;

    if (!Validators.validateEmail(email)) {
      throw new AppError(ErrorCode.INVALID_EMAIL);
    }

    next();
  }

  // ============ MIDDLEWARES DE QUERY ============

  static validateEmailQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.query;

    if (email) {
      if (typeof email !== 'string' || !Validators.validateEmail(email)) {
        throw new AppError(ErrorCode.INVALID_EMAIL);
      }
    }

    next();
  }

  static validateCPFQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    const { cpf } = req.query;

    if (cpf) {
      if (typeof cpf !== 'string' || !Validators.validateCPF(cpf)) {
        throw new AppError(ErrorCode.INVALID_CPF);
      }

      req.query.cpf = Validators.cleanCPF(cpf);
    }

    next();
  }

  // ============ MIDDLEWARES GENÉRICOS ============

  static validateParamMiddleware(
    paramName: string,
    validator: (value: string) => boolean,
    errorMessage: string
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      const value = req.params[paramName];

      if (!value || !validator(value)) {
        throw new AppError(ErrorCode.INVALID_PARAM);
      }

      next();
    };
  }

  static validateQueryMiddleware(
    queryName: string,
    validator: (value: string) => boolean,
    errorMessage: string,
    required: boolean = false
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      const value = req.query[queryName];

      if (!value) {
        if (required) {
          throw new AppError(ErrorCode.MISSING_PARAM);
        }
        return next();
      }

      if (typeof value !== 'string' || !validator(value)) {
        throw new AppError(ErrorCode.INVALID_PARAM);
      }

      next();
    };
  }
}