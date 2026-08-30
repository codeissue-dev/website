type LogLevel = "info" | "warn" | "error";

type LogFields = Record<string, unknown>;

/**
 * Minimal structured logger.
 *
 * Server logs are the only place where technical detail is allowed; user-facing
 * messages are produced by `toUserFacingMessage` in `./errors`.
 */
function write(level: LogLevel, message: string, fields: LogFields = {}): void {
  const line = JSON.stringify({
    level,
    message,
    time: new Date().toISOString(),
    ...fields,
  });

  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export const logger = {
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) => write("error", message, fields),
};

/** Turns an unknown thrown value into safe log fields (no secrets, no env). */
export function describeError(error: unknown): LogFields {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      ...(error.stack ? { errorStack: error.stack } : {}),
    };
  }
  return { errorName: "UnknownError", errorMessage: String(error) };
}
