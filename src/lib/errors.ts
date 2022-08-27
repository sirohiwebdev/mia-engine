export class ValidationError extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function getErrorName(error: unknown) {
  if (error instanceof Error) return error.name;
  return String(error);
}
