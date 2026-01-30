import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";
import { HttpStatus } from "../errors/httpStatus.js";

function getHttpStatusName(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'BAD_REQUEST';
    case HttpStatus.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HttpStatus.FORBIDDEN:
      return 'FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'NOT_FOUND';
    case HttpStatus.CONFLICT:
      return 'CONFLICT';
    case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
      return 'UNSUPPORTED_MEDIA_TYPE';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'INTERNAL_SERVER_ERROR';
    default:
      return 'UNKNOWN';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({
      message: err.message,
      code: err.code,
      httpStatus: getHttpStatusName(err.httpStatus),
    });
  }

  // Erro inesperado
  console.error(err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Erro interno do servidor",
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    httpStatus: getHttpStatusName(HttpStatus.INTERNAL_SERVER_ERROR),
  });
}