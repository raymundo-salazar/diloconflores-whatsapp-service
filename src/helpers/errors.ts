// Clase base para todos los errores personalizados
export class CustomError extends Error {
  public statusCode: number;
  public errorType: string;
  public resource?: string;
  public database_code?: string;
  public sql?: string;
  public errors?: any;

  constructor(
    message: string,
    statusCode: number,
    errorType: string,
    resource?: string,
    database_code?: string,
    sql?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.resource = resource;
    this.database_code = database_code;
    this.sql = sql;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error para fallos de autenticación
export class AuthError extends CustomError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

// Error cuando un recurso no se encuentra
export class NotFoundError extends CustomError {
  constructor(resource = "Resource", path = "") {
    super(`${resource} not found`, 404, "NOT_FOUND_ERROR", path);
  }
}

// Error cuando falla la creación de un recurso
export class CreationError extends CustomError {
  constructor(message = "Failed to create", resource = "Resource") {
    super(message, 400, "CREATION_ERROR", `Failed to create "${resource}"`);
  }
}

export class MissingParametersError extends CustomError {
  constructor(message = "Missing parameters", resource = "Resource") {
    super(
      message,
      400,
      "MISSING_PARAMETERS",
      `Missing parameters for "${resource}"`
    );
  }
}

// Error de base de datos
export class DatabaseError extends CustomError {
  constructor(error: any) {
    const message = error.message;
    const code = error.parent?.code;
    const sql = error.parent?.sql;

    super(message, 500, "DATABASE_ERROR", undefined, code, sql);
  }
}
