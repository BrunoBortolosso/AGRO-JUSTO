class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function badRequest(message = "Requisição inválida.") {
  return new AppError(message, 400, "BAD_REQUEST");
}

function validationError(message = "Dados de entrada inválidos.") {
  return new AppError(message, 400, "VALIDATION_ERROR");
}

function unauthorized(message = "Não autorizado.") {
  return new AppError(message, 401, "UNAUTHORIZED");
}

function notFound(message = "Recurso não encontrado.") {
  return new AppError(message, 404, "NOT_FOUND");
}

function conflict(message = "Conflito ao processar a requisição.") {
  return new AppError(message, 409, "CONFLICT");
}

function tooManyRequests(message = "Muitas tentativas. Tente novamente mais tarde.") {
  return new AppError(message, 429, "TOO_MANY_REQUESTS");
}

function internalServerError(message = "Erro interno do servidor.") {
  return new AppError(message, 500, "INTERNAL_ERROR");
}

export {
  AppError,
  badRequest,
  validationError,
  unauthorized,
  notFound,
  conflict,
  tooManyRequests,
  internalServerError
};