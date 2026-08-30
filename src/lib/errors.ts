export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INVALID_INPUT"
  | "INVALID_TRANSITION";

/**
 * Errors that are safe to show to the user.
 *
 * Anything that is not an `AppError` is treated as an internal failure and
 * reduced to a generic message so SQL, stack traces, environment values and
 * session material can never reach a client.
 */
export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message = "You need to sign in to continue.") {
    super("UNAUTHENTICATED", message);
    this.name = "UnauthenticatedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have access to this resource.") {
    super("FORBIDDEN", message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource does not exist.") {
    super("NOT_FOUND", message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message);
    this.name = "ConflictError";
  }
}

export class InvalidInputError extends AppError {
  constructor(message = "Please check the highlighted fields and try again.") {
    super("INVALID_INPUT", message);
    this.name = "InvalidInputError";
  }
}

export class InvalidTransitionError extends AppError {
  constructor(message: string) {
    super("INVALID_TRANSITION", message);
    this.name = "InvalidTransitionError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

export function toUserFacingMessage(error: unknown): string {
  return isAppError(error) ? error.message : GENERIC_MESSAGE;
}

/** Postgres unique-violation detection without leaking driver internals. */
export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const candidate: { code?: unknown } = error;
  return candidate.code === "23505";
}
