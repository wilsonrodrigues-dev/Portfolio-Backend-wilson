import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export function protect(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        sendError(res, 'Access token expired. Please refresh.', 401);
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        sendError(res, 'Invalid access token.', 401);
        return;
      }
    }
    sendError(res, 'Authentication failed.', 401);
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions.', 403);
      return;
    }
    next();
  };
}

// Attaches req.user when a valid Bearer token is present, otherwise continues
// as anonymous. Used by public list/detail routes so drafts stay hidden from
// anonymous callers while authenticated admins still see everything.
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = verifyAccessToken(authHeader.split(' ')[1]);
    } catch {
      // Invalid/expired token → treat as anonymous; the route may be public.
    }
  }
  next();
}
