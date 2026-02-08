// ========== CUSTOM ERROR CLASSES ==========

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Authentication failed", code?: string) {
    super(message, 401, code);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    public fields?: Record<string, string>
  ) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed", code?: string) {
    super(message, 500, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

// ========== ERROR RESPONSE FORMATTER ==========

export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode: number;
  fields?: Record<string, string>;
  timestamp: string;
}

export function formatErrorResponse(error: unknown): ErrorResponse {
  const timestamp = new Date().toISOString();

  // Handle known custom errors
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      fields: error.fields,
      timestamp,
    };
  }

  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp,
    };
  }

  // Handle Prisma errors
  if (isPrismaError(error)) {
    return formatPrismaError(error, timestamp);
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
      statusCode: 500,
      timestamp,
    };
  }

  // Fallback for unknown errors
  return {
    message: "An unexpected error occurred",
    statusCode: 500,
    timestamp,
  };
}

// ========== PRISMA ERROR HANDLING ==========

function isPrismaError(error: unknown): error is { code: string; meta?: any } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string"
  );
}

function formatPrismaError(
  error: { code: string; meta?: any },
  timestamp: string
): ErrorResponse {
  switch (error.code) {
    case "P2002": // Unique constraint violation
      const field = error.meta?.target?.[0] || "field";
      return {
        message: `A record with this ${field} already exists`,
        code: "DUPLICATE_ENTRY",
        statusCode: 409,
        timestamp,
      };

    case "P2025": // Record not found
      return {
        message: "The requested resource was not found",
        code: "NOT_FOUND",
        statusCode: 404,
        timestamp,
      };

    case "P2003": // Foreign key constraint failed
      return {
        message: "Related record not found",
        code: "FOREIGN_KEY_ERROR",
        statusCode: 400,
        timestamp,
      };

    case "P1001": // Can't reach database server
      return {
        message:
          "Unable to connect to the database. Please try again in a moment.",
        code: "DATABASE_UNAVAILABLE",
        statusCode: 503,
        timestamp,
      };

    case "P1008": // Operations timed out
      return {
        message: "Database operation took too long. Please try again.",
        code: "TIMEOUT",
        statusCode: 504,
        timestamp,
      };

    case "P1017": // Server has closed the connection
      return {
        message: "Database connection was lost. Please try again.",
        code: "CONNECTION_LOST",
        statusCode: 503,
        timestamp,
      };

    default:
      return {
        message: "A database error occurred. Please try again.",
        code: error.code,
        statusCode: 500,
        timestamp,
      };
  }
}

// ========== USER-FRIENDLY ERROR MESSAGES ==========

export const USER_FRIENDLY_MESSAGES: Record<string, string> = {
  // Auth errors
  INVALID_CREDENTIALS: "The email or password you entered is incorrect",
  ACCOUNT_NOT_FOUND: "No account found with this email address",
  ACCOUNT_LOCKED: "Your account has been locked. Please contact support",
  INVALID_TOKEN: "This link is invalid or has expired",
  TOKEN_EXPIRED: "This link has expired. Please request a new one",

  // Validation errors
  VALIDATION_ERROR: "Please check your input and try again",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password",
  EMAIL_INVALID: "Please enter a valid email address",

  // Database errors
  DATABASE_UNAVAILABLE: "Our service is temporarily unavailable. Please try again in a moment",
  DUPLICATE_EMAIL: "An account with this email already exists",
  DUPLICATE_ENTRY: "This information is already in use",

  // General errors
  SERVER_ERROR: "Something went wrong on our end. Please try again",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection",
};

export function getUserFriendlyMessage(code?: string): string {
  if (!code) return USER_FRIENDLY_MESSAGES.SERVER_ERROR;
  return USER_FRIENDLY_MESSAGES[code] || USER_FRIENDLY_MESSAGES.SERVER_ERROR;
}

// ========== ERROR LOGGER ==========

export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : "";

  if (error instanceof AppError) {
    console.error(
      `${timestamp} ${contextStr} ${error.name}: ${error.message}`,
      {
        code: error.code,
        statusCode: error.statusCode,
        stack: error.stack,
      }
    );
  } else if (error instanceof Error) {
    console.error(`${timestamp} ${contextStr} Error: ${error.message}`, {
      stack: error.stack,
    });
  } else {
    console.error(`${timestamp} ${contextStr} Unknown error:`, error);
  }
}
