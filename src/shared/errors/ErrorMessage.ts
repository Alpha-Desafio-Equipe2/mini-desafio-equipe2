import { ErrorCode } from "./ErrorCode.js";
import { HttpStatus } from "./httpStatus.js";

interface ErrorMessageProps {
  message: string;
  httpStatus: HttpStatus;
}

export const ErrorMessage: Record<ErrorCode, ErrorMessageProps> = {
  // Clientes
  [ErrorCode.INVALID_CPF]: {
    message: "CPF inválido",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MISSING_CUSTOMER_NAME]: {
    message: "Nome do cliente não informado",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_BIRTHDATE]: {
    message: "Data de nascimento inválida",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CPF_ALREADY_EXISTS]: {
    message: "CPF já cadastrado",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    message: "Email já cadastrado",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.INVALID_EMAIL]: {
    message: "Email inválido",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CUSTOMER_NOT_FOUND]: {
    message: "Cliente não encontrado",
    httpStatus: HttpStatus.NOT_FOUND,
  },

  // Médicos
  [ErrorCode.INVALID_CRM]: {
    message: "CRM inválido",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MISSING_MEDIC_NAME]: {
    message: "Nome do médico não informado",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MEDIC_NOT_FOUND]: {
    message: "Médico não encontrado",
    httpStatus: HttpStatus.NOT_FOUND,
  },

  // Medicamentos
  [ErrorCode.MISSING_MEDICINE_NAME]: {
    message: "Nome do medicamento não informado",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MEDICINE_OUT_OF_STOCK]: {
    message: "Medicamento sem estoque",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.MEDICINE_NOT_FOUND]: {
    message: "Medicamento não encontrado",
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.INVALID_MEDICINE_PRICE]: {
    message: "Preço do medicamento inválido",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INSUFFICIENT_STOCK]: {
    message: "Estoque insuficiente",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.SKU_ALREADY_EXISTS]: {
    message: "SKU já cadastrado",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.MEDICINE_NAME_ALREADY_EXISTS]: {
    message: "Medicamento já cadastrado",
    httpStatus: HttpStatus.CONFLICT,
  },

  // Vendas
  [ErrorCode.PRESCRIPTION_REQUIRED]: {
    message: "Receita médica obrigatória",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CUSTOMER_NOT_INFORMED]: {
    message: "Cliente não informado",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.BRANCH_NOT_INFORMED]: {
    message: "Filial não informada",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.SALE_NOT_FOUND]: {
    message: "Venda não encontrada",
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.SALE_ALREADY_FINISHED]: {
    message: "Venda já finalizada",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.SALE_CANCELLED]: {
    message: "Venda cancelada",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.SALE_WITHOUT_ITEMS]: {
    message: "Venda sem itens",
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Itens de venda
  [ErrorCode.INVALID_ITEM_QUANTITY]: {
    message: "Quantidade do item inválida",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.SALE_ITEM_NOT_FOUND]: {
    message: "Item da venda não encontrado",
    httpStatus: HttpStatus.NOT_FOUND,
  },

  // Prescrições
  [ErrorCode.INVALID_PRESCRIPTION]: {
    message: "Prescrição inválida",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.PRESCRIPTION_NOT_FOUND]: {
    message: "Prescrição não encontrada",
    httpStatus: HttpStatus.NOT_FOUND,
  },
  [ErrorCode.PRESCRIPTION_EXPIRED]: {
    message: "Receita vencida",
    httpStatus: HttpStatus.CONFLICT,
  },
  [ErrorCode.INVALID_MEDIC_NAME]: {
    message: "Nome do médico inválido",
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  // Filiais
  [ErrorCode.MISSING_BRANCH_NAME]: {
    message: "Nome da filial não informado",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.BRANCH_NOT_FOUND]: {
    message: "Filial não encontrada",
    httpStatus: HttpStatus.NOT_FOUND,
  },

  // Endereços
  [ErrorCode.INVALID_CEP]: {
    message: "CEP inválido",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.MISSING_ADDRESS_FIELD]: {
    message: "Campo obrigatório do endereço não informado",
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.ADDRESS_NOT_FOUND]: {
    message: "Endereço não encontrado",
    httpStatus: HttpStatus.NOT_FOUND,
  },

  // Autenticação / Usuários
  [ErrorCode.ACCESS_DENIED]: {
    message: "Acesso negado",
    httpStatus: HttpStatus.FORBIDDEN,
  },
  [ErrorCode.INVALID_TOKEN]: {
    message: "Token inválido",
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    message: "Credenciais inválidas",
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.TOKEN_NOT_PROVIDED]: {
    message: "Token não fornecido",
    httpStatus: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    message: "Token expirado",
    httpStatus: HttpStatus.UNAUTHORIZED,
  },

  // Sistema
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    message: "Erro interno do servidor",
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};