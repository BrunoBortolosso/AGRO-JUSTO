import { ZodError } from "zod";

import {
  AppError,
  badRequest,
  conflict,
  internalServerError,
  notFound
} from "../utils/errors.js";

function fromPrismaError(error) {
  switch (error?.code) {
    case "P2002":
      return conflict("Já existe um registro com esses dados.");
    case "P2025":
      return notFound("Recurso não encontrado.");
    case "P2003":
      return badRequest("A referência informada é inválida.");
    default:
      return null;
  }
}

function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados de entrada inválidos.",
      code: "VALIDATION_ERROR"
    });
  }

  const normalizedError = error instanceof AppError ? error : fromPrismaError(error);
  if (normalizedError) {
    return res.status(normalizedError.statusCode).json({
      error: normalizedError.message,
      code: normalizedError.code
    });
  }

  // Logs stay on the server; internal details never reach the client.
  // eslint-disable-next-line no-console
  console.error(error);
  return res.status(500).json({
    error: "Erro interno do servidor.",
    code: "INTERNAL_ERROR"
  });
}

export { errorHandler };