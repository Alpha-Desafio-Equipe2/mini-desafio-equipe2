  import { ErrorCode } from "./ErrorCode.js";
  import { HttpStatus } from "./httpStatus.js";

  interface AppErrorProps {
    message: string;
    code: ErrorCode;
    httpStatus: HttpStatus;
  }

  export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly httpStatus: HttpStatus;

    constructor({ message, code, httpStatus }: AppErrorProps) {
      super(message);
      this.code = code;
      this.httpStatus = httpStatus;

      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
