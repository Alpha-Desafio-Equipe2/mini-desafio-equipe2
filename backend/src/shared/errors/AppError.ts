import { ErrorCode } from "./ErrorCode.js";
import { ErrorMessage } from "./ErrorMessage.js";
import { HttpStatus } from "./httpStatus.js";

interface AppErrorProps {
  message: string;
  code: ErrorCode;
  httpStatus: HttpStatus;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly httpStatus: HttpStatus;

  constructor(codeOrProps: ErrorCode | AppErrorProps) {
    // Se receber o objeto completo (para mensagens customizadas)
    if (typeof codeOrProps === 'object' && 'message' in codeOrProps) {
      super(codeOrProps.message);
      this.code = codeOrProps.code;
      this.httpStatus = codeOrProps.httpStatus;
    }
    else {
      // Se receber apenas o ErrorCode
      const errorInfo = ErrorMessage[codeOrProps];
      super(errorInfo.message);
      this.code = codeOrProps;
      this.httpStatus = errorInfo.httpStatus;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
