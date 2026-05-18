/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string, statusCode: number, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: any) {
    super(message, "NOT_FOUND", 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access", details?: any) {
    super(message, "UNAUTHORIZED", 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden", details?: any) {
    super(message, "FORBIDDEN", 403, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", details?: any) {
    super(message, "CONFLICT", 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", details?: any) {
    super(message, "RATE_LIMIT_EXCEEDED", 429, details);
  }
}
