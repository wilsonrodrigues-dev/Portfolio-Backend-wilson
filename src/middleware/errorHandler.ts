import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Multer upload errors (file too large, unexpected field, ...)
  if (err.name === 'MulterError') {
    const code = (err as unknown as { code?: string }).code;
    statusCode = code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = statusCode === 413 ? 'File too large. Maximum allowed size is 5 MB.' : err.message;
    sendError(res, message, statusCode);
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    const errors = Object.values((err as unknown as { errors: Record<string, { message: string }> }).errors).map(
      (e) => e.message
    );
    sendError(res, message, statusCode, errors);
    return;
  }

  // Mongoose duplicate key error
  if ((err as unknown as { code?: number }).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as unknown as { keyValue: Record<string, unknown> }).keyValue || {})[0];
    message = field ? `A record with this ${field} already exists.` : 'Duplicate entry.';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format.';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired.';
  }

  // Never expose internal error details (stack-less but message-level: DB errors,
  // connection strings, filesystem paths, implementation details) on 5xx responses.
  const isServerError = statusCode >= 500;
  const clientMessage = isServerError ? 'Internal Server Error' : message;

  // Log in development, and always log server-side failures for the operator.
  if (process.env.NODE_ENV === 'development' || isServerError) {
    console.error('❌ Error:', err);
  }

  sendError(res, clientMessage, statusCode);
}

export function notFound(req: Request, res: Response, next: NextFunction): void {
  const error: AppError = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
