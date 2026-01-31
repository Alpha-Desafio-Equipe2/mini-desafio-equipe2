import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";
import { HttpStatus } from "../errors/httpStatus.js";

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
      httpStatus: HttpStatus[err.httpStatus],
    });
  }

  // Erro inesperado
  console.error(err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Erro interno do servidor",
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    httpStatus: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
  });
}