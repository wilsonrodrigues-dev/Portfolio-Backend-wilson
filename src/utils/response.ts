import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: Record<string, unknown>
): Response<SuccessResponse<T>> {
  const response: SuccessResponse<T> = { success: true, data, message };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown[]
): Response<ErrorResponse> {
  const response: ErrorResponse = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Escapes regex metacharacters so user-supplied search strings can be used
// safely in $regex (prevents ReDoS / invalid-regex 500s from untrusted input).
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getPaginationParams(query: Record<string, string | string[] | undefined>): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
