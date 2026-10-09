import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../utils/jwt';
export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}
export declare function protect(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
export declare function requireRole(...roles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map