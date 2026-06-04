export type ResultResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown };

export const createSuccessResponse = <T>(data: T): ResultResponse<T> => {
  return { success: true, data };
};

export const createErrorResponse = <T>(error: string, details?: unknown): ResultResponse<T> => {
  // Sanitize error object to prevent 1.1MB Prisma errors from being sent to the client
  let sanitizedDetails = details;
  if (details instanceof Error) {
    sanitizedDetails = details.message;
  }
  
  return { success: false, error, details: sanitizedDetails };
}